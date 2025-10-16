# Geocoding Service Documentation

## Overview

The Nomadiqe app uses the **Nominatim** geocoding service (powered by OpenStreetMap) to automatically convert property addresses into geographic coordinates (latitude and longitude) when properties are created.

## Why Geocoding?

The property map on the explore page requires latitude and longitude coordinates to display properties. Since users typically don't have this information when creating a property listing, the geocoding service automatically:

1. Takes the address, city, and country from the property form
2. Sends a request to Nominatim API to geocode the address
3. Stores the resulting latitude and longitude in the database
4. Allows the property to appear on the map

## Implementation

### Service Location
- **File**: [`../lib/geocoding.ts`](../lib/geocoding.ts)
- **Class**: `GeocodingService`
- **Export**: `geocodingService` (singleton instance)

### Integration Point
- **File**: [`../app/api/onboarding/host/create-listing/route.ts`](../app/api/onboarding/host/create-listing/route.ts)
- **When**: Property creation (POST request)
- **Logic**: If latitude/longitude are not provided, automatically geocode the address

### Key Features

#### 1. Smart Fallback Strategy (NEW!)
The geocoding service now uses a multi-level fallback approach to maximize success rate:
- **Level 1**: Try full address with street number
- **Level 2**: Try street name without number
- **Level 3**: Fall back to city center

This ensures that even properties in small towns or with incomplete OpenStreetMap data will at least get approximate coordinates and appear on the map.

#### 2. Rate Limiting
Nominatim requires a maximum of **1 request per second**. The service enforces this by:
- Tracking the timestamp of the last request
- Automatically waiting if requests are too frequent
- Ensuring compliance with Nominatim's usage policy

```typescript
private async enforceRateLimit(): Promise<void> {
  const now = Date.now()
  const timeSinceLastRequest = now - this.lastRequestTime

  if (timeSinceLastRequest < this.MIN_REQUEST_INTERVAL) {
    const waitTime = this.MIN_REQUEST_INTERVAL - timeSinceLastRequest
    await new Promise(resolve => setTimeout(resolve, waitTime))
  }

  this.lastRequestTime = Date.now()
}
```

#### 2. Automatic Fallback
If geocoding fails for any reason:
- The property is still created
- Latitude and longitude are set to `null`
- A warning is logged to the console
- The property won't appear on the map until coordinates are added

#### 3. User-Agent Header
The service includes a proper User-Agent header as required by Nominatim's usage policy:
```typescript
'User-Agent': 'NomadiqeApp/1.0'
```

## Geocoding Status Tracking

Each property now stores geocoding metadata:

- **`geocodingAccuracy`**: String indicating accuracy level
  - `'exact'`: Address was found exactly (or manually set by admin)
  - `'street'`: Street name found, but not exact address
  - `'city'`: Only city center coordinates (fallback)
  - `'approximate'`: Generic geocoding result
  - `null`: Not yet geocoded

- **`geocodingFailed`**: Boolean flag
  - `true`: All geocoding attempts failed - admin needs to manually set coordinates
  - `false`: Geocoding succeeded or not yet attempted

## Admin Interface

Admins can view geocoding status and manually set coordinates for properties:

### Geocoding Warnings
Properties without coordinates or with failed geocoding show warning badges in the admin dashboard:
- **Orange warning**: "Location Not Set" - property won't appear on map
- **Blue info badge**: Shows geocoding accuracy level for approximate locations

### Manual Coordinate Setting
Admins can click the **"Set Location"** button to:
1. Enter exact latitude and longitude values
2. Use Google Maps or OpenStreetMap to find coordinates
3. Save coordinates directly to the database

This is useful for:
- Properties where automatic geocoding failed
- Properties in areas with poor OpenStreetMap coverage
- Adjusting coordinates for better precision

## API Methods

### `geocodeAddressWithFallback(address, city, country)` (Recommended)
Primary method with smart fallback strategy. Tries multiple approaches to find the best coordinates.

**Parameters:**
- `address` (string): Street address
- `city` (string): City name
- `country` (string): Country name

**Returns:**
- `GeocodingResult | null`
  ```typescript
  interface GeocodingResult {
    latitude: number
    longitude: number
    displayName: string
    accuracy: 'exact' | 'street' | 'city' | 'approximate'
  }
  ```

**Fallback Strategy:**
1. Tries full address: "Via V. di Stefano, 32, Terrasini, Italy"
2. If failed, tries without number: "Via V. di Stefano, Terrasini, Italy"
3. If failed, tries city center: "Terrasini, Italy"

**Example:**
```typescript
import { geocodingService } from '@/lib/geocoding'

const result = await geocodingService.geocodeAddressWithFallback(
  'Via V. di Stefano, 32',
  'Terrasini',
  'Italy'
)

if (result) {
  console.log(`Lat: ${result.latitude}, Lon: ${result.longitude}`)
  console.log(`Accuracy: ${result.accuracy}`)
  // Lat: 38.153115, Lon: 13.0840277
  // Accuracy: city (fell back to city center)
}
```

