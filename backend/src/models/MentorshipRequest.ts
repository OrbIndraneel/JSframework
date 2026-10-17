import mongoose, { Document, Schema } from 'mongoose';

export type MentorshipStatus = 'pending' | 'accepted' | 'declined' | 'completed';

export interface IMentorshipRequest extends Document {
  student: mongoose.Types.ObjectId;
  alumni: mongoose.Types.ObjectId;
  topic: string;
  message: string;
  status: MentorshipStatus;
  responseNote?: string;
  meetingDetails?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MentorshipRequestSchema = new Schema<IMentorshipRequest>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    alumni: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    topic: {
      type: String,
      required: [true, 'Topic / objective is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message to mentor is required'],
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'completed'],
      default: 'pending',
      index: true,
    },
    responseNote: {
      type: String,
      default: '',
    },
    meetingDetails: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const MentorshipRequest = mongoose.model<IMentorshipRequest>('MentorshipRequest', MentorshipRequestSchema);
