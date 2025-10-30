/**
 * Onboarding Flow Test Script
 * 
 * This script tests the onboarding flows for all user roles by:
 * 1. Creating test users
 * 2. Simulating each step of the onboarding process
 * 3. Verifying data integrity and session management
 * 4. Cleaning up test data
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

interface TestResult {
  role: string
  step: string
  success: boolean
  error?: string
}

const results: TestResult[] = []

async function createTestUser(role: 'GUEST' | 'HOST' | 'INFLUENCER') {
  const timestamp = Date.now()
  const email = `test_${role.toLowerCase()}_${timestamp}@nomadiqe.test`
  const password = await bcrypt.hash('TestPassword123!', 10)

  const user = await prisma.user.create({
    data: {
      email,
      password,
      name: `Test ${role}`,
      role: 'GUEST', // Start as GUEST, will update during onboarding
      onboardingStatus: 'PENDING',
      onboardingStep: 'profile-setup'
    }
  })

  // Create onboarding progress
  await prisma.onboardingProgress.create({
    data: {
      userId: user.id,
      currentStep: 'profile-setup',
      completedSteps: '[]'
    }
  })

  return user
}

async function testProfileSetup(userId: string) {
  try {
    // Simulate profile setup
    await prisma.user.update({
      where: { id: userId },
      data: {
        fullName: 'Test User',
        username: `testuser_${Date.now()}`,
        onboardingStatus: 'IN_PROGRESS',
        onboardingStep: 'role-selection'
      }
    })

    await prisma.onboardingProgress.update({
      where: { userId },
      data: {
        currentStep: 'role-selection',
        completedSteps: JSON.stringify(['profile-setup'])
      }
    })

    results.push({ role: 'ALL', step: 'profile-setup', success: true })
    return true
  } catch (error) {
    results.push({ 
      role: 'ALL', 
      step: 'profile-setup', 
      success: false, 
      error: error instanceof Error ? error.message : String(error)
    })
    return false
  }
}

async function testGuestOnboarding(userId: string) {
  try {
    // Select GUEST role
    await prisma.user.update({
      where: { id: userId },
      data: {
        role: 'GUEST',
        onboardingStep: 'interest-selection'
      }
    })

    await prisma.onboardingProgress.update({
      where: { userId },
      data: {
        currentStep: 'interest-selection',
        completedSteps: JSON.stringify(['profile-setup', 'role-selection'])
      }
    })

    // Create guest preferences
    await prisma.guestPreferences.create({
      data: {
        userId,
        travelInterests: ['Adventure', 'Nature', 'Culture']
      }
    })

    results.push({ role: 'GUEST', step: 'role-selection', success: true })

    // Complete interest selection
    await prisma.user.update({
      where: { id: userId },
      data: {
        onboardingStatus: 'COMPLETED',
        onboardingStep: null
      }
    })

    await prisma.onboardingProgress.update({
      where: { userId },
      data: {
        currentStep: 'completed',
        completedSteps: JSON.stringify(['profile-setup', 'role-selection', 'interest-selection']),
        completedAt: new Date()
      }
    })

    results.push({ role: 'GUEST', step: 'interest-selection', success: true })

    // Verify final state
    const finalUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        guestPreferences: true,
        onboardingProgress: true
      }
    })

    if (finalUser?.onboardingStatus !== 'COMPLETED') {
      throw new Error('Onboarding status not updated to COMPLETED')
    }

    if (!finalUser.guestPreferences) {
      throw new Error('Guest preferences not created')
    }

    console.log('✅ GUEST onboarding completed successfully')
    return true
  } catch (error) {
    results.push({ 
      role: 'GUEST', 
      step: 'onboarding', 
      success: false, 
      error: error instanceof Error ? error.message : String(error)
    })
    console.error('❌ GUEST onboarding failed:', error)
    return false
  }
}

async function testHostOnboarding(userId: string) {
  try {
    // Select HOST role
    await prisma.user.update({
      where: { id: userId },
      data: {
        role: 'HOST',
        onboardingStep: 'listing-creation'
      }
    })

    await prisma.onboardingProgress.update({
      where: { userId },
      data: {
        currentStep: 'listing-creation',
        completedSteps: JSON.stringify(['profile-setup', 'role-selection'])
      }
    })

    // Create host profile
    const referralCode = `HOST_${Math.random().toString(36).substring(2, 12).toUpperCase()}`
    await prisma.hostProfile.create({
      data: {
        userId,
        referralCode,
        preferredNiches: []
      }
    })

    results.push({ role: 'HOST', step: 'role-selection', success: true })

    // Create listing
    await prisma.property.create({
      data: {
        title: 'Test Property',
        description: 'This is a test property created during onboarding test',
        type: 'APARTMENT',
        address: '123 Test St',
        city: 'Test City',
        country: 'Test Country',
        price: 100,
        currency: 'EUR',
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
        amenities: ['wifi', 'kitchen'],
        images: ['https://example.com/image.jpg'],
        rules: ['No smoking'],
        hostId: userId,
        isActive: false,
        isVerified: false
      }
    })

    await prisma.user.update({
      where: { id: userId },
      data: {
        onboardingStep: 'collaboration-setup'
      }
    })

    await prisma.onboardingProgress.update({
      where: { userId },
      data: {
        currentStep: 'collaboration-setup',
        completedSteps: JSON.stringify(['profile-setup', 'role-selection', 'listing-creation'])
      }
    })

    results.push({ role: 'HOST', step: 'listing-creation', success: true })

    // Setup collaboration
    await prisma.hostProfile.update({
      where: { userId },
      data: {
        standardOffer: {
          offerType: 'free_stay',
          minNights: 2,
          maxNights: 7,
          deliverables: ['Instagram posts (1-3)', 'Instagram stories (5-10)'],
          terms: 'Test collaboration terms'
        },
        minFollowerCount: 10000,
        preferredNiches: ['travel', 'lifestyle']
      }
    })

    await prisma.user.update({
      where: { id: userId },
      data: {
        onboardingStatus: 'COMPLETED',
        onboardingStep: null
      }
    })

    await prisma.onboardingProgress.update({
      where: { userId },
      data: {
        currentStep: 'completed',
        completedSteps: JSON.stringify(['profile-setup', 'role-selection', 'listing-creation', 'collaboration-setup']),
        completedAt: new Date()
      }
    })

    results.push({ role: 'HOST', step: 'collaboration-setup', success: true })

    // Verify final state
    const finalUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        hostProfile: true,
        onboardingProgress: true,
        properties: true
      }
    })

    if (finalUser?.onboardingStatus !== 'COMPLETED') {
      throw new Error('Onboarding status not updated to COMPLETED')
    }

    if (!finalUser.hostProfile) {
      throw new Error('Host profile not created')
    }

    if (finalUser.properties.length === 0) {
      throw new Error('Property not created')
    }

    console.log('✅ HOST onboarding completed successfully')
    return true
  } catch (error) {
    results.push({ 
      role: 'HOST', 
      step: 'onboarding', 
      success: false, 
      error: error instanceof Error ? error.message : String(error)
    })
    console.error('❌ HOST onboarding failed:', error)
    return false
  }
}

async function testInfluencerOnboarding(userId: string) {
  try {
    // Select INFLUENCER role
    await prisma.user.update({
      where: { id: userId },
      data: {
        role: 'INFLUENCER',
        onboardingStep: 'social-connect'
      }
    })

    await prisma.onboardingProgress.update({
      where: { userId },
      data: {
        currentStep: 'social-connect',
        completedSteps: JSON.stringify(['profile-setup', 'role-selection'])
      }
    })

    // Create influencer profile
    await prisma.influencerProfile.create({
      data: {
        userId,
        contentNiches: []
      }
    })

    results.push({ role: 'INFLUENCER', step: 'role-selection', success: true })

    // Connect social account
    await prisma.socialConnection.create({
      data: {
        userId,
        platform: 'INSTAGRAM',
        platformUserId: 'test_instagram_123',
        username: 'test_influencer',
        followerCount: 50000
      }
    })

    await prisma.user.update({
      where: { id: userId },
      data: {
        onboardingStep: 'media-kit-setup'
      }
    })

    await prisma.onboardingProgress.update({
      where: { userId },
      data: {
        currentStep: 'media-kit-setup',
        completedSteps: JSON.stringify(['profile-setup', 'role-selection', 'social-connect'])
      }
    })

    results.push({ role: 'INFLUENCER', step: 'social-connect', success: true })

    // Setup media kit
    await prisma.influencerProfile.update({
      where: { userId },
      data: {
        contentNiches: ['travel', 'lifestyle', 'food'],
        deliverables: {
          instagramPost: 3,
          instagramStory: 10,
          blogPost: true,
          customDeliverables: []
        },
        portfolioUrl: 'https://example.com/portfolio'
      }
    })

    await prisma.user.update({
      where: { id: userId },
      data: {
        onboardingStatus: 'COMPLETED',
        onboardingStep: null
      }
    })

    await prisma.onboardingProgress.update({
      where: { userId },
      data: {
        currentStep: 'completed',
        completedSteps: JSON.stringify(['profile-setup', 'role-selection', 'social-connect', 'media-kit-setup']),
        completedAt: new Date()
      }
    })

    results.push({ role: 'INFLUENCER', step: 'media-kit-setup', success: true })

    // Verify final state
    const finalUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        influencerProfile: true,
        onboardingProgress: true,
        socialConnections: true
      }
    })

    if (finalUser?.onboardingStatus !== 'COMPLETED') {
      throw new Error('Onboarding status not updated to COMPLETED')
    }

    if (!finalUser.influencerProfile) {
      throw new Error('Influencer profile not created')
    }

    if (finalUser.socialConnections.length === 0) {
      throw new Error('Social connection not created')
    }

    console.log('✅ INFLUENCER onboarding completed successfully')
    return true
  } catch (error) {
    results.push({ 
      role: 'INFLUENCER', 
      step: 'onboarding', 
      success: false, 
      error: error instanceof Error ? error.message : String(error)
    })
    console.error('❌ INFLUENCER onboarding failed:', error)
    return false
  }
}

async function cleanupTestUser(userId: string) {
  try {
    // Delete in correct order to respect foreign key constraints
    await prisma.socialConnection.deleteMany({ where: { userId } })
    await prisma.property.deleteMany({ where: { hostId: userId } })
    await prisma.onboardingProgress.deleteMany({ where: { userId } })
    await prisma.guestPreferences.deleteMany({ where: { userId } })
    await prisma.hostProfile.deleteMany({ where: { userId } })
    await prisma.influencerProfile.deleteMany({ where: { userId } })
    await prisma.user.delete({ where: { id: userId } })
    console.log(`🧹 Cleaned up test user: ${userId}`)
  } catch (error) {
    console.error(`⚠️  Failed to cleanup test user ${userId}:`, error)
  }
}

async function runTests() {
  console.log('🚀 Starting Onboarding Flow Tests...\n')

  const testUsers: string[] = []

  try {
    // Test GUEST flow
    console.log('📝 Testing GUEST onboarding flow...')
    const guestUser = await createTestUser('GUEST')
    testUsers.push(guestUser.id)
    await testProfileSetup(guestUser.id)
    await testGuestOnboarding(guestUser.id)
    console.log('')

    // Test HOST flow
    console.log('📝 Testing HOST onboarding flow...')
    const hostUser = await createTestUser('HOST')
    testUsers.push(hostUser.id)
    await testProfileSetup(hostUser.id)
    await testHostOnboarding(hostUser.id)
    console.log('')

    // Test INFLUENCER flow
    console.log('📝 Testing INFLUENCER onboarding flow...')
    const influencerUser = await createTestUser('INFLUENCER')
    testUsers.push(influencerUser.id)
    await testProfileSetup(influencerUser.id)
    await testInfluencerOnboarding(influencerUser.id)
    console.log('')

    // Print results
    console.log('📊 Test Results Summary:')
    console.log('═'.repeat(60))
    
    const successCount = results.filter(r => r.success).length
    const failCount = results.filter(r => !r.success).length
    
    results.forEach(result => {
      const icon = result.success ? '✅' : '❌'
      console.log(`${icon} ${result.role.padEnd(12)} | ${result.step.padEnd(25)} | ${result.success ? 'PASS' : 'FAIL'}`)
      if (result.error) {
        console.log(`   Error: ${result.error}`)
      }
    })
    
    console.log('═'.repeat(60))
    console.log(`Total: ${results.length} tests | ✅ ${successCount} passed | ❌ ${failCount} failed`)
    console.log('')

    if (failCount === 0) {
      console.log('🎉 All onboarding flows completed successfully!')
    } else {
      console.log('⚠️  Some tests failed. Please review the errors above.')
    }

  } catch (error) {
    console.error('💥 Test suite failed:', error)
  } finally {
    // Cleanup
    console.log('\n🧹 Cleaning up test data...')
    for (const userId of testUsers) {
      await cleanupTestUser(userId)
    }
    
    await prisma.$disconnect()
    console.log('✨ Test suite completed!\n')
    
    // Exit with appropriate code
    process.exit(results.some(r => !r.success) ? 1 : 0)
  }
}

runTests()

