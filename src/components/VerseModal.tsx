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
        background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.8) 0%, rgba(126, 34, 206, 0.9) 100%)',
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
          border: '4px solid #9333ea',
          borderRadius: '2rem',
          padding: '2.5rem',
          maxWidth: '36rem',
          width: '100%',
          maxHeight: '80vh',
          overflow: 'auto',
          position: 'relative',
          boxShadow: '0 25px 50px rgba(147, 51, 234, 0.5)',
          fontFamily: '"Comic Sans MS", "Marker Felt", cursive, sans-serif'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            background: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '3rem',
            height: '3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 6px 16px rgba(147, 51, 234, 0.5)',
            transition: 'all 0.3s ease',
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'rotate(90deg) scale(1.15)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(147, 51, 234, 0.7)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(147, 51, 234, 0.5)';
          }}
        >
          <X className="w-6 h-6" />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            fontSize: '3rem', 
            marginBottom: '1rem',
            animation: 'bounce 2s infinite'
          }}>
            📖✨🌟
          </div>
          <h2 style={{
            fontSize: '2.2rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 50%, #6b21a8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '0.5rem',
            fontFamily: '"Comic Sans MS", "Marker Felt", cursive, sans-serif',
            textShadow: '2px 2px 4px rgba(147, 51, 234, 0.3)'
          }}>
            {verse.title}
          </h2>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(126, 34, 206, 0.15) 100%)',
          border: '3px solid rgba(147, 51, 234, 0.3)',
          borderRadius: '1.5rem',
          padding: '2rem',
          marginBottom: '2rem',
          animation: 'gentle-glow 3s ease-in-out infinite',
          boxShadow: '0 8px 16px rgba(147, 51, 234, 0.2)'
        }}>
          <p style={{
            fontSize: '1.4rem',
            lineHeight: '1.7',
            color: '#6b21a8',
            fontWeight: '700',
            textAlign: 'center',
            margin: 0,
            fontFamily: '"Comic Sans MS", "Marker Felt", cursive, sans-serif',
            textShadow: '1px 1px 2px rgba(147, 51, 234, 0.2)'
          }}>
            "{verse.content}"
          </p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '2rem', 
            marginBottom: '1rem',
            animation: 'pulse 2s infinite'
          }}>
            🙏💜✨
          </div>
          <p style={{
            fontSize: '1.3rem',
            color: '#7e22ce',
            fontWeight: '700',
            margin: 0,
            fontFamily: '"Comic Sans MS", "Marker Felt", cursive, sans-serif',
            textShadow: '1px 1px 2px rgba(126, 34, 206, 0.3)'
          }}>
            God loves you so much! 💕
          </p>
        </div>
      </div>

      <style>{`
        @keyframes gentle-glow {
          0%, 100% { 
            background: linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(126, 34, 206, 0.15) 100%);
            box-shadow: 0 8px 16px rgba(147, 51, 234, 0.2);
          }
          50% { 
            background: linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(126, 34, 206, 0.2) 100%);
            box-shadow: 0 12px 24px rgba(147, 51, 234, 0.3);
          }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}