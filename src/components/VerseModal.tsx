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
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      zIndex: 1000
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(16px)',
        border: '2px solid #3B82F6',
        boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
        borderRadius: '1rem',
        padding: '1.5rem',
        maxWidth: '32rem',
        width: '100%',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#1E40AF',
            margin: 0
          }}>
            {verse.title}
          </h2>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem',
              borderRadius: '50%',
              background: 'rgba(59, 130, 246, 0.1)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
            }}
          >
            <X className="w-5 h-5 text-blue-600" />
          </button>
        </div>
        <div style={{
          color: '#374151',
          lineHeight: '1.6',
          fontSize: '1rem'
        }}>
          {verse.content}
        </div>
      </div>
    </div>
  );
}