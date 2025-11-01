import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// DELETE endpoint to delete a post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const postId = params.id

    // Find the post
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        authorId: true,
      },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Check if user is the author
    if (post.authorId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only delete your own posts' },
        { status: 403 }
      )
    }

    // Soft delete: set isActive to false instead of actually deleting
    await prisma.post.update({
      where: { id: postId },
      data: {
        isActive: false,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}

// PATCH endpoint to update a post
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const postId = params.id
    const body = await request.json()
    const { content, images, location } = body

    // Find the post
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        authorId: true,
      },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Check if user is the author
    if (post.authorId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only edit your own posts' },
        { status: 403 }
      )
    }

    // Update the post
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        ...(content !== undefined && { content }),
        ...(images !== undefined && { images }),
        ...(location !== undefined && { location }),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            fullName: true,
            image: true,
            profilePictureUrl: true,
            role: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      post: {
        id: updatedPost.id,
        content: updatedPost.content,
        images: updatedPost.images as string[],
        location: updatedPost.location || undefined,
        createdAt: updatedPost.createdAt.toISOString(),
        author: {
          id: updatedPost.author.id,
          name: updatedPost.author.fullName || updatedPost.author.name || 'User',
          image: updatedPost.author.image || updatedPost.author.profilePictureUrl || undefined,
          role: updatedPost.author.role,
        },
        property: updatedPost.property ? {
          id: updatedPost.property.id,
          title: updatedPost.property.title,
        } : undefined,
        likes: updatedPost._count.likes,
        comments: updatedPost._count.comments,
      },
    })
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    )
  }
}
