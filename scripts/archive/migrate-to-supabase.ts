#!/usr/bin/env bun

/**
 * Migration script to move data from local PostgreSQL to Supabase
 *
 * This script will:
 * 1. Export data from your local database
 * 2. Import it into your Supabase database
 *
 * Make sure to:
 * 1. Update your .env file with Supabase credentials
 * 2. Run Prisma migrations against Supabase first
 * 3. Update DATABASE_URL to point to Supabase
 */

import { PrismaClient } from '@prisma/client'

// Local database connection
const localPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.LOCAL_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/resume_plan_ai'
    }
  }
})

// Supabase database connection (will use DATABASE_URL from .env)
const supabasePrisma = new PrismaClient()

async function migrateData() {
  try {
    console.log('🚀 Starting migration from local PostgreSQL to Supabase...')

    // 1. Export users
    console.log('📦 Exporting users...')
    const users = await localPrisma.user.findMany({
      include: {
        profile: true,
        skills: {
          include: {
            skill: true
          }
        },
        experiences: true,
        education: true,
        certifications: true,
        jobListings: true,
        resumes: true,
        resetTokens: true,
        verificationTokens: true
      }
    })
    console.log(`Found ${users.length} users`)

    // 2. Export skills
    console.log('📦 Exporting skills...')
    const skills = await localPrisma.skill.findMany()
    console.log(`Found ${skills.length} skills`)

    // 3. Export resume templates
    console.log('📦 Exporting resume templates...')
    const templates = await localPrisma.resumeTemplate.findMany()
    console.log(`Found ${templates.length} resume templates`)

    // 4. Import skills first (referenced by users)
    console.log('📥 Importing skills to Supabase...')
    for (const skill of skills) {
      await supabasePrisma.skill.upsert({
        where: { id: skill.id },
        update: {},
        create: skill
      })
    }

    // 5. Import resume templates
    console.log('📥 Importing resume templates to Supabase...')
    for (const template of templates) {
      await supabasePrisma.resumeTemplate.upsert({
        where: { id: template.id },
        update: {},
        create: template
      })
    }

    // 6. Import users and related data
    console.log('📥 Importing users to Supabase...')
    for (const user of users) {
      // Create user
      await supabasePrisma.user.upsert({
        where: { id: user.id },
        update: {},
        create: {
          id: user.id,
          email: user.email,
          passwordHash: user.passwordHash,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          lastLoginAt: user.lastLoginAt,
          isActive: user.isActive,
          emailVerified: user.emailVerified
        }
      })

      // Create user profile
      if (user.profile) {
        await supabasePrisma.userProfile.upsert({
          where: { userId: user.id },
          update: {},
          create: user.profile
        })
      }

      // Create user skills
      for (const userSkill of user.skills) {
        await supabasePrisma.userSkill.upsert({
          where: {
            userId_skillId: {
              userId: userSkill.userId,
              skillId: userSkill.skillId
            }
          },
          update: {},
          create: {
            userId: userSkill.userId,
            skillId: userSkill.skillId,
            level: userSkill.level,
            yearsOfExperience: userSkill.yearsOfExperience,
            createdAt: userSkill.createdAt,
            updatedAt: userSkill.updatedAt
          }
        })
      }

      // Create experiences
      for (const experience of user.experiences) {
        await supabasePrisma.experience.upsert({
          where: { id: experience.id },
          update: {},
          create: experience
        })
      }

      // Create education
      for (const education of user.education) {
        await supabasePrisma.education.upsert({
          where: { id: education.id },
          update: {},
          create: education
        })
      }

      // Create certifications
      for (const certification of user.certifications) {
        await supabasePrisma.certification.upsert({
          where: { id: certification.id },
          update: {},
          create: certification
        })
      }

      // Create job listings
      for (const jobListing of user.jobListings) {
        await supabasePrisma.jobListing.upsert({
          where: { id: jobListing.id },
          update: {},
          create: jobListing
        })
      }

      // Create resumes
      for (const resume of user.resumes) {
        await supabasePrisma.userResume.upsert({
          where: { id: resume.id },
          update: {},
          create: {
            ...resume,
            content: resume.content as any
          }
        })
      }

      // Create verification tokens
      for (const token of user.verificationTokens) {
        await supabasePrisma.verificationToken.upsert({
          where: { id: token.id },
          update: {},
          create: token
        })
      }

      // Create password reset tokens
      for (const token of user.resetTokens) {
        await supabasePrisma.passwordResetToken.upsert({
          where: { id: token.id },
          update: {},
          create: token
        })
      }

      console.log(`✅ Migrated user: ${user.email}`)
    }

    console.log('🎉 Migration completed successfully!')

  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    await localPrisma.$disconnect()
    await supabasePrisma.$disconnect()
  }
}

// Verify database connections
async function verifyConnections() {
  console.log('🔍 Verifying database connections...')

  try {
    await localPrisma.$connect()
    console.log('✅ Local database connection successful')
  } catch (error) {
    console.error('❌ Local database connection failed:', error)
    throw error
  }

  try {
    await supabasePrisma.$connect()
    console.log('✅ Supabase database connection successful')
  } catch (error) {
    console.error('❌ Supabase database connection failed:', error)
    throw error
  }
}

// Main execution
async function main() {
  await verifyConnections()
  await migrateData()
}

if (import.meta.main) {
  main().catch(console.error)
}
