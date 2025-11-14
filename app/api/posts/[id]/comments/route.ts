import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/posts/[id]/comments - Fetch comments for a post
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const postId = params.id

    // Check if the post exists
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('id')
      .eq('id', postId)
      .single()

    if (postError || !post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Fetch comments for the post
    const { data: comments, error: commentsError } = await supabase
      .from('post_comments')
      .select(`
        *,
        author:users!authorId (
          id,
          name,
          fullName,
          image,
          profilePictureUrl
        )
      `)
      .eq('postId', postId)
      .order('createdAt', { ascending: false })

    if (commentsError) {
      console.error('Error fetching comments:', commentsError)
      return NextResponse.json(
        { error: 'Failed to fetch comments' },
        { status: 500 }
      )
    }

    // Format the comments
    const formattedComments = (comments || []).map((comment: any) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
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
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
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

    // Create the comment
    const { data: comment, error: commentError } = await supabase
      .from('post_comments')
      .insert({
        content: content.trim(),
        authorId: user.id,
        postId: postId,
      })
      .select(`
        *,
        author:users!authorId (
          id,
          name,
          fullName,
          image,
          profilePictureUrl
        )
      `)
      .single()

    if (commentError) {
      console.error('Error creating comment:', commentError)
      return NextResponse.json(
        { error: 'Failed to create comment' },
        { status: 500 }
      )
    }

    // Award points for commenting
    // Award 3 points to commenter (daily limit of 10)
    await supabase.rpc('award_points', {
      p_user_id: user.id,
      p_action: 'comment_created',
      p_points: 3,
      p_reference_id: comment.id,
      p_reference_type: 'comment',
      p_description: 'Wrote a comment'
    })

    // Award 5 points to post author receiving comment (only if not own post, daily limit of 20)
    if (user.id !== post.authorId) {
      await supabase.rpc('award_points', {
        p_user_id: post.authorId,
        p_action: 'comment_received',
        p_points: 5,
        p_reference_id: comment.id,
        p_reference_type: 'comment',
        p_description: 'Received a comment on your post'
      })
    }

    // Format the response
    const formattedComment = {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
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
