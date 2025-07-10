# Supabase Migration Guide

This guide walks you through migrating your Resume Plan AI application from local PostgreSQL to Supabase while keeping Prisma as your ORM.

## Prerequisites

- A Supabase account (<https://supabase.com>)
- Your local PostgreSQL database with existing data
- Bun or Node.js installed

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization and enter project details:
   - **Project Name**: resume-plan-ai (or your preferred name)
   - **Database Password**: Choose a strong password
   - **Region**: Select the closest region to your users
4. Click "Create new project" and wait for it to be provisioned

## Step 2: Get Supabase Credentials

Once your project is ready:

1. Go to **Settings** > **API** in your Supabase dashboard
2. Copy the following values:
   - **Project URL**: `https://your-project-ref.supabase.co`
   - **Anon (public) key**: `eyJ...` (starts with eyJ)
   - **Service Role key**: `eyJ...` (starts with eyJ, different from anon key)

3. Go to **Settings** > **Database**
4. Find the **Connection string** section
5. Copy the connection string: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
6. Replace `[YOUR-PASSWORD]` with the database password you set in Step 1

## Step 3: Update Environment Variables

Update your `.env` file with the Supabase credentials:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Update DATABASE_URL to point to Supabase
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

**Important**: Comment out or backup your current `DATABASE_URL` before changing it:

```env
# Local PostgreSQL (backup)
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/resume_plan_ai

# Supabase PostgreSQL (active)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

## Step 4: Pre-Migration Check

Run the pre-migration check to ensure everything is configured correctly:

```bash
bun run migrate:check
```

This script will:

- ✅ Check local database connection
- ✅ Verify environment variables are set
- ✅ Test Supabase database connection
- 📊 Show data summary from your local database

Fix any issues before proceeding to the next step.

## Step 5: Deploy Database Schema

Deploy your Prisma schema to Supabase:

```bash
# Generate Prisma client for the new database
bunx prisma generate

# Deploy migrations to Supabase
bunx prisma migrate deploy
```

This will create all your tables, indexes, and constraints in your Supabase database.

## Step 6: Migrate Data

Run the data migration script:

```bash
bun run migrate:supabase
```

This script will:

- 📦 Export all data from your local database
- 📥 Import the data into your Supabase database
- ✅ Preserve all relationships and constraints
- 🔍 Show progress for each user and related data

The migration uses `upsert` operations, so it's safe to run multiple times.

## Step 7: Verify Migration

1. **Check Supabase Dashboard**:
   - Go to **Table Editor** in your Supabase dashboard
   - Verify that all tables are created and contain data
   - Check a few records to ensure data integrity

2. **Test Your Application**:

   ```bash
   # Start your application
   bun run dev

   # Test key functionality:
   # - User login/registration
   # - Profile management
   # - Resume building
   # - Job analysis
   ```

3. **Check Database Connection**:

   ```bash
   # Open Prisma Studio connected to Supabase
   bunx prisma studio
   ```

## Step 8: Update Application Code (Optional)

Your application should work immediately with Supabase since you're still using Prisma. However, you can optionally integrate Supabase-specific features:

### Real-time Features

```typescript
// Example: Real-time resume updates
import { supabase } from './lib/supabase'

// Subscribe to resume changes
supabase
  .channel('resume_changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'user_resumes'
  }, (payload) => {
    console.log('Resume updated:', payload)
  })
  .subscribe()
```

### Row Level Security (RLS)

You can enable RLS in Supabase for additional security:

1. Go to **Authentication** > **Policies** in Supabase
2. Enable RLS on your tables
3. Create policies to control data access

## Step 9: Cleanup (Optional)

Once you've verified everything works:

1. **Remove Local Database References**:

   ```env
   # Remove or comment out local database config
   # POSTGRES_USER=postgres
   # POSTGRES_PASSWORD=postgres
   # POSTGRES_DB=resume_plan_ai
   ```

2. **Stop Local PostgreSQL**:

   ```bash
   # Stop Docker containers if you were using them
   bun run docker:down

   # Or stop your local PostgreSQL service
   sudo systemctl stop postgresql  # Linux
   brew services stop postgresql   # macOS
   ```

3. **Update Documentation**:
   - Update your README.md with Supabase instructions
   - Update deployment guides to use Supabase connection strings

## Troubleshooting

### Connection Issues

If you can't connect to Supabase:

- Double-check your connection string format
- Ensure your IP is not blocked (Supabase allows all IPs by default)
- Verify your database password is correct

### Migration Errors

If the migration script fails:

- Check that both databases are accessible
- Ensure Prisma schema is deployed to Supabase first
- Look for constraint violations or duplicate data

### Performance Issues

If your app feels slower:

- Supabase is hosted, so there might be slight latency compared to local DB
- Consider enabling connection pooling
- Use Supabase's built-in caching features

## Rollback Plan

If you need to rollback to local PostgreSQL:

1. Restore your original `.env` file
2. Start your local PostgreSQL service
3. Run your application with the local database

Your local data remains untouched during the migration process.

## Support

- 📚 [Supabase Documentation](https://supabase.com/docs)
- 🔧 [Prisma with Supabase Guide](https://supabase.com/docs/guides/integrations/prisma)
- 💬 [Supabase Community](https://github.com/supabase/supabase/discussions)

## Next Steps

After successful migration, consider:

- Setting up Supabase Auth for enhanced authentication
- Implementing real-time features for collaborative resume editing
- Using Supabase Storage for file uploads (profile pictures, resume PDFs)
- Setting up Row Level Security for multi-tenant data isolation
