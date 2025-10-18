import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        success: true,
        users: [],
        message: 'Please provide a search query with at least 2 characters'
      })
    }

    const searchTerm = query.trim()

    // Search users by name, username, location, or bio
    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            id: {
              not: session.user.id // Exclude current user from results
            }
          },
          {
            OR: [
              {
                fullName: {
                  contains: searchTerm,
                  mode: 'insensitive'
                }
              },
              {
                name: {
                  contains: searchTerm,
                  mode: 'insensitive'
                }
              },
              {
                username: {
                  contains: searchTerm,
                  mode: 'insensitive'
                }
              },
              {
                location: {
                  contains: searchTerm,
                  mode: 'insensitive'
                }
              },
              {
                bio: {
                  contains: searchTerm,
                  mode: 'insensitive'
                }
              },
              {
                email: {
                  contains: searchTerm,
                  mode: 'insensitive'
                }
              }
            ]
          }
        ]
      },
      select: {
        id: true,
        name: true,
        fullName: true,
        username: true,
        email: true,
        image: true,
        profilePictureUrl: true,
        bio: true,
        location: true,
        role: true,
        isVerified: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            posts: true,
            properties: true
          }
        }
      },
      orderBy: [
        // Prioritize exact matches
        {
          fullName: {
            startsWith: searchTerm,
            mode: 'insensitive'
          }
        },
        {
          username: {
            startsWith: searchTerm,
            mode: 'insensitive'
          }
        },
        // Then by relevance (follower count, activity)
        {
          createdAt: 'desc'
        }
      ],
      take: limit
    })

    // Format the results
    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.fullName || user.name || 'Anonymous',
      username: user.username,
      email: user.email,
      image: user.profilePictureUrl || user.image,
      bio: user.bio,
      location: user.location,
      role: user.role,
      isVerified: user.isVerified,
      stats: {
        followers: user._count.followers,
        posts: user._count.posts,
        properties: user._count.properties
      },
      joinedDate: user.createdAt
    }))

    return NextResponse.json({
      success: true,
      users: formattedUsers,
      query: searchTerm,
      count: formattedUsers.length
    })

  } catch (error) {
    console.error('User search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
