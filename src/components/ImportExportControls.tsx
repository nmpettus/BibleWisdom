import React, { useRef } from 'react';
import { Download, Upload, Trash2, BarChart3 } from 'lucide-react';
import { ConversationItem } from '../types/conversation';
import { exportToJSON, importFromJSON, clearLocalStorage, getHistoryStats } from '../utils/storage';

interface ImportExportControlsProps {
  conversations: ConversationItem[];
  onImport: (conversations: ConversationItem[]) => void;
  onClear: () => void;
}

export function ImportExportControls({ conversations, onImport, onClear }: ImportExportControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showStats, setShowStats] = React.useState(false);

  const handleExport = () => {
    try {
      exportToJSON(conversations);
    } catch (error) {
      alert('Failed to export conversations: ' + (error as Error).message);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imported = await importFromJSON(file);
      onImport(imported);
      alert(`Successfully imported ${imported.length} conversation(s)!`);
    } catch (error) {
      alert('Failed to import: ' + (error as Error).message);
    }

    // Reset input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClear = () => {
    if (conversations.length === 0) {
      alert('No conversations to clear!');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete all ${conversations.length} conversation(s)? This cannot be undone!`
    );

    if (confirmed) {
      clearLocalStorage();
      onClear();
      alert('All conversations have been deleted.');
    }
  };

  const stats = getHistoryStats(conversations);

  return (
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
        fontWeight: '700',
        color: '#FF1493',
        marginBottom: '1rem',
        marginTop: 0
      }}>
        Data Management
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '0.75rem',
        marginBottom: '1rem'
      }}>
        <button
          onClick={handleExport}
          disabled={conversations.length === 0}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.75rem',
            borderRadius: '0.75rem',
            background: conversations.length === 0
              ? 'rgba(74, 144, 226, 0.3)'
              : 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)',
            border: 'none',
            color: 'white',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: conversations.length === 0 ? 'not-allowed' : 'pointer',
            opacity: conversations.length === 0 ? 0.5 : 1,
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            if (conversations.length > 0) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(74, 144, 226, 0.4)';
            }
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          title="Export conversations to JSON file"
        >
          <Download className="w-4 h-4" />
          Export
        </button>

        <button
          onClick={handleImportClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.75rem',
            borderRadius: '0.75rem',
            background: 'linear-gradient(135deg, #98FB98 0%, #7FD87F 100%)',
            border: 'none',
            color: '#2F5F2F',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(152, 251, 152, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          title="Import conversations from JSON file"
        >
          <Upload className="w-4 h-4" />
          Import
        </button>

        <button
          onClick={() => setShowStats(!showStats)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.75rem',
            borderRadius: '0.75rem',
            background: 'linear-gradient(135deg, #F0E68C 0%, #DAC670 100%)',
            border: 'none',
            color: '#6B5B00',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(240, 230, 140, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          title="View statistics"
        >
          <BarChart3 className="w-4 h-4" />
          Stats
        </button>

        <button
          onClick={handleClear}
          disabled={conversations.length === 0}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.75rem',
            borderRadius: '0.75rem',
            background: conversations.length === 0
              ? 'rgba(220, 38, 38, 0.3)'
              : 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
            border: 'none',
            color: 'white',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: conversations.length === 0 ? 'not-allowed' : 'pointer',
            opacity: conversations.length === 0 ? 0.5 : 1,
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            if (conversations.length > 0) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.4)';
            }
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          title="Clear all conversations"
        >
          <Trash2 className="w-4 h-4" />
          Clear
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {showStats && conversations.length > 0 && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          borderRadius: '0.75rem',
          background: 'linear-gradient(135deg, rgba(74, 144, 226, 0.05) 0%, rgba(74, 144, 226, 0.1) 100%)',
          border: '2px solid rgba(74, 144, 226, 0.2)'
        }}>
          <h4 style={{
            fontSize: '0.875rem',
            fontWeight: '700',
            color: '#1E40AF',
            marginBottom: '0.75rem',
            marginTop: 0
          }}>
            📊 Statistics
          </h4>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.5rem',
            fontSize: '0.75rem'
          }}>
            <div>
              <span style={{ color: '#6B7280', fontWeight: '600' }}>Total Questions:</span>
              <div style={{ color: '#1E40AF', fontWeight: '700', fontSize: '1.125rem' }}>
                {stats.totalQuestions}
              </div>
            </div>

            <div>
              <span style={{ color: '#6B7280', fontWeight: '600' }}>Total References:</span>
              <div style={{ color: '#1E40AF', fontWeight: '700', fontSize: '1.125rem' }}>
                {stats.totalReferences}
              </div>
            </div>

            <div>
              <span style={{ color: '#6B7280', fontWeight: '600' }}>Avg Refs/Question:</span>
              <div style={{ color: '#1E40AF', fontWeight: '700', fontSize: '1.125rem' }}>
                {stats.averageReferencesPerQuestion}
              </div>
            </div>

            <div>
              <span style={{ color: '#6B7280', fontWeight: '600' }}>Most Common:</span>
              <div style={{ color: '#1E40AF', fontWeight: '700', fontSize: '0.875rem' }}>
                {Object.entries(stats.referenceTypes)
                  .sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A'}
              </div>
            </div>
          </div>

          {Object.keys(stats.referenceTypes).length > 0 && (
            <div style={{ marginTop: '0.75rem' }}>
              <div style={{
                fontSize: '0.75rem',
                color: '#6B7280',
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>
                Reference Types:
              </div>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.375rem'
              }}>
                {Object.entries(stats.referenceTypes).map(([type, count]) => (
                  <span
                    key={type}
                    style={{
                      fontSize: '0.625rem',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.375rem',
                      background: 'rgba(74, 144, 226, 0.15)',
                      color: '#1E40AF',
                      fontWeight: '700'
                    }}
                  >
                    {type}: {count}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
