import { Request, Response } from 'express';
import { z } from 'zod';
import { Company } from '../models/Company.js';
import { Job } from '../models/Job.js';
import { Application } from '../models/Application.js';
import { Interview } from '../models/Interview.js';
import { Notification } from '../models/Notification.js';
import { RecruiterProfile } from '../models/RecruiterProfile.js';
import { StudentProfile } from '../models/StudentProfile.js';

const jobSchema = z.object({
  title: z.string().min(2, 'Job title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  jobType: z.enum(['full_time', 'internship']).default('full_time'),
  workplaceType: z.enum(['on_site', 'remote', 'hybrid']).default('on_site'),
  location: z.string().min(2, 'Location is required'),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  stipend: z.number().optional(),
  requiredSkills: z.array(z.string()).min(1, 'At least 1 required skill is necessary'),
  preferredSkills: z.array(z.string()).default([]),
  eligibleDepartments: z.array(z.string()).default([]),
  minCgpa: z.number().min(0).max(10).default(0),
  targetGraduationYears: z.array(z.number()).default([]),
  positions: z.number().min(1).default(1),
  deadline: z.string(),
  status: z.enum(['draft', 'active', 'closed']).default('active'),
  driveId: z.string().optional(),
});

export const recruiterController = {
  async getCompany(req: Request, res: Response): Promise<void> {
    const recruiterId = req.user!.id;
    let company = await Company.findOne({ recruiter: recruiterId });

    if (!company) {
      const recProfile = await RecruiterProfile.findOne({ user: recruiterId }).populate('company');
      if (recProfile && recProfile.company) {
        company = recProfile.company as any;
      }
    }

    res.json({ success: true, data: company });
  },

  async updateCompany(req: Request, res: Response): Promise<void> {
    const recruiterId = req.user!.id;
    const { name, industry, website, location, description, contactEmail, contactPhone, logoUrl } =
      req.body;

    let company = await Company.findOne({ recruiter: recruiterId });
    if (!company) {
      company = await Company.create({
        name: name || 'Enterprise Solutions',
        recruiter: recruiterId,
        industry: industry || 'Information Technology',
        location: location || 'Bengaluru, India',
        description: description || 'Pioneering technology solutions provider.',
        contactEmail: contactEmail || req.user!.email,
        contactPhone,
        logoUrl,
        website,
        isVerified: false,
      });

      await RecruiterProfile.findOneAndUpdate(
        { user: recruiterId },
        { company: company._id },
        { upsert: true }
      );
    } else {
      if (name) company.name = name;
      if (industry) company.industry = industry;
      if (website !== undefined) company.website = website;
      if (location) company.location = location;
      if (description) company.description = description;
      if (contactEmail) company.contactEmail = contactEmail;
      if (contactPhone !== undefined) company.contactPhone = contactPhone;
      if (logoUrl !== undefined) company.logoUrl = logoUrl;
      await company.save();
    }

    res.json({ success: true, message: 'Company details updated successfully.', data: company });
  },

  async getMyJobs(req: Request, res: Response): Promise<void> {
    const recruiterId = req.user!.id;
    const jobs = await Job.find({ recruiter: recruiterId })
      .populate('company', 'name logoUrl location')
      .sort({ createdAt: -1 });

    const jobIds = jobs.map((j) => j._id);
    const applicationCounts = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      { $group: { _id: '$job', count: { $sum: 1 } } },
    ]);

    const countMap = new Map(applicationCounts.map((a) => [a._id.toString(), a.count]));

    const enriched = jobs.map((job) => ({
      ...job.toObject(),
      applicantCount: countMap.get(job._id.toString()) || 0,
    }));

    res.json({ success: true, data: enriched });
  },

  async createJob(req: Request, res: Response): Promise<void> {
    const recruiterId = req.user!.id;
    const data = jobSchema.parse(req.body);

    let company = await Company.findOne({ recruiter: recruiterId });
    if (!company) {
      company = await Company.create({
        name: 'Corporate Partner',
        recruiter: recruiterId,
        industry: 'Technology',
        location: data.location,
        description: 'Global campus recruitment partner.',
        contactEmail: req.user!.email,
        isVerified: false,
      });
      await RecruiterProfile.findOneAndUpdate(
        { user: recruiterId },
        { company: company._id },
        { upsert: true }
      );
    }

    const job = await Job.create({
      title: data.title,
      company: company._id,
      recruiter: recruiterId,
      description: data.description,
      jobType: data.jobType,
      workplaceType: data.workplaceType,
      location: data.location,
      salaryMin: data.salaryMin,
      salaryMax: data.salaryMax,
      stipend: data.stipend,
      requiredSkills: data.requiredSkills,
      preferredSkills: data.preferredSkills,
      eligibleDepartments: data.eligibleDepartments,
      minCgpa: data.minCgpa,
      targetGraduationYears: data.targetGraduationYears,
      positions: data.positions,
      deadline: new Date(data.deadline),
      status: data.status,
      drive: data.driveId ? (data.driveId as any) : undefined,
    });

    res.status(201).json({
      success: true,
      message: 'Job posting published successfully.',
      data: job,
    });
  },

  async updateJob(req: Request, res: Response): Promise<void> {
    const recruiterId = req.user!.id;
    const { id } = req.params;

    const job = await Job.findOne({ _id: id, recruiter: recruiterId });
    if (!job) {
      res.status(404).json({
        success: false,
        message: 'Job posting not found or you do not have permission to modify it.',
      });
      return;
    }

    const data = jobSchema.partial().parse(req.body);
    if (data.deadline) {
      (data as any).deadline = new Date(data.deadline);
    }

    Object.assign(job, data);
    await job.save();

    res.json({
      success: true,
      message: 'Job posting updated successfully.',
      data: job,
    });
  },

  async deleteJob(req: Request, res: Response): Promise<void> {
    const recruiterId = req.user!.id;
    const { id } = req.params;

    const job = await Job.findOne({ _id: id, recruiter: recruiterId });
    if (!job) {
      res.status(404).json({
        success: false,
        message: 'Job posting not found or unauthorized.',
      });
      return;
    }

    job.status = 'closed';
    await job.save();

    res.json({
      success: true,
      message: 'Job posting status changed to closed.',
    });
  },

  async getApplicants(req: Request, res: Response): Promise<void> {
    const recruiterId = req.user!.id;
    const { jobId } = req.params;

    // Verify job belongs to this recruiter
    const job = await Job.findOne({ _id: jobId, recruiter: recruiterId });
    if (!job) {
      res.status(403).json({
        success: false,
        message: 'Access denied: You can only view applicants for your own company job postings.',
      });
      return;
    }

    const applications = await Application.find({ job: jobId })
      .populate('student', 'name email avatarUrl')
      .sort({ appliedAt: -1 });

    const studentUserIds = applications.map((a) => (a.student as any)?._id);
    const profiles = await StudentProfile.find({ user: { $in: studentUserIds } });
    const profileMap = new Map(profiles.map((p) => [p.user.toString(), p]));

    const enriched = applications.map((app) => {
      const studentId = (app.student as any)?._id?.toString();
      const profile = profileMap.get(studentId);
      return {
        ...app.toObject(),
        studentProfile: profile || null,
      };
    });

    res.json({
      success: true,
      data: {
        job,
        totalApplicants: enriched.length,
        applicants: enriched,
      },
    });
  },

  async updateApplicantStatus(req: Request, res: Response): Promise<void> {
    const recruiterId = req.user!.id;
    const { applicationId } = req.params;
    const { status, note } = req.body;

    const validStatuses = [
      'applied',
      'under_review',
      'shortlisted',
      'interview_scheduled',
      'selected',
      'rejected',
    ];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ success: false, message: `Invalid status: '${status}'` });
      return;
    }

    const application = await Application.findById(applicationId).populate('job');
    if (!application) {
      res.status(404).json({ success: false, message: 'Application not found.' });
      return;
    }

    // Verify recruiter owns this job
    const job = application.job as any;
    if (job.recruiter.toString() !== recruiterId) {
      res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only update candidates for your own postings.',
      });
      return;
    }

    application.status = status;
    application.statusHistory.push({
      status,
      changedBy: recruiterId as any,
      note: note || `Status updated to ${status} by recruiter`,
      changedAt: new Date(),
    });

    await application.save();

    // Send in-app notification to student
    await Notification.create({
      recipient: application.student,
      title: `Application Status Updated: ${job.title}`,
      message: `Your application status for '${job.title}' is now: ${status.replace('_', ' ').toUpperCase()}.${note ? ` Note: ${note}` : ''}`,
      type: 'application',
      link: '/student/applications',
    });

    res.json({
      success: true,
      message: `Candidate status updated to ${status}.`,
      data: application,
    });
  },

  async scheduleInterview(req: Request, res: Response): Promise<void> {
    const recruiterId = req.user!.id;
    const { applicationId, round, scheduledAt, durationMinutes, meetingLink, location, interviewerNotes } =
      req.body;

    const application = await Application.findById(applicationId).populate('job');
    if (!application) {
      res.status(404).json({ success: false, message: 'Application not found.' });
      return;
    }

    const job = application.job as any;
    if (job.recruiter.toString() !== recruiterId) {
      res.status(403).json({ success: false, message: 'Unauthorized.' });
      return;
    }

    const interview = await Interview.create({
      application: application._id,
      job: job._id,
      student: application.student,
      recruiter: recruiterId,
      round: round || 'Technical Interview Round 1',
      scheduledAt: new Date(scheduledAt),
      durationMinutes: durationMinutes || 45,
      meetingLink: meetingLink || '',
      location: location || 'Campus Placement Interview Room',
      interviewerNotes: interviewerNotes || '',
      status: 'scheduled',
      outcome: 'pending',
    });

    // Update application status
    application.status = 'interview_scheduled';
    application.statusHistory.push({
      status: 'interview_scheduled',
      changedBy: recruiterId as any,
      note: `Interview scheduled: ${round} on ${new Date(scheduledAt).toLocaleString()}`,
      changedAt: new Date(),
    });
    await application.save();

    // Notify student
    await Notification.create({
      recipient: application.student,
      title: `Interview Scheduled: ${job.title}`,
      message: `An interview for '${job.title}' (${round}) has been scheduled for ${new Date(scheduledAt).toLocaleString()}.`,
      type: 'interview',
      link: '/student/applications',
    });

    res.status(201).json({
      success: true,
      message: 'Interview scheduled and student notified.',
      data: interview,
    });
  },

  async exportApplicantsCsv(req: Request, res: Response): Promise<void> {
    const recruiterId = req.user!.id;
    const { jobId } = req.params;

    const job = await Job.findOne({ _id: jobId, recruiter: recruiterId }).populate('company');
    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found or access denied.' });
      return;
    }

    const applications = await Application.find({ job: jobId })
      .populate('student', 'name email')
      .sort({ appliedAt: -1 });

    const studentUserIds = applications.map((a) => (a.student as any)?._id);
    const profiles = await StudentProfile.find({ user: { $in: studentUserIds } });
    const profileMap = new Map(profiles.map((p) => [p.user.toString(), p]));

    // Construct CSV
    const headers = [
      'Candidate Name',
      'Email',
      'Roll Number',
      'Department',
      'CGPA',
      'Application Status',
      'AI Match Score (%)',
      'Applied Date',
      'Resume Link',
    ];

    const rows = applications.map((app) => {
      const student = app.student as any;
      const profile = profileMap.get(student?._id?.toString());
      return [
        `"${student?.name || ''}"`,
        `"${student?.email || ''}"`,
        `"${profile?.rollNumber || ''}"`,
        `"${profile?.department || ''}"`,
        `"${profile?.cgpa || ''}"`,
        `"${app.status}"`,
        `"${app.aiMatchScore ?? 'N/A'}"`,
        `"${new Date(app.appliedAt).toISOString().split('T')[0]}"`,
        `"${app.resumeUrl || ''}"`,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="applicants_${job.title.replace(/\s+/g, '_')}.csv"`
    );
    res.send(csvContent);
  },
};
