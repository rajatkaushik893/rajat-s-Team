export interface Document {
  id: string;
  title: string;
  author: string;
  content: string;
  summary: string;
  category: string;
  pageCount: number;
  fileSize: string;
  createdAt: string;
  isPreloaded: boolean;
  chapters?: { title: string; excerpt: string; page: number }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  suggestedPrompts?: string[];
  groundingSources?: string[];
}

export interface VivaQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}
