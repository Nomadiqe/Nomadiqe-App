'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { formatFileSize } from '@/lib/image-upload'
import { 
  X, 
  Eye, 
  Download,
  MoreHorizontal,
  Maximize2
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface GalleryImage {
  id: string
  url: string
  name?: string
  size?: number
  width?: number
  height?: number
}

interface ImageGalleryProps {
  images: GalleryImage[]
  onRemove?: (id: string) => void
  onReorder?: (images: GalleryImage[]) => void
  className?: string
  readonly?: boolean
  columns?: number
  showInfo?: boolean
  enableLightbox?: boolean
}

interface LightboxProps {
  images: GalleryImage[]
  currentIndex: number
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
}

function Lightbox({ images, currentIndex, onClose, onNext, onPrevious }: LightboxProps) {
  const currentImage = images[currentIndex]

  if (!currentImage) return null

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center p-4">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 text-white hover:bg-white/20"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Navigation */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
              onClick={onPrevious}
            >
              ←
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
              onClick={onNext}
            >
              →
            </Button>
          </>
        )}

        {/* Image */}
        <img
          src={currentImage.url}
          alt={currentImage.name || `Image ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain"
        />

        {/* Image Info */}
        <div className="absolute bottom-4 left-4 text-white text-sm">
          <p className="font-medium">{currentImage.name}</p>
          {currentImage.size && (
            <p className="text-white/70">{formatFileSize(currentImage.size)}</p>
          )}
          {images.length > 1 && (
            <p className="text-white/70">
              {currentIndex + 1} of {images.length}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export function ImageGallery({
  images,
  onRemove,
  onReorder,
  className,
  readonly = false,
  columns = 3,
  showInfo = true,
  enableLightbox = true,
}: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const openLightbox = (index: number) => {
    if (enableLightbox) {
      setLightboxIndex(index)
      setLightboxOpen(true)
    }
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % images.length)
  }

  const previousImage = () => {
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No images uploaded yet
      </div>
    )
  }

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  }

  return (
    <>
      <div className={cn('space-y-4', className)}>
        {/* Image Grid */}
        <div className={cn(
          'grid gap-4',
          gridCols[columns as keyof typeof gridCols] || 'grid-cols-3'
        )}>
          {images.map((image, index) => (
            <div key={image.id} className="relative group">
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                <img
                  src={image.url}
                  alt={image.name || `Image ${index + 1}`}
                  className="w-full h-full object-cover cursor-pointer transition-transform group-hover:scale-105"
                  onClick={() => openLightbox(index)}
                />
              </div>

              {/* Overlay Controls */}
              {!readonly && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex space-x-2">
                    {enableLightbox && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => openLightbox(index)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => window.open(image.url, '_blank')}
                    >
                      <Download className="w-4 h-4" />
                    </Button>

                    {onRemove && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => onRemove(image.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* View Icon for readonly mode */}
              {readonly && enableLightbox && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => openLightbox(index)}
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
              )}

              {/* Image Info */}
              {showInfo && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-xs rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="truncate">{image.name || `Image ${index + 1}`}</p>
                  {image.size && (
                    <p>{formatFileSize(image.size)}</p>
                  )}
                  {image.width && image.height && (
                    <p>{image.width} × {image.height}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Gallery Actions */}
        {!readonly && images.length > 0 && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{images.length} image{images.length === 1 ? '' : 's'}</span>
            
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  images.forEach(image => {
                    const link = document.createElement('a')
                    link.href = image.url
                    link.download = image.name || `image-${image.id}`
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                  })
                }}
              >
                <Download className="w-4 h-4 mr-1" />
                Download All
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrevious={previousImage}
        />
      )}
    </>
  )
}

