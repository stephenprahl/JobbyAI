import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function debug() {
  try {
    const users = await prisma.user.findMany({
      select: { email: true, passwordHash: true }
    });

    console.log('Users in database:');
    users.forEach(user => {
      console.log(`- ${user.email}: ${user.passwordHash.substring(0, 20)}...`);
    });

    // Test password verification
    const testUser = await prisma.user.findUnique({
      where: { email: 'admin@example.com' }
    });

    if (testUser) {
      console.log('\nTesting admin password:');
      const isValid = await bcrypt.compare('admin123', testUser.passwordHash);
      console.log(`Password 'admin123' is valid: ${isValid}`);
    }

    const testUser2 = await prisma.user.findUnique({
      where: { email: 'user@example.com' }
    });

    if (testUser2) {
      console.log('\nTesting user password:');
      const isValid = await bcrypt.compare('password123', testUser2.passwordHash);
      console.log(`Password 'password123' is valid: ${isValid}`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debug();
