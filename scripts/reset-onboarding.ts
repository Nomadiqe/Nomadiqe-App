import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function resetOnboarding(userId: string) {
  try {
    // Update user to reset onboarding
    await prisma.user.update({
      where: { id: userId },
      data: {
        onboardingStatus: 'PENDING',
        onboardingStep: 'role-selection',
        role: 'GUEST', // Reset to default
      },
    })

    console.log('✅ Onboarding reset successfully for user:', userId)
  } catch (error) {
    console.error('❌ Error resetting onboarding:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Get user ID from command line argument
const userId = process.argv[2]

if (!userId) {
  console.error('Please provide a user ID as argument')
  console.error('Usage: npx tsx scripts/reset-onboarding.ts <user-id>')
  process.exit(1)
}

resetOnboarding(userId)
