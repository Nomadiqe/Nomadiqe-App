'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ImageIcon, X, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PropertyImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxFiles?: number
  className?: string
}

export function PropertyImageUpload({ 
  images, 
  onImagesChange, 
  maxFiles = 10, 
  className 
}: PropertyImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileSelect = (files: File[]) => {
    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length === 0) return

    // Convert files to data URLs for preview (in a real app, you'd upload to a server)
    imageFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        if (dataUrl && images.length < maxFiles) {
          onImagesChange([...images, dataUrl])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    handleFileSelect(files)
    // Clear input to allow re-uploading same file
    event.target.value = ''
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)

    const files = Array.from(event.dataTransfer.files)
    handleFileSelect(files)
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      <div
        className={cn(
          'relative border-2 border-dashed rounded-lg transition-colors',
          isDragOver ? 'border-primary bg-primary/5' : 'border-border'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleInputChange}
          className="sr-only"
        />

        <div
          onClick={openFileDialog}
          className="flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:bg-accent/50 transition-colors"
        >
          <ImageIcon className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-sm font-medium text-foreground mb-2">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-muted-foreground">
            PNG, JPG, WebP or GIF (max 10MB each)
          </p>
          <p className="text-xs text-muted-foreground">
            Up to {maxFiles} files
          </p>
        </div>
      </div>

      {/* Uploaded Images Preview */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                <img
                  src={image}
                  alt={`Property photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Remove Button */}
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Quick Upload Button */}
      {images.length === 0 && (
        <Button
          type="button"
          variant="outline"
          onClick={openFileDialog}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          Select Images
        </Button>
      )}
    </div>
  )
}
