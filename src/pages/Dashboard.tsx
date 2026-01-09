import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Plus, Download, List, Calendar, Heart, TrendingUp } from 'lucide-react';
import { loadEvents, calculateStats, importEventsFromJSON, saveEvents, exportEventsAsJSON } from '../lib/storage';
import type { HealthEvent, HealthStats } from '../types/health';

export default function Dashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<HealthEvent[]>([]);
  const [stats, setStats] = useState<HealthStats | null>(null);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const loadedEvents = loadEvents();
    setEvents(loadedEvents);
    setStats(calculateStats(loadedEvents));
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setImporting(true);
      try {
        const text = await file.text();
        const importedEvents = importEventsFromJSON(text);

        // Merge with existing events (avoid duplicates by ID)
        const existingIds = new Set(events.map(e => e.id));
        const newEvents = importedEvents.filter(e => !existingIds.has(e.id));

        const merged = [...events, ...newEvents];
        saveEvents(merged);
        setEvents(merged);
        setStats(calculateStats(merged));

        alert(`Successfully imported ${newEvents.length} events!`);
      } catch (error) {
        alert(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setImporting(false);
      }
    };

    input.click();
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

  const recentEvents = events
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
        <div style={{ paddingTop: '32px', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            letterSpacing: '-0.5px',
            color: '#1E293B',
            marginBottom: '8px'
          }}>
            Health Timeline
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#64748B',
            fontWeight: '300'
          }}>
            Track and manage your health journey
          </p>
        </div>

        {/* Quick Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          {/* Import Button */}
          <button
            onClick={handleImport}
            disabled={importing}
            style={{
              background: '#FFFFFF',
              border: '2px solid #60A5FA',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(96, 165, 250, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
            }}
          >
            <Upload size={24} color="#60A5FA" />
            <div style={{ textAlign: 'left' }}>
              <div style={{
                fontSize: '16px',
                fontWeight: '500',
                color: '#1E293B'
              }}>
                {importing ? 'Importing...' : 'Import Data'}
              </div>
              <div style={{
                fontSize: '13px',
                color: '#64748B',
                fontWeight: '300'
              }}>
                Upload JSON file
              </div>
            </div>
          </button>

          {/* Add Event Button */}
          <button
            onClick={() => navigate('/event-form')}
            style={{
              background: '#FFFFFF',
              border: '2px solid #34D399',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(52, 211, 153, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
            }}
          >
            <Plus size={24} color="#34D399" />
            <div style={{ textAlign: 'left' }}>
              <div style={{
                fontSize: '16px',
                fontWeight: '500',
                color: '#1E293B'
              }}>
                Add Event
              </div>
              <div style={{
                fontSize: '13px',
                color: '#64748B',
                fontWeight: '300'
              }}>
                Create new entry
              </div>
            </div>
          </button>

          {/* View Timeline Button */}
          <button
            onClick={() => navigate('/timeline')}
            style={{
              background: '#FFFFFF',
              border: '2px solid #A78BFA',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(167, 139, 250, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
            }}
          >
            <List size={24} color="#A78BFA" />
            <div style={{ textAlign: 'left' }}>
              <div style={{
                fontSize: '16px',
                fontWeight: '500',
                color: '#1E293B'
              }}>
                View Timeline
              </div>
              <div style={{
                fontSize: '13px',
                color: '#64748B',
                fontWeight: '300'
              }}>
                See all events
              </div>
            </div>
          </button>

          {/* Export Button */}
          <button
            onClick={handleExport}
            disabled={events.length === 0}
            style={{
              background: '#FFFFFF',
              border: '2px solid #F59E0B',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: events.length === 0 ? 'not-allowed' : 'pointer',
              opacity: events.length === 0 ? 0.5 : 1,
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            }}
            onMouseOver={(e) => {
              if (events.length > 0) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.2)';
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
            }}
          >
            <Download size={24} color="#F59E0B" />
            <div style={{ textAlign: 'left' }}>
              <div style={{
                fontSize: '16px',
                fontWeight: '500',
                color: '#1E293B'
              }}>
                Export Data
              </div>
              <div style={{
                fontSize: '13px',
                color: '#64748B',
                fontWeight: '300'
              }}>
                Download JSON
              </div>
            </div>
          </button>
        </div>

        {/* Statistics */}
        {stats && stats.totalEvents > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1E293B',
              marginBottom: '16px'
            }}>
              Statistics
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              <div style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <Calendar size={20} color="#60A5FA" />
                  <span style={{ fontSize: '14px', color: '#64748B', fontWeight: '300' }}>
                    Total Events
                  </span>
                </div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#1E293B' }}>
                  {stats.totalEvents}
                </div>
              </div>

              <div style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <Heart size={20} color="#F472B6" />
                  <span style={{ fontSize: '14px', color: '#64748B', fontWeight: '300' }}>
                    Milestones
                  </span>
                </div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#1E293B' }}>
                  {stats.totalMilestones}
                </div>
              </div>

              <div style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <TrendingUp size={20} color="#34D399" />
                  <span style={{ fontSize: '14px', color: '#64748B', fontWeight: '300' }}>
                    Date Range
                  </span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#1E293B' }}>
                  {stats.dateRange.earliest && formatDate(stats.dateRange.earliest)}
                  {' - '}
                  {stats.dateRange.latest && formatDate(stats.dateRange.latest)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Events */}
        {recentEvents.length > 0 && (
          <div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1E293B',
              marginBottom: '16px'
            }}>
              Recent Events
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentEvents.map(event => (
                <div
                  key={event.id}
                  onClick={() => navigate(`/event/${event.id}`)}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '12px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                    border: event.isMilestone ? '2px solid #F472B6' : 'none',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#1E293B',
                        marginBottom: '4px'
                      }}>
                        {event.title}
                        {event.isMilestone && (
                          <span style={{
                            marginLeft: '8px',
                            fontSize: '12px',
                            fontWeight: '500',
                            color: '#F472B6'
                          }}>
                            ★ Milestone
                          </span>
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
                  </div>
                  {event.description && (
                    <div style={{
                      fontSize: '14px',
                      color: '#475569',
                      lineHeight: '1.5'
                    }}>
                      {event.description.length > 100
                        ? `${event.description.substring(0, 100)}...`
                        : event.description
                      }
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {events.length === 0 && (
          <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '48px 24px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          }}>
            <Calendar size={48} color="#CBD5E1" style={{ margin: '0 auto 16px' }} />
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
              Start by importing your health data or adding a new event
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={handleImport}
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
                Import Data
              </button>
              <button
                onClick={() => navigate('/event-form')}
                style={{
                  background: '#FFFFFF',
                  color: '#1E293B',
                  border: '2px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#F8FAFC';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#FFFFFF';
                }}
              >
                Add Event
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
