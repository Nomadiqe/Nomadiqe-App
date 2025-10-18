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
      bio: 'Passionate about sharing the beauty of the Alps with travelers from around the world. Local expert and mountain enthusiast.',
      location: 'Zermatt, Switzerland',
      phone: '+41 27 966 81 00',
      image: null,
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
      bio: 'Architecture lover and city explorer. I help travelers discover the best urban experiences in Barcelona.',
      location: 'Barcelona, Spain',
      phone: '+34 93 285 38 32',
      image: null,
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
      bio: 'Digital nomad and adventure seeker. Love exploring new cultures and sharing travel experiences.',
      location: 'Currently in Europe',
      phone: '+1 555 123 4567',
      image: null,
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

  // Create more sample users
  const traveler2 = await prisma.user.upsert({
    where: { email: 'traveler2@nomadiqe.com' },
    update: {},
    create: {
      email: 'traveler2@nomadiqe.com',
      name: 'Emma Wilson',
      role: 'TRAVELER',
      password: travelerPassword,
      isVerified: true,
      bio: 'Travel photographer and storyteller. Capturing memories one destination at a time.',
      location: 'London, UK',
      phone: '+44 20 7946 0958',
      image: null,
      travelerProfile: {
        create: {
          preferences: {
            preferredDestinations: ['South America', 'Africa'],
            budget: { min: 30, max: 150 },
            amenities: ['WiFi', 'Natural Light', 'Photography Equipment Storage']
          }
        }
      }
    },
  })

  const host3 = await prisma.user.upsert({
    where: { email: 'host3@nomadiqe.com' },
    update: {},
    create: {
      email: 'host3@nomadiqe.com',
      name: 'Raj Patel',
      role: 'HOST',
      password: hostPassword,
      isVerified: true,
      bio: 'Beachfront property owner with deep knowledge of Balinese culture and hidden gems.',
      location: 'Ubud, Bali',
      phone: '+62 361 123456',
      image: null,
      hostProfile: {
        create: {
          businessName: 'Tropical Retreats Bali',
          commission: 0.05,
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
      images: [],
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
      images: [],
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
      images: [],
      rules: ['No smoking', 'No pets', 'Respect quiet hours'],
      isActive: true,
      isVerified: true,
      hostId: host3.id,
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
      images: [],
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
      images: [],
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

  await prisma.follow.create({
    data: {
      followerId: traveler2.id,
      followingId: host2.id,
    },
  })

  await prisma.follow.create({
    data: {
      followerId: traveler1.id,
      followingId: traveler2.id,
    },
  })

  // Create sample posts
  const post1 = await prisma.post.create({
    data: {
      content: 'Just had the most incredible stay at this mountain cabin! The views were absolutely breathtaking and the fresh Alpine air was exactly what I needed. Thanks @Marco for being such an amazing host! 🏔️',
      images: [],
      location: 'Zermatt, Switzerland',
      propertyId: property1.id,
      authorId: traveler1.id,
    },
  })

  const post2 = await prisma.post.create({
    data: {
      content: 'Barcelona never fails to amaze me! From the stunning architecture to the vibrant street life, this city has my heart. Currently exploring the Gothic Quarter and discovering hidden gems around every corner. 🏛️✨',
      images: [],
      location: 'Barcelona, Spain',
      authorId: host2.id,
    },
  })

  const post3 = await prisma.post.create({
    data: {
      content: 'Sunset from our beachfront villa in Bali 🌅 There\'s something magical about the way the light dances on the water here. Grateful to share this slice of paradise with travelers from around the world.',
      images: [],
      location: 'Ubud, Bali',
      propertyId: property3.id,
      authorId: host3.id,
    },
  })

  const post4 = await prisma.post.create({
    data: {
      content: 'Photography tip of the day: Golden hour lighting makes every travel photo 10x better! 📸 Currently capturing the magic of European countryside and loving every moment of this nomadic lifestyle.',
      images: [],
      location: 'Tuscany, Italy',
      authorId: traveler2.id,
    },
  })

  // Create post likes
  await prisma.postLike.create({
    data: {
      userId: traveler2.id,
      postId: post1.id,
    },
  })

  await prisma.postLike.create({
    data: {
      userId: host1.id,
      postId: post2.id,
    },
  })

  await prisma.postLike.create({
    data: {
      userId: traveler1.id,
      postId: post3.id,
    },
  })

  // Create post comments
  await prisma.postComment.create({
    data: {
      content: 'This looks absolutely magical! Adding it to my wishlist 😍',
      authorId: traveler2.id,
      postId: post1.id,
    },
  })

  await prisma.postComment.create({
    data: {
      content: 'Love your photography! The composition is perfect.',
      authorId: host2.id,
      postId: post4.id,
    },
  })

  // Create sample ads
  await prisma.ad.create({
    data: {
      title: 'Featured: Alpine Mountain Cabin',
      description: 'Experience the Swiss Alps like never before! Book now for 20% off your first stay.',
      images: [],
      link: '/property/1',
      priority: 10,
      propertyId: property1.id,
    },
  })

  await prisma.ad.create({
    data: {
      title: 'New in Barcelona: Modern City Loft',
      description: 'Discover Barcelona from this stylish loft in the heart of the city.',
      images: [],
      link: '/property/2',
      priority: 8,
      propertyId: property2.id,
    },
  })

  await prisma.ad.create({
    data: {
      title: 'Paradise Found: Bali Villa',
      description: 'Escape to tropical bliss with private beach access and luxury amenities.',
      images: [],
      link: '/property/3',
      priority: 9,
      propertyId: property3.id,
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
  console.log(`Created ${await prisma.post.count()} posts`)
  console.log(`Created ${await prisma.postLike.count()} post likes`)
  console.log(`Created ${await prisma.postComment.count()} post comments`)
  console.log(`Created ${await prisma.ad.count()} ads`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
