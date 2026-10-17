import { Request, Response } from 'express';
import { z } from 'zod';
import { StudentProfile } from '../models/StudentProfile.js';
import { User } from '../models/User.js';
import { Job } from '../models/Job.js';
import { Application } from '../models/Application.js';
import { Notification } from '../models/Notification.js';
import { Interview } from '../models/Interview.js';
import { aiClient } from '../services/aiClient.js';

const profileUpdateSchema = z.object({
  rollNumber: z.string().optional(),
  department: z.string().optional(),
  degree: z.string().optional(),
  graduationYear: z.number().optional(),
  cgpa: z.number().min(0).max(10).optional(),
  skills: z.array(z.string()).optional(),
  softSkills: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  projects: z
    .array(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        technologies: z.array(z.string()).default([]),
        link: z.string().optional(),
      })
    )
    .optional(),
  bio: z.string().max(1000).optional(),
  phone: z.string().optional(),
  linkedIn: z.string().optional(),
  github: z.string().optional(),
  isPublic: z.boolean().optional(),
});

export const studentController = {
  async getProfile(req: Request, res: Response): Promise<void> {
    const studentId = req.user!.id;
    let profile = await StudentProfile.findOne({ user: studentId }).populate(
      'user',
      'name email avatarUrl role'
    );

    if (!profile) {
      // Auto-create initial profile shell if missing
      profile = await StudentProfile.create({
        user: studentId,
        rollNumber: `ENR-${Date.now().toString().slice(-6)}`,
        department: 'Computer Science and Engineering',
        degree: 'B.Tech',
        graduationYear: new Date().getFullYear(),
        cgpa: 7.0,
      });
    }

    res.json({ success: true, data: profile });
  },

  async updateProfile(req: Request, res: Response): Promise<void> {
    const studentId = req.user!.id;
    const validatedData = profileUpdateSchema.parse(req.body);

    let profile = await StudentProfile.findOne({ user: studentId });
    if (!profile) {
      profile = new StudentProfile({ user: studentId, ...validatedData });
    } else {
      Object.assign(profile, validatedData);
    }

    await profile.save();
    const updated = await StudentProfile.findById(profile._id).populate(
      'user',
      'name email avatarUrl'
    );

    res.json({
      success: true,
      message: 'Student profile updated successfully.',
      data: updated,
    });
  },

  async uploadResume(req: Request, res: Response): Promise<void> {
    const studentId = req.user!.id;
    if (!req.file) {
      res.status(400).json({ success: false, message: 'Please select a resume file (PDF or DOCX).' });
      return;
    }

    const relativeUrl = `/uploads/resumes/${req.file.filename}`;

    // Parse resume content through FastAPI microservice
    const parseResult = await aiClient.parseResume(req.file.path, req.file.originalname);

    let profile = await StudentProfile.findOne({ user: studentId });
    if (!profile) {
      profile = new StudentProfile({
        user: studentId,
        rollNumber: `ENR-${Date.now().toString().slice(-6)}`,
        department: 'Computer Science and Engineering',
        degree: 'B.Tech',
        graduationYear: new Date().getFullYear(),
        cgpa: 7.0,
      });
    }

    profile.resumeUrl = relativeUrl;
    profile.resumeOriginalName = req.file.originalname;
    profile.resumeUploadedAt = new Date();

    // If parse extracted skills and candidate didn't have many, suggest/incorporate
    if (parseResult.skills && parseResult.skills.length > 0) {
      const mergedSkills = Array.from(new Set([...(profile.skills || []), ...parseResult.skills]));
      profile.skills = mergedSkills;
    }

    await profile.save();

    res.json({
      success: true,
      message: 'Resume uploaded and analyzed successfully.',
      data: {
        resumeUrl: relativeUrl,
        filename: req.file.originalname,
        extractedData: parseResult,
        profile,
      },
    });
  },

  async getJobs(req: Request, res: Response): Promise<void> {
    const {
      search,
      department,
      jobType,
      location,
      minSalary,
      page = '1',
      limit = '10',
    } = req.query;

    const query: any = { status: 'active' };

    if (search) {
      query.$or = [
        { title: { $regex: search as string, $options: 'i' } },
        { description: { $regex: search as string, $options: 'i' } },
        { requiredSkills: { $regex: search as string, $options: 'i' } },
      ];
    }

    if (department && department !== 'all') {
      query.eligibleDepartments = { $in: [department, 'All Departments', ''] };
    }

    if (jobType && jobType !== 'all') {
      query.jobType = jobType;
    }

    if (location) {
      query.location = { $regex: location as string, $options: 'i' };
    }

    if (minSalary) {
      query.$or = [
        { salaryMin: { $gte: Number(minSalary) } },
        { stipend: { $gte: Number(minSalary) } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(limit as string, 10)));
    const skip = (pageNum - 1) * pageSize;

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate('company', 'name logoUrl location industry isVerified')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize),
      Job.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        jobs,
        pagination: {
          total,
          page: pageNum,
          pages: Math.ceil(total / pageSize),
          limit: pageSize,
        },
      },
    });
  },

  async getRecommendations(req: Request, res: Response): Promise<void> {
    const studentId = req.user!.id;
    const profile = await StudentProfile.findOne({ user: studentId });

    if (!profile) {
      res.status(400).json({
        success: false,
        message: 'Please complete your student profile before requesting AI job recommendations.',
      });
      return;
    }

    // Retrieve active job openings
    const activeJobs = await Job.find({ status: 'active' })
      .populate('company', 'name logoUrl location')
      .limit(30);

    if (activeJobs.length === 0) {
      res.json({
        success: true,
        data: {
          recommendations: [],
          message: 'No active job openings are currently available for recommendation.',
        },
      });
      return;
    }

    const studentInput = {
      student_id: studentId,
      department: profile.department,
      cgpa: profile.cgpa,
      graduation_year: profile.graduationYear,
      skills: profile.skills || [],
      certifications: profile.certifications || [],
      projects: (profile.projects || []).map((p) => `${p.title}: ${p.description || ''}`),
      experience_months: 0,
    };

    const jobsInput = activeJobs.map((job: any) => ({
      job_id: job._id.toString(),
      title: job.title,
      company_name: job.company?.name || 'Company',
      required_skills: job.requiredSkills || [],
      preferred_skills: job.preferredSkills || [],
      eligible_departments: job.eligibleDepartments || [],
      min_cgpa: job.minCgpa || 0,
      target_graduation_years: job.targetGraduationYears || [],
      job_type: job.jobType,
      description: job.description,
    }));

    const recommendations = await aiClient.getRecommendations(studentInput, jobsInput);

    // Merge job entity information into recommendations
    const jobMap = new Map(activeJobs.map((j) => [j._id.toString(), j]));
    const enriched = recommendations.map((rec) => {
      const jobDoc = jobMap.get(rec.job_id);
      return {
        ...rec,
        jobDetails: jobDoc,
      };
    });

    res.json({
      success: true,
      data: {
        totalEvaluated: jobsInput.length,
        recommendations: enriched,
      },
    });
  },

  async applyJob(req: Request, res: Response): Promise<void> {
    const studentId = req.user!.id;
    const { jobId, coverNote, resumeUrl } = req.body;

    if (!jobId) {
      res.status(400).json({ success: false, message: 'Job ID is required.' });
      return;
    }

    const job = await Job.findById(jobId).populate('company');
    if (!job || job.status !== 'active') {
      res.status(404).json({ success: false, message: 'Job posting is not active or no longer exists.' });
      return;
    }

    if (new Date(job.deadline) < new Date()) {
      res.status(400).json({ success: false, message: 'Application deadline for this job has expired.' });
      return;
    }

    // Check existing application to prevent duplicates
    const existing = await Application.findOne({ job: jobId, student: studentId });
    if (existing) {
      res.status(409).json({
        success: false,
        message: 'You have already submitted an application for this position.',
      });
      return;
    }

    const profile = await StudentProfile.findOne({ user: studentId });
    const finalResumeUrl = resumeUrl || profile?.resumeUrl;

    if (!finalResumeUrl) {
      res.status(400).json({
        success: false,
        message: 'Please upload a resume in your profile before applying.',
      });
      return;
    }

    // Calculate AI match evaluation for this application
    let matchResult: any = null;
    if (profile) {
      const studentInput = {
        student_id: studentId,
        department: profile.department,
        cgpa: profile.cgpa,
        graduation_year: profile.graduationYear,
        skills: profile.skills || [],
        certifications: profile.certifications || [],
        projects: (profile.projects || []).map((p) => `${p.title}: ${p.description || ''}`),
      };

      const jobInput = {
        job_id: job._id.toString(),
        title: job.title,
        company_name: (job.company as any)?.name || 'Company',
        required_skills: job.requiredSkills || [],
        preferred_skills: job.preferredSkills || [],
        eligible_departments: job.eligibleDepartments || [],
        min_cgpa: job.minCgpa || 0,
        target_graduation_years: job.targetGraduationYears || [],
        description: job.description,
      };

      matchResult = await aiClient.matchJob(studentInput, jobInput);
    }

    const application = await Application.create({
      job: jobId,
      student: studentId,
      resumeUrl: finalResumeUrl,
      resumeOriginalName: profile?.resumeOriginalName || 'student_resume.pdf',
      coverNote: coverNote || '',
      status: 'applied',
      statusHistory: [
        {
          status: 'applied',
          changedBy: studentId,
          note: 'Application submitted by candidate.',
          changedAt: new Date(),
        },
      ],
      aiMatchScore: matchResult ? matchResult.match_score : undefined,
      aiExplanation: matchResult ? matchResult.explanation : undefined,
      aiMatchedSkills: matchResult ? matchResult.matched_skills : [],
      aiMissingSkills: matchResult ? matchResult.missing_skills : [],
    });

    // Notify recruiter
    await Notification.create({
      recipient: job.recruiter,
      title: 'New Applicant Received',
      message: `A candidate has submitted an application for '${job.title}'. Match score: ${matchResult?.match_score ?? 'N/A'}%.`,
      type: 'application',
      link: `/recruiter/jobs/${job._id}/applicants`,
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      data: application,
    });
  },

  async getMyApplications(req: Request, res: Response): Promise<void> {
    const studentId = req.user!.id;
    const applications = await Application.find({ student: studentId })
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'name logoUrl location industry' },
      })
      .sort({ appliedAt: -1 });

    const applicationIds = applications.map((a) => a._id);
    const interviews = await Interview.find({ application: { $in: applicationIds } });

    const interviewMap = new Map(interviews.map((i) => [i.application.toString(), i]));
    const result = applications.map((app) => ({
      ...app.toObject(),
      interview: interviewMap.get(app._id.toString()) || null,
    }));

    res.json({ success: true, data: result });
  },

  async withdrawApplication(req: Request, res: Response): Promise<void> {
    const studentId = req.user!.id;
    const { id } = req.params;

    const application = await Application.findOne({ _id: id, student: studentId });
    if (!application) {
      res.status(404).json({ success: false, message: 'Application not found.' });
      return;
    }

    if (['selected', 'rejected', 'withdrawn'].includes(application.status)) {
      res.status(400).json({
        success: false,
        message: `Cannot withdraw application that is already marked '${application.status}'.`,
      });
      return;
    }

    application.status = 'withdrawn';
    application.statusHistory.push({
      status: 'withdrawn',
      changedBy: studentId as any,
      note: 'Application withdrawn by candidate.',
      changedAt: new Date(),
    });

    await application.save();

    res.json({
      success: true,
      message: 'Application successfully withdrawn.',
      data: application,
    });
  },
};
