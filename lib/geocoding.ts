/**
 * Nominatim Geocoding Service
 *
 * This service uses OpenStreetMap's Nominatim API to convert addresses
 * into geographic coordinates (latitude and longitude).
 *
 * Rate Limits:
 * - Maximum 1 request per second
 * - Must include User-Agent header
 * - See: https://operations.osmfoundation.org/policies/nominatim/
 */

interface GeocodingResult {
  latitude: number
  longitude: number
  displayName: string
  accuracy: 'exact' | 'street' | 'city' | 'approximate'
}

interface NominatimResponse {
  lat: string
  lon: string
  display_name: string
  importance: number
}

class GeocodingService {
  private lastRequestTime: number = 0
  private readonly MIN_REQUEST_INTERVAL = 1000 // 1 second in milliseconds
  private readonly BASE_URL = 'https://nominatim.openstreetmap.org/search'
  private readonly USER_AGENT = 'NomadiqeApp/1.0'

  /**
   * Enforces rate limiting by ensuring at least 1 second between requests
   */
  private async enforceRateLimit(): Promise<void> {
    const now = Date.now()
    const timeSinceLastRequest = now - this.lastRequestTime

    if (timeSinceLastRequest < this.MIN_REQUEST_INTERVAL) {
      const waitTime = this.MIN_REQUEST_INTERVAL - timeSinceLastRequest
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }

    this.lastRequestTime = Date.now()
  }

  /**
   * Geocodes an address into latitude and longitude coordinates
   *
   * @param address - Street address
   * @param city - City name
   * @param country - Country name
   * @returns GeocodingResult with coordinates or null if not found
   */
  async geocodeAddress(
    address: string,
    city: string,
    country: string
  ): Promise<GeocodingResult | null> {
    try {
      // Enforce rate limiting
      await this.enforceRateLimit()

      // Build the search query
      const query = `${address}, ${city}, ${country}`

      // Build URL with query parameters
      const params = new URLSearchParams({
        q: query,
        format: 'json',
        limit: '1',
        addressdetails: '1'
      })

      const url = `${this.BASE_URL}?${params.toString()}`

      // Make the request with proper headers
      const response = await fetch(url, {
        headers: {
          'User-Agent': this.USER_AGENT,
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        console.error(`Nominatim API error: ${response.status} ${response.statusText}`)
        return null
      }

      const data: NominatimResponse[] = await response.json()

      // Check if we got any results
      if (!data || data.length === 0) {
        console.warn(`No geocoding results found for: ${query}`)
        return null
      }

      const result = data[0]

      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        displayName: result.display_name,
        accuracy: 'approximate'
      }

    } catch (error) {
      console.error('Geocoding error:', error)
      return null
    }
  }

  /**
   * Geocodes an address with smart fallback strategy
   * Tries multiple approaches in order:
   * 1. Full address with street number
   * 2. Street name without number
   * 3. City center as last resort
   *
   * @param address - Street address
   * @param city - City name
   * @param country - Country name
   * @returns GeocodingResult with coordinates and accuracy level, or null if all attempts fail
   */
  async geocodeAddressWithFallback(
    address: string,
    city: string,
    country: string
  ): Promise<GeocodingResult | null> {
    console.log('Starting multi-level geocoding fallback...')

    // Strategy 1: Try full address
    console.log('  Attempt 1: Full address')
    let result = await this.geocodeAddress(address, city, country)
    if (result) {
      console.log('  ✓ Success with full address')
      return { ...result, accuracy: 'exact' }
    }

    // Strategy 2: Try without street number (extract street name)
    const streetWithoutNumber = address.replace(/,?\s*\d+[a-zA-Z]?\s*$/g, '').trim()
    if (streetWithoutNumber !== address && streetWithoutNumber.length > 0) {
      console.log('  Attempt 2: Street name without number')
      result = await this.geocodeAddress(streetWithoutNumber, city, country)
      if (result) {
        console.log('  ✓ Success with street name (approximate)')
        return { ...result, accuracy: 'street' }
      }
    }

    // Strategy 3: Try city center as last resort
    console.log('  Attempt 3: City center fallback')
    result = await this.geocodeAddress(city, city, country)
    if (result) {
      console.log('  ✓ Success with city center (approximate location)')
      return { ...result, accuracy: 'city' }
    }

    console.log('  ✗ All geocoding attempts failed')
    return null
  }

  /**
   * Alternative method: Geocode using structured address components
   * This can be more accurate than a single query string
   *
   * @param street - Street address
   * @param city - City name
   * @param state - State/province (optional)
   * @param country - Country name
   * @param postalCode - Postal/ZIP code (optional)
   * @returns GeocodingResult with coordinates or null if not found
   */
  async geocodeStructured(params: {
    street: string
    city: string
    state?: string
    country: string
    postalCode?: string
  }): Promise<GeocodingResult | null> {
    try {
      // Enforce rate limiting
      await this.enforceRateLimit()

      // Build structured query parameters
      const queryParams = new URLSearchParams({
        street: params.street,
        city: params.city,
        country: params.country,
        format: 'json',
        limit: '1',
        addressdetails: '1'
      })

      if (params.state) {
        queryParams.append('state', params.state)
      }

      if (params.postalCode) {
        queryParams.append('postalcode', params.postalCode)
      }

      const url = `${this.BASE_URL}?${queryParams.toString()}`

      const response = await fetch(url, {
        headers: {
          'User-Agent': this.USER_AGENT,
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        console.error(`Nominatim API error: ${response.status} ${response.statusText}`)
        return null
      }

      const data: NominatimResponse[] = await response.json()

      if (!data || data.length === 0) {
        console.warn(`No geocoding results found for structured query`)
        return null
      }

      const result = data[0]

      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        displayName: result.display_name,
        accuracy: 'approximate'
      }

    } catch (error) {
      console.error('Structured geocoding error:', error)
      return null
    }
  }
}

// Export types for use in other modules
export type { GeocodingResult }

// Export a singleton instance to maintain rate limiting across requests
export const geocodingService = new GeocodingService()
