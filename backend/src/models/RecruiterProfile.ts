import mongoose, { Document, Schema } from 'mongoose';

export interface IRecruiterProfile extends Document {
  user: mongoose.Types.ObjectId;
  company?: mongoose.Types.ObjectId;
  designation: string;
  phone?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RecruiterProfileSchema = new Schema<IRecruiterProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      index: true,
    },
    designation: {
      type: String,
      required: [true, 'Designation / job title is required'],
      trim: true,
    },
    phone: {
      type: String,
      default: '',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const RecruiterProfile = mongoose.model<IRecruiterProfile>('RecruiterProfile', RecruiterProfileSchema);
