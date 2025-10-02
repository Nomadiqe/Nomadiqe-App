import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import Image from "next/image"
import { MapPin, Users, Bed, Bath, Star, Heart, Share2, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface PropertyPageProps {
  params: {
    id: string
  }
}

async function getProperty(id: string) {
  try {
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
        reviews: {
          include: {
            reviewer: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
      },
    })

    return property
  } catch (error) {
    console.error("Error fetching property:", error)
    return null
  }
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const property = await getProperty(params.id)

  if (!property) {
    notFound()
  }

  const averageRating = property.reviews.length > 0
    ? property.reviews.reduce((acc: number, review: any) => acc + review.rating, 0) / property.reviews.length
    : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Feed
          </Button>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Property Title and Actions */}
        <div className="mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {property.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{property.city}, {property.country}</span>
                </div>
                {property.reviews.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{averageRating.toFixed(1)}</span>
                    <span>({property.reviews.length} reviews)</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Images Gallery */}
        {property.images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8 rounded-xl overflow-hidden">
            <div className="relative h-96 md:h-[500px]">
              <Image
                src={property.images[0]}
                alt={property.title}
                fill
                className="object-cover"
              />
            </div>
            {property.images.length > 1 && (
              <div className="grid grid-cols-2 gap-2">
                {property.images.slice(1, 5).map((image: string, index: number) => (
                  <div key={index} className="relative h-48 md:h-[246px]">
                    <Image
                      src={image}
                      alt={`${property.title} ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Info */}
            <div>
              <div className="flex items-center gap-6 pb-6 border-b border-border">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm">{property.maxGuests} guests</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bed className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm">{property.bedrooms} bedrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm">{property.bathrooms} bathrooms</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">About this place</h2>
              <p className="text-muted-foreground leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            {property.amenities.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 gap-4">
                  {property.amenities.map((amenity: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* House Rules */}
            {property.rules.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">House Rules</h2>
                <div className="space-y-2">
                  {property.rules.map((rule: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      <span className="text-sm">{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {property.reviews.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">
                  Reviews ({property.reviews.length})
                </h2>
                <div className="space-y-6">
                  {property.reviews.map((review: any) => (
                    <div key={review.id} className="border-b border-border pb-6 last:border-b-0">
                      <div className="flex items-start gap-4">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted">
                          {review.reviewer.image ? (
                            <Image
                              src={review.reviewer.image}
                              alt={review.reviewer.name || "User"}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg font-semibold">
                              {review.reviewer.name?.[0] || "U"}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-semibold">{review.reviewer.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{review.rating}</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 border border-border rounded-xl p-6 shadow-lg">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold">
                    {property.currency === "EUR" ? "€" : "$"}{property.price}
                  </span>
                  <span className="text-muted-foreground">/ night</span>
                </div>
                {property.reviews.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{averageRating.toFixed(1)}</span>
                    </div>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">{property.reviews.length} reviews</span>
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Check-in</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-border rounded-md"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Check-out</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-border rounded-md"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Guests</label>
                  <select className="w-full px-4 py-2 border border-border rounded-md">
                    {Array.from({ length: property.maxGuests }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "guest" : "guests"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Button className="w-full" size="lg">
                Reserve
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-4">
                You won't be charged yet
              </p>

              {/* Host Info */}
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="font-semibold mb-4">Hosted by</h3>
                <Link href={`/profile/${property.host.id}`}>
                  <div className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted">
                      {property.host.image ? (
                        <Image
                          src={property.host.image}
                          alt={property.host.name || "Host"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg font-semibold">
                          {property.host.name?.[0] || "H"}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{property.host.name}</p>
                      <p className="text-sm text-muted-foreground">View profile</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}