#!/usr/bin/env bun

/**
 * Simple test script to verify Supabase integration is working
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testSupabaseIntegration() {
  try {
    console.log('🧪 Testing Supabase integration...')

    // Test 1: Check database connection
    console.log('\n1️⃣ Testing database connection...')
    const result = await prisma.$queryRaw`SELECT NOW() as current_time`
    console.log('✅ Database connection successful:', result)

    // Test 2: Check if data exists
    console.log('\n2️⃣ Testing data retrieval...')
    const userCount = await prisma.user.count()
    const skillCount = await prisma.skill.count()
    const templateCount = await prisma.resumeTemplate.count()

    console.log(`✅ Found ${userCount} users`)
    console.log(`✅ Found ${skillCount} skills`)
    console.log(`✅ Found ${templateCount} resume templates`)

    // Test 3: Test a simple write operation
    console.log('\n3️⃣ Testing write operation...')
    const testSkill = await prisma.skill.upsert({
      where: { name: 'Supabase Test' },
      update: {
        name: 'Supabase Test'
      },
      create: {
        name: 'Supabase Test'
      }
    })
    console.log('✅ Write operation successful:', testSkill.name)

    // Test 4: Test Supabase-specific features (extensions)
    console.log('\n4️⃣ Testing PostgreSQL extensions...')
    const extensions = await prisma.$queryRaw`SELECT extname FROM pg_extension WHERE extname IN ('pgcrypto', 'citext')`
    console.log('✅ Available extensions:', extensions)

    console.log('\n🎉 All tests passed! Supabase integration is working correctly.')

  } catch (error) {
    console.error('❌ Test failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testSupabaseIntegration()
