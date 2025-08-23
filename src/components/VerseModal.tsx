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
        background: 'rgba(139, 92, 246, 0.8)',
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
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(16px)',
          borderRadius: '1rem',
          padding: '1.5rem',
          maxWidth: '28rem',
          width: '100%',
          maxHeight: '80vh',
          overflowY: 'auto',
          border: '3px solid #8b5cf6',
          boxShadow: '0 20px 40px rgba(139, 92, 246, 0.4)',
          position: 'relative',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <span style={{ fontSize: '1.5rem' }}>📖✨</span>
        </div>
        
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            padding: '0.5rem',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.5)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(139, 92, 246, 0.3)';
          }}
        >
          <X className="w-4 h-4" />
        </button>
        
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '1rem',
          textAlign: 'center',
          lineHeight: '1.3'
        }}>
          {verse.title}
        </h2>
        
        <div style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)',
          borderRadius: '0.75rem',
          padding: '1rem',
          border: '2px solid rgba(139, 92, 246, 0.2)',
          marginBottom: '1rem'
        }}>
          <p style={{
            color: '#374151',
            lineHeight: '1.6',
            fontSize: '0.95rem',
            margin: 0,
            textAlign: 'center'
          }}>
            {verse.content}
          </p>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '1.25rem' }}>🙏💜</span>
        </div>
      </div>
    </div>
  );
}