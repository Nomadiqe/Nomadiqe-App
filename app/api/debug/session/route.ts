import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    return NextResponse.json({
      hasSession: !!session,
      session: session,
      user: session?.user,
      timestamp: new Date().toISOString()
    }, { status: 200 })
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to get session',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

