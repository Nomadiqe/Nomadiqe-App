/**
 * Image upload utilities for Vercel Blob integration
 */

export interface ImageUploadOptions {
  maxSizeInMB?: number
  allowedTypes?: string[]
  maxFiles?: number
  compressionQuality?: number
}

export interface ImageValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

export const DEFAULT_UPLOAD_OPTIONS: ImageUploadOptions = {
  maxSizeInMB: 10,
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  maxFiles: 5,
  compressionQuality: 0.9,
}

/**
 * Validate image files before upload
 */
export function validateImageFiles(
  files: File[],
  options: ImageUploadOptions = DEFAULT_UPLOAD_OPTIONS
): ImageValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  
  const maxSizeBytes = (options.maxSizeInMB || 10) * 1024 * 1024
  const allowedTypes = options.allowedTypes || DEFAULT_UPLOAD_OPTIONS.allowedTypes!
  const maxFiles = options.maxFiles || 5

  // Check file count
  if (files.length > maxFiles) {
    errors.push(`Maximum ${maxFiles} files allowed. You selected ${files.length} files.`)
  }

  // Validate each file
  files.forEach((file, index) => {
    const fileNum = index + 1

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      errors.push(`File ${fileNum} (${file.name}): Invalid file type. Allowed types: ${allowedTypes.join(', ')}`)
    }

    // Check file size
    if (file.size > maxSizeBytes) {
      errors.push(`File ${fileNum} (${file.name}): File too large. Maximum size: ${options.maxSizeInMB}MB`)
    }

    // Check if file is very large (warning)
    if (file.size > maxSizeBytes * 0.8) {
      warnings.push(`File ${fileNum} (${file.name}): Large file size may slow down upload`)
    }

    // Check for common issues
    if (file.name.length > 100) {
      warnings.push(`File ${fileNum}: Very long filename may cause issues`)
    }
  })

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Generate a unique filename with timestamp and random suffix
 */
export function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now()
  const randomSuffix = Math.random().toString(36).substring(2, 8)
  const extension = originalName.split('.').pop() || 'jpg'
  const nameWithoutExtension = originalName.split('.').slice(0, -1).join('.')
  
  // Clean filename: remove special characters and spaces
  const cleanName = nameWithoutExtension
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 30)
  
  return `${cleanName}-${timestamp}-${randomSuffix}.${extension}`
}

/**
 * Compress image using canvas (client-side)
 */
export function compressImage(
  file: File,
  quality: number = 0.9,
  maxWidth: number = 1920,
  maxHeight: number = 1080
): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height
        height = maxHeight
      }

      canvas.width = width
      canvas.height = height

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            })
            resolve(compressedFile)
          } else {
            reject(new Error('Failed to compress image'))
          }
        },
        file.type,
        quality
      )
    }

    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Create image preview URL
 */
export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Extract image metadata
 */
export function getImageInfo(file: File): Promise<{
  width: number
  height: number
  aspectRatio: number
}> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height,
      })
    }
    
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}

