import { ConversationHistory, ConversationItem } from '../types/conversation';

const STORAGE_KEY = 'bible_wisdom_history';
const CURRENT_VERSION = '1.0.0';

/**
 * Save conversation history to localStorage
 */
export function saveToLocalStorage(conversations: ConversationItem[]): void {
  try {
    const history: ConversationHistory = {
      version: CURRENT_VERSION,
      created: Date.now(),
      lastModified: Date.now(),
      conversations
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    throw new Error('Failed to save conversation history');
  }
}

/**
 * Load conversation history from localStorage
 */
export function loadFromLocalStorage(): ConversationItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const history: ConversationHistory = JSON.parse(stored);

    // Validate the data structure
    if (!history.conversations || !Array.isArray(history.conversations)) {
      console.warn('Invalid conversation history format');
      return [];
    }

    return history.conversations;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return [];
  }
}

/**
 * Clear all conversation history from localStorage
 */
export function clearLocalStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

/**
 * Export conversation history to a JSON file
 */
export function exportToJSON(conversations: ConversationItem[]): void {
  try {
    const history: ConversationHistory = {
      version: CURRENT_VERSION,
      created: Date.now(),
      lastModified: Date.now(),
      conversations
    };

    const dataStr = JSON.stringify(history, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `bible-wisdom-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting to JSON:', error);
    throw new Error('Failed to export conversation history');
  }
}

/**
 * Import conversation history from a JSON file
 */
export function importFromJSON(file: File): Promise<ConversationItem[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const history: ConversationHistory = JSON.parse(content);

        // Validate the imported data
        if (!history.conversations || !Array.isArray(history.conversations)) {
          reject(new Error('Invalid file format: missing conversations array'));
          return;
        }

        // Validate each conversation item
        const validConversations = history.conversations.filter(conv => {
          return (
            conv.id &&
            typeof conv.timestamp === 'number' &&
            conv.question &&
            conv.answer &&
            conv.answer.text &&
            Array.isArray(conv.answer.references)
          );
        });

        if (validConversations.length === 0) {
          reject(new Error('No valid conversations found in file'));
          return;
        }

        if (validConversations.length < history.conversations.length) {
          console.warn(
            `Imported ${validConversations.length} valid conversations out of ${history.conversations.length} total`
          );
        }

        resolve(validConversations);
      } catch (error) {
        reject(new Error('Failed to parse JSON file: ' + (error as Error).message));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

/**
 * Merge imported conversations with existing ones, avoiding duplicates
 */
export function mergeConversations(
  existing: ConversationItem[],
  imported: ConversationItem[]
): ConversationItem[] {
  const existingIds = new Set(existing.map(conv => conv.id));
  const newConversations = imported.filter(conv => !existingIds.has(conv.id));

  return [...existing, ...newConversations].sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Generate a unique ID for a conversation
 */
export function generateConversationId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get statistics about the conversation history
 */
export function getHistoryStats(conversations: ConversationItem[]) {
  const totalQuestions = conversations.length;
  const totalReferences = conversations.reduce(
    (sum, conv) => sum + conv.answer.references.length,
    0
  );

  const referenceTypes = conversations.reduce((acc, conv) => {
    conv.answer.references.forEach(ref => {
      acc[ref.type] = (acc[ref.type] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const oldestTimestamp = conversations.length > 0
    ? Math.min(...conversations.map(c => c.timestamp))
    : Date.now();

  const newestTimestamp = conversations.length > 0
    ? Math.max(...conversations.map(c => c.timestamp))
    : Date.now();

  return {
    totalQuestions,
    totalReferences,
    referenceTypes,
    oldestTimestamp,
    newestTimestamp,
    averageReferencesPerQuestion: totalQuestions > 0
      ? (totalReferences / totalQuestions).toFixed(1)
      : '0'
  };
}
