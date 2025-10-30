import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { awardPoints } from '@/lib/services/points-service'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be signed in to like posts' },
        { status: 401 }
      )
    }

    const postId = params.id

    // Check if the post exists
    const post = await prisma.post.findUnique({
      where: { id: postId }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Check if user already liked this post
    const existingLike = await prisma.postLike.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId: postId
        }
      }
    })

    if (existingLike) {
      // Unlike: Remove the like
      await prisma.postLike.delete({
        where: {
          id: existingLike.id
        }
      })

      // Get updated like count
      const likeCount = await prisma.postLike.count({
        where: { postId: postId }
      })

      return NextResponse.json({
        liked: false,
        likeCount
      })
    } else {
      // Like: Create a new like
      await prisma.postLike.create({
        data: {
          userId: session.user.id,
          postId: postId
        }
      })

      // Award points (only if not liking own post)
      if (session.user.id !== post.authorId) {
        // Award 1 point to user giving the like (daily limit of 50)
        await awardPoints({
          userId: session.user.id,
          action: 'post_liked',
          referenceId: postId,
          referenceType: 'post',
          description: 'Liked a post',
        })

        // Award 2 points to post author receiving the like (daily limit of 30)
        await awardPoints({
          userId: post.authorId,
          action: 'like_received',
          referenceId: postId,
          referenceType: 'post',
          description: 'Received a like on your post',
        })
      }

      // Get updated like count
      const likeCount = await prisma.postLike.count({
        where: { postId: postId }
      })

      return NextResponse.json({
        liked: true,
        likeCount
      })
    }
  } catch (error) {
    console.error('Error handling like:', error)
    return NextResponse.json(
      { error: 'Failed to process like action' },
      { status: 500 }
    )
  }
}

// GET method to check if user has liked a post
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({
        liked: false,
        likeCount: 0
      })
    }

    const postId = params.id

    const [like, likeCount] = await Promise.all([
      prisma.postLike.findUnique({
        where: {
          userId_postId: {
            userId: session.user.id,
            postId: postId
          }
        }
      }),
      prisma.postLike.count({
        where: { postId: postId }
      })
    ])

    return NextResponse.json({
      liked: !!like,
      likeCount
    })
  } catch (error) {
    console.error('Error checking like status:', error)
    return NextResponse.json(
      { error: 'Failed to check like status' },
      { status: 500 }
    )
  }
}