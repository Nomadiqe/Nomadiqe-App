/**
 * Script to geocode existing properties that don't have coordinates
 *
 * This script finds all properties in the database that are missing
 * latitude and/or longitude coordinates, and attempts to geocode them
 * using the Nominatim service.
 *
 * Usage:
 *   npx tsx scripts/geocode-existing-properties.ts
 *
 * Options:
 *   DRY_RUN=true - Preview changes without updating the database
 *   LIMIT=10 - Limit the number of properties to geocode
 */

import { prisma } from '../lib/db'
import { geocodingService } from '../lib/geocoding'

const DRY_RUN = process.env.DRY_RUN === 'true'
const LIMIT = process.env.LIMIT ? parseInt(process.env.LIMIT) : undefined

interface GeocodeStats {
  total: number
  successful: number
  failed: number
  skipped: number
}

async function geocodeExistingProperties() {
  console.log('🗺️  Geocoding Existing Properties\n')
  console.log('═══════════════════════════════════════\n')

  if (DRY_RUN) {
    console.log('⚠️  DRY RUN MODE - No changes will be made\n')
  }

  const stats: GeocodeStats = {
    total: 0,
    successful: 0,
    failed: 0,
    skipped: 0
  }

  try {
    // Find properties without coordinates
    const properties = await prisma.property.findMany({
      where: {
        OR: [
          { latitude: null },
          { longitude: null }
        ]
      },
      select: {
        id: true,
        title: true,
        address: true,
        city: true,
        country: true,
        latitude: true,
        longitude: true
      },
      take: LIMIT
    })

    stats.total = properties.length

    if (properties.length === 0) {
      console.log('✅ All properties already have coordinates!\n')
      return
    }

    console.log(`Found ${properties.length} ${properties.length === 1 ? 'property' : 'properties'} without coordinates\n`)

    // Process each property
    for (let i = 0; i < properties.length; i++) {
      const property = properties[i]

      console.log(`\n[${i + 1}/${properties.length}] Processing: ${property.title}`)
      console.log(`   Address: ${property.address}, ${property.city}, ${property.country}`)

      // Check if address fields are valid
      if (!property.address || !property.city || !property.country) {
        console.log('   ⚠️  Skipped - Missing address information')
        stats.skipped++
        continue
      }

      // Attempt to geocode with smart fallback
      try {
        const result = await geocodingService.geocodeAddressWithFallback(
          property.address,
          property.city,
          property.country
        )

        if (result) {
          console.log(`   ✓ Geocoded: ${result.latitude}, ${result.longitude} (accuracy: ${result.accuracy})`)

          if (!DRY_RUN) {
            await prisma.property.update({
              where: { id: property.id },
              data: {
                latitude: result.latitude,
                longitude: result.longitude,
                geocodingAccuracy: result.accuracy,
                geocodingFailed: false
              }
            })
            console.log('   ✓ Database updated')
          } else {
            console.log('   ℹ️  Would update database (DRY RUN)')
          }

          stats.successful++
        } else {
          console.log('   ✗ Geocoding failed - No results found')

          if (!DRY_RUN) {
            // Mark as failed so admin knows to manually set coordinates
            await prisma.property.update({
              where: { id: property.id },
              data: {
                geocodingFailed: true
              }
            })
            console.log('   ℹ️  Marked as geocoding failed')
          }

          stats.failed++
        }
      } catch (error) {
        console.log(`   ✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
        stats.failed++
      }
    }

    // Print summary
    console.log('\n═══════════════════════════════════════')
    console.log('\n📊 Summary\n')
    console.log(`Total properties processed: ${stats.total}`)
    console.log(`✓ Successfully geocoded:    ${stats.successful}`)
    console.log(`✗ Failed to geocode:        ${stats.failed}`)
    console.log(`⚠ Skipped (missing data):   ${stats.skipped}`)

    if (DRY_RUN) {
      console.log('\n⚠️  This was a DRY RUN - no changes were made to the database')
      console.log('   Run without DRY_RUN=true to apply changes\n')
    } else {
      console.log('\n✅ Database updated successfully\n')
    }

  } catch (error) {
    console.error('\n❌ Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
geocodeExistingProperties()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
