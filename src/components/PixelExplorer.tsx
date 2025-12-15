import { useState, useRef, useEffect } from 'react';
import { RotateCcw, Plus, Minus, ArrowLeft } from 'lucide-react';

type ImageOption = {
  id: string;
  emoji: string;
  label: string;
  color: string;
};

const images: ImageOption[] = [
  { id: 'dog', emoji: '🐶', label: 'DOG', color: '#F4A460' },
  { id: 'apple', emoji: '🍎', label: 'APPLE', color: '#FF4444' },
  { id: 'toy', emoji: '🧸', label: 'TOY', color: '#D4A373' },
];

type Screen = 'select' | 'zoom' | 'insight';

interface PixelExplorerProps {
  onBack?: () => void;
}

export default function PixelExplorer({ onBack }: PixelExplorerProps = {}) {
  const [currentScreen, setCurrentScreen] = useState<Screen>('select');
  const [selectedImage, setSelectedImage] = useState<ImageOption | null>(null);
  const [zoomLevel, setZoomLevel] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageSelect = (image: ImageOption) => {
    setSelectedImage(image);
    setZoomLevel(0);
    setTimeout(() => {
      setCurrentScreen('zoom');
    }, 300);
  };

  const handleTryAnother = () => {
    setCurrentScreen('select');
    setSelectedImage(null);
    setZoomLevel(0);
  };

  const handleZoomChange = (newLevel: number) => {
    const clampedLevel = Math.max(0, Math.min(100, newLevel));
    setZoomLevel(clampedLevel);

    // Auto-advance to insight screen when fully zoomed
    if (clampedLevel >= 95 && currentScreen === 'zoom') {
      setTimeout(() => {
        setCurrentScreen('insight');
      }, 500);
    }
  };

  // Draw pixelated image on canvas
  useEffect(() => {
    if (!canvasRef.current || !selectedImage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 300;
    canvas.width = size;
    canvas.height = size;

    // Calculate pixel size based on zoom level
    // Stage 1 (0-33%): Normal - 1px blocks
    // Stage 2 (34-66%): Slight grid - 5px blocks
    // Stage 3 (67-100%): Large blocks - 20px blocks
    let pixelSize = 1;
    if (zoomLevel > 66) {
      pixelSize = Math.floor(1 + (zoomLevel - 66) * 0.5); // Up to 20px
    } else if (zoomLevel > 33) {
      pixelSize = Math.floor(1 + (zoomLevel - 33) * 0.12); // Up to 5px
    }

    // Create a simple colored pattern based on the emoji
    const baseColor = selectedImage.color;

    // Draw pixelated blocks
    for (let y = 0; y < size; y += pixelSize) {
      for (let x = 0; x < size; x += pixelSize) {
        // Create variation in color
        const variation = Math.sin((x + y) / 20) * 30;
        const colorValue = hexToRgb(baseColor);
        if (colorValue) {
          const r = Math.max(0, Math.min(255, colorValue.r + variation));
          const g = Math.max(0, Math.min(255, colorValue.g + variation));
          const b = Math.max(0, Math.min(255, colorValue.b + variation));
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.fillRect(x, y, pixelSize, pixelSize);
        }
      }
    }

    // Draw grid lines for stages 2 and 3
    if (zoomLevel > 33) {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= size; i += pixelSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, size);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(size, i);
        ctx.stroke();
      }
    }

    // Draw emoji overlay (fades out as we zoom)
    if (zoomLevel < 80) {
      ctx.font = '200px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const opacity = 1 - (zoomLevel / 80);
      ctx.globalAlpha = opacity;
      ctx.fillText(selectedImage.emoji, size / 2, size / 2);
      ctx.globalAlpha = 1;
    }
  }, [selectedImage, zoomLevel]);

  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FFB6C1 0%, #E6E6FA 50%, #87CEEB 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        fontFamily: "'Comic Sans MS', cursive, sans-serif",
        position: 'relative',
      }}
    >
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
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
            transition: 'all 0.3s ease',
            zIndex: 100,
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
          <ArrowLeft size={16} />
          <span>Back to Bible Q&amp;A</span>
        </button>
      )}

      {/* SCREEN 1: Choose an Image */}
      {currentScreen === 'select' && (
        <div
          style={{
            textAlign: 'center',
            animation: 'fadeIn 0.5s ease-in',
          }}
        >
          {/* Maggie Avatar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            <img
              src="/MaggieRead.jpeg"
              alt="Maggie"
              style={{
                width: '5rem',
                height: '5rem',
                borderRadius: '50%',
                border: '4px solid #FF69B4',
                boxShadow: '0 6px 20px rgba(255, 105, 180, 0.5)',
              }}
            />
            <h1
              style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: '#7e22ce',
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                margin: 0,
              }}
            >
              Pixel Explorer
            </h1>
          </div>

          {/* Instructions */}
          <p
            style={{
              fontSize: '1.5rem',
              color: '#4B0082',
              marginBottom: '2rem',
              fontWeight: 'bold',
            }}
          >
            Tap an image to explore!
          </p>

          {/* Image Selection Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '1.5rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            {images.map((image) => (
              <button
                key={image.id}
                onClick={() => handleImageSelect(image)}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                }}
                style={{
                  background: `linear-gradient(135deg, ${image.color}, ${image.color}dd)`,
                  border: '4px solid white',
                  borderRadius: '20px',
                  padding: '2rem',
                  fontSize: '4rem',
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  minWidth: '150px',
                }}
              >
                <span>{image.emoji}</span>
                <span
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    color: 'white',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                  }}
                >
                  {image.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SCREEN 2: Zoom & Discover */}
      {currentScreen === 'zoom' && selectedImage && (
        <div
          style={{
            textAlign: 'center',
            animation: 'slideUp 0.5s ease-out',
            maxWidth: '600px',
            width: '100%',
          }}
        >
          {/* Canvas for pixelated image */}
          <div
            style={{
              marginBottom: '2rem',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <canvas
              ref={canvasRef}
              style={{
                border: '6px solid white',
                borderRadius: '20px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                maxWidth: '100%',
                height: 'auto',
                background: 'white',
              }}
            />
          </div>

          {/* Zoom Slider */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                justifyContent: 'center',
              }}
            >
              <button
                onClick={() => handleZoomChange(zoomLevel - 10)}
                disabled={zoomLevel <= 0}
                style={{
                  background: '#FF69B4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '3rem',
                  height: '3rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: zoomLevel <= 0 ? 'not-allowed' : 'pointer',
                  opacity: zoomLevel <= 0 ? 0.5 : 1,
                  boxShadow: '0 4px 10px rgba(255, 105, 180, 0.3)',
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={(e) => {
                  if (zoomLevel > 0) e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <Minus size={24} />
              </button>

              <div style={{ flex: 1 }}>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={zoomLevel}
                  onChange={(e) => handleZoomChange(Number(e.target.value))}
                  style={{
                    width: '100%',
                    height: '10px',
                    borderRadius: '5px',
                    background: `linear-gradient(to right, #FF69B4 0%, #FF69B4 ${zoomLevel}%, #E0E0E0 ${zoomLevel}%, #E0E0E0 100%)`,
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                />
                <div
                  style={{
                    marginTop: '0.5rem',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    color: '#7e22ce',
                  }}
                >
                  Zoom: {zoomLevel}%
                </div>
              </div>

              <button
                onClick={() => handleZoomChange(zoomLevel + 10)}
                disabled={zoomLevel >= 100}
                style={{
                  background: '#FF69B4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '3rem',
                  height: '3rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: zoomLevel >= 100 ? 'not-allowed' : 'pointer',
                  opacity: zoomLevel >= 100 ? 0.5 : 1,
                  boxShadow: '0 4px 10px rgba(255, 105, 180, 0.3)',
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={(e) => {
                  if (zoomLevel < 100) e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <Plus size={24} />
              </button>
            </div>
          </div>

          {/* Maggie Explanation */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '1.5rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <img
              src="/MaggieRead.jpeg"
              alt="Maggie"
              style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '50%',
                border: '3px solid #FF69B4',
              }}
            />
            <p
              style={{
                fontSize: '1.3rem',
                color: '#4B0082',
                margin: 0,
                fontWeight: 'bold',
                flex: 1,
                textAlign: 'left',
              }}
            >
              To computers, pictures are tiny squares called pixels!
            </p>
          </div>
        </div>
      )}

      {/* SCREEN 3: Maggie Insight */}
      {currentScreen === 'insight' && selectedImage && (
        <div
          style={{
            textAlign: 'center',
            animation: 'fadeIn 0.5s ease-in',
            maxWidth: '600px',
            width: '100%',
          }}
        >
          {/* Frozen Pixelated Image */}
          <div
            style={{
              marginBottom: '2rem',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <canvas
              ref={canvasRef}
              style={{
                border: '6px solid white',
                borderRadius: '20px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                maxWidth: '100%',
                height: 'auto',
                background: 'white',
              }}
            />
          </div>

          {/* Maggie Insight */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <img
              src="/MaggieRead.jpeg"
              alt="Maggie"
              style={{
                width: '4rem',
                height: '4rem',
                borderRadius: '50%',
                border: '3px solid #FF69B4',
                boxShadow: '0 4px 12px rgba(255, 105, 180, 0.4)',
              }}
            />
            <p
              style={{
                fontSize: '1.5rem',
                color: '#4B0082',
                margin: 0,
                fontWeight: 'bold',
                flex: 1,
                textAlign: 'left',
              }}
            >
              Even faces are just colors and numbers!
            </p>
          </div>

          {/* Try Another Button */}
          <button
            onClick={handleTryAnother}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
            style={{
              background: 'linear-gradient(135deg, #FF69B4, #FF1493)',
              color: 'white',
              border: 'none',
              borderRadius: '15px',
              padding: '1rem 2rem',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(255, 105, 180, 0.4)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              margin: '0 auto',
            }}
          >
            <RotateCcw size={28} />
            Try Another Image
          </button>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
