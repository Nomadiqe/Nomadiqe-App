import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function removeDemoPhotos() {
  console.log('Removing demo photos from properties...')

  const demoPhotoUrl = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'

  try {
    // Find all properties with the demo photo
    const properties = await prisma.property.findMany({
      where: {
        images: {
          has: demoPhotoUrl
        }
      },
      select: {
        id: true,
        title: true,
        images: true
      }
    })

    console.log(`Found ${properties.length} properties with demo photos`)

    // Update each property to remove the demo photo
    for (const property of properties) {
      const updatedImages = property.images.filter(img => img !== demoPhotoUrl)

      await prisma.property.update({
        where: { id: property.id },
        data: { images: updatedImages }
      })

      console.log(`✓ Removed demo photo from: ${property.title}`)
      console.log(`  Images before: ${property.images.length}, after: ${updatedImages.length}`)
    }

    console.log('\n✅ Successfully removed all demo photos!')
  } catch (error) {
    console.error('Error removing demo photos:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

removeDemoPhotos()
  .catch((error) => {
    console.error('Failed to remove demo photos:', error)
    process.exit(1)
  })
