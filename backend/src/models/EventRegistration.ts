import mongoose, { Document, Schema } from 'mongoose';

export interface IEventRegistration extends Document {
  event: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  registeredAt: Date;
}

const EventRegistrationSchema = new Schema<IEventRegistration>(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

// Prevent duplicate registrations
EventRegistrationSchema.index({ event: 1, user: 1 }, { unique: true });

export const EventRegistration = mongoose.model<IEventRegistration>(
  'EventRegistration',
  EventRegistrationSchema
);
