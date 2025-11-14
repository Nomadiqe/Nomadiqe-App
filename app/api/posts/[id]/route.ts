import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// DELETE endpoint to delete a post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const postId = params.id

    // Find the post
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('id, authorId')
      .eq('id', postId)
      .single()

    if (postError || !post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Check if user is the author
    if (post.authorId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only delete your own posts' },
        { status: 403 }
      )
    }

    // Soft delete: set isActive to false instead of actually deleting
    const { error: deleteError } = await supabase
      .from('posts')
      .update({ isActive: false })
      .eq('id', postId)

    if (deleteError) {
      console.error('Error deleting post:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete post' },
        { status: 500 }
      )
    }

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
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const postId = params.id
    const body = await request.json()
    const { content, images, location } = body

    // Find the post
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('id, authorId')
      .eq('id', postId)
      .single()

    if (postError || !post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Check if user is the author
    if (post.authorId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only edit your own posts' },
        { status: 403 }
      )
    }

    // Build update object
    const updateData: any = {}
    if (content !== undefined) updateData.content = content
    if (images !== undefined) updateData.images = images
    if (location !== undefined) updateData.location = location

    // Update the post
    const { data: updatedPost, error: updateError } = await supabase
      .from('posts')
      .update(updateData)
      .eq('id', postId)
      .select(`
        *,
        author:users!authorId (
          id,
          name,
          fullName,
          image,
          profilePictureUrl,
          role
        ),
        property:properties (
          id,
          title
        )
      `)
      .single()

    if (updateError) {
      console.error('Error updating post:', updateError)
      return NextResponse.json(
        { error: 'Failed to update post' },
        { status: 500 }
      )
    }

    // Get counts for likes and comments
    const { count: likesCount } = await supabase
      .from('post_likes')
      .select('*', { count: 'exact', head: true })
      .eq('postId', postId)

    const { count: commentsCount } = await supabase
      .from('post_comments')
      .select('*', { count: 'exact', head: true })
      .eq('postId', postId)

    return NextResponse.json({
      success: true,
      post: {
        id: updatedPost.id,
        content: updatedPost.content,
        images: updatedPost.images as string[],
        location: updatedPost.location || undefined,
        createdAt: updatedPost.createdAt,
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
        likes: likesCount || 0,
        comments: commentsCount || 0,
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
