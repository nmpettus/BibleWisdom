import React, { useState, useRef, useEffect } from 'react';
import { Send, Book, ArrowLeft, MessageSquare, History as HistoryIcon, Layout } from 'lucide-react';
import { getAnswer } from './lib/openai';
import { VerseModal } from './components/VerseModal';
import { Timeline } from './components/Timeline';
import { HistoryPanel } from './components/HistoryPanel';
import { ImportExportControls } from './components/ImportExportControls';
import { ConversationItem, Answer } from './types/conversation';
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  generateConversationId,
  mergeConversations
} from './utils/storage';

type ViewMode = 'ask' | 'history';

function App() {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<Answer | null>(null);
  const [returnUrl, setReturnUrl] = useState<string | null>(null);
  const [selectedVerse, setSelectedVerse] = useState<{
    title: string;
    content: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('ask');
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load conversations from localStorage on mount
  useEffect(() => {
    const loaded = loadFromLocalStorage();
    setConversations(loaded);
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      saveToLocalStorage(conversations);
    }
  }, [conversations]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const returnUrlParam = urlParams.get('returnUrl');
    if (returnUrlParam) {
      setReturnUrl(decodeURIComponent(returnUrlParam));
    } else {
      setReturnUrl('https://booksbymaggie.com');
    }
  }, []);

  const handleReturn = () => {
    window.location.href = returnUrl || 'https://booksbymaggie.com';
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const currentQuestion = question;
    setCurrentAnswer(null);
    setIsLoading(true);
    setError(null);
    setQuestion('');

    try {
      const response = await getAnswer(currentQuestion);
      setCurrentAnswer(response);

      // Add to conversation history
      const newConversation: ConversationItem = {
        id: generateConversationId(),
        timestamp: Date.now(),
        question: currentQuestion,
        answer: response
      };

      setConversations(prev => [newConversation, ...prev]);
    } catch (err) {
      setError((err as Error).message);
      setQuestion(currentQuestion); // Restore question on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = (imported: ConversationItem[]) => {
    setConversations(prev => mergeConversations(prev, imported));
  };

  const handleClear = () => {
    setConversations([]);
    setSelectedConversationId(null);
    setCurrentAnswer(null);
  };

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
  };

  const selectedConversation = conversations.find(c => c.id === selectedConversationId) || null;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFB6C1 0%, #87CEEB 30%, #98FB98 60%, #F0E68C 100%)',
      padding: '1rem'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 0.5rem'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            {returnUrl && (
              <button
                onClick={handleReturn}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '1rem',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid #FF69B4',
                  boxShadow: '0 4px 16px rgba(255, 105, 180, 0.3)',
                  color: '#FF1493',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#FF69B4';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                  e.currentTarget.style.color = '#FF1493';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}

            {/* View Mode Tabs */}
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              marginLeft: 'auto'
            }}>
              <button
                onClick={() => setViewMode('ask')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '1rem',
                  background: viewMode === 'ask'
                    ? 'linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)'
                    : 'rgba(255, 255, 255, 0.95)',
                  border: '2px solid #FF69B4',
                  color: viewMode === 'ask' ? 'white' : '#FF1493',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <MessageSquare className="w-4 h-4" />
                Ask Maggie
              </button>

              <button
                onClick={() => setViewMode('history')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '1rem',
                  background: viewMode === 'history'
                    ? 'linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)'
                    : 'rgba(255, 255, 255, 0.95)',
                  border: '2px solid #FF69B4',
                  color: viewMode === 'history' ? 'white' : '#FF1493',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
              >
                <HistoryIcon className="w-4 h-4" />
                History
                {conversations.length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-0.5rem',
                    right: '-0.5rem',
                    background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
                    color: 'white',
                    fontSize: '0.625rem',
                    fontWeight: '700',
                    borderRadius: '1rem',
                    padding: '0.125rem 0.375rem',
                    minWidth: '1.25rem',
                    textAlign: 'center'
                  }}>
                    {conversations.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Title */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img
              src="/MaggieRead.jpeg"
              alt="Maggie the friendly dog reading a book"
              style={{
                width: '3.5rem',
                height: '3.5rem',
                borderRadius: '50%',
                boxShadow: '0 4px 16px rgba(255, 105, 180, 0.4)',
                marginRight: '1rem',
                border: '3px solid #FF69B4'
              }}
            />
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #FF1493 0%, #FF69B4 50%, #FFB6C1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: '1.2',
              padding: '0.25rem 0',
              textShadow: '0 2px 8px rgba(255, 20, 147, 0.3)'
            }}>
              Ask Maggie Bible Questions! 🐕📖
            </h1>
          </div>

          <p style={{
            textAlign: 'center',
            fontSize: '1rem',
            color: '#4B0082',
            marginTop: '1rem',
            maxWidth: '42rem',
            margin: '1rem auto 0',
            lineHeight: '1.5',
            fontWeight: '500',
            background: 'rgba(255, 255, 255, 0.8)',
            padding: '0.75rem 1rem',
            borderRadius: '1rem',
            boxShadow: '0 2px 8px rgba(75, 0, 130, 0.2)'
          }}>
            ✨ Get fun Bible answers that show how much God loves you! ✨
          </p>
        </div>

        {/* Main Content */}
        {viewMode === 'ask' ? (
          <div style={{
            maxWidth: '56rem',
            margin: '0 auto'
          }}>
            {/* Question Form */}
            <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
              <div style={{ position: 'relative' }}>
                <textarea
                  ref={inputRef}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="What would you like to know about God? 🤔"
                  style={{
                    width: '100%',
                    padding: '1rem 3rem 1rem 1rem',
                    borderRadius: '1rem',
                    background: 'rgba(255, 255, 255, 0.98)',
                    backdropFilter: 'blur(16px)',
                    border: '3px solid #FFB6C1',
                    boxShadow: '0 8px 24px rgba(255, 182, 193, 0.4)',
                    minHeight: '5rem',
                    resize: 'none',
                    fontSize: '1rem',
                    fontWeight: '500',
                    color: '#4B0082',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = '0 0 0 3px rgba(255, 105, 180, 0.5), 0 8px 24px rgba(255, 182, 193, 0.4)';
                    e.target.style.borderColor = '#FF69B4';
                    e.target.style.transform = 'scale(1.02)';
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = '0 8px 24px rgba(255, 182, 193, 0.4)';
                    e.target.style.borderColor = '#FFB6C1';
                    e.target.style.transform = 'scale(1)';
                  }}
                />
                <button
                  type="submit"
                  disabled={isLoading || !question.trim()}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    bottom: '0.75rem',
                    padding: '0.6rem',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #FF69B4 0%, #FF1493 50%, #DC143C 100%)',
                    color: 'white',
                    border: 'none',
                    cursor: isLoading || !question.trim() ? 'not-allowed' : 'pointer',
                    opacity: isLoading || !question.trim() ? 0.5 : 1,
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(255, 105, 180, 0.4)'
                  }}
                  onMouseOver={(e) => {
                    if (!isLoading && question.trim()) {
                      e.currentTarget.style.transform = 'scale(1.15)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 105, 180, 0.6)';
                    }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 105, 180, 0.4)';
                  }}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Loading State */}
            {isLoading && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.5rem 0'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#4B0082',
                    marginBottom: '0.5rem',
                    background: 'rgba(255, 255, 255, 0.98)',
                    padding: '0.5rem 1rem',
                    borderRadius: '1rem',
                    boxShadow: '0 2px 8px rgba(75, 0, 130, 0.2)'
                  }}>
                    🤔 Maggie is thinking... 🐾
                  </p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '2px solid #FF6B6B',
                boxShadow: '0 4px 16px rgba(255, 107, 107, 0.3)',
                backgroundColor: 'rgba(255, 240, 240, 0.9)',
                color: '#DC143C',
                borderRadius: '1rem',
                padding: '1rem',
                marginBottom: '1.5rem',
                fontSize: '0.95rem',
                fontWeight: '500'
              }}>
                😟 Oops! {error}
              </div>
            )}

            {/* Current Answer */}
            {currentAnswer && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.98)',
                  backdropFilter: 'blur(16px)',
                  border: '2px solid #FF69B4',
                  boxShadow: '0 4px 16px rgba(255, 105, 180, 0.3)',
                  borderRadius: '1rem',
                  padding: '1.25rem'
                }}>
                  <p style={{
                    color: '#4B0082',
                    lineHeight: '1.5',
                    fontSize: '1rem',
                    fontWeight: '500'
                  }}>
                    {currentAnswer.text}
                  </p>
                </div>

                {currentAnswer.references && currentAnswer.references.length > 0 && (
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.98)',
                    backdropFilter: 'blur(16px)',
                    border: '3px solid #FFB6C1',
                    boxShadow: '0 8px 24px rgba(255, 182, 193, 0.4)',
                    borderRadius: '1rem',
                    padding: '1.25rem'
                  }}>
                    <h3 style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: '#1E40AF',
                      marginBottom: '0.75rem'
                    }}>
                      References
                    </h3>
                    <div style={{
                      display: 'grid',
                      gap: '0.5rem'
                    }}>
                      {currentAnswer.references.map((ref, index) => (
                        <div
                          key={index}
                          onClick={async () => {
                            if (ref.type === 'verse') {
                              try {
                                const { getVerseContent } = await import('./lib/bible');
                                const verseContent = await getVerseContent(ref.title);
                                setSelectedVerse({
                                  title: ref.title,
                                  content: verseContent
                                });
                              } catch (error) {
                                console.error('Error loading verse:', error);
                              }
                            } else {
                              window.open(ref.link, '_blank');
                            }
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.625rem',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            background: 'rgba(74, 144, 226, 0.05)',
                            border: '1px solid rgba(74, 144, 226, 0.15)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = 'rgba(74, 144, 226, 0.1)';
                            e.currentTarget.style.borderColor = 'rgba(74, 144, 226, 0.3)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(74, 144, 226, 0.15)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = 'rgba(74, 144, 226, 0.05)';
                            e.currentTarget.style.borderColor = 'rgba(74, 144, 226, 0.15)';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <div style={{
                            padding: '0.375rem',
                            borderRadius: '0.375rem',
                            background: 'rgba(74, 144, 226, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {ref.type === 'verse' && <Book className="w-4 h-4" />}
                            {ref.type !== 'verse' && <Layout className="w-4 h-4" />}
                          </div>
                          <div style={{ flex: 1 }}>
                            <h4 style={{
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              color: '#374151',
                              marginBottom: '0.125rem'
                            }}>
                              {ref.title}
                            </h4>
                            {ref.description && (
                              <p style={{
                                fontSize: '0.75rem',
                                color: '#6B7280',
                                margin: 0
                              }}>
                                {ref.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* History View */
          <div>
            {/* Import/Export Controls */}
            <div style={{ marginBottom: '1.5rem' }}>
              <ImportExportControls
                conversations={conversations}
                onImport={handleImport}
                onClear={handleClear}
              />
            </div>

            {/* Timeline and History Panel */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: conversations.length === 0 ? '1fr' : 'minmax(300px, 400px) 1fr',
              gap: '1.5rem',
              alignItems: 'start',
              minHeight: '600px'
            }}>
              {conversations.length > 0 && (
                <div style={{ height: '600px' }}>
                  <Timeline
                    conversations={conversations}
                    onSelectConversation={handleSelectConversation}
                    selectedId={selectedConversationId}
                  />
                </div>
              )}

              <div style={{ height: '600px' }}>
                {conversations.length === 0 ? (
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.98)',
                    backdropFilter: 'blur(16px)',
                    border: '3px solid #FFB6C1',
                    boxShadow: '0 8px 24px rgba(255, 182, 193, 0.4)',
                    borderRadius: '1rem',
                    padding: '3rem',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    gap: '1.5rem'
                  }}>
                    <Book className="w-20 h-20" style={{ color: '#FFB6C1' }} />
                    <div>
                      <h3 style={{
                        fontSize: '1.75rem',
                        fontWeight: '700',
                        color: '#FF1493',
                        margin: '0 0 0.5rem 0'
                      }}>
                        No Conversations Yet
                      </h3>
                      <p style={{
                        fontSize: '1.125rem',
                        color: '#6B7280',
                        margin: 0,
                        maxWidth: '400px'
                      }}>
                        Start asking Maggie questions to build your conversation history! 🐕📖
                      </p>
                    </div>
                    <button
                      onClick={() => setViewMode('ask')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '1rem',
                        background: 'linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)',
                        border: 'none',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 105, 180, 0.4)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <MessageSquare className="w-5 h-5" />
                      Ask a Question
                    </button>
                  </div>
                ) : (
                  <HistoryPanel
                    conversation={selectedConversation}
                    onVerseClick={(verse) => setSelectedVerse(verse)}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Verse Modal */}
      {selectedVerse && (
        <VerseModal
          verse={selectedVerse}
          onClose={() => setSelectedVerse(null)}
        />
      )}
    </div>
  );
}

export default App;
