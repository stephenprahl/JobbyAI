import prisma from '../services/prisma.service';

export const prismaContext = {
  prisma,
};

export type PrismaContext = typeof prismaContext;
