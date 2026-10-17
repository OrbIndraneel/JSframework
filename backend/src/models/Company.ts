import mongoose, { Document, Schema } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  recruiter: mongoose.Types.ObjectId;
  industry: string;
  website?: string;
  location: string;
  description: string;
  logoUrl?: string;
  isVerified: boolean;
  contactEmail: string;
  contactPhone?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      index: true,
    },
    recruiter: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    industry: {
      type: String,
      required: [true, 'Industry is required'],
      trim: true,
      index: true,
    },
    website: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      required: [true, 'Location / HQ is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Company description is required'],
      maxlength: 3000,
    },
    logoUrl: {
      type: String,
      default: '',
    },
    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    contactEmail: {
      type: String,
      required: [true, 'Company contact email is required'],
      lowercase: true,
      trim: true,
    },
    contactPhone: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Company = mongoose.model<ICompany>('Company', CompanySchema);
