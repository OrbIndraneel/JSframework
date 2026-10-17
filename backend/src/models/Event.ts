import mongoose, { Document, Schema } from 'mongoose';

export type EventType = 'workshop' | 'webinar' | 'guest_lecture' | 'prep_session';
export type OrganizerType = 'alumni' | 'placement_officer';

export interface IEvent extends Document {
  title: string;
  description: string;
  organizer: mongoose.Types.ObjectId;
  organizerType: OrganizerType;
  eventType: EventType;
  eventDate: Date;
  durationMinutes: number;
  locationOrLink: string;
  maxAttendees: number;
  registeredCount: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      maxlength: 3000,
    },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    organizerType: {
      type: String,
      enum: ['alumni', 'placement_officer'],
      default: 'alumni',
    },
    eventType: {
      type: String,
      enum: ['workshop', 'webinar', 'guest_lecture', 'prep_session'],
      default: 'webinar',
    },
    eventDate: {
      type: Date,
      required: [true, 'Event date and time are required'],
      index: true,
    },
    durationMinutes: {
      type: Number,
      default: 60,
    },
    locationOrLink: {
      type: String,
      required: [true, 'Meeting link or campus room is required'],
    },
    maxAttendees: {
      type: Number,
      default: 100,
    },
    registeredCount: {
      type: Number,
      default: 0,
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

export const Event = mongoose.model<IEvent>('Event', EventSchema);
