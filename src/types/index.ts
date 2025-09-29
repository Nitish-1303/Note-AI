export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'free' | 'premium';
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  folderId?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  isMarkdown?: boolean;
  summary?: string;
  keywords?: string[];
}

export interface Folder {
  id: string;
  name: string;
  color: string;
  userId: string;
  createdAt: string;
}

export interface SearchResult {
  note: Note;
  relevance: number;
  snippet: string;
}

export interface AnalyticsData {
  totalNotes: number;
  notesThisWeek: number;
  mostUsedTags: string[];
  recentActivity: {
    date: string;
    action: string;
    noteTitle: string;
  }[];
}