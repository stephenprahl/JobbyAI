// Documentation Data Types
export interface DocumentationSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'code' | 'list' | 'checklist' | 'table';
  language?: string; // for code blocks
  items?: string[]; // for lists
  checklistItems?: ChecklistItem[]; // for checklists
  metadata?: Record<string, any>;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  category?: string;
  priority?: 'high' | 'medium' | 'low';
}

export interface DocumentationFile {
  id: string;
  title: string;
  description: string;
  version: string;
  lastUpdated: string;
  authors: string[];
  tags: string[];
  status: 'draft' | 'review' | 'approved' | 'deprecated';
  sections: DocumentationSection[];
  metadata: {
    category: string;
    importance: 'critical' | 'high' | 'medium' | 'low';
    audience: string[];
    relatedDocs: string[];
  };
}

export interface DocumentationRepository {
  version: string;
  lastUpdated: string;
  documents: DocumentationFile[];
  categories: string[];
  tags: string[];
}
