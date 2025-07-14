import React from 'react';
import { X } from 'lucide-react';

interface VerseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export function VerseModal({ isOpen, onClose, title, content }: VerseModalProps) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(8px)',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
        borderRadius: '1rem',
        maxWidth: '42rem',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'hidden',
        animation: 'fade-in 0.3s ease-out'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>{title}</h3>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem',
              borderRadius: '50%',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <X style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }} />
          </button>
        </div>
        <div style={{
          padding: '2rem',
          overflowY: 'auto',
          maxHeight: 'calc(90vh - 8rem)'
        }}>
          <div style={{
            fontSize: '1.125rem',
            lineHeight: '1.7',
            color: '#374151'
          }}>
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}