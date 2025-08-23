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
        background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.9) 0%, rgba(126, 34, 206, 0.9) 50%, rgba(107, 33, 168, 0.9) 100%)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        zIndex: 1000,
        animation: 'fadeIn 0.3s ease-out'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          borderRadius: '2rem',
          padding: '2rem',
          maxWidth: '90vw',
          maxHeight: '80vh',
          overflow: 'auto',
          position: 'relative',
          border: '4px solid #9333ea',
          boxShadow: '0 25px 50px rgba(147, 51, 234, 0.4), 0 0 0 1px rgba(147, 51, 234, 0.1)',
          fontFamily: '"Comic Sans MS", cursive, sans-serif',
          animation: 'slideUp 0.4s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fun Header Emojis */}
        <div style={{
          textAlign: 'center',
          fontSize: '2rem',
          marginBottom: '1rem',
          animation: 'bounce 2s infinite'
        }}>
          📖✨🌟
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            width: '3rem',
            height: '3rem',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(147, 51, 234, 0.4)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(147, 51, 234, 0.6)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(147, 51, 234, 0.4)';
          }}
        >
          <X size={20} />
        </button>

        {/* Verse Title */}
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '800',
          textAlign: 'center',
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 50%, #6b21a8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '0 2px 4px rgba(147, 51, 234, 0.3)',
          fontFamily: '"Comic Sans MS", cursive, sans-serif'
        }}>
          {verse.title} 📜
        </h2>

        {/* Verse Content */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(126, 34, 206, 0.1) 100%)',
          borderRadius: '1.5rem',
          padding: '2rem',
          marginBottom: '1.5rem',
          border: '3px solid rgba(147, 51, 234, 0.3)',
          animation: 'glow 3s ease-in-out infinite alternate'
        }}>
          <p style={{
            fontSize: '1.3rem',
            lineHeight: '1.6',
            color: '#4c1d95',
            fontWeight: '600',
            textAlign: 'center',
            margin: 0,
            fontFamily: '"Comic Sans MS", cursive, sans-serif'
          }}>
            "{verse.content}"
          </p>
        </div>

        {/* Sweet Message */}
        <p style={{
          textAlign: 'center',
          fontSize: '1.1rem',
          color: '#7e22ce',
          fontWeight: '700',
          marginBottom: '1rem',
          fontFamily: '"Comic Sans MS", cursive, sans-serif'
        }}>
          God loves you so much! 💕
        </p>

        {/* Fun Footer Emojis */}
        <div style={{
          textAlign: 'center',
          fontSize: '1.8rem',
          animation: 'pulse 2s infinite'
        }}>
          🙏💜✨
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
        
        @keyframes glow {
          from {
            box-shadow: 0 0 20px rgba(147, 51, 234, 0.3);
          }
          to {
            box-shadow: 0 0 30px rgba(147, 51, 234, 0.5);
          }
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}