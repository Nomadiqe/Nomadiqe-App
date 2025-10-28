import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkUserStatus() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        onboardingStatus: true,
        onboardingStep: true
      }
    })

    console.log('\nAll users:')
    console.log(JSON.stringify(users, null, 2))

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUserStatus()
