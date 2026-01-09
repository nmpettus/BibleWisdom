import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Plus, Edit, Trash2, Heart } from 'lucide-react';
import { loadEvents, groupEventsByMonth, exportEventsAsJSON, deleteEvent, saveEvents } from '../lib/storage';
import type { HealthEvent } from '../types/health';

export default function Timeline() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<HealthEvent[]>([]);
  const [groupedEvents, setGroupedEvents] = useState<{ [yearMonth: string]: HealthEvent[] }>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const loadedEvents = loadEvents();
    setEvents(loadedEvents);
    setGroupedEvents(groupEventsByMonth(loadedEvents));
  };

  const handleExport = () => {
    if (events.length === 0) {
      alert('No events to export');
      return;
    }

    const json = exportEventsAsJSON(events);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `health-timeline-${new Date().toISOString().split('T')[0]}.json`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const handleDelete = (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      deleteEvent(eventId);
      loadData();
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatMonthYear = (yearMonth: string) => {
    const [year, month] = yearMonth.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  // Sort months in descending order (newest first)
  const sortedMonths = Object.keys(groupedEvents).sort((a, b) => b.localeCompare(a));

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #F8FAFC, #E2E8F0)',
      padding: '24px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{ paddingTop: '32px', marginBottom: '24px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            letterSpacing: '-0.5px',
            color: '#1E293B',
            marginBottom: '8px'
          }}>
            Timeline
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#64748B',
            fontWeight: '300'
          }}>
            View all health events chronologically
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: '#FFFFFF',
              color: '#DC2626',
              border: '2px solid #DC2626',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#FEE2E2';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#FFFFFF';
            }}
          >
            <ArrowLeft size={20} />
            Back
          </button>

          <button
            onClick={() => navigate('/event-form')}
            style={{
              background: '#34D399',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#10B981';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#34D399';
            }}
          >
            <Plus size={20} />
            Add Event
          </button>

          <button
            onClick={handleExport}
            disabled={events.length === 0}
            style={{
              background: '#F59E0B',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: events.length === 0 ? 'not-allowed' : 'pointer',
              opacity: events.length === 0 ? 0.5 : 1,
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => {
              if (events.length > 0) {
                e.currentTarget.style.background = '#D97706';
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#F59E0B';
            }}
          >
            <Download size={20} />
            Export
          </button>
        </div>

        {/* Timeline */}
        {sortedMonths.length > 0 ? (
          <div style={{ position: 'relative' }}>
            {/* Vertical Timeline Line */}
            <div style={{
              position: 'absolute',
              left: '20px',
              top: '0',
              bottom: '0',
              width: '2px',
              background: '#CBD5E1'
            }} />

            {sortedMonths.map((yearMonth) => (
              <div key={yearMonth} style={{ marginBottom: '32px' }}>
                {/* Month Header */}
                <div style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#1E293B',
                  marginBottom: '16px',
                  paddingLeft: '48px'
                }}>
                  {formatMonthYear(yearMonth)}
                </div>

                {/* Events in this month */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {groupedEvents[yearMonth].map((event) => (
                    <div
                      key={event.id}
                      style={{
                        position: 'relative',
                        paddingLeft: '48px'
                      }}
                    >
                      {/* Timeline Dot */}
                      <div style={{
                        position: 'absolute',
                        left: '12px',
                        top: '24px',
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        background: event.isMilestone ? '#F472B6' : '#60A5FA',
                        border: '3px solid #FFFFFF',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        zIndex: 1
                      }} />

                      {/* Event Card */}
                      <div
                        style={{
                          background: '#FFFFFF',
                          borderRadius: '12px',
                          padding: '20px',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                          border: event.isMilestone ? '2px solid #F472B6' : 'none',
                          transition: 'all 0.2s',
                          cursor: 'pointer'
                        }}
                        onClick={() => navigate(`/event/${event.id}`)}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                        }}
                      >
                        {/* Header */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'start',
                          marginBottom: '12px'
                        }}>
                          <div style={{ flex: 1 }}>
                            <div style={{
                              fontSize: '18px',
                              fontWeight: '600',
                              color: '#1E293B',
                              marginBottom: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}>
                              {event.title}
                              {event.isMilestone && (
                                <Heart size={16} color="#F472B6" fill="#F472B6" />
                              )}
                            </div>
                            <div style={{
                              fontSize: '14px',
                              color: '#64748B',
                              fontWeight: '300'
                            }}>
                              {formatDate(event.date)} · {event.category}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div
                            style={{ display: 'flex', gap: '8px' }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => navigate(`/event-form?id=${event.id}`)}
                              style={{
                                background: '#F1F5F9',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background = '#E2E8F0';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.background = '#F1F5F9';
                              }}
                              title="Edit"
                            >
                              <Edit size={16} color="#475569" />
                            </button>
                            <button
                              onClick={() => handleDelete(event.id)}
                              style={{
                                background: '#FEE2E2',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background = '#FECACA';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.background = '#FEE2E2';
                              }}
                              title="Delete"
                            >
                              <Trash2 size={16} color="#DC2626" />
                            </button>
                          </div>
                        </div>

                        {/* Description */}
                        {event.description && (
                          <div style={{
                            fontSize: '14px',
                            color: '#475569',
                            lineHeight: '1.6',
                            marginBottom: '12px'
                          }}>
                            {event.description}
                          </div>
                        )}

                        {/* Tags */}
                        {event.tags && event.tags.length > 0 && (
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {event.tags.map((tag, index) => (
                              <span
                                key={index}
                                style={{
                                  background: '#E0E7FF',
                                  color: '#4F46E5',
                                  fontSize: '12px',
                                  fontWeight: '500',
                                  padding: '4px 12px',
                                  borderRadius: '12px'
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '48px 24px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1E293B',
              marginBottom: '8px'
            }}>
              No Events Yet
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#64748B',
              fontWeight: '300',
              marginBottom: '24px'
            }}>
              Add your first health event to start tracking your timeline
            </p>
            <button
              onClick={() => navigate('/event-form')}
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
              Add Event
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
