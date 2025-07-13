import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { PrismaClient, SkillLevel } from '../node_modules/.prisma/client';

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

  const templates = [
    {
      id: 'classic-professional',
      name: 'Classic Professional',
      description: 'Traditional corporate design with clean lines and professional typography',
      category: 'professional'
    },
    {
      id: 'modern-professional',
      name: 'Modern Professional',
      description: 'Contemporary professional design with subtle color accents',
      category: 'professional'
    },
    {
      id: 'executive-modern',
      name: 'Executive Modern',
      description: 'Sleek professional design for modern executives',
      category: 'professional'
    },
    {
      id: 'creative-designer',
      name: 'Creative Designer',
      description: 'Bold and creative layout perfect for design professionals',
      category: 'creative'
    },
    {
      id: 'creative-marketing',
      name: 'Creative Marketing',
      description: 'Dynamic layout for marketing and creative professionals',
      category: 'creative'
    },
    {
      id: 'creative-media',
      name: 'Creative Media',
      description: 'Vibrant design for media and entertainment professionals',
      category: 'creative'
    },
    {
      id: 'creative-arts',
      name: 'Creative Arts',
      description: 'Artistic layout for creative arts professionals',
      category: 'creative'
    },
    {
      id: 'minimal-clean',
      name: 'Minimal Clean',
      description: 'Ultra-clean design focusing on content with minimal distractions',
      category: 'minimal'
    },
    {
      id: 'minimal-modern',
      name: 'Minimal Modern',
      description: 'Contemporary minimal design with strategic use of space',
      category: 'minimal'
    },
    {
      id: 'minimal-elegant',
      name: 'Minimal Elegant',
      description: 'Sophisticated minimal design with elegant typography',
      category: 'minimal'
    },
    {
      id: 'executive-senior',
      name: 'Executive Senior',
      description: 'Sophisticated design for senior leadership positions',
      category: 'executive'
    },
    {
      id: 'executive-corporate',
      name: 'Executive Corporate',
      description: 'Premium corporate design for high-level positions',
      category: 'executive'
    },
    {
      id: 'tech-developer',
      name: 'Tech Developer',
      description: 'Code-friendly design optimized for software developers',
      category: 'tech'
    },
    {
      id: 'tech-engineer',
      name: 'Tech Engineer',
      description: 'Engineering-focused design for technical professionals',
      category: 'tech'
    },
    {
      id: 'tech-data',
      name: 'Tech Data Science',
      description: 'Data-focused design for data scientists and analysts',
      category: 'tech'
    },
    {
      id: 'academic-researcher',
      name: 'Academic Researcher',
      description: 'Research-focused design for academic professionals',
      category: 'academic'
    },
    {
      id: 'academic-professor',
      name: 'Academic Professor',
      description: 'Comprehensive academic design for faculty positions',
      category: 'academic'
    },
    {
      id: 'healthcare-medical',
      name: 'Healthcare Medical',
      description: 'Professional medical design for healthcare professionals',
      category: 'healthcare'
    },
    {
      id: 'healthcare-wellness',
      name: 'Healthcare Wellness',
      description: 'Wellness-focused design for health and wellness professionals',
      category: 'healthcare'
    },
    {
      id: 'sales-professional',
      name: 'Sales Professional',
      description: 'Results-driven design for sales professionals',
      category: 'sales'
    },
    {
      id: 'sales-executive',
      name: 'Sales Executive',
      description: 'Executive sales design for senior sales leadership',
      category: 'sales'
    },
    {
      id: 'education-teacher',
      name: 'Education Teacher',
      description: 'Educational design for teachers and educators',
      category: 'education'
    },
    {
      id: 'education-administration',
      name: 'Education Administration',
      description: 'Administrative design for education leadership',
      category: 'education'
    }
  ];

  const createdTemplates: any[] = [];

  for (const templateData of templates) {
    const template = await prisma.resumeTemplate.create({
      data: {
        id: templateData.id,
        name: templateData.name,
        description: templateData.description,
        templateHtml: `
          <!DOCTYPE html>
          <html>
          <head>
            <title>${templateData.name} Resume</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; }
              .container { max-width: 800px; margin: 0 auto; }
              h1 { color: #2c3e50; margin-bottom: 10px; }
              h2 { color: #3498db; border-bottom: 2px solid #3498db; padding-bottom: 5px; margin-top: 25px; }
              .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #eee; }
              .section { margin-bottom: 25px; }
              .contact-info { margin: 10px 0; color: #666; }
              .experience-item, .education-item { margin-bottom: 15px; padding-left: 15px; border-left: 3px solid #3498db; }
              .job-title { font-weight: bold; color: #2c3e50; }
              .company { color: #666; font-style: italic; }
              .date { color: #888; font-size: 0.9em; }
              .skills { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; }
              .skill { background: #f0f0f0; padding: 5px 10px; border-radius: 15px; font-size: 0.9em; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>{{fullName}}</h1>
                <div class="contact-info">{{email}} | {{phone}} | {{location}}</div>
                {{#if headline}}<p>{{headline}}</p>{{/if}}
              </div>

              {{#if summary}}
              <div class="section">
                <h2>Professional Summary</h2>
                <p>{{summary}}</p>
              </div>
              {{/if}}

              {{#if experiences}}
              <div class="section">
                <h2>Work Experience</h2>
                {{#each experiences}}
                <div class="experience-item">
                  <div class="job-title">{{title}}</div>
                  <div class="company">{{company}} - {{location}}</div>
                  <div class="date">{{startDate}} - {{#if current}}Present{{else}}{{endDate}}{{/if}}</div>
                  {{#if description}}<p>{{description}}</p>{{/if}}
                </div>
                {{/each}}
              </div>
              {{/if}}

              {{#if education}}
              <div class="section">
                <h2>Education</h2>
                {{#each education}}
                <div class="education-item">
                  <div class="job-title">{{degree}}{{#if fieldOfStudy}} in {{fieldOfStudy}}{{/if}}</div>
                  <div class="company">{{institution}}</div>
                  <div class="date">{{startDate}} - {{endDate}}</div>
                </div>
                {{/each}}
              </div>
              {{/if}}

              {{#if skills}}
              <div class="section">
                <h2>Skills</h2>
                <div class="skills">
                  {{#each skills}}
                  <span class="skill">{{this}}</span>
                  {{/each}}
                </div>
              </div>
              {{/if}}
            </div>
          </body>
          </html>
        `,
        templateCss: `
          /* ${templateData.category} theme styles */
          .container { max-width: 800px; margin: 0 auto; padding: 20px; }
          .section { margin-bottom: 25px; }
          h2 { color: #3498db; border-bottom: 2px solid #3498db; padding-bottom: 5px; }
          .experience-item, .education-item { margin-bottom: 15px; }
        `,
        isPublic: true,
        createdById: admin.id,
      },
    });
    createdTemplates.push(template);
  }

  // Get the classic professional template for the sample resume
  const classicTemplate = createdTemplates.find(t => t.id === 'classic-professional');

  // Create a sample resume for the user
  console.log('Creating sample resume...');
  await prisma.userResume.create({
    data: {
      userId: user.id,
      templateId: classicTemplate?.id || createdTemplates[0].id,
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
