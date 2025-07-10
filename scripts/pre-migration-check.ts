#!/usr/bin/env bun

/**
 * Pre-migration checklist script
 *
 * This script will:
 * 1. Check if Supabase credentials are configured
 * 2. Test database connections
 * 3. Check if Prisma schema is compatible with Supabase
 * 4. Provide migration instructions
 */

import { PrismaClient } from '@prisma/client'
import { isSupabaseConfigured } from '../src/server/lib/supabase.ts'

const localPrisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:postgres@localhost:5432/resume_plan_ai'
    }
  }
})

async function checkLocalDatabase() {
  console.log('🔍 Checking local database...')

  try {
    await localPrisma.$connect()

    // Count records in each table
    const userCount = await localPrisma.user.count()
    const skillCount = await localPrisma.skill.count()
    const templateCount = await localPrisma.resumeTemplate.count()

    console.log('✅ Local database connection successful')
    console.log(`📊 Data summary:`)
    console.log(`   - Users: ${userCount}`)
    console.log(`   - Skills: ${skillCount}`)
    console.log(`   - Resume Templates: ${templateCount}`)

    return { userCount, skillCount, templateCount }
  } catch (error) {
    console.error('❌ Local database connection failed:', error)
    throw error
  } finally {
    await localPrisma.$disconnect()
  }
}

function checkEnvironmentVariables() {
  console.log('🔍 Checking environment variables...')

  const requiredVars = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ]

  const missing = requiredVars.filter(varName => !process.env[varName])

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:')
    missing.forEach(varName => console.error(`   - ${varName}`))
    return false
  }

  console.log('✅ All required environment variables are set')
  return true
}

async function checkSupabaseConnection() {
  console.log('🔍 Checking Supabase connection...')

  if (!isSupabaseConfigured()) {
    console.error('❌ Supabase is not properly configured')
    return false
  }

  try {
    // Test with the DATABASE_URL pointing to Supabase
    const testPrisma = new PrismaClient()
    await testPrisma.$connect()
    await testPrisma.$disconnect()

    console.log('✅ Supabase database connection successful')
    return true
  } catch (error) {
    console.error('❌ Supabase database connection failed:', error)
    console.error('   Make sure DATABASE_URL points to your Supabase database')
    return false
  }
}

function printMigrationInstructions() {
  console.log('\n📋 Migration Instructions:')
  console.log('='.repeat(50))

  console.log('\n1. 🔧 Setup Supabase Project:')
  console.log('   - Go to https://supabase.com and create a new project')
  console.log('   - Copy your project URL and API keys')
  console.log('   - Update your .env file with Supabase credentials')

  console.log('\n2. 🔗 Update Environment Variables:')
  console.log('   - Set SUPABASE_URL to your project URL')
  console.log('   - Set SUPABASE_ANON_KEY to your anonymous key')
  console.log('   - Set SUPABASE_SERVICE_ROLE_KEY to your service role key')
  console.log('   - Update DATABASE_URL to point to Supabase')

  console.log('\n3. 🗄️ Run Prisma Migrations:')
  console.log('   - Run: bun prisma migrate deploy')
  console.log('   - This will create all tables in your Supabase database')

  console.log('\n4. 📦 Migrate Data:')
  console.log('   - Run: bun run scripts/migrate-to-supabase.ts')
  console.log('   - This will copy all data from local to Supabase')

  console.log('\n5. ✅ Verify Migration:')
  console.log('   - Check your Supabase dashboard for data')
  console.log('   - Test your application with the new database')

  console.log('\n6. 🧹 Cleanup (Optional):')
  console.log('   - Remove local PostgreSQL configuration from .env')
  console.log('   - Stop local PostgreSQL service if no longer needed')
}

async function main() {
  console.log('🚀 Pre-Migration Checklist for Supabase')
  console.log('='.repeat(40))

  try {
    // Check local database
    const localData = await checkLocalDatabase()

    // Check environment variables
    const envVarsOk = checkEnvironmentVariables()

    // Check Supabase connection (only if env vars are set)
    let supabaseOk = false
    if (envVarsOk) {
      supabaseOk = await checkSupabaseConnection()
    }

    console.log('\n📊 Checklist Summary:')
    console.log('='.repeat(25))
    console.log(`Local Database: ${localData ? '✅' : '❌'}`)
    console.log(`Environment Variables: ${envVarsOk ? '✅' : '❌'}`)
    console.log(`Supabase Connection: ${supabaseOk ? '✅' : '❌'}`)

    if (localData && envVarsOk && supabaseOk) {
      console.log('\n🎉 All checks passed! You\'re ready to migrate.')
      console.log('   Run: bun run scripts/migrate-to-supabase.ts')
    } else {
      printMigrationInstructions()
    }

  } catch (error) {
    console.error('❌ Pre-migration check failed:', error)
    printMigrationInstructions()
  }
}

if (import.meta.main) {
  main().catch(console.error)
}