### `geocodeAddress(address, city, country)`
Primary method for geocoding a simple address string.

**Parameters:**
- `address` (string): Street address
- `city` (string): City name
- `country` (string): Country name

**Returns:**
- `GeocodingResult | null`
  ```typescript
  interface GeocodingResult {
    latitude: number
    longitude: number
    displayName: string
  }
  ```

**Example:**
```typescript
import { geocodingService } from '@/lib/geocoding'

const result = await geocodingService.geocodeAddress(
  'La Rambla 1',
  'Barcelona',
  'Spain'
)

if (result) {
  console.log(`Lat: ${result.latitude}, Lon: ${result.longitude}`)
  // Lat: 41.3766998, Lon: 2.1764929
}
```

### `geocodeStructured(params)`
Alternative method using structured address components (more accurate for complex addresses).

**Parameters:**
```typescript
{
  street: string
  city: string
  state?: string
  country: string
  postalCode?: string
}
```

**Returns:**
- `GeocodingResult | null`

**Example:**
```typescript
const result = await geocodingService.geocodeStructured({
  street: '1600 Amphitheatre Parkway',
  city: 'Mountain View',
  state: 'California',
  country: 'USA',
  postalCode: '94043'
})
```

## Usage in Property Creation Flow

When a host creates a property:

1. **Form Submission**: User fills out property details including address, city, country
2. **API Request**: Data is sent to `/api/onboarding/host/create-listing`
3. **Geocoding Check**:
   ```typescript
   if (!latitude || !longitude) {
     const geocodingResult = await geocodingService.geocodeAddress(
       validatedData.location.address,
       validatedData.location.city,
       validatedData.location.country
     )

     if (geocodingResult) {
       latitude = geocodingResult.latitude
       longitude = geocodingResult.longitude
     }
   }
   ```
4. **Database Insert**: Property is created with geocoded coordinates
5. **Map Display**: Property now appears on the explore page map

## Limitations & Considerations

### 1. Accuracy
- Generic addresses (e.g., "123 Main Street") may not geocode successfully
- More specific addresses produce better results
- Well-known landmarks and street names work best

### 2. Rate Limits
- **Nominatim**: 1 request per second
- The service enforces this automatically
- Multiple property creations in rapid succession will be delayed

### 3. Service Availability
- Nominatim is free and generally reliable
- No API key required
- Dependent on OpenStreetMap data quality

### 4. No API Key Required
- Completely free service
- No signup or billing required
- Must comply with usage policy (rate limits, User-Agent header)

## Troubleshooting

### Property Not Appearing on Map

**Check 1: Database Coordinates**
```sql
SELECT id, title, latitude, longitude
FROM Property
WHERE id = 'property-id';
```

If `latitude` and `longitude` are `NULL`, the geocoding failed.

**Check 2: Server Logs**
Look for these messages:
- `"Geocoding address:"` - Shows the address being geocoded
- `"Geocoding successful:"` - Shows the resulting coordinates
- `"Geocoding failed - property will be created without coordinates"` - Warning message

**Check 3: Address Quality**
- Is the address specific enough?
- Does the address exist in OpenStreetMap?
- Try searching the address on [OpenStreetMap](https://www.openstreetmap.org/)

### Manual Fix for Existing Properties

If a property exists without coordinates, you can manually update them:

```typescript
// Example API endpoint or script to update coordinates
await prisma.property.update({
  where: { id: 'property-id' },
  data: {
    latitude: 41.3851,
    longitude: 2.1734
  }
})
```

Or re-geocode in bulk:
```typescript
const properties = await prisma.property.findMany({
  where: {
    OR: [
      { latitude: null },
      { longitude: null }
    ]
  }
})

for (const property of properties) {
  const result = await geocodingService.geocodeAddress(
    property.address,
    property.city,
    property.country
  )

  if (result) {
    await prisma.property.update({
      where: { id: property.id },
      data: {
        latitude: result.latitude,
        longitude: result.longitude
      }
    })
  }

  // Rate limiting is handled automatically by the service
}
```

## Future Enhancements

Potential improvements to consider:

1. **Caching**: Cache geocoding results to avoid repeat requests
2. **Batch Geocoding**: Script to geocode existing properties without coordinates
3. **Alternative Providers**: Fallback to Google Maps or Mapbox if Nominatim fails
4. **Admin Interface**: Allow admins to manually adjust coordinates if geocoding is inaccurate
5. **Reverse Geocoding**: Convert coordinates back to addresses for validation

## Resources

- [Nominatim API Documentation](https://nominatim.org/release-docs/latest/api/Overview/)
- [Nominatim Usage Policy](https://operations.osmfoundation.org/policies/nominatim/)
- [OpenStreetMap](https://www.openstreetmap.org/)
