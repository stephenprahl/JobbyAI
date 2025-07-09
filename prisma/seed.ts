import { PrismaClient, SkillLevel } from '../node_modules/.prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

const { hash } = bcrypt;
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.userResume.deleteMany();
  await prisma.resumeTemplate.deleteMany();
  await prisma.jobListing.deleteMany();
  await prisma.certification.deleteMany();
  await prisma.education.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.userSkill.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();

  // Hash passwords
  const password = await hash('password123', 12);
  const adminPassword = await hash('admin123', 12);

  // Create admin user
  console.log('Creating admin user...');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      passwordHash: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isActive: true,
      emailVerified: true,
      lastLoginAt: new Date(),
      profile: {
        create: {
          headline: 'System Administrator',
          summary: 'Responsible for system administration and user management',
          location: 'Remote',
          websiteUrl: 'https://resume-plan-ai.com',
          linkedinUrl: 'https://linkedin.com/in/admin',
          githubUrl: 'https://github.com/admin',
        },
      },
    },
  });

  // Create regular user
  console.log('Creating regular user...');
  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      passwordHash: password,
      firstName: 'John',
      lastName: 'Doe',
      role: 'USER',
      profile: {
        create: {
          headline: 'Senior Software Engineer',
          summary: 'Experienced full-stack developer with a passion for creating efficient and scalable applications.',
          location: 'San Francisco, CA',
          websiteUrl: 'https://johndoe.dev',
          linkedinUrl: 'https://linkedin.com/in/johndoe',
          githubUrl: 'https://github.com/johndoe',
        },
      },
    },
  });

  // Create skills
  console.log('Creating skills...');
  const skills = await Promise.all([
    prisma.skill.create({ data: { name: 'JavaScript' } }),
    prisma.skill.create({ data: { name: 'TypeScript' } }),
    prisma.skill.create({ data: { name: 'Node.js' } }),
    prisma.skill.create({ data: { name: 'React' } }),
    prisma.skill.create({ data: { name: 'PostgreSQL' } }),
    prisma.skill.create({ data: { name: 'Docker' } }),
    prisma.skill.create({ data: { name: 'AWS' } }),
    prisma.skill.create({ data: { name: 'GraphQL' } }),
  ]);

  // Add skills to users
  console.log('Adding skills to users...');
  await Promise.all([
    // Admin skills
    prisma.userSkill.create({
      data: {
        userId: admin.id,
        skillId: skills[0].id, // JavaScript
        level: 'EXPERT',
        yearsOfExperience: 8,
      },
    }),
    prisma.userSkill.create({
      data: {
        userId: admin.id,
        skillId: skills[2].id, // Node.js
        level: 'EXPERT',
        yearsOfExperience: 7,
      },
    }),

    // User skills
    ...skills.map((skill, index) =>
      prisma.userSkill.create({
        data: {
          userId: user.id,
          skillId: skill.id,
          level: [SkillLevel.ADVANCED, SkillLevel.EXPERT, SkillLevel.INTERMEDIATE][index % 3],
          yearsOfExperience: [3, 5, 4, 6, 4, 2, 3, 1][index],
        },
      })
    ),
  ]);

  // Create experiences for user
  console.log('Creating experiences...');
  await prisma.experience.create({
    data: {
      userId: user.id,
      title: 'Senior Software Engineer',
      companyName: 'Tech Corp Inc.',
      location: 'San Francisco, CA',
      startDate: new Date('2020-01-15'),
      current: true,
      description: 'Led a team of developers in building scalable microservices. Improved system performance by 40%.',
    },
  });

  await prisma.experience.create({
    data: {
      userId: user.id,
      title: 'Software Engineer',
      companyName: 'Web Solutions LLC',
      location: 'New York, NY',
      startDate: new Date('2017-06-01'),
      endDate: new Date('2019-12-31'),
      description: 'Developed and maintained web applications using React and Node.js.',
    },
  });

  // Create education
  console.log('Creating education...');
  await prisma.education.create({
    data: {
      userId: user.id,
      institution: 'Stanford University',
      degree: 'Master of Science',
      fieldOfStudy: 'Computer Science',
      startDate: new Date('2015-09-01'),
      endDate: new Date('2017-05-30'),
      gpa: 3.8,
      description: 'Specialized in Machine Learning and Distributed Systems',
    },
  });

  // Create job listings
  console.log('Creating job listings...');
  await prisma.jobListing.create({
    data: {
      userId: user.id,
      title: 'Senior Full Stack Developer',
      companyName: 'InnovateTech',
      location: 'Remote',
      description: 'Looking for an experienced full-stack developer to join our team.',
      requirements: ['5+ years of experience', 'Proficiency in TypeScript', 'Experience with React and Node.js'],
      employmentType: 'FULL_TIME',
      source: 'LinkedIn',
      url: 'https://linkedin.com/jobs/view/123456',
      applied: true,
      applicationDate: new Date('2023-10-15'),
      status: 'Interview Scheduled',
      notes: 'Technical interview scheduled for next week',
    },
  });

  // Create resume templates
  console.log('Creating resume templates...');
  const template = await prisma.resumeTemplate.create({
    data: {
      name: 'Professional',
      description: 'Clean and professional resume template',
      templateHtml: `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Professional Resume</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            h1 { color: #2c3e50; }
            .section { margin-bottom: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>{{name}}</h1>
            <p>{{headline}}</p>
            <p>{{email}} | {{phone}} | {{location}}</p>
          </div>
          <div class="section">
            <h2>Summary</h2>
            <p>{{summary}}</p>
          </div>
          <!-- More sections will be dynamically added -->
        </body>
        </html>
      `,
      templateCss: `
        body { max-width: 800px; margin: 0 auto; padding: 20px; }
        .section { margin-bottom: 25px; }
        h2 { color: #3498db; border-bottom: 2px solid #3498db; padding-bottom: 5px; }
        .experience-item, .education-item { margin-bottom: 15px; }
      `,
      isPublic: true,
      createdById: admin.id,
    },
  });

  // Create a sample resume for the user
  console.log('Creating sample resume...');
  await prisma.userResume.create({
    data: {
      userId: user.id,
      templateId: template.id,
      title: 'Professional Resume',
      content: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: '(123) 456-7890',
        location: 'San Francisco, CA',
        headline: 'Senior Software Engineer',
        summary: 'Experienced full-stack developer with a passion for creating efficient and scalable applications.',
        experiences: [
          {
            title: 'Senior Software Engineer',
            company: 'Tech Corp Inc.',
            location: 'San Francisco, CA',
            startDate: '2020-01',
            current: true,
            description: 'Led a team of developers in building scalable microservices.',
          },
        ],
        education: [
          {
            institution: 'Stanford University',
            degree: 'M.S. Computer Science',
            fieldOfStudy: 'Machine Learning',
            startDate: '2015-09',
            endDate: '2017-05',
          },
        ],
        skills: skills.map(skill => skill.name).slice(0, 5),
      },
      isPublic: false,
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
