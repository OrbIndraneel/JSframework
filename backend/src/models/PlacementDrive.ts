import mongoose, { Document, Schema } from 'mongoose';

export type DriveStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface IPlacementDrive extends Document {
  name: string;
  academicYear: string;
  description: string;
  startDate: Date;
  endDate: Date;
  eligibleDepartments: string[];
  minCgpa: number;
  companies: mongoose.Types.ObjectId[];
  status: DriveStatus;
  createdByUser: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PlacementDriveSchema = new Schema<IPlacementDrive>(
  {
    name: {
      type: String,
      required: [true, 'Drive name is required'],
      trim: true,
      index: true,
    },
    academicYear: {
      type: String,
      required: [true, 'Academic year is required (e.g. 2024-2025)'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      default: '',
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    eligibleDepartments: {
      type: [String],
      default: [],
    },
    minCgpa: {
      type: Number,
      default: 0.0,
    },
    companies: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Company',
      },
    ],
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
      index: true,
    },
    createdByUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const PlacementDrive = mongoose.model<IPlacementDrive>('PlacementDrive', PlacementDriveSchema);
