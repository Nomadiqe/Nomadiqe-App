'use client'

import { useRef, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useImageUpload, type UseImageUploadOptions } from '@/hooks/use-image-upload'
import { formatFileSize } from '@/lib/image-upload'
import { 
  ImageIcon, 
  X, 
  Upload, 
  AlertCircle,
  Check,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageUploadProps extends UseImageUploadOptions {
  className?: string
  multiple?: boolean
  disabled?: boolean
  placeholder?: string
  children?: React.ReactNode
}

export function ImageUpload({
  className,
  multiple = true,
  disabled = false,
  placeholder,
  children,
  ...uploadOptions
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const {
    images,
    isUploading,
    uploadProgress,
    uploadImages,
    removeImage,
  } = useImageUpload(uploadOptions)

  const handleFileSelect = useCallback((files: File[]) => {
    if (files.length > 0) {
      uploadImages(files)
    }
  }, [uploadImages])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    handleFileSelect(files)
    // Clear input to allow re-uploading same file
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

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      <div
        className={cn(
          'relative border-2 border-dashed rounded-lg transition-colors',
          isDragOver ? 'border-primary bg-primary/5' : 'border-border',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept="image/*"
          onChange={handleInputChange}
          disabled={disabled || isUploading}
          className="sr-only"
        />

        {children ? (
          <div onClick={!disabled ? openFileDialog : undefined} className="cursor-pointer">
            {children}
          </div>
        ) : (
          <div
            onClick={!disabled ? openFileDialog : undefined}
            className={cn(
              'flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:bg-accent/50 transition-colors',
              disabled && 'cursor-not-allowed hover:bg-transparent'
            )}
          >
            <ImageIcon className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-sm font-medium text-foreground mb-2">
              {placeholder || `Click to upload or drag and drop`}
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, WebP or GIF (max {uploadOptions.maxSizeInMB || 10}MB each)
            </p>
            {multiple && (
              <p className="text-xs text-muted-foreground">
                Up to {uploadOptions.maxFiles || 5} files
              </p>
            )}
          </div>
        )}

        {/* Upload Progress Overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
            <div className="text-center space-y-2">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
              <p className="text-sm font-medium">Uploading...</p>
              {uploadProgress && (
                <div className="w-48 space-y-1">
                  <p className="text-xs text-muted-foreground truncate">
                    {uploadProgress.fileName}
                  </p>
                  <Progress value={uploadProgress.percentage} className="w-full" />
                  <p className="text-xs text-muted-foreground">
                    {Math.round(uploadProgress.percentage)}%
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Uploaded Images Preview */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="relative group">
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                <img
                  src={image.preview}
                  alt="Upload preview"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Remove Button */}
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(image.id)}
              >
                <X className="w-3 h-3" />
              </Button>

              {/* File Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-xs rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="truncate">{image.file.name}</p>
                <p>{formatFileSize(image.size)}</p>
              </div>

              {/* Success Indicator */}
              <div className="absolute top-2 left-2 bg-green-500 text-white rounded-full p-1">
                <Check className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Upload Button */}
      {!isUploading && images.length === 0 && (
        <Button
          type="button"
          variant="outline"
          onClick={openFileDialog}
          disabled={disabled}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          {multiple ? 'Select Images' : 'Select Image'}
        </Button>
      )}
    </div>
  )
}

