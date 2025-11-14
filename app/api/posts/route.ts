import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { awardPoints } from '@/lib/services/points-service'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { content, location, images, propertyId } = body

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    // Create post
    const { data: post, error } = await supabase
      .from('posts')
      .insert({
        content: content.trim(),
        location: location?.trim() || null,
        images: images || [],
        authorId: user.id,
        propertyId: propertyId || null,
        isActive: true,
      })
      .select(`
        *,
        author:users!authorId (
          id,
          name,
          fullName,
          image,
          profilePictureUrl
        ),
        property:properties (
          id,
          title,
          city,
          country,
          price,
          currency,
          images
        )
      `)
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
    }

    // Award points for post creation (daily limit of 5 enforced by service)
    await awardPoints({
      userId: user.id,
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
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from('posts')
      .select(`
        *,
        author:users!authorId (
          id,
          name,
          fullName,
          image,
          profilePictureUrl
        ),
        property:properties (
          id,
          title,
          city,
          country,
          price,
          currency,
          images
        ),
        post_likes (count),
        post_comments (count)
      `)
      .eq('isActive', true)
      .order('createdAt', { ascending: false })
      .range(offset, offset + limit - 1)

    if (userId) {
      query = query.eq('authorId', userId)
    }

    const { data: posts, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
    }

    // Check if user liked each post
    let userLikes: any[] = []
    if (user) {
      const postIds = posts?.map(p => p.id) || []
      if (postIds.length > 0) {
        const { data: likes } = await supabase
          .from('post_likes')
          .select('postId')
          .eq('userId', user.id)
          .in('postId', postIds)
        userLikes = likes || []
      }
    }

    const likedPostIds = new Set(userLikes.map(l => l.postId))

    const formattedPosts = posts?.map((post: any) => ({
      ...post,
      author: {
        ...post.author,
        name: post.author?.fullName || post.author?.name || 'User',
        image: post.author?.image || post.author?.profilePictureUrl || undefined
      },
      likes: post.post_likes?.[0]?.count || 0,
      comments: post.post_comments?.[0]?.count || 0,
      isLiked: likedPostIds.has(post.id),
    })) || []

    return NextResponse.json({
      success: true,
      posts: formattedPosts,
      page,
      hasMore: posts?.length === limit
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}