import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  GraduationCap,
  Briefcase,
  HelpCircle,
} from 'lucide-react';
import { apiClient } from '../../services/api.js';
import { AIMatchRecommendation } from '../../types/index.js';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.js';
import { EmptyState } from '../../components/common/EmptyState.js';

export const StudentRecommendationsPage: React.FC = () => {
  const [recommendations, setRecommendations] = useState<AIMatchRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get('/students/recommendations')
      .then((res) => {
        setRecommendations(res.data.data.recommendations || []);
      })
      .catch((err) => console.error('Failed to fetch recommendations:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <LoadingSpinner message="Calculating AI job matches and running scikit-learn TF-IDF analysis..." />
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.2rem 0.6rem',
            background: 'var(--primary-100)',
            color: 'var(--primary-800)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: 700,
            marginBottom: '0.5rem',
          }}
        >
          <BrainCircuit size={14} /> PYTHON FASTAPI RECOMMENDATION SERVICE
        </div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.25rem' }}>
          Personalized Career Recommendations & Skill Gap Analysis
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Real-time candidate-job compatibility ranked through weighted skill overlap, semantic relevance, and university eligibility enforcement.
        </p>
      </div>

      {recommendations.length === 0 ? (
        <EmptyState
          title="No Recommendations Available"
          description="Make sure you have added your skills and academic branch in your profile, and that active jobs are published."
          actionText="Browse Openings"
          onAction={() => (window.location.href = '/jobs')}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {recommendations.map((rec) => {
            const isHighMatch = rec.match_score >= 75;
            const isMedMatch = rec.match_score >= 50;

            return (
              <div
                key={rec.job_id}
                className="card card-hover"
                style={{
                  borderLeft: `5px solid ${
                    !rec.is_eligible ? '#ef4444' : isHighMatch ? '#10b981' : isMedMatch ? '#3b82f6' : '#f59e0b'
                  }`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    marginBottom: '1rem',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--navy-900)' }}>
                        {rec.title}
                      </h2>
                      <span
                        className={`badge ${
                          rec.is_eligible ? 'badge-success' : 'badge-danger'
                        }`}
                      >
                        {rec.is_eligible ? '✓ Fully Eligible' : '✕ Ineligible'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                      {rec.company_name}
                    </div>
                  </div>

                  {/* Match Score Badge */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '1.85rem',
                        fontWeight: 800,
                        color: !rec.is_eligible ? '#ef4444' : isHighMatch ? '#059669' : '#2563eb',
                        lineHeight: 1,
                      }}
                    >
                      {rec.match_score}%
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      Match Score
                    </div>
                  </div>
                </div>

                {/* Recommendation Rationale */}
                <div
                  style={{
                    background: rec.is_eligible ? 'var(--primary-50)' : 'var(--danger-bg)',
                    border: `1px solid ${rec.is_eligible ? 'var(--primary-100)' : 'var(--danger-border)'}`,
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.75rem 1rem',
                    fontSize: '0.85rem',
                    color: rec.is_eligible ? 'var(--primary-900)' : 'var(--danger-text)',
                    marginBottom: '1rem',
                  }}
                >
                  <strong>AI Assessment:</strong> {rec.recommendation_rationale}
                </div>

                {/* Score Breakdown Details */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '0.75rem',
                    background: 'var(--surface-muted)',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '1rem',
                    fontSize: '0.8rem',
                  }}
                >
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Required Skills: </span>
                    <strong style={{ color: 'var(--navy-900)' }}>
                      {rec.score_breakdown?.required_skill_overlap}%
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Semantic Relevance: </span>
                    <strong style={{ color: 'var(--navy-900)' }}>
                      {rec.score_breakdown?.text_relevance_similarity}%
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Academic Standing: </span>
                    <strong style={{ color: 'var(--navy-900)' }}>
                      {rec.score_breakdown?.academic_score}%
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Preferred Skills: </span>
                    <strong style={{ color: 'var(--navy-900)' }}>
                      {rec.score_breakdown?.preferred_skill_overlap}%
                    </strong>
                  </div>
                </div>

                {/* Skills Analysis */}
                <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
                  {/* Matched Skills */}
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                      Matched Competencies ({rec.matched_skills.length})
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {rec.matched_skills.length > 0 ? (
                        rec.matched_skills.map((s) => (
                          <span
                            key={s}
                            style={{
                              background: '#ecfdf5',
                              color: '#065f46',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              padding: '0.2rem 0.5rem',
                              borderRadius: '4px',
                            }}
                          >
                            ✓ {s}
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          No overlapping skills found in candidate profile.
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Missing Skills / Skill Gap */}
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                      Skill Gap / Missing Requirements ({rec.missing_skills.length})
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {rec.missing_skills.length > 0 ? (
                        rec.missing_skills.map((s) => (
                          <span
                            key={s}
                            style={{
                              background: '#fffbeb',
                              color: '#92400e',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              padding: '0.2rem 0.5rem',
                              borderRadius: '4px',
                            }}
                          >
                            ! {s}
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>
                          No missing skill gaps detected!
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Link */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.75rem', borderTop: '1px solid var(--surface-border)' }}>
                  <Link
                    to={`/jobs/${rec.job_id}`}
                    className="btn btn-outline-primary btn-sm"
                  >
                    View Job & Apply &rarr;
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
