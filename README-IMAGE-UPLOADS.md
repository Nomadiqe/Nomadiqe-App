# Image Upload Integration with Vercel Blob

This document describes the image upload functionality that has been integrated into the Nomadiqe app using Vercel Blob.

## 🚀 Features Implemented

### Core Infrastructure
- ✅ **Vercel Blob SDK** - Added to package.json
- ✅ **Upload API Route** - `/app/api/upload/route.ts`
- ✅ **Utilities Library** - Image validation, compression, and helpers
- ✅ **Custom Hook** - `useImageUpload` for easy integration
- ✅ **Reusable Components** - Multiple upload component variants

### Integrated Features
- ✅ **Profile Pictures** - Profile setup during onboarding
- ✅ **Property Photos** - Host listing creation (up to 20 images)
- ✅ **Post Images** - Content creation (up to 5 images)
- ✅ **Portfolio Images** - Influencer media kit (up to 10 images)

## 📦 Components Created

### 1. `ImageUpload` Component
- **Purpose**: Multiple image uploads with drag & drop
- **Features**: Progress tracking, validation, preview grid
- **Props**: `multiple`, `maxFiles`, `maxSizeInMB`, `onUploadComplete`

### 2. `SingleImageUpload` Component  
- **Purpose**: Single image uploads (profile pictures, avatars)
- **Variants**: `avatar`, `card`, `banner`
- **Features**: Overlay controls, drag & drop, compression

### 3. `ImageGallery` Component
- **Purpose**: Display and manage uploaded images
- **Features**: Lightbox, download, remove, reorder
- **Props**: `images`, `onRemove`, `readonly`, `enableLightbox`

## 🛠 Utilities & Hooks

### `useImageUpload` Hook
```typescript
const {
  images,
  isUploading,
  uploadProgress,
  uploadImages,
  removeImage,
  clearImages
} = useImageUpload({
  maxFiles: 5,
  maxSizeInMB: 10,
  onUploadComplete: (images) => { /* handle */ }
})
```

### Image Validation & Processing
- File type validation (JPG, PNG, WebP, GIF)
- File size limits (configurable)
- Client-side image compression
- Unique filename generation
- Preview URL creation

## 🔧 Setup Instructions

### 1. Environment Variables
Add to your `.env.local`:
```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_your-token-here
```

### 2. Vercel Blob Store Setup
1. Go to Vercel Dashboard → Your Project → Storage
2. Create a new Blob store named "Images" 
3. Copy the `BLOB_READ_WRITE_TOKEN` to your environment variables

### 3. Install Dependencies
The `@vercel/blob` package has been added to package.json. Run:
```bash
npm install
# or
pnpm install
```

## 📍 Integration Examples

### Profile Picture Upload
```tsx
<SingleImageUpload
  value={profilePicture}
  onChange={(url) => setProfilePicture(url)}
  variant="avatar"
  size="lg"
  placeholder="Upload profile picture"
  maxSizeInMB={5}
/>
```

### Multiple Image Upload  
```tsx
<ImageUpload
  multiple={true}
  maxFiles={5}
  maxSizeInMB={10}
  onUploadComplete={(images) => {
    const urls = images.map(img => img.url)
    setUploadedImages(prev => [...prev, ...urls])
  }}
/>
```

## 🔒 Security Features

### Server-Side Validation
- Authentication required for all uploads
- File type validation on server
- File size limits enforced
- Unique filenames with timestamps

### Client-Side Features
- File validation before upload
- Progress tracking with user feedback
- Error handling with toast notifications
- Upload cancellation support

## 🎨 User Experience

### Visual Feedback
- Drag & drop zones with hover states
- Upload progress bars and percentages
- Success/error toast notifications
- Image previews with remove buttons

### Responsive Design  
- Grid layouts adapt to screen size
- Touch-friendly controls on mobile
- Accessible keyboard navigation
- Loading states during uploads

## 🔄 File Processing Pipeline

1. **Client Selection** - User selects/drops images
2. **Validation** - File type, size, count checks  
3. **Compression** - Automatic compression for large images
4. **Upload** - Secure upload to Vercel Blob
5. **Storage** - URLs stored in application state/database
6. **Preview** - Immediate preview with management controls

## 📊 Upload Limits

| Feature | Max Files | Max Size | File Types |
|---------|-----------|----------|------------|
| Profile Picture | 1 | 5MB | JPG, PNG, WebP |
| Property Photos | 20 | 15MB | JPG, PNG, WebP, GIF |
| Post Images | 5 | 10MB | JPG, PNG, WebP, GIF |
| Portfolio Images | 10 | 8MB | JPG, PNG, WebP, GIF |

## 🚨 Important Notes

### Database Integration
- The current implementation focuses on file upload functionality
- URLs are stored in component state and passed to parent components
- Backend API routes should be updated to save URLs to database
- Consider adding metadata tracking (upload date, file size, user ID)

### Production Considerations
- Monitor Vercel Blob storage usage and costs
- Implement image optimization for different display sizes
- Consider adding image CDN for better performance
- Set up automated cleanup of unused images
- Add image moderation if needed for user-generated content

### Testing
- Test uploads with various file sizes and types
- Verify error handling for network failures
- Test on different devices and browsers
- Validate security measures and authentication

This implementation provides a robust, user-friendly image upload system that integrates seamlessly with your existing Nomadiqe application architecture.
