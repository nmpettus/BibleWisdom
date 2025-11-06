import React, { useState, useMemo } from 'react';
import { Clock, ZoomIn, ZoomOut, Calendar, Search } from 'lucide-react';
import { ConversationItem, TimelineZoomLevel } from '../types/conversation';

interface TimelineProps {
  conversations: ConversationItem[];
  onSelectConversation: (id: string) => void;
  selectedId?: string;
}

export function Timeline({ conversations, onSelectConversation, selectedId }: TimelineProps) {
  const [zoomLevel, setZoomLevel] = useState<TimelineZoomLevel>('week');
  const [searchTerm, setSearchTerm] = useState('');

  const zoomLevels: TimelineZoomLevel[] = ['day', 'week', 'month', 'all'];

  const getZoomDescription = (level: TimelineZoomLevel): string => {
    switch (level) {
      case 'day': return 'Today';
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'all': return 'All Time';
    }
  };

  const filteredConversations = useMemo(() => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;
    const oneMonth = 30 * oneDay;

    let filtered = conversations.filter(conv => {
      // Filter by search term
      if (searchTerm && !conv.question.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !conv.answer.text.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Filter by zoom level
      switch (zoomLevel) {
        case 'day':
          return now - conv.timestamp < oneDay;
        case 'week':
          return now - conv.timestamp < oneWeek;
        case 'month':
          return now - conv.timestamp < oneMonth;
        case 'all':
          return true;
      }
    });

    return filtered.sort((a, b) => b.timestamp - a.timestamp);
  }, [conversations, zoomLevel, searchTerm]);

  const handleZoomIn = () => {
    const currentIndex = zoomLevels.indexOf(zoomLevel);
    if (currentIndex > 0) {
      setZoomLevel(zoomLevels[currentIndex - 1]);
    }
  };

  const handleZoomOut = () => {
    const currentIndex = zoomLevels.indexOf(zoomLevel);
    if (currentIndex < zoomLevels.length - 1) {
      setZoomLevel(zoomLevels[currentIndex + 1]);
    }
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(16px)',
      border: '3px solid #FFB6C1',
      boxShadow: '0 8px 24px rgba(255, 182, 193, 0.4)',
      borderRadius: '1rem',
      padding: '1.5rem',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      {/* Header with Controls */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Calendar className="w-5 h-5" style={{ color: '#FF69B4' }} />
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#FF1493',
              margin: 0
            }}>
              Timeline
            </h3>
          </div>

          {/* Zoom Controls */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <button
              onClick={handleZoomIn}
              disabled={zoomLevel === 'day'}
              style={{
                padding: '0.5rem',
                borderRadius: '0.5rem',
                background: zoomLevel === 'day' ? 'rgba(255, 182, 193, 0.3)' : 'linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)',
                border: 'none',
                color: 'white',
                cursor: zoomLevel === 'day' ? 'not-allowed' : 'pointer',
                opacity: zoomLevel === 'day' ? 0.5 : 1,
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <span style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#4B0082',
              minWidth: '80px',
              textAlign: 'center'
            }}>
              {getZoomDescription(zoomLevel)}
            </span>

            <button
              onClick={handleZoomOut}
              disabled={zoomLevel === 'all'}
              style={{
                padding: '0.5rem',
                borderRadius: '0.5rem',
                background: zoomLevel === 'all' ? 'rgba(255, 182, 193, 0.3)' : 'linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)',
                border: 'none',
                color: 'white',
                cursor: zoomLevel === 'all' ? 'not-allowed' : 'pointer',
                opacity: zoomLevel === 'all' ? 0.5 : 1,
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative' }}>
          <Search
            className="w-4 h-4"
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#FF69B4'
            }}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search questions..."
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem 0.5rem 2.5rem',
              borderRadius: '0.75rem',
              border: '2px solid #FFB6C1',
              fontSize: '0.875rem',
              outline: 'none',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#FF69B4';
              e.target.style.boxShadow = '0 0 0 3px rgba(255, 105, 180, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#FFB6C1';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
      </div>

      {/* Timeline Items */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        paddingRight: '0.5rem'
      }}>
        {filteredConversations.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: '#9CA3AF'
          }}>
            <Clock className="w-12 h-12" style={{
              margin: '0 auto 1rem',
              color: '#FFB6C1'
            }} />
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
              {searchTerm ? 'No conversations found' : 'No conversations yet'}
            </p>
          </div>
        ) : (
          filteredConversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => onSelectConversation(conv.id)}
              style={{
                padding: '1rem',
                borderRadius: '0.75rem',
                background: selectedId === conv.id
                  ? 'linear-gradient(135deg, rgba(255, 105, 180, 0.15) 0%, rgba(255, 182, 193, 0.15) 100%)'
                  : 'rgba(74, 144, 226, 0.05)',
                border: selectedId === conv.id
                  ? '2px solid #FF69B4'
                  : '2px solid rgba(74, 144, 226, 0.15)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
              onMouseOver={(e) => {
                if (selectedId !== conv.id) {
                  e.currentTarget.style.background = 'rgba(74, 144, 226, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(74, 144, 226, 0.3)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }
              }}
              onMouseOut={(e) => {
                if (selectedId !== conv.id) {
                  e.currentTarget.style.background = 'rgba(74, 144, 226, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(74, 144, 226, 0.15)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }
              }}
            >
              {/* Timeline Dot */}
              <div style={{
                position: 'absolute',
                left: '-0.5rem',
                top: '1rem',
                width: '0.75rem',
                height: '0.75rem',
                borderRadius: '50%',
                background: selectedId === conv.id
                  ? 'linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)'
                  : 'linear-gradient(135deg, #87CEEB 0%, #4A90E2 100%)',
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }} />

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <Clock className="w-3 h-3" style={{ color: '#9CA3AF', flexShrink: 0 }} />
                <span style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  fontWeight: '500'
                }}>
                  {formatDate(conv.timestamp)}
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  color: '#9CA3AF'
                }}>
                  {formatTime(conv.timestamp)}
                </span>
              </div>

              <p style={{
                margin: 0,
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                lineHeight: '1.4',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}>
                {conv.question}
              </p>

              {conv.answer.references.length > 0 && (
                <div style={{
                  marginTop: '0.5rem',
                  display: 'flex',
                  gap: '0.25rem',
                  flexWrap: 'wrap'
                }}>
                  {conv.answer.references.slice(0, 3).map((ref, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '0.625rem',
                        padding: '0.125rem 0.5rem',
                        borderRadius: '0.25rem',
                        background: 'rgba(74, 144, 226, 0.1)',
                        color: '#4A90E2',
                        fontWeight: '600'
                      }}
                    >
                      {ref.type}
                    </span>
                  ))}
                  {conv.answer.references.length > 3 && (
                    <span style={{
                      fontSize: '0.625rem',
                      color: '#9CA3AF',
                      fontWeight: '600'
                    }}>
                      +{conv.answer.references.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
