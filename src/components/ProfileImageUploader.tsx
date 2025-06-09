'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Upload, X, User } from 'lucide-react'
import { uploadMedia } from '@/lib/actions/upload'
import { toast } from 'react-hot-toast'

interface ProfileImageUploaderProps {
  currentImageUrl?: string
  onImageUpload: (imageUrl: string) => void
  onImageRemove: () => void
  disabled?: boolean
}

export default function ProfileImageUploader({
  currentImageUrl,
  onImageUpload,
  onImageRemove,
  disabled = false,
}: ProfileImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error('Image size must be less than 5MB')
      return
    }

    setIsUploading(true)
    try {
      // Create preview
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)

      // Upload file
      const result = await uploadMedia([file])
      if (result.success) {
        const uploadedUrl = result.data[0]
        onImageUpload(uploadedUrl)
        toast.success('Profile image uploaded successfully')
        
        // Clean up object URL
        URL.revokeObjectURL(objectUrl)
        setPreviewUrl(uploadedUrl)
      } else {
        toast.error(result.message)
        URL.revokeObjectURL(objectUrl)
        setPreviewUrl(currentImageUrl || null)
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image')
      setPreviewUrl(currentImageUrl || null)
    } finally {
      setIsUploading(false)
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveImage = () => {
    setPreviewUrl(null)
    onImageRemove()
    toast.success('Profile image removed')
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="h-32 w-32 border-4 border-border">
          <AvatarImage 
            src={previewUrl || undefined} 
            alt="Profile picture"
            className="object-cover"
          />
          <AvatarFallback className="text-2xl">
            <User className="h-12 w-12" />
          </AvatarFallback>
        </Avatar>
        
        {previewUrl && !disabled && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-8 w-8 rounded-full p-0"
            onClick={handleRemoveImage}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex flex-col items-center space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || isUploading}
        />
        
        <Button
          type="button"
          variant={previewUrl ? "outline" : "default"}
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          className="flex items-center space-x-2"
        >
          <Upload className="h-4 w-4" />
          <span>
            {isUploading 
              ? 'Uploading...' 
              : previewUrl 
                ? 'Change Image' 
                : 'Upload Image'
            }
          </span>
        </Button>
        
        <p className="text-xs text-muted-foreground text-center">
          Recommended: Square image, max 5MB<br />
          Supports JPG, PNG, GIF formats
        </p>
      </div>
    </div>
  )
} 