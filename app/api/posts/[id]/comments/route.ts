import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET /api/posts/[id]/comments - Fetch comments for a post
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
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

    // Fetch comments for the post
    const comments = await prisma.postComment.findMany({
      where: { postId: postId },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            fullName: true,
            image: true,
            profilePictureUrl: true,
          }
        }
      }
    })

    // Format the comments
    const formattedComments = comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      user: {
        id: comment.author.id,
        name: comment.author.fullName || comment.author.name || 'User',
        image: comment.author.image || comment.author.profilePictureUrl || undefined,
      }
    }))

    return NextResponse.json({
      comments: formattedComments
    })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

// POST /api/posts/[id]/comments - Create a new comment
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be signed in to comment' },
        { status: 401 }
      )
    }

    const postId = params.id
    const { content } = await request.json()

    // Validate content
    if (!content || typeof content !== 'string' || !content.trim()) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      )
    }

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

    // Create the comment
    const comment = await prisma.postComment.create({
      data: {
        content: content.trim(),
        authorId: session.user.id,
        postId: postId,
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
        }
      }
    })

    // Format the response
    const formattedComment = {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      user: {
        id: comment.author.id,
        name: comment.author.fullName || comment.author.name || 'User',
        image: comment.author.image || comment.author.profilePictureUrl || undefined,
      }
    }

    return NextResponse.json({
      comment: formattedComment
    })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}