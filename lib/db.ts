import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Export a type for use in other files
export type PrismaClientType = typeof prisma

// Export a function to get prisma client safely
export function getPrismaClient() {
  return prisma
}

// Export a function to check if prisma is available
export function isPrismaAvailable() {
  try {
    return !!prisma
  } catch {
    return false
  }
}
