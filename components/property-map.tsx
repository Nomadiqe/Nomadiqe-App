'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Link from 'next/link'
import { useTheme } from 'next-themes'

// Custom marker icon showing property image and price
const createPropertyMarkerIcon = (imageUrl: string, price: number, currency: string) => {
  return L.divIcon({
    className: 'custom-property-marker',
    html: `
      <div style="
        position: relative;
        width: 80px;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        cursor: pointer;
        transition: transform 0.2s;
      "
      onmouseover="this.style.transform='scale(1.1)'"
      onmouseout="this.style.transform='scale(1)'">
        <img
          src="${imageUrl || '/placeholder-property.jpg'}"
          alt="Property"
          style="
            width: 80px;
            height: 60px;
            object-fit: cover;
            display: block;
          "
        />
        <div style="
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
          padding: 4px 6px 2px;
        ">
          <div style="
            color: white;
            font-size: 11px;
            font-weight: 700;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
            text-align: center;
          ">
            ${currency} ${price}
          </div>
        </div>
      </div>
    `,
    iconSize: [80, 60],
    iconAnchor: [40, 60],
    popupAnchor: [0, -60],
  })
}

interface PropertyMapProps {
  properties: {
    id: string
    title: string
    city: string
    country: string
    latitude?: number | null
    longitude?: number | null
    price: number
    currency: string
    images: string[]
  }[]
}

function MapUpdater({ properties }: { properties: PropertyMapProps['properties'] }) {
  const map = useMap()

  useEffect(() => {
    // Filter properties with valid coordinates
    const validProperties = properties.filter(p => p.latitude && p.longitude)

    if (validProperties.length > 0) {
      // Calculate bounds to fit all markers
      const bounds = L.latLngBounds(
        validProperties.map(p => [p.latitude!, p.longitude!])
      )
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 })
    }
  }, [properties, map])

  return null
}

function ThemeUpdater({ theme }: { theme: string | undefined }) {
  const map = useMap()

  useEffect(() => {
    const container = map.getContainer()
    const isDark = theme === 'dark'

    // Remove both classes first
    container.classList.remove('sicilian-map-light', 'sicilian-map-dark')

    // Add the appropriate class
    if (isDark) {
      container.classList.add('sicilian-map-dark')
    } else {
      container.classList.add('sicilian-map-light')
    }
  }, [theme, map])

  return null
}

export function PropertyMap({ properties }: PropertyMapProps) {
  const { theme, resolvedTheme } = useTheme()

  // Filter properties that have valid coordinates
  const validProperties = properties.filter(
    p => p.latitude != null && p.longitude != null
  )

  if (validProperties.length === 0) {
    return (
      <div className="w-full h-full min-h-[400px] bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">No properties with location data available</p>
      </div>
    )
  }

  // Calculate center point (average of all coordinates)
  const center: [number, number] = [
    validProperties.reduce((sum, p) => sum + (p.latitude || 0), 0) / validProperties.length,
    validProperties.reduce((sum, p) => sum + (p.longitude || 0), 0) / validProperties.length,
  ]

  // Determine which theme is active
  const activeTheme = resolvedTheme || theme

  // Choose tile layer based on theme - Sicilian island aesthetic
  // Use light tiles for both, apply invert filter for dark mode
  const tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
  const labelUrl = null

  const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'

  return (
    <div className="w-full h-full min-h-[400px] lg:min-h-[calc(100vh-200px)] rounded-lg overflow-hidden border border-border">
      <MapContainer
        center={center}
        zoom={10}
        scrollWheelZoom={true}
        className={`h-full w-full ${activeTheme === 'dark' ? 'sicilian-map-dark' : 'sicilian-map-light'}`}
      >
        <TileLayer
          key={`base-${activeTheme}`}
          attribution={attribution}
          url={tileUrl}
          opacity={activeTheme === 'dark' ? 0.7 : 1}
        />
        {labelUrl && (
          <TileLayer
            key={`labels-${activeTheme}`}
            url={labelUrl}
            opacity={0.9}
          />
        )}
        <ThemeUpdater theme={activeTheme} />
        <MapUpdater properties={validProperties} />
        {validProperties.map((property) => (
          <Marker
            key={property.id}
            position={[property.latitude!, property.longitude!]}
            icon={createPropertyMarkerIcon(
              property.images[0] || '/placeholder-property.jpg',
              property.price,
              property.currency
            )}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                {property.images[0] && (
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                )}
                <h3 className="font-semibold text-sm mb-1">{property.title}</h3>
                <p className="text-xs text-gray-600 mb-2">
                  {property.city}, {property.country}
                </p>
                <p className="font-bold text-sm mb-2">
                  {property.currency} {property.price}/night
                </p>
                <Link
                  href={`/property/${property.id}`}
                  className="text-xs text-primary hover:underline"
                >
                  View Property →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
