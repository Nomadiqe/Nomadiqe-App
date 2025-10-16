'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Home,
  Users,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Shield,
  Clock,
  AlertCircle,
  MapPin,
  MapPinOff,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface Property {
  id: string
  title: string
  city: string
  country: string
  price: number
  currency: string
  maxGuests: number
  bedrooms: number
  images: string[]
  isActive: boolean
  isVerified: boolean
  latitude: number | null
  longitude: number | null
  geocodingAccuracy: string | null
  geocodingFailed: boolean
  createdAt: string
  host: {
    id: string
    name: string | null
    fullName: string | null
    email: string
  }
  bookingsCount: number
  reviewsCount: number
}

interface AdminDashboardProps {
  user: any
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [coordinatesDialog, setCoordinatesDialog] = useState<{ open: boolean; propertyId: string | null }>({ open: false, propertyId: null })
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [savingCoordinates, setSavingCoordinates] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchProperties()
  }, [statusFilter])

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const url = statusFilter === 'all'
        ? '/api/admin/properties'
        : `/api/admin/properties?status=${statusFilter}`

      const response = await fetch(url)
      const data = await response.json()

      if (data.success) {
        setProperties(data.properties)
      }
    } catch (error) {
      console.error('Failed to fetch properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const togglePropertyStatus = async (propertyId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/properties/${propertyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      })

      const data = await response.json()

      if (data.success) {
        // Update local state
        setProperties(properties.map(p =>
          p.id === propertyId ? { ...p, isActive: !currentStatus } : p
        ))
      } else {
        alert('Failed to update property status')
      }
    } catch (error) {
      console.error('Failed to toggle property status:', error)
      alert('Failed to update property status')
    }
  }

  const verifyProperty = async (propertyId: string) => {
    try {
      const response = await fetch(`/api/admin/properties/${propertyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: true })
      })

      const data = await response.json()

      if (data.success) {
        setProperties(properties.map(p =>
          p.id === propertyId ? { ...p, isVerified: true } : p
        ))
      } else {
        alert('Failed to verify property')
      }
    } catch (error) {
      console.error('Failed to verify property:', error)
      alert('Failed to verify property')
    }
  }

  const deleteProperty = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/properties/${propertyId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        setProperties(properties.filter(p => p.id !== propertyId))
      } else {
        alert('Failed to delete property')
      }
    } catch (error) {
      console.error('Failed to delete property:', error)
      alert('Failed to delete property')
    }
  }

  const openCoordinatesDialog = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId)
    if (property) {
      setLatitude(property.latitude?.toString() || '')
      setLongitude(property.longitude?.toString() || '')
      setCoordinatesDialog({ open: true, propertyId })
    }
  }

  const saveCoordinates = async () => {
    if (!coordinatesDialog.propertyId) return

    const lat = parseFloat(latitude)
    const lng = parseFloat(longitude)

    if (isNaN(lat) || isNaN(lng)) {
      alert('Please enter valid latitude and longitude values')
      return
    }

    if (lat < -90 || lat > 90) {
      alert('Latitude must be between -90 and 90')
      return
    }

    if (lng < -180 || lng > 180) {
      alert('Longitude must be between -180 and 180')
      return
    }

    setSavingCoordinates(true)

    try {
      const response = await fetch(`/api/admin/properties/${coordinatesDialog.propertyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude: lat, longitude: lng })
      })

      const data = await response.json()

      if (data.success) {
        // Update local state
        setProperties(properties.map(p =>
          p.id === coordinatesDialog.propertyId
            ? { ...p, latitude: lat, longitude: lng, geocodingAccuracy: 'exact', geocodingFailed: false }
            : p
        ))
        setCoordinatesDialog({ open: false, propertyId: null })
        alert('Coordinates updated successfully!')
      } else {
        alert('Failed to update coordinates')
      }
    } catch (error) {
      console.error('Failed to save coordinates:', error)
      alert('Failed to update coordinates')
    } finally {
      setSavingCoordinates(false)
    }
  }

  const stats = {
    total: properties.length,
    active: properties.filter(p => p.isActive).length,
    inactive: properties.filter(p => !p.isActive).length,
    verified: properties.filter(p => p.isVerified).length,
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center">
                <Shield className="w-8 h-8 mr-3 text-primary" />
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage properties and moderate content
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All listings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <p className="text-xs text-muted-foreground">Published listings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Under Review</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.inactive}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified</CardTitle>
              <Shield className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.verified}</div>
              <p className="text-xs text-muted-foreground">Verified hosts</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Property Management</CardTitle>
                <CardDescription>Review and manage all property listings</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                >
                  All ({properties.length})
                </Button>
                <Button
                  variant={statusFilter === 'active' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('active')}
                >
                  Active
                </Button>
                <Button
                  variant={statusFilter === 'inactive' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('inactive')}
                >
                  Under Review
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading properties...</p>
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No properties found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {properties.map((property) => (
                  <div
                    key={property.id}
                    className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    {/* Property Image */}
                    <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={property.images[0] || '/placeholder-property.jpg'}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        {property.isVerified && (
                          <Badge variant="default" className="bg-blue-500">
                            <Shield className="w-3 h-3" />
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Property Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg truncate">{property.title}</h3>
                          <div className="flex items-center text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span className="text-sm">{property.city}, {property.country}</span>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span>{property.maxGuests} guests</span>
                            <span>{property.bedrooms} bedrooms</span>
                            <span className="font-semibold text-foreground">
                              {property.currency} {property.price}/night
                            </span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <Badge variant={property.isActive ? 'default' : 'secondary'}>
                          {property.isActive ? 'Published' : 'Under Review'}
                        </Badge>
                      </div>

                      {/* Host Info */}
                      <div className="mt-3 p-2 bg-muted/50 rounded text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {property.host.fullName || property.host.name || 'Unknown Host'}
                          </span>
                          <span className="text-muted-foreground">({property.host.email})</span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>{property.bookingsCount} bookings</span>
                        <span>{property.reviewsCount} reviews</span>
                        <span>Created {new Date(property.createdAt).toLocaleDateString()}</span>
                      </div>

                      {/* Geocoding Warning */}
                      {(property.geocodingFailed || (!property.latitude || !property.longitude)) && (
                        <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                          <div className="flex items-start gap-2">
                            <MapPinOff className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <h4 className="font-semibold text-orange-900 dark:text-orange-200 text-sm">
                                Location Not Set
                              </h4>
                              <p className="text-orange-700 dark:text-orange-300 text-xs mt-1">
                                {property.geocodingFailed
                                  ? 'Automatic geocoding failed. This property will not appear on the map.'
                                  : 'No coordinates found. This property will not appear on the map.'}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Geocoding Accuracy Info */}
                      {property.geocodingAccuracy && property.geocodingAccuracy !== 'exact' && property.latitude && property.longitude && (
                        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded text-xs">
                          <MapPin className="h-3 w-3 inline mr-1 text-blue-600" />
                          <span className="text-blue-700 dark:text-blue-300">
                            Location accuracy: <strong>{property.geocodingAccuracy}</strong>
                            {property.geocodingAccuracy === 'city' && ' (showing city center)'}
                            {property.geocodingAccuracy === 'street' && ' (showing street, not exact address)'}
                          </span>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 mt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                        >
                          <Link href={`/property/${property.id}`} target="_blank">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>

                        {!property.isVerified && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => verifyProperty(property.id)}
                          >
                            <Shield className="h-4 w-4 mr-1" />
                            Verify
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openCoordinatesDialog(property.id)}
                          className={(property.geocodingFailed || (!property.latitude || !property.longitude)) ? 'border-orange-500 text-orange-600 hover:bg-orange-50' : ''}
                        >
                          <MapPin className="h-4 w-4 mr-1" />
                          Set Location
                        </Button>

                        <Button
                          size="sm"
                          variant={property.isActive ? 'destructive' : 'default'}
                          onClick={() => togglePropertyStatus(property.id, property.isActive)}
                        >
                          {property.isActive ? (
                            <>
                              <XCircle className="h-4 w-4 mr-1" />
                              Unpublish
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Publish
                            </>
                          )}
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteProperty(property.id)}
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Coordinates Dialog */}
      <Dialog open={coordinatesDialog.open} onOpenChange={(open) => setCoordinatesDialog({ ...coordinatesDialog, open })}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Set Property Location</DialogTitle>
            <DialogDescription>
              Enter the exact latitude and longitude for this property. You can find these coordinates using Google Maps or OpenStreetMap.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="latitude">
                Latitude <span className="text-muted-foreground text-xs">(e.g., 41.3851)</span>
              </Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                placeholder="41.3851"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Must be between -90 and 90
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="longitude">
                Longitude <span className="text-muted-foreground text-xs">(e.g., 2.1734)</span>
              </Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                placeholder="2.1734"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Must be between -180 and 180
              </p>
            </div>
            <div className="rounded-lg bg-muted p-3 text-sm">
              <p className="font-medium mb-1">How to find coordinates:</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Open Google Maps and search for the address</li>
                <li>Right-click on the location and select the coordinates</li>
                <li>Copy and paste them here</li>
              </ol>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCoordinatesDialog({ open: false, propertyId: null })}
              disabled={savingCoordinates}
            >
              Cancel
            </Button>
            <Button onClick={saveCoordinates} disabled={savingCoordinates}>
              {savingCoordinates ? 'Saving...' : 'Save Location'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
