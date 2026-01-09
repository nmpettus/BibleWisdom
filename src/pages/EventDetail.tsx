import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, Calendar, Tag, FileText, Edit, Trash2, Heart } from 'lucide-react';
import { getEvent, deleteEvent } from '../lib/storage';
import type { HealthEvent } from '../types/health';

export default function EventDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [event, setEvent] = useState<HealthEvent | null>(null);

  useEffect(() => {
    if (id) {
      const loadedEvent = getEvent(id);
      setEvent(loadedEvent);
    }
  }, [id]);

  const handleDelete = () => {
    if (!event) return;

    if (confirm('Are you sure you want to delete this event?')) {
      deleteEvent(event.id);
      navigate('/timeline');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (isoStr: string) => {
    const date = new Date(isoStr);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!event) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #F8FAFC, #E2E8F0)',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '48px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1E293B',
            marginBottom: '8px'
          }}>
            Event Not Found
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#64748B',
            fontWeight: '300',
            marginBottom: '24px'
          }}>
            The event you're looking for doesn't exist
          </p>
          <button
            onClick={() => navigate('/timeline')}
            style={{
              background: '#60A5FA',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#3B82F6';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#60A5FA';
            }}
          >
            Back to Timeline
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #F8FAFC, #E2E8F0)',
      padding: '24px'
    }}>
      <div style={{
        maxWidth: '700px',
        margin: '0 auto',
        paddingTop: '32px'
      }}>
        {/* Modal Card */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          overflow: 'hidden',
          border: event.isMilestone ? '3px solid #F472B6' : 'none'
        }}>
          {/* Header */}
          <div style={{
            background: event.isMilestone
              ? 'linear-gradient(to right, #F472B6, #EC4899)'
              : 'linear-gradient(to right, #60A5FA, #3B82F6)',
            padding: '24px',
            position: 'relative'
          }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              <X size={20} color="#FFFFFF" />
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '8px'
            }}>
              {event.isMilestone && (
                <Heart size={28} color="#FFFFFF" fill="#FFFFFF" />
              )}
              <h1 style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#FFFFFF',
                margin: 0
              }}>
                {event.title}
              </h1>
            </div>

            {event.isMilestone && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'inline-block',
                padding: '6px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#FFFFFF'
              }}>
                ★ MILESTONE
              </div>
            )}
          </div>

          {/* Content */}
          <div style={{ padding: '32px' }}>
            {/* Date */}
            <div style={{
              display: 'flex',
              alignItems: 'start',
              gap: '16px',
              marginBottom: '24px',
              paddingBottom: '24px',
              borderBottom: '1px solid #E2E8F0'
            }}>
              <div style={{
                background: '#F1F5F9',
                borderRadius: '8px',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Calendar size={24} color="#475569" />
              </div>
              <div>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#64748B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '4px'
                }}>
                  Date
                </div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1E293B'
                }}>
                  {formatDate(event.date)}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#64748B',
                  fontWeight: '300',
                  marginTop: '4px'
                }}>
                  Category: {event.category}
                </div>
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#64748B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '8px'
                }}>
                  Description
                </div>
                <div style={{
                  fontSize: '15px',
                  color: '#1E293B',
                  lineHeight: '1.7',
                  whiteSpace: 'pre-wrap'
                }}>
                  {event.description}
                </div>
              </div>
            )}

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#64748B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Tag size={14} />
                  Tags
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        background: '#E0E7FF',
                        color: '#4F46E5',
                        fontSize: '13px',
                        fontWeight: '500',
                        padding: '6px 14px',
                        borderRadius: '16px'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {event.notes && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#64748B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <FileText size={14} />
                  Additional Notes
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#475569',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                  background: '#F8FAFC',
                  padding: '16px',
                  borderRadius: '8px'
                }}>
                  {event.notes}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div style={{
              paddingTop: '24px',
              borderTop: '1px solid #E2E8F0',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div>
                <div style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#94A3B8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '4px'
                }}>
                  Created
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#64748B',
                  fontWeight: '300'
                }}>
                  {formatDateTime(event.createdAt)}
                </div>
              </div>
              <div>
                <div style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#94A3B8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '4px'
                }}>
                  Last Updated
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#64748B',
                  fontWeight: '300'
                }}>
                  {formatDateTime(event.updatedAt)}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => navigate(`/event-form?id=${event.id}`)}
                style={{
                  flex: 1,
                  background: '#60A5FA',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '14px 24px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#3B82F6';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#60A5FA';
                }}
              >
                <Edit size={18} />
                Edit Event
              </button>

              <button
                onClick={handleDelete}
                style={{
                  background: '#FEE2E2',
                  color: '#DC2626',
                  border: '2px solid #DC2626',
                  borderRadius: '8px',
                  padding: '14px 24px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#FECACA';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#FEE2E2';
                }}
              >
                <Trash2 size={18} />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
