import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Users, CheckCircle, Video } from 'lucide-react';
import { apiClient } from '../../services/api.js';
import { CampusEvent } from '../../types/index.js';
import { useAppSelector } from '../../store/index.js';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.js';
import { EmptyState } from '../../components/common/EmptyState.js';

export const EventsPage: React.FC = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/alumni/events');
      setEvents(res.data.data);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRegister = async (eventId: string) => {
    if (!isAuthenticated) {
      alert('Please log in as a student to register for events.');
      return;
    }

    setRegisteringId(eventId);
    try {
      await apiClient.post(`/alumni/events/${eventId}/register`);
      alert('Registration confirmed! You will receive updates in your in-app notifications.');
      fetchEvents();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to register for event.');
    } finally {
      setRegisteringId(null);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.4rem' }}>
          Workshops, Tech Talks & Placement Drives
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Interactive preparation sessions, system design masterclasses, and corporate pre-placement talks.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading events schedule..." />
      ) : events.length === 0 ? (
        <EmptyState
          title="No Upcoming Events"
          description="Check back soon for newly scheduled alumni workshops and placement orientation sessions."
        />
      ) : (
        <div className="grid-2">
          {events.map((ev) => (
            <div key={ev._id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span className="badge badge-info" style={{ textTransform: 'capitalize' }}>
                  {ev.eventType.replace('_', ' ')}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Organized by: {ev.organizerType === 'placement_officer' ? 'Placement Cell' : 'Alumni Network'}
                </span>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
                {ev.title}
              </h3>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {ev.description}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={16} color="var(--primary-600)" />
                  <span style={{ color: 'var(--navy-900)', fontWeight: 500 }}>
                    {new Date(ev.eventDate).toLocaleDateString()} at {new Date(ev.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={16} color="var(--primary-600)" />
                  <span>Duration: {ev.durationMinutes} Minutes</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={16} color="var(--primary-600)" />
                  <span>{ev.locationOrLink}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={16} color="var(--primary-600)" />
                  <span>
                    {ev.registeredCount} / {ev.maxAttendees} Attendees Registered
                  </span>
                </div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--surface-border)' }}>
                {ev.isUserRegistered ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      color: 'var(--success-text)',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      padding: '0.5rem',
                      background: 'var(--success-bg)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <CheckCircle size={18} /> You are registered for this event
                  </div>
                ) : (
                  <button
                    onClick={() => handleRegister(ev._id)}
                    disabled={registeringId === ev._id || ev.registeredCount >= ev.maxAttendees}
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                  >
                    {registeringId === ev._id
                      ? 'Confirming Registration...'
                      : ev.registeredCount >= ev.maxAttendees
                      ? 'Event Full'
                      : 'Register for Workshop'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
