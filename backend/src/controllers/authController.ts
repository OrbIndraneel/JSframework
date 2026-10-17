import { Request, Response } from 'express';
import { z } from 'zod';
import { User, UserRole } from '../models/User.js';
import { StudentProfile } from '../models/StudentProfile.js';
import { RecruiterProfile } from '../models/RecruiterProfile.js';
import { AlumniProfile } from '../models/AlumniProfile.js';
import { Company } from '../models/Company.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken,
} from '../utils/jwt.js';
import { logAudit } from '../middleware/audit.js';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['student', 'recruiter', 'alumni']),
  // Role specific extra fields
  department: z.string().optional(),
  rollNumber: z.string().optional(),
  graduationYear: z.number().optional(),
  cgpa: z.number().min(0).max(10).optional(),
  companyName: z.string().optional(),
  designation: z.string().optional(),
  industry: z.string().optional(),
  location: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const authController = {
  async register(req: Request, res: Response): Promise<void> {
    const rawRole = req.body.role;
    // Strict requirement: Never allow users to select placement_officer publicly
    if (rawRole === 'placement_officer') {
      res.status(403).json({
        success: false,
        message:
          'Security restriction: Placement Officer administrative accounts cannot be created via public registration. Contact university IT administration.',
      });
      return;
    }

    const data = registerSchema.parse(req.body);

    const existingUser = await User.findOne({ email: data.email.toLowerCase() });
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'An account with this email address is already registered.',
      });
      return;
    }

    // Default verification rules:
    // Students are verified immediately for placement drives or activated;
    // Recruiters and Alumni require placement cell verification.
    const isVerifiedByDefault = data.role === 'student';

    const user = await User.create({
      name: data.name,
      email: data.email.toLowerCase(),
      password: data.password,
      role: data.role as UserRole,
      isVerified: isVerifiedByDefault,
      isActive: true,
    });

    // Create corresponding profile record based on role
    if (data.role === 'student') {
      await StudentProfile.create({
        user: user._id,
        rollNumber: data.rollNumber || `ENR-${Date.now().toString().slice(-6)}`,
        department: data.department || 'Computer Science and Engineering',
        degree: 'B.Tech',
        graduationYear: data.graduationYear || new Date().getFullYear(),
        cgpa: data.cgpa || 7.5,
        skills: ['Javascript', 'Python', 'SQL'],
        softSkills: ['Teamwork', 'Communication'],
      });
    } else if (data.role === 'recruiter') {
      let company = null;
      if (data.companyName) {
        company = await Company.create({
          name: data.companyName,
          recruiter: user._id,
          industry: data.industry || 'Information Technology',
          location: data.location || 'Bengaluru, India',
          description: `${data.companyName} is an industry leader in engineering and enterprise technology solutions.`,
          contactEmail: user.email,
          isVerified: false,
        });
      }

      await RecruiterProfile.create({
        user: user._id,
        company: company ? company._id : undefined,
        designation: data.designation || 'Technical Recruiter',
        isVerified: false,
      });
    } else if (data.role === 'alumni') {
      await AlumniProfile.create({
        user: user._id,
        department: data.department || 'Computer Science and Engineering',
        graduationYear: data.graduationYear || new Date().getFullYear() - 2,
        currentCompany: data.companyName || 'Leading Tech Firm',
        designation: data.designation || 'Software Engineer',
        expertise: ['Full Stack Development', 'Career Guidance'],
        isAvailableForMentorship: true,
      });
    }

    const payload = {
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.refreshTokenHash = hashToken(refreshToken);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
        },
        accessToken,
        refreshToken,
      },
    });
  },

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email credentials or account does not exist.',
      });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact the placement administrator.',
      });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid password credentials.',
      });
      return;
    }

    const payload = {
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.refreshTokenHash = hashToken(refreshToken);
    await user.save();

    res.json({
      success: true,
      message: 'Logged in successfully.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          avatarUrl: user.avatarUrl,
        },
        accessToken,
        refreshToken,
      },
    });
  },

  async refreshToken(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ success: false, message: 'Refresh token is required.' });
      return;
    }

    try {
      const decoded = verifyRefreshToken(refreshToken);
      const user = await User.findById(decoded.userId).select('+refreshTokenHash');

      if (!user || !user.refreshTokenHash) {
        res.status(401).json({ success: false, message: 'Invalid refresh token.' });
        return;
      }

      const incomingHash = hashToken(refreshToken);
      if (incomingHash !== user.refreshTokenHash) {
        res.status(401).json({ success: false, message: 'Revoked or expired refresh token.' });
        return;
      }

      // Rotate tokens
      const payload = {
        userId: user._id.toString(),
        role: user.role,
        email: user.email,
      };

      const newAccessToken = generateAccessToken(payload);
      const newRefreshToken = generateRefreshToken(payload);

      user.refreshTokenHash = hashToken(newRefreshToken);
      await user.save();

      res.json({
        success: true,
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
      });
    } catch (err: any) {
      res.status(401).json({ success: false, message: 'Expired or invalid refresh token.' });
    }
  },

  async logout(req: Request, res: Response): Promise<void> {
    if (req.user) {
      await User.findByIdAndUpdate(req.user.id, { $unset: { refreshTokenHash: 1 } });
    }
    res.json({ success: true, message: 'Logged out successfully.' });
  },

  async getCurrentUser(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    let profile: any = null;
    if (user.role === 'student') {
      profile = await StudentProfile.findOne({ user: user._id });
    } else if (user.role === 'recruiter') {
      profile = await RecruiterProfile.findOne({ user: user._id }).populate('company');
    } else if (user.role === 'alumni') {
      profile = await AlumniProfile.findOne({ user: user._id });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          isActive: user.isActive,
          avatarUrl: user.avatarUrl,
          createdAt: user.createdAt,
        },
        profile,
      },
    });
  },

  async forgotPassword(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ success: false, message: 'Email is required' });
      return;
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    // In production we send an email; here we acknowledge securely
    res.json({
      success: true,
      message: 'If an account exists with this email, password reset instructions have been dispatched.',
      // For academic demonstration ease:
      devNote: user ? 'Use POST /api/auth/reset-password with your email and new password.' : undefined,
    });
  },

  async resetPassword(req: Request, res: Response): Promise<void> {
    const { email, newPassword } = req.body;
    if (!email || !newPassword || newPassword.length < 6) {
      res.status(400).json({ success: false, message: 'Email and new password (min 6 chars) are required.' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password has been updated successfully. Please login with your new credentials.',
    });
  },
};
