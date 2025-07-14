import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Send, Book, GraduationCap, MessageCircle, ExternalLink, ArrowLeft } from 'lucide-react';
import { getAnswer } from './lib/openai';
import { getVerseContent } from './lib/bible';
import { VerseModal } from './components/VerseModal';

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
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{
        maxWidth: '64rem',
        margin: '0 auto',
        padding: '0 1rem'
      }}>
        {returnUrl && (
          <div style={{ marginBottom: '1.5rem' }}>
            <button
              onClick={handleReturn}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                color: '#374151',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
                e.currentTarget.style.color = '#4f46e5';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                e.currentTarget.style.color = '#374151';
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to previous page</span>
            </button>
          </div>
        )}
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '3rem'
        }}>
          <img 
            src="/MaggieRead.jpeg" 
            alt="Maggie the friendly dog reading a book" 
            style={{
              width: '4rem',
              height: '4rem',
              borderRadius: '50%',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              marginRight: '1.5rem',
              border: '3px solid rgba(255, 255, 255, 0.8)'
            }}
          />
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #e2e8f0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: '1.2',
            padding: '0.5rem 0',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            Ask Maggie Bible Questions
          </h1>
        </div>
        
        <p style={{
          textAlign: 'center',
          fontSize: '1.125rem',
          color: 'rgba(255, 255, 255, 0.95)',
          marginBottom: '2rem',
          maxWidth: '48rem',
          margin: '0 auto 2rem auto',
          lineHeight: '1.6',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
        }}>
          Answers are based on the New Testament covenant of Grace and God's Love as taught by Tim Keller, Andrew Farley, and others.
        </p>
        
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <div style={{ position: 'relative' }}>
            <textarea
              ref={inputRef}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask your biblical question here..."
              style={{
                width: '100%',
                padding: '1.5rem 3.5rem 1.5rem 1.5rem',
                borderRadius: '0.75rem',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                minHeight: '7.5rem',
                resize: 'none',
                fontSize: '1.125rem',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.4), 0 20px 40px rgba(0, 0, 0, 0.15)';
                e.target.style.borderColor = 'rgba(139, 92, 246, 0.6)';
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !question.trim()}
              style={{
                position: 'absolute',
                right: '1rem',
                bottom: '1rem',
                padding: '0.75rem',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                color: 'white',
                border: 'none',
                cursor: isLoading || !question.trim() ? 'not-allowed' : 'pointer',
                opacity: isLoading || !question.trim() ? 0.5 : 1,
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
              }}
              onMouseOver={(e) => {
                if (!isLoading && question.trim()) {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.3)';
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
              }}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>

        {isLoading && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
            padding: '2rem 0'
          }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{
                fontSize: '1.125rem',
                fontWeight: '500',
                color: 'rgba(255, 255, 255, 0.9)',
                marginBottom: '0.5rem'
              }}>
                Maggie is thinking...
              </p>
              <div style={{
                position: 'relative',
                width: '20rem',
                height: '4rem',
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
              gap: '0.75rem'
            }}>
              <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full paw-bouncing"></div>
              <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full paw-bouncing animation-delay-200"></div>
              <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-full paw-bouncing animation-delay-400"></div>
            </div>
          </div>
        )}

        {error && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            backgroundColor: 'rgba(254, 226, 226, 0.5)',
            color: '#dc2626',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            {error}
          </div>
        )}

        {answer && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
              borderRadius: '0.75rem',
              padding: '2rem'
            }}>
              <p style={{
                color: '#1f2937',
                lineHeight: '1.6',
                fontSize: '1.125rem'
              }}>
                {answer.text}
              </p>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(16px)',