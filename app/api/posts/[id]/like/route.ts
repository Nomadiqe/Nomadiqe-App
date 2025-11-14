import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { awardPoints } from '@/lib/services/points-service'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'You must be signed in to like posts' },
        { status: 401 }
      )
    }

    const postId = params.id

    // Check if the post exists
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

    // Check if user already liked this post
    const { data: existingLike } = await supabase
      .from('post_likes')
      .select('id')
      .eq('userId', user.id)
      .eq('postId', postId)
      .single()

    if (existingLike) {
      // Unlike: Remove the like
      await supabase
        .from('post_likes')
        .delete()
        .eq('id', existingLike.id)

      // Get updated like count
      const { count: likeCount } = await supabase
        .from('post_likes')
        .select('*', { count: 'exact', head: true })
        .eq('postId', postId)

      return NextResponse.json({
        liked: false,
        likeCount: likeCount || 0
      })
    } else {
      // Like: Create a new like
      await supabase
        .from('post_likes')
        .insert({
          userId: user.id,
          postId: postId,
          createdAt: new Date().toISOString(),
        })

      // Award points (only if not liking own post)
      if (user.id !== post.authorId) {
        // Award 1 point to user giving the like (daily limit of 50)
        await awardPoints({
          userId: user.id,
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
      const { count: likeCount } = await supabase
        .from('post_likes')
        .select('*', { count: 'exact', head: true })
        .eq('postId', postId)

      return NextResponse.json({
        liked: true,
        likeCount: likeCount || 0
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
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({
        liked: false,
        likeCount: 0
      })
    }

    const postId = params.id

    const [{ data: like }, { count: likeCount }] = await Promise.all([
      supabase
        .from('post_likes')
        .select('id')
        .eq('userId', user.id)
        .eq('postId', postId)
        .single(),
      supabase
        .from('post_likes')
        .select('*', { count: 'exact', head: true })
        .eq('postId', postId)
    ])

    return NextResponse.json({
      liked: !!like,
      likeCount: likeCount || 0
    })
  } catch (error) {
    console.error('Error checking like status:', error)
    return NextResponse.json(
      { error: 'Failed to check like status' },
      { status: 500 }
    )
  }
}
