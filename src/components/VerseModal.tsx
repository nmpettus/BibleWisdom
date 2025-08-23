import React from 'react';
import { X } from 'lucide-react';

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
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%)',
          borderRadius: '1.5rem',
          padding: '2rem',
          maxWidth: '32rem',
          width: '100%',
          maxHeight: '80vh',
          overflow: 'auto',
          position: 'relative',
          border: '3px solid #8b5cf6',
          boxShadow: '0 20px 40px rgba(139, 92, 246, 0.4)',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            padding: '0.5rem',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(139, 92, 246, 0.6)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.4)';
          }}
        >
          <X className="w-5 h-5" />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            📖✨🌟
          </div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1rem',
            lineHeight: '1.3'
          }}>
            {verse.title}
          </h2>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(124, 58, 237, 0.08) 100%)',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          border: '2px solid rgba(139, 92, 246, 0.2)',
          animation: 'gentle-pulse 3s ease-in-out infinite'
        }}>
          <p style={{
            fontSize: '1.125rem',
            lineHeight: '1.6',
            color: '#374151',
            fontWeight: '500',
            textAlign: 'center',
            margin: 0,
            fontStyle: 'italic'
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
          fontSize: '1rem',
          color: '#7c3aed',
          fontWeight: '600',
          margin: 0
        }}>
          God loves you so much! 💕
        </p>
      </div>

      <style>{`
        @keyframes gentle-pulse {
          0%, 100% { 
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(124, 58, 237, 0.08) 100%);
          }
          50% { 
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(124, 58, 237, 0.12) 100%);
          }
        }
      `}</style>
    </div>
  );
}