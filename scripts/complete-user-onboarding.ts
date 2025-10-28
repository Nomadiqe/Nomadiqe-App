import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function completeUserOnboarding() {
  try {
    // Update the user with IN_PROGRESS status to COMPLETED
    const result = await prisma.user.update({
      where: {
        email: 'matteolorso@gmail.com'
      },
      data: {
        onboardingStatus: 'COMPLETED',
        onboardingStep: null
      }
    })

    console.log('Updated user:', JSON.stringify(result, null, 2))

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

completeUserOnboarding()
