export type UserRole = 'student' | 'recruiter' | 'placement_officer' | 'alumni';

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  isActive?: boolean;
  avatarUrl?: string;
  createdAt?: string;
}

export interface Project {
  title: string;
  description?: string;
  technologies: string[];
  link?: string;
}

export interface StudentProfile {
  _id: string;
  user: User | string;
  rollNumber: string;
  department: string;
  degree: string;
  graduationYear: number;
  cgpa: number;
  skills: string[];
  softSkills: string[];
  certifications: string[];
  projects: Project[];
  resumeUrl?: string;
  resumeOriginalName?: string;
  resumeUploadedAt?: string;
  isPublic: boolean;
  bio?: string;
  phone?: string;
  linkedIn?: string;
  github?: string;
  completeness: number;
}

export interface Company {
  _id: string;
  name: string;
  industry: string;
  website?: string;
  location: string;
  description: string;
  logoUrl?: string;
  isVerified: boolean;
  contactEmail: string;
  contactPhone?: string;
}

export interface RecruiterProfile {
  _id: string;
  user: User | string;
  company?: Company;
  designation: string;
  phone?: string;
  isVerified: boolean;
}

export interface AlumniProfile {
  _id: string;
  user: User;
  graduationYear: number;
  degree: string;
  department: string;
  currentCompany: string;
  designation: string;
  expertise: string[];
  isAvailableForMentorship: boolean;
  mentorshipTopics: string[];
  bio?: string;
  linkedIn?: string;
  isPublic: boolean;
}

export type JobType = 'full_time' | 'internship';
export type WorkplaceType = 'on_site' | 'remote' | 'hybrid';
export type JobStatus = 'draft' | 'active' | 'closed';

export interface Job {
  _id: string;
  title: string;
  company: Company;
  recruiter: User | string;
  drive?: any;
  description: string;
  jobType: JobType;
  workplaceType: WorkplaceType;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  stipend?: number;
  requiredSkills: string[];
  preferredSkills: string[];
  eligibleDepartments: string[];
  minCgpa: number;
  targetGraduationYears: number[];
  positions: number;
  deadline: string;
  status: JobStatus;
  applicantCount?: number;
  createdAt: string;
}

export type ApplicationStatus =
  | 'applied'
  | 'under_review'
  | 'shortlisted'
  | 'interview_scheduled'
  | 'selected'
  | 'rejected'
  | 'withdrawn';

export interface StatusHistoryItem {
  status: ApplicationStatus;
  changedBy: string | User;
  note?: string;
  changedAt: string;
}

export interface Application {
  _id: string;
  job: Job;
  student: User;
  resumeUrl: string;
  resumeOriginalName?: string;
  coverNote?: string;
  status: ApplicationStatus;
  statusHistory: StatusHistoryItem[];
  aiMatchScore?: number;
  aiExplanation?: string;
  aiMatchedSkills?: string[];
  aiMissingSkills?: string[];
  appliedAt: string;
  studentProfile?: StudentProfile;
  interview?: Interview | null;
}

export interface Interview {
  _id: string;
  application: string;
  job: Job | string;
  student: User | string;
  round: string;
  scheduledAt: string;
  durationMinutes: number;
  meetingLink?: string;
  location?: string;
  interviewerNotes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  outcome: 'pending' | 'passed' | 'failed';
}

export interface MentorshipRequest {
  _id: string;
  student: User;
  alumni: User;
  topic: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  responseNote?: string;
  meetingDetails?: string;
  createdAt: string;
}

export interface CampusEvent {
  _id: string;
  title: string;
  description: string;
  organizer: User;
  organizerType: 'alumni' | 'placement_officer';
  eventType: 'workshop' | 'webinar' | 'guest_lecture' | 'prep_session';
  eventDate: string;
  durationMinutes: number;
  locationOrLink: string;
  maxAttendees: number;
  registeredCount: number;
  isPublic: boolean;
  isUserRegistered?: boolean;
}

export interface PlacementDrive {
  _id: string;
  name: string;
  academicYear: string;
  description?: string;
  startDate: string;
  endDate: string;
  eligibleDepartments: string[];
  minCgpa: number;
  companies: Company[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AIMatchRecommendation {
  job_id: string;
  title: string;
  company_name: string;
  match_score: number;
  is_eligible: boolean;
  eligibility_reasons: string[];
  matched_skills: string[];
  missing_skills: string[];
  score_breakdown: {
    required_skill_overlap: number;
    preferred_skill_overlap: number;
    text_relevance_similarity: number;
    academic_score: number;
    overall_raw_score: number;
  };
  explanation: string;
  suggested_skills: string[];
  recommendation_rationale: string;
  jobDetails?: Job;
}

export interface PlacementAnalytics {
  kpis: {
    totalStudents: number;
    verifiedRecruiters: number;
    activeJobs: number;
    totalApplications: number;
    placedStudents: number;
    placementRate: number;
    placementRateFormula: string;
  };
  funnel: Record<string, number>;
  departmentDistribution: Array<{ department: string; count: number }>;
  companyHiring: Array<{ company: string; hires: number }>;
  salaryStats: {
    avgSalary: number;
    minSalary: number;
    maxSalary: number;
  };
}
