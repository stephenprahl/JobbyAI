import { DocumentationFile } from '../types/documentation';

export const supabaseMigrationDoc: DocumentationFile = {
  id: 'supabase-migration',
  title: 'Supabase Migration Guide',
  description: 'Complete guide for migrating JobbyAI application from local PostgreSQL to Supabase while keeping Prisma as ORM',
  version: '1.0.0',
  lastUpdated: '2025-07-10',
  authors: ['JobbyAI Team'],
  tags: ['migration', 'supabase', 'database', 'guide', 'setup'],
  status: 'approved',
  sections: [
    {
      id: 'prerequisites',
      title: 'Prerequisites',
      content: 'Requirements before starting the migration process.',
      type: 'checklist',
      checklistItems: [
        { id: 'supabase-account', text: 'A Supabase account (https://supabase.com)', completed: true },
        { id: 'local-db', text: 'Your local PostgreSQL database with existing data', completed: true },
        { id: 'runtime', text: 'Bun or Node.js installed', completed: true }
      ]
    },
    {
      id: 'create-project',
      title: 'Step 1: Create Supabase Project',
      content: 'Setting up a new Supabase project.',
      type: 'list',
      items: [
        'Go to supabase.com and sign in',
        'Click "New Project"',
        'Choose your organization and enter project details',
        'Click "Create new project" and wait for it to be provisioned'
      ]
    },
    {
      id: 'get-credentials',
      title: 'Step 2: Get Supabase Credentials',
      content: 'Retrieving necessary credentials from your Supabase project.',
      type: 'list',
      items: [
        'Go to Settings > API in your Supabase dashboard',
        'Copy the Project URL, Anon key, and Service Role key',
        'Go to Settings > Database and copy the connection string',
        'Replace [YOUR-PASSWORD] with your database password'
      ]
    },
    {
      id: 'update-env',
      title: 'Step 3: Update Environment Variables',
      content: 'Configure your .env file with Supabase credentials.',
      type: 'code',
      language: 'env'
    },
    {
      id: 'pre-migration-check',
      title: 'Step 4: Pre-Migration Check',
      content: 'Run the pre-migration check to ensure everything is configured correctly.',
      type: 'code',
      language: 'bash'
    },
    {
      id: 'deploy-schema',
      title: 'Step 5: Deploy Database Schema',
      content: 'Deploy your Prisma schema to Supabase.',
      type: 'code',
      language: 'bash'
    },
    {
      id: 'migrate-data',
      title: 'Step 6: Migrate Data',
      content: 'Run the data migration script to transfer your data.',
      type: 'code',
      language: 'bash'
    },
    {
      id: 'verify-migration',
      title: 'Step 7: Verify Migration',
      content: 'Steps to verify the migration was successful.',
      type: 'checklist',
      checklistItems: [
        { id: 'check-dashboard', text: 'Check Supabase Dashboard - verify all tables and data', completed: false },
        { id: 'test-application', text: 'Test Your Application - ensure all functionality works', completed: false },
        { id: 'check-connection', text: 'Check Database Connection - Open Prisma Studio', completed: false }
      ]
    },
    {
      id: 'optional-enhancements',
      title: 'Step 8: Optional Enhancements',
      content: 'Additional Supabase features you can integrate.',
      type: 'list',
      items: [
        'Real-time Features - Subscribe to changes using Supabase Realtime',
        'Row Level Security (RLS) - Enable RLS for additional security',
        'Authentication - Replace custom auth with Supabase Auth'
      ]
    },
    {
      id: 'cleanup',
      title: 'Step 9: Cleanup',
      content: 'Clean up local database references after successful migration.',
      type: 'list',
      items: [
        'Remove local database configuration',
        'Stop local PostgreSQL services',
        'Update documentation with Supabase instructions'
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      content: 'Common issues and solutions during migration.',
      type: 'list',
      items: [
        'Connection Issues - Check connection string format and credentials',
        'Migration Errors - Ensure databases are accessible and schema is deployed',
        'Performance Issues - Consider connection pooling and caching'
      ]
    },
    {
      id: 'rollback-plan',
      title: 'Rollback Plan',
      content: 'How to rollback to local PostgreSQL if needed.',
      type: 'list',
      items: [
        'Restore your original .env file',
        'Start your local PostgreSQL service',
        'Run your application with the local database'
      ]
    },
    {
      id: 'support',
      title: 'Support Resources',
      content: 'Additional resources and documentation.',
      type: 'list',
      items: [
        'Supabase Documentation - https://supabase.com/docs',
        'Prisma with Supabase Guide - https://supabase.com/docs/guides/integrations/prisma',
        'Supabase Community - https://github.com/supabase/supabase/discussions'
      ]
    },
    {
      id: 'next-steps',
      title: 'Next Steps',
      content: 'Recommended enhancements after successful migration.',
      type: 'list',
      items: [
        'Set up Supabase Auth for enhanced authentication',
        'Implement real-time features for collaborative editing',
        'Use Supabase Storage for file uploads',
        'Set up Row Level Security for multi-tenant data isolation'
      ]
    }
  ],
  metadata: {
    category: 'migration',
    importance: 'critical',
    audience: ['developers', 'devops'],
    relatedDocs: ['migration-complete']
  }
};
