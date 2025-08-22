import Link from 'next/link'
import Image from 'next/image'
import { Heart, Star, MapPin, Users, Bed } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
  currency = "EUR"
}: PropertyCardProps) {
  return (
    <div className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <Link href={`/property/${id}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3">
            <Button
              size="icon"
              variant="ghost"
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
            >
              <Heart className="w-4 h-4" />
            </Button>
          </div>
          <div className="absolute bottom-3 left-3">
            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-sm">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>{rating}</span>
            </div>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/property/${id}`}>
          <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>
        
        <div className="flex items-center text-muted-foreground text-sm mb-2">
          <MapPin className="w-3 h-3 mr-1" />
          {location}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{guests} guests</span>
          </div>
          <div className="flex items-center gap-1">
            <Bed className="w-3 h-3" />
            <span>{bedrooms} bedroom{bedrooms !== 1 ? 's' : ''}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-semibold">{formatPrice(price, currency)}</span>
            <span className="text-sm text-muted-foreground"> / night</span>
          </div>
          <Button size="sm" className="bg-nomadiqe-600 hover:bg-nomadiqe-700">
            View Details
          </Button>
        </div>
      </div>
    </div>
  )
}
