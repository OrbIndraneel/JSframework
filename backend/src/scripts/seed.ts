import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { StudentProfile } from '../models/StudentProfile.js';
import { Company } from '../models/Company.js';
import { RecruiterProfile } from '../models/RecruiterProfile.js';
import { AlumniProfile } from '../models/AlumniProfile.js';
import { Job } from '../models/Job.js';
import { PlacementDrive } from '../models/PlacementDrive.js';
import { Application } from '../models/Application.js';
import { Interview } from '../models/Interview.js';
import { MentorshipRequest } from '../models/MentorshipRequest.js';
import { Event } from '../models/Event.js';
import { Notification } from '../models/Notification.js';
import { AuditLog } from '../models/AuditLog.js';

export const seedDatabase = async () => {
  console.log('--- Commencing CampusConnect Database Seeding ---');

  // Clear existing collections safely
  await Promise.all([
    User.deleteMany({}),
    StudentProfile.deleteMany({}),
    Company.deleteMany({}),
    RecruiterProfile.deleteMany({}),
    AlumniProfile.deleteMany({}),
    Job.deleteMany({}),
    PlacementDrive.deleteMany({}),
    Application.deleteMany({}),
    Interview.deleteMany({}),
    MentorshipRequest.deleteMany({}),
    Event.deleteMany({}),
    Notification.deleteMany({}),
    AuditLog.deleteMany({}),
  ]);

  console.log('Cleared existing records.');

  // 1. Create Placement Officer (Admin bootstrap)
  const officer = await User.create({
    name: 'Dr. Rajesh Sharma',
    email: 'admin@campusconnect.edu',
    password: 'Password@123',
    role: 'placement_officer',
    isVerified: true,
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  });

  // 2. Create Recruiters & Companies
  const tcsRecruiter = await User.create({
    name: 'Priya Nair',
    email: 'recruiter.tcs@tcs.com',
    password: 'Password@123',
    role: 'recruiter',
    isVerified: true,
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
  });

  const tcsCompany = await Company.create({
    name: 'Tata Consultancy Services',
    recruiter: tcsRecruiter._id,
    industry: 'Information Technology & Consulting',
    location: 'Mumbai, Maharashtra',
    website: 'https://www.tcs.com',
    description: 'A global leader in IT services, consulting, and business solutions.',
    isVerified: true,
    contactEmail: 'campus.hiring@tcs.com',
    contactPhone: '+91 22 6778 9999',
    logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150',
  });

  await RecruiterProfile.create({
    user: tcsRecruiter._id,
    company: tcsCompany._id,
    designation: 'Campus Recruitment Lead',
    isVerified: true,
  });

  const infyRecruiter = await User.create({
    name: 'Arjun Mehta',
    email: 'recruiter.infy@infosys.com',
    password: 'Password@123',
    role: 'recruiter',
    isVerified: true,
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  });

  const infyCompany = await Company.create({
    name: 'Infosys Limited',
    recruiter: infyRecruiter._id,
    industry: 'Enterprise Software & Services',
    location: 'Bengaluru, Karnataka',
    website: 'https://www.infosys.com',
    description: 'Next-generation digital services and consulting helping clients in 56 countries.',
    isVerified: true,
    contactEmail: 'talent@infosys.com',
    contactPhone: '+91 80 2852 0261',
    logoUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=150',
  });

  await RecruiterProfile.create({
    user: infyRecruiter._id,
    company: infyCompany._id,
    designation: 'Senior Talent Acquisition Specialist',
    isVerified: true,
  });

  const msftRecruiter = await User.create({
    name: 'Neha Kulkarni',
    email: 'recruiter.msft@microsoft.com',
    password: 'Password@123',
    role: 'recruiter',
    isVerified: true,
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
  });

  const msftCompany = await Company.create({
    name: 'Microsoft India',
    recruiter: msftRecruiter._id,
    industry: 'Cloud & System Software',
    location: 'Hyderabad, Telangana',
    website: 'https://www.microsoft.com',
    description: 'Empowering every person and organization on the planet to achieve more.',
    isVerified: true,
    contactEmail: 'india_university@microsoft.com',
    contactPhone: '+91 40 6695 0000',
    logoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150',
  });

  await RecruiterProfile.create({
    user: msftRecruiter._id,
    company: msftCompany._id,
    designation: 'University Relations Director',
    isVerified: true,
  });

  const zomatoRecruiter = await User.create({
    name: 'Vikram Singh',
    email: 'recruiter.zomato@zomato.com',
    password: 'Password@123',
    role: 'recruiter',
    isVerified: true,
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  });

  const zomatoCompany = await Company.create({
    name: 'Zomato India',
    recruiter: zomatoRecruiter._id,
    industry: 'Consumer Internet & Logistics',
    location: 'Gurugram, Haryana',
    website: 'https://www.zomato.com',
    description: 'Connecting customers, delivery partners, and restaurant partners worldwide.',
    isVerified: true,
    contactEmail: 'tech_campus@zomato.com',
    logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150',
  });

  await RecruiterProfile.create({
    user: zomatoRecruiter._id,
    company: zomatoCompany._id,
    designation: 'Engineering Talent Partner',
    isVerified: true,
  });

  // 3. Create Students
  const studentRahul = await User.create({
    name: 'Rahul Sharma',
    email: 'rahul.sharma@student.iiite.ac.in',
    password: 'Password@123',
    role: 'student',
    isVerified: true,
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
  });

  await StudentProfile.create({
    user: studentRahul._id,
    rollNumber: '21CS101',
    department: 'Computer Science and Engineering',
    degree: 'B.Tech',
    graduationYear: 2025,
    cgpa: 8.85,
    skills: ['Python', 'React', 'Javascript', 'Docker', 'SQL', 'Node.js'],
    softSkills: ['Problem Solving', 'Public Speaking', 'Team Leadership'],
    certifications: ['AWS Certified Cloud Practitioner', 'MongoDB Associate Developer'],
    projects: [
      {
        title: 'Distributed File Storage Engine',
        description: 'Engineered high-throughput object storage cluster in Node.js and Docker.',
        technologies: ['Node.js', 'Docker', 'TypeScript'],
        link: 'https://github.com/rahul/distributed-storage',
      },
      {
        title: 'Campus Food Delivery Portal',
        description: 'Built real-time order tracking platform with React and WebSockets.',
        technologies: ['React', 'Express.js', 'MongoDB'],
      },
    ],
    resumeUrl: '/uploads/resumes/sample_resume_rahul.pdf',
    resumeOriginalName: 'Rahul_Sharma_Resume.pdf',
    bio: 'Senior year CSE student with strong foundations in distributed web systems, full-stack architecture, and cloud deployment.',
    phone: '+91 98765 43210',
    linkedIn: 'https://linkedin.com/in/rahul-sharma-iiite',
    github: 'https://github.com/rahul-sharma',
    completeness: 100,
  });

  const studentAnanya = await User.create({
    name: 'Ananya Verma',
    email: 'ananya.verma@student.iiite.ac.in',
    password: 'Password@123',
    role: 'student',
    isVerified: true,
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  });

  await StudentProfile.create({
    user: studentAnanya._id,
    rollNumber: '21IT105',
    department: 'Information Technology',
    degree: 'B.Tech',
    graduationYear: 2025,
    cgpa: 9.32,
    skills: ['Java', 'Spring Boot', 'AWS', 'Kubernetes', 'Microservices', 'SQL', 'Python'],
    softSkills: ['Analytical Thinking', 'Agile Methodologies', 'Collaboration'],
    certifications: ['Oracle Certified Professional: Java SE 17', 'AWS Solutions Architect Associate'],
    projects: [
      {
        title: 'Fintech Microservices Gateway',
        description: 'High-availability payment routing pipeline with resilient circuit breaking.',
        technologies: ['Java', 'Spring Boot', 'Kafka', 'PostgreSQL'],
      },
    ],
    resumeUrl: '/uploads/resumes/sample_resume_ananya.pdf',
    resumeOriginalName: 'Ananya_Verma_Resume.pdf',
    bio: 'Passionate about backend microservices, database optimizations, and distributed computing.',
    phone: '+91 98111 22334',
    linkedIn: 'https://linkedin.com/in/ananya-verma',
    github: 'https://github.com/ananya-v',
    completeness: 100,
  });

  const studentRohit = await User.create({
    name: 'Rohit Patel',
    email: 'rohit.patel@student.iiite.ac.in',
    password: 'Password@123',
    role: 'student',
    isVerified: true,
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
  });

  await StudentProfile.create({
    user: studentRohit._id,
    rollNumber: '21EC112',
    department: 'Electronics and Communication',
    degree: 'B.Tech',
    graduationYear: 2025,
    cgpa: 7.45,
    skills: ['C++', 'Python', 'Embedded Systems', 'IoT', 'Linux'],
    softSkills: ['Fast Learner', 'Troubleshooting'],
    projects: [
      {
        title: 'Smart Agricultural Monitoring Hub',
        description: 'ESP32 based telemetry sensor node sending metrics over MQTT.',
        technologies: ['C++', 'MQTT', 'Python'],
      },
    ],
    resumeUrl: '/uploads/resumes/sample_resume_rohit.pdf',
    resumeOriginalName: 'Rohit_Patel_Resume.pdf',
    bio: 'Aspiring embedded engineer passionate about firmware, IoT devices, and automation.',
    completeness: 85,
  });

  const studentSneha = await User.create({
    name: 'Sneha Reddy',
    email: 'sneha.reddy@student.iiite.ac.in',
    password: 'Password@123',
    role: 'student',
    isVerified: true,
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
  });

  await StudentProfile.create({
    user: studentSneha._id,
    rollNumber: '21AI118',
    department: 'Artificial Intelligence and Data Science',
    degree: 'B.Tech',
    graduationYear: 2025,
    cgpa: 8.78,
    skills: ['Python', 'Machine Learning', 'PyTorch', 'Scikit-learn', 'Pandas', 'SQL', 'FastAPI'],
    softSkills: ['Data Interpretation', 'Communication'],
    projects: [
      {
        title: 'Deep Learning Lung Segmentation',
        description: 'U-Net architecture segmenting CT scans with 94.2% dice score.',
        technologies: ['Python', 'PyTorch', 'OpenCV'],
      },
    ],
    resumeUrl: '/uploads/resumes/sample_resume_sneha.pdf',
    resumeOriginalName: 'Sneha_Reddy_Resume.pdf',
    bio: 'Machine learning practitioner keen on computer vision and predictive modeling.',
    completeness: 90,
  });

  // 4. Create Alumni
  const alumniAmit = await User.create({
    name: 'Amit Saxena',
    email: 'alumni.amit@gmail.com',
    password: 'Password@123',
    role: 'alumni',
    isVerified: true,
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
  });

  await AlumniProfile.create({
    user: alumniAmit._id,
    graduationYear: 2021,
    degree: 'B.Tech',
    department: 'Computer Science and Engineering',
    currentCompany: 'Google India',
    designation: 'Senior Software Engineer (L5)',
    expertise: ['System Design', 'Distributed Systems', 'Data Structures', 'Google Interview Prep'],
    isAvailableForMentorship: true,
    mentorshipTopics: ['Mock System Design Interviews', 'Resume Strategy for FAANG', 'Transitioning to Senior Roles'],
    bio: 'Alumnus of 2021 CSE batch. Currently working on Google Cloud networking infrastructure. Happy to mentor juniors aiming for top product companies.',
    linkedIn: 'https://linkedin.com/in/amit-saxena-tech',
    isPublic: true,
  });

  const alumniDivya = await User.create({
    name: 'Divya Krishnan',
    email: 'alumni.divya@gmail.com',
    password: 'Password@123',
    role: 'alumni',
    isVerified: true,
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150',
  });

  await AlumniProfile.create({
    user: alumniDivya._id,
    graduationYear: 2022,
    degree: 'B.Tech',
    department: 'Information Technology',
    currentCompany: 'Amazon',
    designation: 'Technical Product Manager',
    expertise: ['Product Roadmapping', 'User Research', 'Behavioral Interviews', 'Agile Leadership'],
    isAvailableForMentorship: true,
    mentorshipTopics: ['Transitioning from Dev to PM', 'Amazon Leadership Principles', 'Resume Review'],
    bio: '2022 IT grad. Leading cross-functional teams delivering eCommerce logistics capabilities across APAC.',
    linkedIn: 'https://linkedin.com/in/divya-krishnan-pm',
    isPublic: true,
  });

  // 5. Create Placement Drive
  const drive = await PlacementDrive.create({
    name: 'Graduating Batch 2025 Annual Recruitment Drive',
    academicYear: '2024-2025',
    description: 'Premier campus recruitment drive hosting top enterprise, product, and consulting employers.',
    startDate: new Date('2024-08-01'),
    endDate: new Date('2025-05-31'),
    eligibleDepartments: ['CSE', 'IT', 'ECE', 'AI & DS', 'Mechanical', 'Electrical'],
    minCgpa: 6.5,
    companies: [tcsCompany._id, infyCompany._id, msftCompany._id, zomatoCompany._id],
    status: 'ongoing',
    createdByUser: officer._id,
  });

  // 6. Create Job Postings
  const jobTcs = await Job.create({
    title: 'Assistant System Engineer (Digital)',
    company: tcsCompany._id,
    recruiter: tcsRecruiter._id,
    drive: drive._id,
    description: 'Join TCS Digital practice building transformative digital enterprise platforms. Involves full lifecycle development, cloud deployment, and client collaboration.',
    jobType: 'full_time',
    workplaceType: 'hybrid',
    location: 'Mumbai / Bengaluru / Hyderabad',
    salaryMin: 700000,
    salaryMax: 900000,
    requiredSkills: ['Python', 'SQL', 'Javascript'],
    preferredSkills: ['React', 'Docker'],
    eligibleDepartments: ['CSE', 'IT', 'ECE', 'AI & DS'],
    minCgpa: 7.0,
    targetGraduationYears: [2025],
    positions: 50,
    deadline: new Date(Date.now() + 60 * 24 * 3600 * 1000),
    status: 'active',
  });

  const jobInfy = await Job.create({
    title: 'Specialist Programmer (Power Programmer)',
    company: infyCompany._id,
    recruiter: infyRecruiter._id,
    drive: drive._id,
    description: 'Specialist Programmer role for candidates with exceptional competitive coding, algorithmic skills, and proficiency in backend languages and framework paradigms.',
    jobType: 'full_time',
    workplaceType: 'on_site',
    location: 'Bengaluru / Pune',
    salaryMin: 950000,
    salaryMax: 1150000,
    requiredSkills: ['Java', 'Data Structures', 'SQL'],
    preferredSkills: ['Spring Boot', 'Kubernetes'],
    eligibleDepartments: ['CSE', 'IT'],
    minCgpa: 7.5,
    targetGraduationYears: [2025, 2026],
    positions: 25,
    deadline: new Date(Date.now() + 75 * 24 * 3600 * 1000),
    status: 'active',
  });

  const jobMsft = await Job.create({
    title: 'Software Development Engineer - 1 (SDE-1)',
    company: msftCompany._id,
    recruiter: msftRecruiter._id,
    drive: drive._id,
    description: 'Develop large scale cloud services and Windows developer tools. Strong foundation in object-oriented programming, data structures, and problem-solving required.',
    jobType: 'full_time',
    workplaceType: 'hybrid',
    location: 'Hyderabad / Bengaluru / Noida',
    salaryMin: 1800000,
    salaryMax: 2400000,
    requiredSkills: ['C++', 'Data Structures', 'Algorithms', 'System Design'],
    preferredSkills: ['Cloud', 'Distributed Systems'],
    eligibleDepartments: ['CSE', 'IT'],
    minCgpa: 8.0,
    targetGraduationYears: [2025, 2026],
    positions: 15,
    deadline: new Date(Date.now() + 90 * 24 * 3600 * 1000),
    status: 'active',
  });

  const jobZomato = await Job.create({
    title: 'Full Stack Engineering Intern',
    company: zomatoCompany._id,
    recruiter: zomatoRecruiter._id,
    drive: drive._id,
    description: '6-month fast-paced engineering internship on hyper-scale consumer food ordering and delivery stack. Hands-on feature development from day one.',
    jobType: 'internship',
    workplaceType: 'on_site',
    location: 'Gurugram, NCR',
    stipend: 50000,
    requiredSkills: ['React', 'Node.js', 'Javascript'],
    preferredSkills: ['Docker', 'MongoDB'],
    eligibleDepartments: ['CSE', 'IT', 'ECE', 'AI & DS'],
    minCgpa: 6.5,
    targetGraduationYears: [2025, 2026],
    positions: 8,
    deadline: new Date(Date.now() + 45 * 24 * 3600 * 1000),
    status: 'active',
  });

  // 7. Create Sample Applications with realistic statuses
  const appAnanyaMsft = await Application.create({
    job: jobMsft._id,
    student: studentAnanya._id,
    resumeUrl: '/uploads/resumes/sample_resume_ananya.pdf',
    resumeOriginalName: 'Ananya_Verma_Resume.pdf',
    coverNote: 'Excited to contribute to Microsoft Azure cloud core infrastructure.',
    status: 'selected',
    statusHistory: [
      { status: 'applied', changedBy: studentAnanya._id, note: 'Applied via CampusConnect portal.', changedAt: new Date('2024-09-01') },
      { status: 'shortlisted', changedBy: msftRecruiter._id, note: 'Top quartile coding assessment score.', changedAt: new Date('2024-09-08') },
      { status: 'interview_scheduled', changedBy: msftRecruiter._id, note: 'Technical rounds 1 & 2 cleared.', changedAt: new Date('2024-09-15') },
      { status: 'selected', changedBy: msftRecruiter._id, note: 'Offer letter extended at 21 LPA CTC.', changedAt: new Date('2024-09-22') },
    ],
    aiMatchScore: 88.5,
    aiExplanation: 'High alignment in Data Structures and Algorithms with stellar 9.32 CGPA.',
    aiMatchedSkills: ['c++', 'algorithms', 'data structures', 'system design'],
    aiMissingSkills: ['distributed systems'],
    appliedAt: new Date('2024-09-01'),
  });

  const appRahulZomato = await Application.create({
    job: jobZomato._id,
    student: studentRahul._id,
    resumeUrl: '/uploads/resumes/sample_resume_rahul.pdf',
    resumeOriginalName: 'Rahul_Sharma_Resume.pdf',
    coverNote: 'Passionate full-stack developer with published React and Docker projects.',
    status: 'interview_scheduled',
    statusHistory: [
      { status: 'applied', changedBy: studentRahul._id, note: 'Applied.', changedAt: new Date('2024-09-10') },
      { status: 'shortlisted', changedBy: zomatoRecruiter._id, note: 'Impressive project portfolio.', changedAt: new Date('2024-09-14') },
      { status: 'interview_scheduled', changedBy: zomatoRecruiter._id, note: 'Scheduled technical round.', changedAt: new Date('2024-09-18') },
    ],
    aiMatchScore: 92.4,
    aiExplanation: 'Profile perfectly matches required React and Node.js skills with project experience.',
    aiMatchedSkills: ['react.js', 'node.js', 'javascript', 'docker'],
    aiMissingSkills: [],
    appliedAt: new Date('2024-09-10'),
  });

  const appRahulInfy = await Application.create({
    job: jobInfy._id,
    student: studentRahul._id,
    resumeUrl: '/uploads/resumes/sample_resume_rahul.pdf',
    resumeOriginalName: 'Rahul_Sharma_Resume.pdf',
    status: 'shortlisted',
    statusHistory: [
      { status: 'applied', changedBy: studentRahul._id, note: 'Application submitted.', changedAt: new Date('2024-09-12') },
      { status: 'shortlisted', changedBy: infyRecruiter._id, note: 'Shortlisted for online assessment.', changedAt: new Date('2024-09-16') },
    ],
    aiMatchScore: 78.0,
    aiExplanation: 'Strong academic performance and SQL proficiency.',
    aiMatchedSkills: ['sql', 'data structures'],
    aiMissingSkills: ['java'],
    appliedAt: new Date('2024-09-12'),
  });

  const appRohitTcs = await Application.create({
    job: jobTcs._id,
    student: studentRohit._id,
    resumeUrl: '/uploads/resumes/sample_resume_rohit.pdf',
    resumeOriginalName: 'Rohit_Patel_Resume.pdf',
    status: 'under_review',
    statusHistory: [
      { status: 'applied', changedBy: studentRohit._id, note: 'Applied.', changedAt: new Date('2024-09-15') },
      { status: 'under_review', changedBy: tcsRecruiter._id, note: 'Resume under initial evaluation.', changedAt: new Date('2024-09-17') },
    ],
    aiMatchScore: 68.2,
    aiExplanation: 'Eligible department and CGPA. Candidate has Python background.',
    aiMatchedSkills: ['python'],
    aiMissingSkills: ['sql', 'javascript'],
    appliedAt: new Date('2024-09-15'),
  });

  // 8. Create Scheduled Interview
  await Interview.create({
    application: appRahulZomato._id,
    job: jobZomato._id,
    student: studentRahul._id,
    recruiter: zomatoRecruiter._id,
    round: 'Technical Interview (Live Coding & Architecture)',
    scheduledAt: new Date(Date.now() + 48 * 3600 * 1000), // in 2 days
    durationMinutes: 45,
    meetingLink: 'https://meet.google.com/xyz-placement-zomato',
    location: 'Google Meet / Online',
    interviewerNotes: 'Candidate demonstrates strong React and state management fundamentals.',
    status: 'scheduled',
    outcome: 'pending',
  });

  // 9. Create Alumni Mentorship Request
  await MentorshipRequest.create({
    student: studentRahul._id,
    alumni: alumniAmit._id,
    topic: 'Guidance on System Design & FAANG Level Product Company Interviews',
    message: 'Hello Amit Sir, I am preparing for product engineering roles and would love your advice on preparing for scalable system design rounds.',
    status: 'accepted',
    responseNote: 'Glad to assist! Lets connect this Saturday at 4 PM IST.',
    meetingDetails: 'Google Meet: https://meet.google.com/mentor-amit-rahul (Saturday 4:00 PM)',
  });

  // 10. Create Alumni Events & Workshops
  const event1 = await Event.create({
    title: 'Masterclass: Cracking FAANG Level Product Engineering Rounds',
    description: 'Comprehensive breakdown of algorithmic patterns, dynamic programming, and low-level system design by Senior Google Engineer Amit Saxena.',
    organizer: alumniAmit._id,
    organizerType: 'alumni',
    eventType: 'workshop',
    eventDate: new Date(Date.now() + 5 * 24 * 3600 * 1000), // in 5 days
    durationMinutes: 90,
    locationOrLink: 'https://meet.google.com/faang-masterclass-iiite',
    maxAttendees: 150,
    registeredCount: 42,
    isPublic: true,
  });

  const event2 = await Event.create({
    title: 'Placement Cell: Pre-Placement Talk and Resume Optimization Masterclass',
    description: 'Placement team orientation explaining campus rules, tier-1 company cutoffs, and ATS-friendly resume formatting.',
    organizer: officer._id,
    organizerType: 'placement_officer',
    eventType: 'prep_session',
    eventDate: new Date(Date.now() + 8 * 24 * 3600 * 1000),
    durationMinutes: 60,
    locationOrLink: 'University Auditorium / Hall B',
    maxAttendees: 300,
    registeredCount: 110,
    isPublic: true,
  });

  // 11. Create Notifications
  await Notification.create({
    recipient: studentRahul._id,
    title: 'Interview Scheduled',
    message: 'Your interview for Full Stack Engineering Intern with Zomato has been scheduled.',
    type: 'interview',
    link: '/student/applications',
  });

  await Notification.create({
    recipient: studentRahul._id,
    title: 'Mentorship Request Accepted',
    message: 'Amit Saxena accepted your mentorship request with meeting link.',
    type: 'mentorship',
    link: '/student/career-assistance',
  });

  await Notification.create({
    recipient: studentAnanya._id,
    title: 'Congratulations! Selected at Microsoft India',
    message: 'Your application for SDE-1 has been marked SELECTED. Offer details in your dashboard.',
    type: 'application',
    link: '/student/applications',
  });

  // 12. Audit Logs
  await AuditLog.create({
    actor: officer._id,
    actorRole: 'placement_officer',
    actorEmail: officer.email,
    action: 'CREATE_PLACEMENT_DRIVE',
    resourceType: 'PlacementDrive',
    resourceId: drive._id.toString(),
    details: { name: drive.name, academicYear: drive.academicYear },
  });

  await AuditLog.create({
    actor: officer._id,
    actorRole: 'placement_officer',
    actorEmail: officer.email,
    action: 'VERIFY_USER',
    resourceType: 'User',
    resourceId: msftRecruiter._id.toString(),
    details: { targetEmail: msftRecruiter.email, role: 'recruiter' },
  });

  console.log('--- Database Seeding Complete ---');
  console.log('Seeded User Credentials:');
  console.log('  Placement Officer : admin@campusconnect.edu | Password@123');
  console.log('  Recruiter (MSFT)  : recruiter.msft@microsoft.com | Password@123');
  console.log('  Recruiter (TCS)   : recruiter.tcs@tcs.com | Password@123');
  console.log('  Student (Rahul)   : rahul.sharma@student.iiite.ac.in | Password@123');
  console.log('  Student (Ananya)  : ananya.verma@student.iiite.ac.in | Password@123');
  console.log('  Alumni (Amit)     : alumni.amit@gmail.com | Password@123');
};

// If run directly from CLI
if (process.argv[1]?.includes('seed')) {
  (async () => {
    try {
      await connectDB();
      await seedDatabase();
      await disconnectDB();
      process.exit(0);
    } catch (err) {
      console.error('Seeding failed:', err);
      process.exit(1);
    }
  })();
}
