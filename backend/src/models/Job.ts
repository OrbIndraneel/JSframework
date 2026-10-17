import mongoose, { Document, Schema } from 'mongoose';

export type JobType = 'full_time' | 'internship';
export type WorkplaceType = 'on_site' | 'remote' | 'hybrid';
export type JobStatus = 'draft' | 'active' | 'closed';

export interface IJob extends Document {
  title: string;
  company: mongoose.Types.ObjectId;
  recruiter: mongoose.Types.ObjectId;
  drive?: mongoose.Types.ObjectId;
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
  deadline: Date;
  status: JobStatus;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      index: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
    },
    recruiter: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    drive: {
      type: Schema.Types.ObjectId,
      ref: 'PlacementDrive',
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      maxlength: 10000,
    },
    jobType: {
      type: String,
      enum: ['full_time', 'internship'],
      default: 'full_time',
      index: true,
    },
    workplaceType: {
      type: String,
      enum: ['on_site', 'remote', 'hybrid'],
      default: 'on_site',
    },
    location: {
      type: String,
      required: [true, 'Job location is required'],
      trim: true,
    },
    salaryMin: {
      type: Number,
      min: 0,
    },
    salaryMax: {
      type: Number,
      min: 0,
    },
    stipend: {
      type: Number,
      min: 0,
    },
    requiredSkills: {
      type: [String],
      required: true,
      default: [],
      index: true,
    },
    preferredSkills: {
      type: [String],
      default: [],
    },
    eligibleDepartments: {
      type: [String],
      default: [],
      index: true,
    },
    minCgpa: {
      type: Number,
      default: 0.0,
      min: 0,
      max: 10,
      index: true,
    },
    targetGraduationYears: {
      type: [Number],
      default: [],
      index: true,
    },
    positions: {
      type: Number,
      default: 1,
      min: 1,
    },
    deadline: {
      type: Date,
      required: [true, 'Application deadline is required'],
      index: true,
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'closed'],
      default: 'draft',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Job = mongoose.model<IJob>('Job', JobSchema);
