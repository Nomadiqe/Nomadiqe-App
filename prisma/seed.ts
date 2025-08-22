import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create sample users
  const hostPassword = await bcrypt.hash('password123', 12)
  const travelerPassword = await bcrypt.hash('password123', 12)

  const host1 = await prisma.user.upsert({
    where: { email: 'host1@nomadiqe.com' },
    update: {},
    create: {
      email: 'host1@nomadiqe.com',
      name: 'Marco Rossi',
      role: 'HOST',
      password: hostPassword,
      isVerified: true,
      hostProfile: {
        create: {
          businessName: 'Alpine Retreats',
          commission: 0.05,
        }
      }
    },
  })

  const host2 = await prisma.user.upsert({
    where: { email: 'host2@nomadiqe.com' },
    update: {},
    create: {
      email: 'host2@nomadiqe.com',
      name: 'Sophie Chen',
      role: 'HOST',
      password: hostPassword,
      isVerified: true,
      hostProfile: {
        create: {
          businessName: 'Urban Escapes',
          commission: 0.05,
        }
      }
    },
  })

  const traveler1 = await prisma.user.upsert({
    where: { email: 'traveler1@nomadiqe.com' },
    update: {},
    create: {
      email: 'traveler1@nomadiqe.com',
      name: 'Alex Johnson',
      role: 'TRAVELER',
      password: travelerPassword,
      isVerified: true,
      travelerProfile: {
        create: {
          preferences: {
            preferredDestinations: ['Europe', 'Asia'],
            budget: { min: 50, max: 200 },
            amenities: ['WiFi', 'Kitchen', 'Parking']
          }
        }
      }
    },
  })

  // Create sample properties
  const property1 = await prisma.property.create({
    data: {
      title: 'Cozy Mountain Cabin',
      description: 'Beautiful wooden cabin with stunning mountain views. Perfect for a peaceful retreat in the Swiss Alps.',
      type: 'CABIN',
      address: 'Alpine Valley 123',
      city: 'Zermatt',
      country: 'Switzerland',
      latitude: 46.0207,
      longitude: 7.7491,
      price: 120,
      currency: 'EUR',
      maxGuests: 4,
      bedrooms: 2,
      bathrooms: 1,
      amenities: ['WiFi', 'Kitchen', 'Fireplace', 'Mountain View', 'Parking'],
      images: [
        'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      rules: ['No smoking', 'No pets', 'Quiet hours 10 PM - 8 AM'],
      isActive: true,
      isVerified: true,
      hostId: host1.id,
    },
  })

  const property2 = await prisma.property.create({
    data: {
      title: 'Modern City Loft',
      description: 'Stylish loft in the heart of Barcelona with modern amenities and easy access to all attractions.',
      type: 'APARTMENT',
      address: 'Carrer de Gràcia 456',
      city: 'Barcelona',
      country: 'Spain',
      latitude: 41.3851,
      longitude: 2.1734,
      price: 85,
      currency: 'EUR',
      maxGuests: 2,
      bedrooms: 1,
      bathrooms: 1,
      amenities: ['WiFi', 'Kitchen', 'Balcony', 'Air Conditioning', 'Washing Machine'],
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      rules: ['No smoking', 'No parties', 'Check-in after 3 PM'],
      isActive: true,
      isVerified: true,
      hostId: host2.id,
    },
  })

  const property3 = await prisma.property.create({
    data: {
      title: 'Beachfront Villa',
      description: 'Luxurious villa with direct beach access, private pool, and stunning ocean views in Bali.',
      type: 'VILLA',
      address: 'Jalan Pantai 789',
      city: 'Ubud',
      country: 'Indonesia',
      latitude: -8.3405,
      longitude: 115.0920,
      price: 200,
      currency: 'EUR',
      maxGuests: 6,
      bedrooms: 3,
      bathrooms: 2,
      amenities: ['WiFi', 'Kitchen', 'Private Pool', 'Beach Access', 'Garden', 'Air Conditioning'],
      images: [
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      rules: ['No smoking', 'No pets', 'Respect quiet hours'],
      isActive: true,
      isVerified: true,
      hostId: host1.id,
    },
  })

  // Create sample local experiences
  const experience1 = await prisma.localExperience.create({
    data: {
      title: 'Traditional Cooking Class',
      description: 'Learn to cook authentic local dishes with a professional chef in a traditional kitchen.',
      category: 'Food & Cooking',
      location: 'Barcelona, Spain',
      price: 45,
      currency: 'EUR',
      images: [
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      contactInfo: 'cooking@localexperience.com',
      isActive: true,
    },
  })

  const experience2 = await prisma.localExperience.create({
    data: {
      title: 'Mountain Hiking Guide',
      description: 'Professional hiking guide for mountain trails with stunning views and local knowledge.',
      category: 'Outdoor Activities',
      location: 'Zermatt, Switzerland',
      price: 80,
      currency: 'EUR',
      images: [
        'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      contactInfo: 'hiking@localexperience.com',
      isActive: true,
    },
  })

  // Create sample bookings
  const booking1 = await prisma.booking.create({
    data: {
      checkIn: new Date('2024-02-15'),
      checkOut: new Date('2024-02-18'),
      guests: 2,
      totalPrice: 255,
      currency: 'EUR',
      status: 'CONFIRMED',
      propertyId: property1.id,
      travelerId: traveler1.id,
      payment: {
        create: {
          amount: 255,
          currency: 'EUR',
          method: 'STRIPE',
          status: 'COMPLETED',
          transactionId: 'txn_123456789',
        }
      }
    },
  })

  // Create sample reviews
  const review1 = await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Amazing experience! The cabin was perfect and the views were breathtaking. Highly recommend!',
      bookingId: booking1.id,
      reviewerId: traveler1.id,
      propertyId: property1.id,
    },
  })

  // Create sample likes
  await prisma.like.create({
    data: {
      userId: traveler1.id,
      propertyId: property1.id,
    },
  })

  await prisma.like.create({
    data: {
      userId: traveler1.id,
      propertyId: property2.id,
    },
  })

  // Create sample follows
  await prisma.follow.create({
    data: {
      followerId: traveler1.id,
      followingId: host1.id,
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log(`Created ${await prisma.user.count()} users`)
  console.log(`Created ${await prisma.property.count()} properties`)
  console.log(`Created ${await prisma.localExperience.count()} local experiences`)
  console.log(`Created ${await prisma.booking.count()} bookings`)
  console.log(`Created ${await prisma.review.count()} reviews`)
  console.log(`Created ${await prisma.like.count()} likes`)
  console.log(`Created ${await prisma.follow.count()} follows`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
