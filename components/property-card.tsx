import Link from 'next/link'
import Image from 'next/image'
import { Heart, Star, MapPin, Users, Bed, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'

interface PropertyCardProps {
  id: string
  title: string
  location: string
  price: number
  rating: number
  image: string
  guests: number
  bedrooms: number
  currency?: string
  variant?: 'grid' | 'list'
}

export function PropertyCard({
  id,
  title,
  location,
  price,
  rating,
  image,
  guests,
  bedrooms,
  currency = "EUR",
  variant = "grid"
}: PropertyCardProps) {
  // List variant - horizontal layout with image on left
  if (variant === "list") {
    return (
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 max-h-[180px]">
        <Link href={`/property/${id}`}>
          <div className="flex h-[180px]">
            {/* Image - Left side */}
            <div className="relative w-[240px] shrink-0">
              {image ? (
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Camera className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              {rating > 0 && (
                <Badge className="absolute bottom-2 left-2 bg-black/60 hover:bg-black/70 backdrop-blur-sm border-0">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                  {rating.toFixed(1)}
                </Badge>
              )}
            </div>

            {/* Content - Right side */}
            <div className="flex-1 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-base group-hover:text-primary transition-colors line-clamp-1">
                    {title}
                  </h3>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 shrink-0"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span className="line-clamp-1">{location}</span>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    <span>{guests}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Bed className="h-3.5 w-3.5" />
                    <span>{bedrooms}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold">{formatPrice(price, currency)}</span>
                  <span className="text-sm text-muted-foreground"> / night</span>
                </div>
                <Button size="sm" variant="default">
                  View
                </Button>
              </div>
            </div>
          </div>
        </Link>
      </Card>
    )
  }

  // Grid variant - original vertical layout
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <Link href={`/property/${id}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Camera className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          <div className="absolute top-3 right-3">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-md"
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
          {rating > 0 && (
            <Badge
              className="absolute bottom-3 left-3 bg-black/60 hover:bg-black/70 backdrop-blur-sm border-0"
            >
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
              {rating.toFixed(1)}
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/property/${id}`}>
          <h3 className="font-semibold text-base mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {title}
          </h3>
        </Link>

        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-1">{location}</span>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            <span>{guests} {guests === 1 ? 'guest' : 'guests'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bed className="h-3.5 w-3.5" />
            <span>{bedrooms} {bedrooms === 1 ? 'bedroom' : 'bedrooms'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold">{formatPrice(price, currency)}</span>
            <span className="text-sm text-muted-foreground"> / night</span>
          </div>
          <Button size="sm" variant="default">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
