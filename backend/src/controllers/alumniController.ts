import { Request, Response } from 'express';
import { z } from 'zod';
import { AlumniProfile } from '../models/AlumniProfile.js';
import { MentorshipRequest } from '../models/MentorshipRequest.js';
import { Event } from '../models/Event.js';
import { EventRegistration } from '../models/EventRegistration.js';
import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';

const alumniProfileSchema = z.object({
  graduationYear: z.number().optional(),
  degree: z.string().optional(),
  department: z.string().optional(),
  currentCompany: z.string().optional(),
  designation: z.string().optional(),
  expertise: z.array(z.string()).optional(),
  isAvailableForMentorship: z.boolean().optional(),
  mentorshipTopics: z.array(z.string()).optional(),
  bio: z.string().max(1000).optional(),
  linkedIn: z.string().optional(),
  isPublic: z.boolean().optional(),
});

export const alumniController = {
  async getProfile(req: Request, res: Response): Promise<void> {
    const alumniId = req.user!.id;
    let profile = await AlumniProfile.findOne({ user: alumniId }).populate(
      'user',
      'name email avatarUrl role isVerified'
    );

    if (!profile) {
      profile = await AlumniProfile.create({
        user: alumniId,
        graduationYear: new Date().getFullYear() - 2,
        degree: 'B.Tech',
        department: 'Computer Science and Engineering',
        currentCompany: 'Technology Enterprise',
        designation: 'Software Development Engineer',
        expertise: ['Full Stack Development', 'System Design'],
        isAvailableForMentorship: true,
      });
    }

    res.json({ success: true, data: profile });
  },

  async updateProfile(req: Request, res: Response): Promise<void> {
    const alumniId = req.user!.id;
    const validatedData = alumniProfileSchema.parse(req.body);

    let profile = await AlumniProfile.findOne({ user: alumniId });
    if (!profile) {
      profile = new AlumniProfile({ user: alumniId, ...validatedData });
    } else {
      Object.assign(profile, validatedData);
    }

    await profile.save();
    const updated = await AlumniProfile.findById(profile._id).populate(
      'user',
      'name email avatarUrl isVerified'
    );

    res.json({
      success: true,
      message: 'Alumni profile updated successfully.',
      data: updated,
    });
  },

  async getDirectory(req: Request, res: Response): Promise<void> {
    const {
      search,
      department,
      company,
      mentorshipOnly,
      graduationYear,
      page = '1',
      limit = '12',
    } = req.query;

    const query: any = { isPublic: true };

    if (department && department !== 'all') {
      query.department = department;
    }

    if (company) {
      query.currentCompany = { $regex: company as string, $options: 'i' };
    }

    if (mentorshipOnly === 'true') {
      query.isAvailableForMentorship = true;
    }

    if (graduationYear) {
      query.graduationYear = Number(graduationYear);
    }

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(limit as string, 10)));
    const skip = (pageNum - 1) * pageSize;

    let profiles = await AlumniProfile.find(query)
      .populate('user', 'name email avatarUrl isVerified')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    if (search) {
      const term = (search as string).toLowerCase();
      profiles = profiles.filter(
        (p) =>
          (p.user as any)?.name?.toLowerCase().includes(term) ||
          p.currentCompany?.toLowerCase().includes(term) ||
          p.designation?.toLowerCase().includes(term) ||
          p.expertise?.some((e) => e.toLowerCase().includes(term))
      );
    }

    const total = await AlumniProfile.countDocuments(query);

    res.json({
      success: true,
      data: {
        profiles,
        pagination: {
          total,
          page: pageNum,
          pages: Math.ceil(total / pageSize),
          limit: pageSize,
        },
      },
    });
  },

  async requestMentorship(req: Request, res: Response): Promise<void> {
    const studentId = req.user!.id;
    const { alumniUserId, topic, message } = req.body;

    if (!alumniUserId || !topic || !message) {
      res.status(400).json({
        success: false,
        message: 'Alumni ID, topic, and message are required.',
      });
      return;
    }

    // Verify alumni exists
    const alumniUser = await User.findOne({ _id: alumniUserId, role: 'alumni' });
    if (!alumniUser) {
      res.status(404).json({ success: false, message: 'Alumni mentor not found.' });
      return;
    }

    // Check for existing pending request
    const existing = await MentorshipRequest.findOne({
      student: studentId,
      alumni: alumniUserId,
      status: 'pending',
    });

    if (existing) {
      res.status(409).json({
        success: false,
        message: 'You already have a pending mentorship request with this mentor.',
      });
      return;
    }

    const request = await MentorshipRequest.create({
      student: studentId,
      alumni: alumniUserId,
      topic,
      message,
      status: 'pending',
    });

    // Notify alumni
    await Notification.create({
      recipient: alumniUserId,
      title: 'New Mentorship Request',
      message: `A student has requested career mentorship on topic: '${topic}'.`,
      type: 'mentorship',
      link: '/alumni/mentorship',
    });

    res.status(201).json({
      success: true,
      message: 'Mentorship request submitted successfully!',
      data: request,
    });
  },

  async getMentorshipRequests(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const role = req.user!.role;

    let query: any = {};
    if (role === 'alumni') {
      query.alumni = userId;
    } else {
      query.student = userId;
    }

    const requests = await MentorshipRequest.find(query)
      .populate('student', 'name email avatarUrl')
      .populate('alumni', 'name email avatarUrl')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: requests });
  },

  async respondMentorshipRequest(req: Request, res: Response): Promise<void> {
    const alumniId = req.user!.id;
    const { id } = req.params;
    const { status, responseNote, meetingDetails } = req.body;

    const validStatuses = ['accepted', 'declined', 'completed'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ success: false, message: `Invalid status: '${status}'` });
      return;
    }

    const request = await MentorshipRequest.findOne({ _id: id, alumni: alumniId });
    if (!request) {
      res.status(404).json({ success: false, message: 'Mentorship request not found or unauthorized.' });
      return;
    }

    request.status = status;
    if (responseNote !== undefined) request.responseNote = responseNote;
    if (meetingDetails !== undefined) request.meetingDetails = meetingDetails;
    await request.save();

    // Notify student
    await Notification.create({
      recipient: request.student,
      title: `Mentorship Request ${status.toUpperCase()}`,
      message: `Your mentorship request regarding '${request.topic}' has been ${status}.${meetingDetails ? ` Meeting: ${meetingDetails}` : ''}`,
      type: 'mentorship',
      link: '/student/career-assistance',
    });

    res.json({
      success: true,
      message: `Mentorship request has been ${status}.`,
      data: request,
    });
  },

  async getEvents(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id;
    const events = await Event.find({ isPublic: true })
      .populate('organizer', 'name email avatarUrl')
      .sort({ eventDate: 1 });

    let registeredEventIds = new Set<string>();
    if (userId) {
      const registrations = await EventRegistration.find({ user: userId });
      registeredEventIds = new Set(registrations.map((r) => r.event.toString()));
    }

    const enriched = events.map((ev) => ({
      ...ev.toObject(),
      isUserRegistered: registeredEventIds.has(ev._id.toString()),
    }));

    res.json({ success: true, data: enriched });
  },

  async createEvent(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const role = req.user!.role;
    const {
      title,
      description,
      eventType,
      eventDate,
      durationMinutes,
      locationOrLink,
      maxAttendees,
    } = req.body;

    if (!title || !description || !eventDate || !locationOrLink) {
      res.status(400).json({
        success: false,
        message: 'Title, description, date, and meeting link/location are required.',
      });
      return;
    }

    const event = await Event.create({
      title,
      description,
      organizer: userId,
      organizerType: role === 'placement_officer' ? 'placement_officer' : 'alumni',
      eventType: eventType || 'workshop',
      eventDate: new Date(eventDate),
      durationMinutes: durationMinutes || 60,
      locationOrLink,
      maxAttendees: maxAttendees || 100,
      registeredCount: 0,
      isPublic: true,
    });

    res.status(201).json({
      success: true,
      message: 'Event/workshop created successfully.',
      data: event,
    });
  },

  async registerEvent(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      res.status(404).json({ success: false, message: 'Event not found.' });
      return;
    }

    if (new Date(event.eventDate) < new Date()) {
      res.status(400).json({ success: false, message: 'Event has already concluded.' });
      return;
    }

    if (event.registeredCount >= event.maxAttendees) {
      res.status(400).json({ success: false, message: 'Event has reached maximum capacity.' });
      return;
    }

    const existing = await EventRegistration.findOne({ event: id, user: userId });
    if (existing) {
      res.status(409).json({ success: false, message: 'You are already registered for this event.' });
      return;
    }

    await EventRegistration.create({ event: id, user: userId });
    event.registeredCount += 1;
    await event.save();

    await Notification.create({
      recipient: userId as any,
      title: 'Event Registration Confirmed',
      message: `You are registered for '${event.title}' scheduled on ${new Date(event.eventDate).toLocaleString()}.`,
      type: 'drive',
      link: '/events',
    });

    res.status(201).json({
      success: true,
      message: 'Successfully registered for event.',
      data: event,
    });
  },
};
