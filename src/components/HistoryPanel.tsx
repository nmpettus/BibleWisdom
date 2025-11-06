import React from 'react';
import { Book, GraduationCap, MessageCircle, ExternalLink, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { ConversationItem, Reference } from '../types/conversation';
import { getVerseContent } from '../lib/bible';

interface HistoryPanelProps {
  conversation: ConversationItem | null;
  onVerseClick: (verse: { title: string; content: string }) => void;
}

export function HistoryPanel({ conversation, onVerseClick }: HistoryPanelProps) {
  const [expandedAnswer, setExpandedAnswer] = React.useState(true);
  const [expandedReferences, setExpandedReferences] = React.useState(true);

  if (!conversation) {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(16px)',
        border: '3px solid #FFB6C1',
        boxShadow: '0 8px 24px rgba(255, 182, 193, 0.4)',
        borderRadius: '1rem',
        padding: '2rem',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: '1rem'
      }}>
        <Book className="w-16 h-16" style={{ color: '#FFB6C1' }} />
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          color: '#FF1493',
          margin: 0
        }}>
          Select a Conversation
        </h3>
        <p style={{
          fontSize: '1rem',
          color: '#6B7280',
          margin: 0,
          maxWidth: '300px'
        }}>
          Click on any question from the timeline to see the full conversation and answer! 🐕📖
        </p>
      </div>
    );
  }

  const formatFullDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const ReferenceIcon = ({ type }: { type: Reference['type'] }) => {
    switch (type) {
      case 'verse':
        return <Book className="w-4 h-4" />;
      case 'book':
        return <GraduationCap className="w-4 h-4" />;
      case 'commentary':
        return <MessageCircle className="w-4 h-4" />;
      case 'article':
      case 'sermon':
      case 'devotional':
        return <ExternalLink className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const handleVerseClick = async (ref: Reference) => {
    if (ref.type === 'verse') {
      try {
        const verseContent = await getVerseContent(ref.title);
        onVerseClick({
          title: ref.title,
          content: verseContent
        });
      } catch (error) {
        console.error('Error loading verse:', error);
      }
    } else {
      window.open(ref.link, '_blank');
    }
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
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    }}>
      {/* Header with Date */}
      <div style={{
        paddingBottom: '1rem',
        borderBottom: '2px solid #FFB6C1'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '0.5rem'
        }}>
          <Calendar className="w-4 h-4" style={{ color: '#FF69B4' }} />
          <span style={{
            fontSize: '0.875rem',
            color: '#6B7280',
            fontWeight: '500'
          }}>
            {formatFullDate(conversation.timestamp)}
          </span>
        </div>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          color: '#FF1493',
          margin: 0,
          lineHeight: '1.3'
        }}>
          Question
        </h2>
      </div>

      {/* Question Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(255, 105, 180, 0.1) 0%, rgba(255, 182, 193, 0.1) 100%)',
        borderRadius: '1rem',
        padding: '1.5rem',
        border: '2px solid rgba(255, 105, 180, 0.2)'
      }}>
        <p style={{
          fontSize: '1.125rem',
          fontWeight: '600',
          color: '#4B0082',
          margin: 0,
          lineHeight: '1.6'
        }}>
          {conversation.question}
        </p>
      </div>

      {/* Answer Section */}
      <div>
        <button
          onClick={() => setExpandedAnswer(!expandedAnswer)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '0.75rem'
          }}
        >
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#1E40AF',
            margin: 0
          }}>
            Maggie's Answer 🐕
          </h3>
          {expandedAnswer ? (
            <ChevronUp className="w-5 h-5" style={{ color: '#1E40AF' }} />
          ) : (
            <ChevronDown className="w-5 h-5" style={{ color: '#1E40AF' }} />
          )}
        </button>

        {expandedAnswer && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '1rem',
            padding: '1.5rem',
            border: '2px solid #87CEEB',
            boxShadow: '0 4px 12px rgba(135, 206, 235, 0.2)'
          }}>
            <p style={{
              fontSize: '1rem',
              color: '#4B0082',
              lineHeight: '1.6',
              margin: 0,
              whiteSpace: 'pre-wrap'
            }}>
              {conversation.answer.text}
            </p>
          </div>
        )}
      </div>

      {/* References Section */}
      {conversation.answer.references.length > 0 && (
        <div>
          <button
            onClick={() => setExpandedReferences(!expandedReferences)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              marginBottom: '0.75rem'
            }}
          >
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#1E40AF',
              margin: 0
            }}>
              References ({conversation.answer.references.length})
            </h3>
            {expandedReferences ? (
              <ChevronUp className="w-5 h-5" style={{ color: '#1E40AF' }} />
            ) : (
              <ChevronDown className="w-5 h-5" style={{ color: '#1E40AF' }} />
            )}
          </button>

          {expandedReferences && (
            <div style={{
              display: 'grid',
              gap: '0.75rem'
            }}>
              {conversation.answer.references.map((ref, index) => (
                <div
                  key={index}
                  onClick={() => handleVerseClick(ref)}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    background: 'rgba(74, 144, 226, 0.05)',
                    border: '2px solid rgba(74, 144, 226, 0.15)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(74, 144, 226, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(74, 144, 226, 0.3)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(74, 144, 226, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(74, 144, 226, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(74, 144, 226, 0.15)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    background: 'rgba(74, 144, 226, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <ReferenceIcon type={ref.type} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.25rem'
                    }}>
                      <span style={{
                        fontSize: '0.625rem',
                        padding: '0.125rem 0.5rem',
                        borderRadius: '0.25rem',
                        background: 'rgba(74, 144, 226, 0.2)',
                        color: '#1E40AF',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {ref.type}
                      </span>
                    </div>

                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '700',
                      color: '#374151',
                      marginBottom: '0.375rem',
                      lineHeight: '1.3'
                    }}>
                      {ref.title}
                    </h4>

                    {ref.description && (
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#6B7280',
                        margin: 0,
                        lineHeight: '1.4'
                      }}>
                        {ref.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
