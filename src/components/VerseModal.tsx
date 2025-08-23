import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Send, Book, GraduationCap, MessageCircle, ExternalLink, ArrowLeft, X } from 'lucide-react';
import { getAnswer } from './lib/openai';
import { getVerseContent } from './lib/bible';

interface VerseModalProps {
  verse: {
    title: string;
    content: string;
  };
  onClose: () => void;
}

export function VerseModal({ verse, onClose }: VerseModalProps) {
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.8) 0%, rgba(124, 58, 237, 0.9) 100%)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        zIndex: 50
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '1.5rem',
          padding: '2rem',
          maxWidth: '28rem',
          width: '100%',
          maxHeight: '80vh',
          overflowY: 'auto',
          border: '3px solid rgba(139, 92, 246, 0.4)',
          boxShadow: '0 20px 40px rgba(139, 92, 246, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.5)',
          position: 'relative',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '1.5rem',
          fontSize: '2rem'
        }}>
          📖✨🌟
        </div>
        
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            padding: '0.75rem',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ff6b9d 0%, #c44569 100%)',
            color: 'white',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(255, 107, 157, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.1) rotate(90deg)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 107, 157, 0.6)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 157, 0.4)';
          }}
        >
          <X className="w-5 h-5" />
        </button>
        
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '1.5rem',
          textAlign: 'center',
          lineHeight: '1.3',
          textShadow: '0 2px 4px rgba(139, 92, 246, 0.2)'
        }}>
          {verse.title}
        </h2>
        
        <div style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(124, 58, 237, 0.12) 100%)',
          borderRadius: '1rem',
          padding: '1.5rem',
          border: '2px solid rgba(139, 92, 246, 0.2)',
          marginBottom: '1.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, transparent 70%)',
            animation: 'gentle-pulse 4s ease-in-out infinite'
          }}></div>
          
          <p style={{
            color: '#374151',
            lineHeight: '1.7',
            fontSize: '1.1rem',
            margin: 0,
            textAlign: 'center',
            fontWeight: '500',
            position: 'relative',
            zIndex: 1
          }}>
            "{verse.content}"
          </p>
        </div>
        
        <div style={{ 
          textAlign: 'center',
          fontSize: '1.5rem',
          marginBottom: '0.5rem'
        }}>
          🙏💜✨
        </div>
        
        <p style={{
          textAlign: 'center',
          fontSize: '0.9rem',
          color: '#8b5cf6',
          fontWeight: '600',
          margin: 0
        }}>
          God loves you so much! 💕
        </p>
      </div>
      
      <style>{`
        @keyframes gentle-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}

interface Reference {
  type: 'verse' | 'book' | 'commentary' | 'article';
  title: string;
  link: string;
  description?: string;
}

interface Answer {
  text: string;
  references: Reference[];
}

function App() {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [returnUrl, setReturnUrl] = useState<string | null>(null);
  const [selectedVerse, setSelectedVerse] = useState<{
    title: string;
    content: string;
  } | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [error, setError] = useState<string | null>(null);

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

    setAnswer(null);
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getAnswer(question);
      setAnswer(response);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const ReferenceIcon = ({ type }: { type: Reference['type'] }) => {
    switch (type) {
      case 'verse': return <Book className="w-4 h-4" />;
      case 'book': return <GraduationCap className="w-4 h-4" />;
      case 'commentary': return <MessageCircle className="w-4 h-4" />;
      case 'article': return <ExternalLink className="w-4 h-4" />;
      default: return null;
    }
  };

  const handleVerseClick = async (ref: Reference) => {
    if (ref.type === 'verse') {
      const verseContent = await getVerseContent(ref.title);
      setSelectedVerse({
        title: ref.title,
        content: verseContent
      });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFB6C1 0%, #87CEEB 30%, #98FB98 60%, #F0E68C 100%)',
      padding: '1rem'
    }}>
      <div style={{
        maxWidth: '56rem',
        margin: '0 auto',
        padding: '0 0.5rem'
      }}>
        {returnUrl && (
          <div style={{ marginBottom: '1rem' }}>
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
              <span>← Back</span>
            </button>
          </div>
        )}
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem'
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
          marginBottom: '1.5rem',
          maxWidth: '42rem',
          margin: '0 auto 1.5rem auto',
          lineHeight: '1.5',
          fontWeight: '500',
          background: 'rgba(255, 255, 255, 0.8)',
          padding: '0.75rem 1rem',
          borderRadius: '1rem',
          boxShadow: '0 2px 8px rgba(75, 0, 130, 0.2)'
        }}>
          ✨ Get fun Bible answers that show how much God loves you! ✨
        </p>
        
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
              <div style={{
                position: 'relative',
                width: '16rem',
                height: '3rem',
                overflow: 'hidden'
              }}>
                <div className="absolute top-4 paw-print paw-walking paw-walking-1">🐾</div>
                <div className="absolute top-8 paw-print paw-walking paw-walking-2">🐾</div>
                <div className="absolute top-4 paw-print paw-walking paw-walking-3">🐾</div>
                <div className="absolute top-8 paw-print paw-walking paw-walking-4">🐾</div>
              </div>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full paw-bouncing"></div>
              <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-400 rounded-full paw-bouncing animation-delay-200"></div>
              <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full paw-bouncing animation-delay-400"></div>
            </div>
          </div>
        )}

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

        {answer && (
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
                {answer.text}
              </p>
            </div>

            {answer.references && answer.references.length > 0 && (
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
                  {answer.references.map((ref, index) => (
                    <div
                      key={index}
                      onClick={() => ref.type === 'verse' ? handleVerseClick(ref) : window.open(ref.link, '_blank')}
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
                        <ReferenceIcon type={ref.type} />
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