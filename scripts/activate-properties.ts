import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function activateProperties() {
  try {
    // Activate all inactive properties
    const result = await prisma.property.updateMany({
      where: {
        isActive: false
      },
      data: {
        isActive: true
      }
    })

    console.log(`Successfully activated ${result.count} properties`)

    // Verify the update
    const activeProperties = await prisma.property.findMany({
      where: { isActive: true },
      select: {
        id: true,
        title: true,
        city: true,
        country: true,
        isActive: true
      }
    })

    console.log('\nActive properties:', JSON.stringify(activeProperties, null, 2))

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

activateProperties()
