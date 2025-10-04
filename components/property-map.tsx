'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Link from 'next/link'

// Fix for default marker icon in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

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

  return (
    <div className="w-full h-full min-h-[400px] lg:min-h-[calc(100vh-200px)] rounded-lg overflow-hidden border border-border">
      <MapContainer
        center={center}
        zoom={10}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater properties={validProperties} />
        {validProperties.map((property) => (
          <Marker
            key={property.id}
            position={[property.latitude!, property.longitude!]}
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
