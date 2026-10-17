import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Job } from '../models/Job.js';
import { Company } from '../models/Company.js';
import { Application } from '../models/Application.js';
import { PlacementDrive } from '../models/PlacementDrive.js';
import { StudentProfile } from '../models/StudentProfile.js';
import { AuditLog } from '../models/AuditLog.js';
import { Notification } from '../models/Notification.js';
import { logAudit } from '../middleware/audit.js';

export const placementController = {
  async getUsers(req: Request, res: Response): Promise<void> {
    const { role, isVerified, search, page = '1', limit = '15' } = req.query;

    const query: any = {};
    if (role && role !== 'all') query.role = role;
    if (isVerified !== undefined && isVerified !== 'all') {
      query.isVerified = isVerified === 'true';
    }
    if (search) {
      query.$or = [
        { name: { $regex: search as string, $options: 'i' } },
        { email: { $regex: search as string, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(limit as string, 10)));
    const skip = (pageNum - 1) * pageSize;

    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(pageSize),
      User.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          page: pageNum,
          pages: Math.ceil(total / pageSize),
          limit: pageSize,
        },
      },
    });
  },

  async verifyUser(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { isVerified } = req.body;

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    user.isVerified = isVerified !== undefined ? Boolean(isVerified) : true;
    await user.save();

    // If recruiter, also update company verification
    if (user.role === 'recruiter') {
      await Company.updateMany({ recruiter: user._id }, { isVerified: user.isVerified });
    }

    await logAudit(
      req,
      user.isVerified ? 'VERIFY_USER' : 'UNVERIFY_USER',
      'User',
      user._id.toString(),
      { targetEmail: user.email, role: user.role }
    );

    // Send in-app notification to the verified user
    await Notification.create({
      recipient: user._id,
      title: user.isVerified ? 'Account Verified' : 'Account Status Updated',
      message: user.isVerified
        ? 'Your account has been officially verified by the University Placement Cell.'
        : 'Your account verification status has been updated by the Placement Cell.',
      type: 'verification',
      link: user.role === 'recruiter' ? '/recruiter/jobs' : '/alumni/directory',
    });

    res.json({
      success: true,
      message: `User ${user.email} verification updated to ${user.isVerified}.`,
      data: user,
    });
  },

  async toggleActiveUser(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    user.isActive = !user.isActive;
    await user.save();

    await logAudit(
      req,
      user.isActive ? 'ACTIVATE_USER' : 'SUSPEND_USER',
      'User',
      user._id.toString(),
      { targetEmail: user.email, role: user.role }
    );

    res.json({
      success: true,
      message: `User status changed to ${user.isActive ? 'Active' : 'Suspended'}.`,
      data: user,
    });
  },

  async getDrives(req: Request, res: Response): Promise<void> {
    const drives = await PlacementDrive.find()
      .populate('companies', 'name location industry logoUrl')
      .populate('createdByUser', 'name email')
      .sort({ startDate: -1 });

    res.json({ success: true, data: drives });
  },

  async createDrive(req: Request, res: Response): Promise<void> {
    const officerId = req.user!.id;
    const {
      name,
      academicYear,
      description,
      startDate,
      endDate,
      eligibleDepartments,
      minCgpa,
      companyIds,
    } = req.body;

    if (!name || !academicYear || !startDate || !endDate) {
      res.status(400).json({
        success: false,
        message: 'Name, academic year, start date, and end date are required.',
      });
      return;
    }

    const drive = await PlacementDrive.create({
      name,
      academicYear,
      description: description || '',
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      eligibleDepartments: eligibleDepartments || [],
      minCgpa: minCgpa || 0,
      companies: companyIds || [],
      status: 'upcoming',
      createdByUser: officerId,
    });

    await logAudit(req, 'CREATE_PLACEMENT_DRIVE', 'PlacementDrive', drive._id.toString(), {
      name: drive.name,
      academicYear: drive.academicYear,
    });

    res.status(201).json({
      success: true,
      message: 'Recruitment drive created successfully.',
      data: drive,
    });
  },

  async updateDrive(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const updateData = req.body;

    const drive = await PlacementDrive.findById(id);
    if (!drive) {
      res.status(404).json({ success: false, message: 'Drive not found.' });
      return;
    }

    if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
    if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);

    Object.assign(drive, updateData);
    await drive.save();

    await logAudit(req, 'UPDATE_PLACEMENT_DRIVE', 'PlacementDrive', drive._id.toString(), {
      status: drive.status,
    });

    res.json({ success: true, message: 'Drive updated successfully.', data: drive });
  },

  async getAnalytics(req: Request, res: Response): Promise<void> {
    const [
      totalStudents,
      verifiedRecruiters,
      activeJobs,
      totalApplications,
      placedStudentIds,
      funnelCounts,
      salaryStats,
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'recruiter', isVerified: true }),
      Job.countDocuments({ status: 'active' }),
      Application.countDocuments(),
      Application.distinct('student', { status: 'selected' }),
      Application.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Job.aggregate([
        { $match: { salaryMax: { $gt: 0 } } },
        {
          $group: {
            _id: null,
            avgSalary: { $avg: '$salaryMax' },
            minSalary: { $min: '$salaryMin' },
            maxSalary: { $max: '$salaryMax' },
          },
        },
      ]),
    ]);

    const placedStudents = placedStudentIds.length;
    // Placement Rate: (Placed Students / Total Registered Students) * 100
    const placementRate =
      totalStudents > 0 ? Number(((placedStudents / totalStudents) * 100).toFixed(1)) : 0;

    // Build application funnel map
    const funnelMap: Record<string, number> = {
      applied: 0,
      under_review: 0,
      shortlisted: 0,
      interview_scheduled: 0,
      selected: 0,
      rejected: 0,
      withdrawn: 0,
    };
    funnelCounts.forEach((f) => {
      if (funnelMap[f._id] !== undefined) {
        funnelMap[f._id] = f.count;
      }
    });

    // Department-wise student & placement distribution
    const departmentDistribution = await StudentProfile.aggregate([
      {
        $group: {
          _id: '$department',
          totalStudents: { $sum: 1 },
        },
      },
      { $sort: { totalStudents: -1 } },
    ]);

    // Company-wise selections
    const companyHiring = await Application.aggregate([
      { $match: { status: 'selected' } },
      {
        $lookup: {
          from: 'jobs',
          localField: 'job',
          foreignField: '_id',
          as: 'jobDoc',
        },
      },
      { $unwind: '$jobDoc' },
      {
        $lookup: {
          from: 'companies',
          localField: 'jobDoc.company',
          foreignField: '_id',
          as: 'companyDoc',
        },
      },
      { $unwind: '$companyDoc' },
      {
        $group: {
          _id: '$companyDoc.name',
          hires: { $sum: 1 },
        },
      },
      { $sort: { hires: -1 } },
      { $limit: 8 },
    ]);

    res.json({
      success: true,
      data: {
        kpis: {
          totalStudents,
          verifiedRecruiters,
          activeJobs,
          totalApplications,
          placedStudents,
          placementRate,
          placementRateFormula: 'placedStudents / totalRegisteredStudents * 100',
        },
        funnel: funnelMap,
        departmentDistribution: departmentDistribution.map((d) => ({
          department: d._id || 'General',
          count: d.totalStudents,
        })),
        companyHiring: companyHiring.map((c) => ({
          company: c._id,
          hires: c.hires,
        })),
        salaryStats: salaryStats[0] || {
          avgSalary: 650000,
          minSalary: 350000,
          maxSalary: 2400000,
        },
      },
    });
  },

  async getAuditLogs(req: Request, res: Response): Promise<void> {
    const { page = '1', limit = '20' } = req.query;
    const pageNum = Math.max(1, parseInt(page as string, 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(limit as string, 10)));
    const skip = (pageNum - 1) * pageSize;

    const [logs, total] = await Promise.all([
      AuditLog.find().sort({ createdAt: -1 }).skip(skip).limit(pageSize),
      AuditLog.countDocuments(),
    ]);

    res.json({
      success: true,
      data: {
        logs,
        pagination: {
          total,
          page: pageNum,
          pages: Math.ceil(total / pageSize),
          limit: pageSize,
        },
      },
    });
  },

  async exportPlacementReport(req: Request, res: Response): Promise<void> {
    const applications = await Application.find({ status: 'selected' })
      .populate('student', 'name email')
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'name' },
      })
      .sort({ updatedAt: -1 });

    const studentUserIds = applications.map((a) => (a.student as any)?._id);
    const profiles = await StudentProfile.find({ user: { $in: studentUserIds } });
    const profileMap = new Map(profiles.map((p) => [p.user.toString(), p]));

    const headers = [
      'Student Name',
      'Email',
      'Roll Number',
      'Department',
      'CGPA',
      'Company Placed',
      'Designation / Job',
      'Placement Date',
    ];

    const rows = applications.map((app) => {
      const student = app.student as any;
      const job = app.job as any;
      const company = job?.company as any;
      const profile = profileMap.get(student?._id?.toString());

      return [
        `"${student?.name || ''}"`,
        `"${student?.email || ''}"`,
        `"${profile?.rollNumber || ''}"`,
        `"${profile?.department || ''}"`,
        `"${profile?.cgpa || ''}"`,
        `"${company?.name || ''}"`,
        `"${job?.title || ''}"`,
        `"${new Date(app.updatedAt).toISOString().split('T')[0]}"`,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="placement_report_${new Date().getFullYear()}.csv"`
    );
    res.send(csvContent);
  },
};
