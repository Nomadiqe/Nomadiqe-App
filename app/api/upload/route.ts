import { handleUpload } from '@vercel/blob/client'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname: string, clientPayload?: string) => {
        // Validate user is authenticated
        if (!user?.id) {
          throw new Error('Authentication required')
        }

        // Extract file info from pathname
        const filename = pathname.split('/').pop() || 'unknown'
        const fileExtension = filename.split('.').pop()?.toLowerCase()

        // Validate file type
        const allowedTypes = ['jpg', 'jpeg', 'png', 'webp', 'gif']
        if (!fileExtension || !allowedTypes.includes(fileExtension)) {
          throw new Error('Invalid file type. Only JPG, PNG, WebP, and GIF are allowed.')
        }

        return {
          allowedContentTypes: [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif'
          ],
          tokenPayload: JSON.stringify({
            userId: user.id,
            uploadedAt: new Date().toISOString(),
          }),
          addRandomSuffix: true,
          cacheControlMaxAge: 60 * 60 * 24 * 365, // 1 year
        }
      },
      onUploadCompleted: async ({ blob, tokenPayload }: { blob: any; tokenPayload?: string }) => {
        const parsedPayload = tokenPayload ? JSON.parse(tokenPayload) : {}
        console.log('Upload completed:', {
          url: blob.url,
          size: blob.size,
          uploadedBy: parsedPayload?.userId,
          uploadedAt: parsedPayload?.uploadedAt,
        })

        // Here you could store upload metadata in your database
        // For example:
        // await supabase.from('uploaded_files').insert({
        //   url: blob.url,
        //   size: blob.size,
        //   userId: parsedPayload?.userId,
        //   uploadedAt: new Date(parsedPayload?.uploadedAt),
        // })
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error: any) {
    console.error('Upload error:', error)
    
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 400 }
    )
  }
}
