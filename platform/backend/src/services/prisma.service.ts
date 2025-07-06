import { PrismaClient } from '@prisma/client/edge';

// Create a single PrismaClient instance
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error', 'warn'],
});

// Export connect and disconnect functions
export const connect = () => prisma.$connect();
export const disconnect = () => prisma.$disconnect();

// Export the PrismaClient instance as default
export default prisma;
