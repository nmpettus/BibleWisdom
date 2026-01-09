import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save, Calendar } from 'lucide-react';
import { addEvent, updateEvent, getEvent } from '../lib/storage';

export default function EventForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get('id');
  const isEditing = !!eventId;

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    title: '',
    description: '',
    category: 'Appointment',
    isMilestone: false,
    tags: '',
    notes: ''
  });

  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isEditing && eventId) {
      const event = getEvent(eventId);
      if (event) {
        setFormData({
          date: event.date,
          title: event.title,
          description: event.description,
          category: event.category,
          isMilestone: event.isMilestone,
          tags: event.tags?.join(', ') || '',
          notes: event.notes || ''
        });
      }
    }
  }, [eventId, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }

    if (!formData.date) {
      alert('Please select a date');
      return;
    }

    setSaving(true);

    try {
      const eventData = {
        date: formData.date,
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        isMilestone: formData.isMilestone,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        notes: formData.notes.trim()
      };

      if (isEditing && eventId) {
        updateEvent(eventId, eventData);
      } else {
        addEvent(eventData);
      }

      setShowSuccess(true);

      // Navigate back after a short delay
      setTimeout(() => {
        navigate('/timeline');
      }, 1000);
    } catch (error) {
      alert(`Failed to save event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const categories = [
    'Appointment',
    'Medication',
    'Symptom',
    'Test',
    'Procedure',
    'Vaccination',
    'Emergency',
    'Follow-up',
    'Other'
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #F8FAFC, #E2E8F0)',
      padding: '24px'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{ paddingTop: '32px', marginBottom: '24px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            letterSpacing: '-0.5px',
            color: '#1E293B',
            marginBottom: '8px'
          }}>
            {isEditing ? 'Edit Event' : 'Add Event'}
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#64748B',
            fontWeight: '300'
          }}>
            {isEditing ? 'Update health event details' : 'Create a new health event'}
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => navigate(-1)}
            type="button"
            style={{
              background: '#FFFFFF',
              color: '#DC2626',
              border: '2px solid #DC2626',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#FEE2E2';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#FFFFFF';
            }}
          >
            <ArrowLeft size={20} />
            Back
          </button>

          <button
            onClick={handleSubmit}
            disabled={saving}
            style={{
              background: '#34D399',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => {
              if (!saving) {
                e.currentTarget.style.background = '#10B981';
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#34D399';
            }}
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Event'}
          </button>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div style={{
            background: '#D1FAE5',
            border: '2px solid #34D399',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#065F46'
          }}>
            ✓ Event saved successfully!
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          }}>
            {/* Date */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1E293B',
                marginBottom: '8px'
              }}>
                Date *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    paddingLeft: '40px',
                    fontSize: '14px',
                    border: '2px solid #E2E8F0',
                    borderRadius: '8px',
                    color: '#1E293B',
                    fontFamily: 'inherit',
                    cursor: 'pointer'
                  }}
                />
                <Calendar
                  size={20}
                  color="#64748B"
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none'
                  }}
                />
              </div>
            </div>

            {/* Title */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1E293B',
                marginBottom: '8px'
              }}>
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Annual checkup"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '14px',
                  border: '2px solid #E2E8F0',
                  borderRadius: '8px',
                  color: '#1E293B',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            {/* Category */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1E293B',
                marginBottom: '8px'
              }}>
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '14px',
                  border: '2px solid #E2E8F0',
                  borderRadius: '8px',
                  color: '#1E293B',
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  background: '#FFFFFF'
                }}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1E293B',
                marginBottom: '8px'
              }}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add details about this event..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '14px',
                  border: '2px solid #E2E8F0',
                  borderRadius: '8px',
                  color: '#1E293B',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Milestone */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={formData.isMilestone}
                  onChange={(e) => setFormData({ ...formData, isMilestone: e.target.checked })}
                  style={{
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer'
                  }}
                />
                <div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1E293B'
                  }}>
                    Mark as milestone
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#64748B',
                    fontWeight: '300'
                  }}>
                    Important events like diagnoses or major procedures
                  </div>
                </div>
              </label>
            </div>

            {/* Tags */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1E293B',
                marginBottom: '8px'
              }}>
                Tags
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="e.g., cardiology, urgent, follow-up (comma separated)"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '14px',
                  border: '2px solid #E2E8F0',
                  borderRadius: '8px',
                  color: '#1E293B',
                  fontFamily: 'inherit'
                }}
              />
              <div style={{
                fontSize: '12px',
                color: '#64748B',
                fontWeight: '300',
                marginTop: '4px'
              }}>
                Separate multiple tags with commas
              </div>
            </div>

            {/* Notes */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1E293B',
                marginBottom: '8px'
              }}>
                Additional Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any additional information..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '14px',
                  border: '2px solid #E2E8F0',
                  borderRadius: '8px',
                  color: '#1E293B',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
