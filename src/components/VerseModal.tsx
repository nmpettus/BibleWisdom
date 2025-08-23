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