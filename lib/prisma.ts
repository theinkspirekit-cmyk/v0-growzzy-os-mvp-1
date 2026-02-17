
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    },
    // log: ['query', 'error', 'warn'], // Uncomment for debugging
  })
}

const globalForPrisma = global as unknown as { prisma: ReturnType<typeof prismaClientSingleton> }

export const prisma = globalForPrisma.prisma || prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
