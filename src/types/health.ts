// Health Timeline Data Types

export interface HealthEvent {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  title: string;
  description: string;
  category: string; // e.g., "Appointment", "Medication", "Symptom", "Test", "Procedure"
  isMilestone: boolean;
  tags?: string[];
  notes?: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface HealthEventsByMonth {
  [yearMonth: string]: HealthEvent[]; // "2025-01": [events...]
}

export interface HealthStats {
  totalEvents: number;
  totalMilestones: number;
  dateRange: {
    earliest: string | null;
    latest: string | null;
  };
  categoryCounts: {
    [category: string]: number;
  };
}

// For import/export
export interface HealthTimelineData {
  events: HealthEvent[];
  exportDate: string;
  version: string;
}
