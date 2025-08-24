// Conditional import to handle build-time scenarios
let PrismaClient: any
let prisma: any

try {
  // Try to import PrismaClient
  const prismaModule = require('@prisma/client')
  PrismaClient = prismaModule.PrismaClient
  
  const globalForPrisma = globalThis as unknown as {
    prisma: any | undefined
  }

  prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
} catch (error) {
  console.warn('Prisma client not available during build time:', error)
  // Create a mock client for build time
  prisma = {}
}

// Export a type for use in other files
export type PrismaClientType = typeof prisma

// Export a function to get prisma client safely
export function getPrismaClient() {
  return prisma
}

// Export a function to check if prisma is available
export function isPrismaAvailable() {
  try {
    return !!prisma && typeof prisma === 'object' && Object.keys(prisma).length > 0
  } catch {
    return false
  }
}

export { prisma }
