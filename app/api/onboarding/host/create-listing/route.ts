import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { geocodingService } from '@/lib/geocoding'
import { z } from 'zod'

const listingSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  location: z.object({
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    country: z.string().min(1, 'Country is required'),
    latitude: z.number().optional(),
    longitude: z.number().optional()
  }),
  propertyType: z.enum(['APARTMENT', 'HOUSE', 'VILLA', 'BNB', 'HOTEL', 'HOSTEL', 'CABIN', 'TENT', 'OTHER']),
  maxGuests: z.number().min(1, 'Must accommodate at least 1 guest').max(50),
  bedrooms: z.number().min(1, 'Must have at least 1 bedroom').max(20),
  bathrooms: z.number().min(1, 'Must have at least 1 bathroom').max(20),
  amenities: z.object({
    wifi: z.boolean().default(false),
    airConditioning: z.boolean().default(false),
    heating: z.boolean().default(false),
    tv: z.boolean().default(false),
    kitchen: z.boolean().default(false),
    washingMachine: z.boolean().default(false),
    dryer: z.boolean().default(false),
    refrigerator: z.boolean().default(false),
    dishwasher: z.boolean().default(false),
    coffeeMachine: z.boolean().default(false),
    balcony: z.boolean().default(false),
    seaView: z.boolean().default(false),
    pool: z.boolean().default(false),
    jacuzzi: z.boolean().default(false),
    gym: z.boolean().default(false),
    fireplace: z.boolean().default(false),
    workspace: z.boolean().default(false),
    towels: z.boolean().default(false),
    shampoo: z.boolean().default(false),
    toiletPaper: z.boolean().default(false),
    hairDryer: z.boolean().default(false),
    iron: z.boolean().default(false),
    crib: z.boolean().default(false),
    highChair: z.boolean().default(false),
    toys: z.boolean().default(false),
    elevator: z.boolean().default(false),
    wheelchairAccessible: z.boolean().default(false),
    parking: z.boolean().default(false),
    privateEntrance: z.boolean().default(false),
    smokeDetector: z.boolean().default(false),
    carbonMonoxide: z.boolean().default(false),
    fireExtinguisher: z.boolean().default(false),
    firstAidKit: z.boolean().default(false),
    securityCameras: z.boolean().default(false)
  }),
  photos: z.array(z.string().url()).min(1, 'At least one photo is required').max(20, 'Maximum 20 photos allowed'),
  pricing: z.object({
    basePrice: z.number().min(1, 'Base price must be greater than 0'),
    cleaningFee: z.number().min(0, 'Cleaning fee cannot be negative'),
    currency: z.string().default('EUR')
  }),
  rules: z.array(z.string()).default([])
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify user is a host
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { hostProfile: true }
    })

    if (!user || user.role !== 'HOST' || !user.hostProfile) {
      return NextResponse.json(
        { error: 'This endpoint is only for hosts' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const validatedData = listingSchema.parse(body)

    // Convert amenities object to string array format expected by Property model
    const amenitiesArray: string[] = []
    Object.entries(validatedData.amenities).forEach(([key, value]) => {
      if (value === true) {
        amenitiesArray.push(key)
      }
    })

    // Geocode the address if coordinates are not provided
    let latitude = validatedData.location.latitude
    let longitude = validatedData.location.longitude
    let geocodingAccuracy: string | null = null
    let geocodingFailed = false

    if (!latitude || !longitude) {
      console.log('Geocoding address:', {
        address: validatedData.location.address,
        city: validatedData.location.city,
        country: validatedData.location.country
      })

      const geocodingResult = await geocodingService.geocodeAddressWithFallback(
        validatedData.location.address,
        validatedData.location.city,
        validatedData.location.country
      )

      if (geocodingResult) {
        latitude = geocodingResult.latitude
        longitude = geocodingResult.longitude
        geocodingAccuracy = geocodingResult.accuracy
        console.log('Geocoding successful:', {
          latitude,
          longitude,
          accuracy: geocodingAccuracy
        })
      } else {
        geocodingFailed = true
        console.warn('Geocoding failed - property will be created without coordinates')
      }
    }

    // Create the property listing
    const property = await prisma.property.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        type: validatedData.propertyType,
        address: validatedData.location.address,
        city: validatedData.location.city,
        country: validatedData.location.country,
        latitude: latitude ?? null,
        longitude: longitude ?? null,
        geocodingAccuracy,
        geocodingFailed,
        price: validatedData.pricing.basePrice,
        currency: validatedData.pricing.currency,
        maxGuests: validatedData.maxGuests,
        bedrooms: validatedData.bedrooms,
        bathrooms: validatedData.bathrooms,
        amenities: amenitiesArray,
        images: validatedData.photos,
        rules: validatedData.rules,
        hostId: session.user.id,
        isActive: true, // Properties are immediately visible
        isVerified: false
      }
    })

    // Update user onboarding step
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        onboardingStep: 'collaboration-setup'
      }
    })

    // Update progress
    const progress = await prisma.onboardingProgress.findUnique({
      where: { userId: session.user.id }
    })

    if (progress) {
      const completedSteps = JSON.parse(progress.completedSteps as string)
      completedSteps.push('listing-creation')
      
      await prisma.onboardingProgress.update({
        where: { userId: session.user.id },
        data: {
          currentStep: 'collaboration-setup',
          completedSteps: JSON.stringify(completedSteps)
        }
      })
    }

    return NextResponse.json({
      listingId: property.id,
      success: true,
      nextStep: 'collaboration-setup',
      message: 'Property listing created successfully. Your listing will be reviewed before being published.'
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid listing data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create listing error:', error)
    return NextResponse.json(
      { error: 'Failed to create listing', code: 'ONBOARDING_005' },
      { status: 500 }
    )
  }
}
