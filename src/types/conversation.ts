export interface Reference {
  type: 'verse' | 'book' | 'commentary' | 'article' | 'sermon' | 'devotional';
  title: string;
  link: string;
  description?: string;
}

export interface Answer {
  text: string;
  references: Reference[];
}

export interface ConversationItem {
  id: string;
  timestamp: number;
  question: string;
  answer: Answer;
}

export interface ConversationHistory {
  version: string;
  created: number;
  lastModified: number;
  conversations: ConversationItem[];
}

export type TimelineZoomLevel = 'day' | 'week' | 'month' | 'all';

export interface TimelineFilter {
  startDate?: number;
  endDate?: number;
  searchTerm?: string;
}
