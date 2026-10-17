import mongoose, { Document, Schema } from 'mongoose';

export type ApplicationStatus =
  | 'applied'
  | 'under_review'
  | 'shortlisted'
  | 'interview_scheduled'
  | 'selected'
  | 'rejected'
  | 'withdrawn';

export interface IStatusHistoryItem {
  status: ApplicationStatus;
  changedBy: mongoose.Types.ObjectId;
  note?: string;
  changedAt: Date;
}

export interface IApplication extends Document {
  job: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  resumeUrl: string;
  resumeOriginalName?: string;
  coverNote?: string;
  status: ApplicationStatus;
  statusHistory: IStatusHistoryItem[];
  aiMatchScore?: number;
  aiExplanation?: string;
  aiMatchedSkills?: string[];
  aiMissingSkills?: string[];
  appliedAt: Date;
  updatedAt: Date;
}

const StatusHistorySchema = new Schema<IStatusHistoryItem>(
  {
    status: {
      type: String,
      enum: [
        'applied',
        'under_review',
        'shortlisted',
        'interview_scheduled',
        'selected',
        'rejected',
        'withdrawn',
      ],
      required: true,
    },
    changedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    note: {
      type: String,
      default: '',
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const ApplicationSchema = new Schema<IApplication>(
  {
    job: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    resumeUrl: {
      type: String,
      required: [true, 'Resume document is required for applying'],
    },
    resumeOriginalName: {
      type: String,
      default: '',
    },
    coverNote: {
      type: String,
      default: '',
      maxlength: 1500,
    },
    status: {
      type: String,
      enum: [
        'applied',
        'under_review',
        'shortlisted',
        'interview_scheduled',
        'selected',
        'rejected',
        'withdrawn',
      ],
      default: 'applied',
      index: true,
    },
    statusHistory: {
      type: [StatusHistorySchema],
      default: [],
    },
    aiMatchScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    aiExplanation: {
      type: String,
      default: '',
    },
    aiMatchedSkills: {
      type: [String],
      default: [],
    },
    aiMissingSkills: {
      type: [String],
      default: [],
    },
    appliedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Crucial: unique compound index prevents duplicate applications
ApplicationSchema.index({ job: 1, student: 1 }, { unique: true });

export const Application = mongoose.model<IApplication>('Application', ApplicationSchema);
