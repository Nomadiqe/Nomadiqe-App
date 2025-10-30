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
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
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
      image: 'https://images.unsplash.com/photo-1494790108755-2616b332c7e0?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
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
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
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
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
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
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
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
      images: [
        'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      location: 'Zermatt, Switzerland',
      propertyId: property1.id,
      authorId: traveler1.id,
    },
  })

  const post2 = await prisma.post.create({
    data: {
      content: 'Barcelona never fails to amaze me! From the stunning architecture to the vibrant street life, this city has my heart. Currently exploring the Gothic Quarter and discovering hidden gems around every corner. 🏛️✨',
      images: [
        'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      location: 'Barcelona, Spain',
      authorId: host2.id,
    },
  })

  const post3 = await prisma.post.create({
    data: {
      content: 'Sunset from our beachfront villa in Bali 🌅 There\'s something magical about the way the light dances on the water here. Grateful to share this slice of paradise with travelers from around the world.',
      images: [
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      location: 'Ubud, Bali',
      propertyId: property3.id,
      authorId: host3.id,
    },
  })

  const post4 = await prisma.post.create({
    data: {
      content: 'Photography tip of the day: Golden hour lighting makes every travel photo 10x better! 📸 Currently capturing the magic of European countryside and loving every moment of this nomadic lifestyle.',
      images: [
        'https://images.unsplash.com/photo-1516680224141-86bc862537ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
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
      images: [
        'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      link: '/property/1',
      priority: 10,
      propertyId: property1.id,
    },
  })

  await prisma.ad.create({
    data: {
      title: 'New in Barcelona: Modern City Loft',
      description: 'Discover Barcelona from this stylish loft in the heart of the city.',
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      link: '/property/2',
      priority: 8,
      propertyId: property2.id,
    },
  })

  await prisma.ad.create({
    data: {
      title: 'Paradise Found: Bali Villa',
      description: 'Escape to tropical bliss with private beach access and luxury amenities.',
      images: [
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      link: '/property/3',
      priority: 9,
      propertyId: property3.id,
    },
  })

  // Seed Points Rules
  console.log('🎯 Seeding points rules...')

  const pointsRules = [
    // High-value actions (Critical for business)
    { action: 'signup', points: 100, dailyLimit: null, description: 'User signs up and verifies email' },
    { action: 'onboarding_complete', points: 75, dailyLimit: null, description: 'User completes full onboarding' },
    { action: 'booking_completed', points: 50, dailyLimit: null, description: 'User completes a booking' },
    { action: 'review_created', points: 25, dailyLimit: null, description: 'User leaves a review after booking' },
    { action: 'daily_check_in', points: 10, dailyLimit: 1, description: 'User checks in for the day' },

    // Medium-value actions (Engagement & Content)
    { action: 'post_created', points: 15, dailyLimit: 5, description: 'User creates a new post' },
    { action: 'comment_received', points: 5, dailyLimit: 20, description: 'User receives a comment on their post' },
    { action: 'comment_created', points: 3, dailyLimit: 10, description: 'User writes a comment' },
    { action: 'property_created', points: 30, dailyLimit: null, description: 'Host uploads a property listing' },
    { action: 'profile_completed', points: 20, dailyLimit: null, description: 'User completes their profile' },

    // Lower-value actions (Easy engagement)
    { action: 'post_liked', points: 1, dailyLimit: 50, description: 'User likes a post' },
    { action: 'like_received', points: 2, dailyLimit: 30, description: 'User receives a like on their post' },
    { action: 'follow_user', points: 2, dailyLimit: 20, description: 'User follows another user' },
    { action: 'follower_gained', points: 3, dailyLimit: null, description: 'User gains a new follower' },
  ]

  for (const rule of pointsRules) {
    await prisma.pointsRule.upsert({
      where: { action: rule.action },
      update: {
        points: rule.points,
        dailyLimit: rule.dailyLimit,
        description: rule.description,
      },
      create: rule,
    })
  }

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
  console.log(`Created ${await prisma.pointsRule.count()} points rules`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
