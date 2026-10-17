import mongoose, { Document, Schema } from 'mongoose';

export interface IAlumniProfile extends Document {
  user: mongoose.Types.ObjectId;
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
  createdAt: Date;
  updatedAt: Date;
}

const AlumniProfileSchema = new Schema<IAlumniProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    graduationYear: {
      type: Number,
      required: [true, 'Graduation year is required'],
      index: true,
    },
    degree: {
      type: String,
      required: [true, 'Degree program is required'],
      default: 'B.Tech',
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      index: true,
    },
    currentCompany: {
      type: String,
      required: [true, 'Current organization is required'],
      trim: true,
      index: true,
    },
    designation: {
      type: String,
      required: [true, 'Current designation is required'],
      trim: true,
    },
    expertise: {
      type: [String],
      default: [],
      index: true,
    },
    isAvailableForMentorship: {
      type: Boolean,
      default: true,
      index: true,
    },
    mentorshipTopics: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      default: '',
      maxlength: 1000,
    },
    linkedIn: {
      type: String,
      default: '',
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const AlumniProfile = mongoose.model<IAlumniProfile>('AlumniProfile', AlumniProfileSchema);
