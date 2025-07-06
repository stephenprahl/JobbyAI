import { prismaService } from '../services/prisma.service';

export const prismaContext = {
  prisma: prismaService.getClient(),
};

export type PrismaContext = typeof prismaContext;
