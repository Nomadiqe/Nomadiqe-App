'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useImageUpload, type UseImageUploadOptions } from '@/hooks/use-image-upload'
import { 
  Camera, 
  User, 
  X, 
  Loader2,
  Upload
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SingleImageUploadProps extends Omit<UseImageUploadOptions, 'maxFiles'> {
  value?: string
  onChange?: (url: string | null) => void
  className?: string
  disabled?: boolean
  placeholder?: string
  variant?: 'avatar' | 'card' | 'banner'
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24', 
  lg: 'w-32 h-32',
  xl: 'w-40 h-40',
}

const variantStyles = {
  avatar: 'rounded-full',
  card: 'rounded-lg',
  banner: 'rounded-lg aspect-video w-full h-32',
}

export function SingleImageUpload({
  value,
  onChange,
  className,
  disabled = false,
  placeholder = "Upload image",
  variant = 'avatar',
  size = 'md',
  ...uploadOptions
}: SingleImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const {
    images,
    isUploading,
    uploadProgress,
    uploadImages,
    removeImage,
    clearImages,
  } = useImageUpload({
    ...uploadOptions,
    maxFiles: 1,
    onUploadComplete: (uploadedImages) => {
      if (uploadedImages.length > 0) {
        onChange?.(uploadedImages[0].url)
      }
      uploadOptions.onUploadComplete?.(uploadedImages)
    },
  })

  const currentImage = images.length > 0 ? images[0] : null
  const displayUrl = currentImage?.preview || value

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      // Clear existing images first
      clearImages()
      uploadImages([files[0]])
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    handleFileSelect(files)
    event.target.value = ''
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)

    const files = Array.from(event.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    )
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

  const handleRemove = () => {
    if (currentImage) {
      removeImage(currentImage.id)
    }
    onChange?.(null)
  }

  const containerClasses = cn(
    'relative group border-2 border-dashed border-border transition-colors overflow-hidden',
    variantStyles[variant],
    variant !== 'banner' && sizeClasses[size],
    isDragOver && 'border-primary bg-primary/5',
    disabled && 'opacity-50 cursor-not-allowed',
    !displayUrl && 'bg-muted',
    className
  )

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        disabled={disabled || isUploading}
        className="sr-only"
      />

      <div
        className={containerClasses}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {displayUrl ? (
          <>
            {/* Image Display */}
            <img
              src={displayUrl}
              alt="Uploaded image"
              className="w-full h-full object-cover"
            />
            
            {/* Overlay Controls */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={openFileDialog}
                  disabled={disabled || isUploading}
                >
                  <Camera className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleRemove}
                  disabled={disabled || isUploading}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div
            onClick={!disabled ? openFileDialog : undefined}
            className={cn(
              'flex flex-col items-center justify-center h-full cursor-pointer hover:bg-accent/50 transition-colors p-4',
              disabled && 'cursor-not-allowed hover:bg-transparent'
            )}
          >
            {variant === 'avatar' ? (
              <User className="w-8 h-8 text-muted-foreground mb-2" />
            ) : (
              <Upload className="w-8 h-8 text-muted-foreground mb-2" />
            )}
            <p className="text-xs text-center text-muted-foreground">
              {placeholder}
            </p>
          </div>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary mb-2" />
            {uploadProgress && (
              <div className="w-3/4 space-y-1">
                <Progress value={uploadProgress.percentage} className="w-full h-1" />
                <p className="text-xs text-center text-muted-foreground">
                  {Math.round(uploadProgress.percentage)}%
                </p>
              </div>
            )}
          </div>
        )}

        {/* Upload Button (for avatar variant) */}
        {variant === 'avatar' && !displayUrl && !isUploading && (
          <Button
            type="button"
            size="sm"
            className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
            onClick={openFileDialog}
            disabled={disabled}
          >
            <Camera className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Upload Button (for non-avatar variants) */}
      {variant !== 'avatar' && !displayUrl && !isUploading && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={openFileDialog}
          disabled={disabled}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          Select Image
        </Button>
      )}
    </div>
  )
}

