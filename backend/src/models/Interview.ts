import mongoose, { Document, Schema } from 'mongoose';

export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
export type InterviewOutcome = 'pending' | 'passed' | 'failed';

export interface IInterview extends Document {
  application: mongoose.Types.ObjectId;
  job: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  recruiter: mongoose.Types.ObjectId;
  round: string;
  scheduledAt: Date;
  durationMinutes: number;
  meetingLink?: string;
  location?: string;
  interviewerNotes?: string;
  status: InterviewStatus;
  outcome: InterviewOutcome;
  createdAt: Date;
  updatedAt: Date;
}

const InterviewSchema = new Schema<IInterview>(
  {
    application: {
      type: Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
      index: true,
    },
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
    recruiter: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    round: {
      type: String,
      required: [true, 'Interview round description is required'],
      default: 'Technical Interview',
    },
    scheduledAt: {
      type: Date,
      required: [true, 'Scheduled date and time are required'],
      index: true,
    },
    durationMinutes: {
      type: Number,
      default: 45,
    },
    meetingLink: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: 'Online / Campus Placement Cell',
    },
    interviewerNotes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
      default: 'scheduled',
      index: true,
    },
    outcome: {
      type: String,
      enum: ['pending', 'passed', 'failed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export const Interview = mongoose.model<IInterview>('Interview', InterviewSchema);
