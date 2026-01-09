// Storage utilities for Health Timeline data

import type { HealthEvent, HealthStats } from '../types/health';

const STORAGE_KEY = 'health_timeline_events';

/**
 * Load all health events from localStorage
 */
export function loadEvents(): HealthEvent[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const events = JSON.parse(data);
    return Array.isArray(events) ? events : [];
  } catch (error) {
    console.error('Error loading events from storage:', error);
    return [];
  }
}

/**
 * Save all health events to localStorage
 */
export function saveEvents(events: HealthEvent[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('Error saving events to storage:', error);
    throw new Error('Failed to save events');
  }
}

/**
 * Add a new event
 */
export function addEvent(event: Omit<HealthEvent, 'id' | 'createdAt' | 'updatedAt'>): HealthEvent {
  const events = loadEvents();

  const newEvent: HealthEvent = {
    ...event,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  events.push(newEvent);
  saveEvents(events);

  return newEvent;
}

/**
 * Update an existing event
 */
export function updateEvent(id: string, updates: Partial<HealthEvent>): HealthEvent | null {
  const events = loadEvents();
  const index = events.findIndex(e => e.id === id);

  if (index === -1) return null;

  events[index] = {
    ...events[index],
    ...updates,
    id: events[index].id, // Preserve original ID
    createdAt: events[index].createdAt, // Preserve creation date
    updatedAt: new Date().toISOString(),
  };

  saveEvents(events);
  return events[index];
}

/**
 * Delete an event
 */
export function deleteEvent(id: string): boolean {
  const events = loadEvents();
  const filtered = events.filter(e => e.id !== id);

  if (filtered.length === events.length) return false;

  saveEvents(filtered);
  return true;
}

/**
 * Get a single event by ID
 */
export function getEvent(id: string): HealthEvent | null {
  const events = loadEvents();
  return events.find(e => e.id === id) || null;
}

/**
 * Calculate statistics from events
 */
export function calculateStats(events: HealthEvent[]): HealthStats {
  if (events.length === 0) {
    return {
      totalEvents: 0,
      totalMilestones: 0,
      dateRange: { earliest: null, latest: null },
      categoryCounts: {},
    };
  }

  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));
  const categoryCounts: { [key: string]: number } = {};

  events.forEach(event => {
    categoryCounts[event.category] = (categoryCounts[event.category] || 0) + 1;
  });

  return {
    totalEvents: events.length,
    totalMilestones: events.filter(e => e.isMilestone).length,
    dateRange: {
      earliest: sorted[0].date,
      latest: sorted[sorted.length - 1].date,
    },
    categoryCounts,
  };
}

/**
 * Group events by month (YYYY-MM format)
 */
export function groupEventsByMonth(events: HealthEvent[]): { [yearMonth: string]: HealthEvent[] } {
  const grouped: { [yearMonth: string]: HealthEvent[] } = {};

  events.forEach(event => {
    const yearMonth = event.date.substring(0, 7); // "2025-01-15" -> "2025-01"
    if (!grouped[yearMonth]) {
      grouped[yearMonth] = [];
    }
    grouped[yearMonth].push(event);
  });

  // Sort events within each month by date (newest first)
  Object.keys(grouped).forEach(month => {
    grouped[month].sort((a, b) => b.date.localeCompare(a.date));
  });

  return grouped;
}

/**
 * Generate a unique ID
 */
function generateId(): string {
  return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Export events as JSON
 */
export function exportEventsAsJSON(events: HealthEvent[]): string {
  const data = {
    events,
    exportDate: new Date().toISOString(),
    version: '1.0',
  };

  return JSON.stringify(data, null, 2);
}

/**
 * Import events from JSON
 */
export function importEventsFromJSON(jsonString: string): HealthEvent[] {
  try {
    const data = JSON.parse(jsonString);

    // Handle different JSON formats
    let events: any[] = [];

    if (Array.isArray(data)) {
      events = data;
    } else if (data.events && Array.isArray(data.events)) {
      events = data.events;
    } else {
      throw new Error('Invalid JSON format');
    }

    // Validate and transform events
    const validEvents: HealthEvent[] = events.map((event, index) => {
      if (!event.date || !event.title) {
        throw new Error(`Invalid event at index ${index}: missing required fields`);
      }

      return {
        id: event.id || generateId(),
        date: event.date,
        title: event.title,
        description: event.description || '',
        category: event.category || 'Other',
        isMilestone: event.isMilestone || false,
        tags: event.tags || [],
        notes: event.notes || '',
        createdAt: event.createdAt || new Date().toISOString(),
        updatedAt: event.updatedAt || new Date().toISOString(),
      };
    });

    return validEvents;
  } catch (error) {
    console.error('Error importing events:', error);
    throw new Error(`Failed to import events: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
