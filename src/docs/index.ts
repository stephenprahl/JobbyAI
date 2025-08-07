import { DocumentationRepository } from '../types/documentation.js';
import { cleanupSummaryDoc } from './cleanupSummary.js';
import { migrationCompleteDoc } from './migrationComplete.js';
import { projectCompleteDocumentation } from './projectComplete.js';
import { readmeDocumentation } from './readme.js';

export const documentationRepository: DocumentationRepository = {
  version: '1.0.0',
  lastUpdated: '2025-07-10',
  documents: [
    readmeDocumentation,
    projectCompleteDocumentation,
    migrationCompleteDoc,
    cleanupSummaryDoc
  ],
  categories: [
    'project-overview',
    'project-completion',
    'testing-qa',
    'technical-implementation',
    'migration',
    'maintenance'
  ],
  tags: [
    'readme',
    'getting-started',
    'setup',
    'overview',
    'project-complete',
    'accomplishments',
    'deployment',
    'testing',
    'qa',
    'debugging',
    'migration',
    'supabase',
    'database',
    'completion',
    'verification',
    'guide',
    'cleanup',
    'project-structure',
    'maintenance',
    'organization',
    'technical-documentation'
  ]
};

// Utility functions for working with documentation
export function getDocumentById(id: string) {
  return documentationRepository.documents.find(doc => doc.id === id);
}

export function getDocumentsByCategory(category: string) {
  return documentationRepository.documents.filter(doc => doc.metadata.category === category);
}

export function getDocumentsByTag(tag: string) {
  return documentationRepository.documents.filter(doc => doc.tags.includes(tag));
}

export function getDocumentsByAudience(audience: string) {
  return documentationRepository.documents.filter(doc =>
    doc.metadata.audience.includes(audience)
  );
}

export function getChecklistItems(documentId: string, category?: string) {
  const doc = getDocumentById(documentId);
  if (!doc) return [];

  const checklistSections = doc.sections.filter(section => section.type === 'checklist');
  const allItems = checklistSections.flatMap(section => section.checklistItems || []);

  if (category) {
    return allItems.filter(item => item.category === category);
  }

  return allItems;
}

export function getCompletionPercentage(documentId: string, category?: string) {
  const items = getChecklistItems(documentId, category);
  if (items.length === 0) return 0;

  const completedItems = items.filter(item => item.completed);
  return Math.round((completedItems.length / items.length) * 100);
}

export function markChecklistItemComplete(documentId: string, itemId: string, completed: boolean = true) {
  const doc = getDocumentById(documentId);
  if (!doc) return false;

  for (const section of doc.sections) {
    if (section.checklistItems) {
      const item = section.checklistItems.find(item => item.id === itemId);
      if (item) {
        item.completed = completed;
        return true;
      }
    }
  }

  return false;
}

// Export individual documents for direct import
export {
  cleanupSummaryDoc, migrationCompleteDoc, projectCompleteDocumentation, readmeDocumentation
};
