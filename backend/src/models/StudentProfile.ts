import mongoose, { Document, Schema } from 'mongoose';

export interface IProject {
  title: string;
  description?: string;
  technologies: string[];
  link?: string;
}

export interface IStudentProfile extends Document {
  user: mongoose.Types.ObjectId;
  rollNumber: string;
  department: string;
  degree: string;
  graduationYear: number;
  cgpa: number;
  skills: string[];
  softSkills: string[];
  certifications: string[];
  projects: IProject[];
  resumeUrl?: string;
  resumeOriginalName?: string;
  resumeUploadedAt?: Date;
  isPublic: boolean;
  bio?: string;
  phone?: string;
  linkedIn?: string;
  github?: string;
  completeness: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    technologies: { type: [String], default: [] },
    link: { type: String, default: '' },
  },
  { _id: false }
);

const StudentProfileSchema = new Schema<IStudentProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    rollNumber: {
      type: String,
      required: [true, 'Roll number / enrollment ID is required'],
      trim: true,
      index: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      index: true,
    },
    degree: {
      type: String,
      required: [true, 'Degree program is required'],
      default: 'B.Tech',
    },
    graduationYear: {
      type: Number,
      required: [true, 'Graduation year is required'],
      index: true,
    },
    cgpa: {
      type: Number,
      required: [true, 'CGPA is required'],
      min: 0,
      max: 10,
      index: true,
    },
    skills: {
      type: [String],
      default: [],
      index: true,
    },
    softSkills: {
      type: [String],
      default: [],
    },
    certifications: {
      type: [String],
      default: [],
    },
    projects: {
      type: [ProjectSchema],
      default: [],
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    resumeOriginalName: {
      type: String,
      default: '',
    },
    resumeUploadedAt: {
      type: Date,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    bio: {
      type: String,
      default: '',
      maxlength: 1000,
    },
    phone: {
      type: String,
      default: '',
    },
    linkedIn: {
      type: String,
      default: '',
    },
    github: {
      type: String,
      default: '',
    },
    completeness: {
      type: Number,
      default: 20,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to calculate profile completeness score
StudentProfileSchema.pre<IStudentProfile>('save', function (next) {
  let score = 20; // base for required fields
  if (this.skills && this.skills.length > 0) score += 20;
  if (this.projects && this.projects.length > 0) score += 20;
  if (this.resumeUrl) score += 20;
  if (this.certifications && this.certifications.length > 0) score += 10;
  if (this.bio || this.linkedIn || this.github) score += 10;
  this.completeness = Math.min(score, 100);
  next();
});

export const StudentProfile = mongoose.model<IStudentProfile>('StudentProfile', StudentProfileSchema);
