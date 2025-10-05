'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Link from 'next/link'
import { useTheme } from 'next-themes'

// Custom marker icon for Sicilian theme - Azure blue
const createCustomIcon = () => {
  return L.divIcon({
    className: 'custom-marker-icon',
    html: `
      <div style="
        position: relative;
        width: 32px;
        height: 32px;
      ">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                fill="hsl(200 95% 45%)"
                stroke="hsl(0 0% 100%)"
                stroke-width="1.5"/>
          <circle cx="12" cy="9" r="2.5" fill="hsl(0 0% 100%)"/>
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
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
  const tileUrl = activeTheme === 'dark'
    ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'

  const labelUrl = activeTheme === 'dark'
    ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png'
    : null

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
        <MapUpdater properties={validProperties} />
        {validProperties.map((property) => (
          <Marker
            key={property.id}
            position={[property.latitude!, property.longitude!]}
            icon={createCustomIcon()}
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
