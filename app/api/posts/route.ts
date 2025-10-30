import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { awardPoints } from '@/lib/services/points-service'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { content, location, images, propertyId } = body

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const post = await prisma.post.create({
      data: {
        content: content.trim(),
        location: location?.trim() || null,
        images: images || [],
        authorId: session.user.id,
        propertyId: propertyId || null,
        isActive: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            fullName: true,
            image: true,
            profilePictureUrl: true,
          }
        },
        property: {
          select: {
            id: true,
            title: true,
            city: true,
            country: true,
            price: true,
            currency: true,
            images: true,
          }
        }
      }
    })

    // Award points for post creation (daily limit of 5 enforced by service)
    await awardPoints({
      userId: session.user.id,
      action: 'post_created',
      referenceId: post.id,
      referenceType: 'post',
      description: 'Created a new post',
    })

    return NextResponse.json({
      success: true,
      post: {
        ...post,
        author: {
          ...post.author,
          name: post.author.fullName || post.author.name || 'User'
        }
      }
    })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where: any = { isActive: true }
    if (userId) {
      where.authorId = userId
    }

    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            fullName: true,
            image: true,
            profilePictureUrl: true,
          }
        },
        property: {
          select: {
            id: true,
            title: true,
            city: true,
            country: true,
            price: true,
            currency: true,
            images: true,
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          }
        },
        ...(session?.user?.id ? {
          likes: {
            where: { userId: session.user.id },
            select: { id: true }
          }
        } : {})
      }
    })

    const formattedPosts = posts.map((post: any) => ({
      ...post,
      author: {
        ...post.author,
        name: post.author.fullName || post.author.name || 'User',
        image: post.author.image || post.author.profilePictureUrl || undefined
      },
      likes: post._count.likes,
      comments: post._count.comments,
      isLiked: Array.isArray(post.likes) ? post.likes.length > 0 : false,
    }))

    return NextResponse.json({
      success: true,
      posts: formattedPosts,
      page,
      hasMore: posts.length === limit
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}