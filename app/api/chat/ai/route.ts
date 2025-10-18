import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const { message, userId } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Simple AI responses based on keywords and context
    const response = generateAIResponse(message, session.user)

    return NextResponse.json({
      success: true,
      response,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('AI Chat error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateAIResponse(message: string, user: any): string {
  const lowerMessage = message.toLowerCase()

  // Travel recommendations
  if (lowerMessage.includes('travel') || lowerMessage.includes('destination') || lowerMessage.includes('where to go')) {
    return `I'd love to help you with travel recommendations! Based on your profile, I can suggest destinations that match your interests. What type of experience are you looking for? Adventure, relaxation, cultural exploration, or something else?`
  }

  // Property-related questions
  if (lowerMessage.includes('property') || lowerMessage.includes('accommodation') || lowerMessage.includes('stay')) {
    return `I can help you find the perfect accommodation! Nomadiqe offers unique properties from local hosts. Are you looking for something specific? I can help you search by location, amenities, or property type.`
  }

  // Host-related questions
  if (lowerMessage.includes('host') || lowerMessage.includes('rent') || lowerMessage.includes('list')) {
    return `Becoming a host on Nomadiqe is a great way to share your space and earn income! I can guide you through the process of listing your property, setting up your host profile, or connecting with creators through our KOL$BED program. What would you like to know more about?`
  }

  // Creator/Influencer questions
  if (lowerMessage.includes('creator') || lowerMessage.includes('influencer') || lowerMessage.includes('collaboration')) {
    return `The KOL$BED program connects creators with amazing properties for authentic travel content! If you're a creator, you can reach out to hosts for collaboration opportunities. If you're a host, you can discover creators to promote your properties. How can I help you with collaborations?`
  }

  // Platform features
  if (lowerMessage.includes('feature') || lowerMessage.includes('how to') || lowerMessage.includes('help')) {
    return `Nomadiqe offers many features to enhance your travel experience! You can discover unique properties, connect with other travelers, share your experiences through posts, and collaborate with creators. What specific feature would you like to learn about?`
  }

  // Social features
  if (lowerMessage.includes('social') || lowerMessage.includes('connect') || lowerMessage.includes('friend')) {
    return `Building connections on Nomadiqe is easy! You can follow other travelers, share your travel stories through posts, and discover like-minded adventurers. You can also search for users by name, location, or interests. Would you like me to help you find other travelers?`
  }

  // Booking and payment
  if (lowerMessage.includes('book') || lowerMessage.includes('payment') || lowerMessage.includes('price')) {
    return `Booking on Nomadiqe is simple and secure! You can browse properties, check availability, and book directly through the platform. All payments are processed securely. Do you have questions about a specific booking or payment method?`
  }

  // Safety and support
  if (lowerMessage.includes('safe') || lowerMessage.includes('support') || lowerMessage.includes('problem') || lowerMessage.includes('issue')) {
    return `Your safety and satisfaction are our top priorities! All properties on Nomadiqe are verified, and we have a dedicated support team to help with any issues. You can also read reviews from other travelers. Is there a specific concern I can help address?`
  }

  // General greetings
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return `Hello ${user.name || 'there'}! 👋 I'm your AI travel assistant on Nomadiqe. I'm here to help you discover amazing properties, plan your next adventure, or answer any questions about our platform. What can I help you with today?`
  }

  // Thank you responses
  if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
    return `You're very welcome! I'm here whenever you need help with travel planning, property recommendations, or any questions about Nomadiqe. Happy travels! ✈️`
  }

  // Default responses based on user role
  const role = user.role?.toLowerCase()
  
  if (role === 'host') {
    return `As a host, you can manage your properties, track bookings, and connect with creators through our KOL$BED program. You can also view analytics and earnings. How can I help you optimize your hosting experience?`
  }
  
  if (role === 'influencer' || role === 'creator') {
    return `As a creator, you can discover amazing properties for collaboration, reach out to hosts through KOL$BED, and share your travel experiences with your audience. Would you like help finding collaboration opportunities?`
  }

  // General travel assistant response
  return `I'm here to help you make the most of your Nomadiqe experience! Whether you're planning your next trip, looking for unique accommodations, or want to share your travel stories, I can assist you. What would you like to explore today?`
}
