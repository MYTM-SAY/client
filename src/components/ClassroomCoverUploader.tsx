'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, X, ImageIcon } from 'lucide-react'
import { uploadMedia } from '@/lib/actions/upload'
import { toast } from 'react-hot-toast'
import Image from 'next/image'

interface ClassroomCoverUploaderProps {
  currentImageUrl?: string
  onImageUpload: (imageUrl: string) => void
  onImageRemove: () => void
  disabled?: boolean
}

export default function ClassroomCoverUploader({
  currentImageUrl,
  onImageUpload,
  onImageRemove,
  disabled = false,
}: ClassroomCoverUploaderProps) {
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

    // Validate file size (10MB max for cover images)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error('Image size must be less than 10MB')
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
        toast.success('Cover image uploaded successfully')
        
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
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(null)
    onImageRemove()
    toast.success('Cover image removed')
  }

  return (
    <div className="space-y-4">
      {previewUrl ? (
        <div className="space-y-3">
          <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-border">
            <Image
              src={previewUrl}
              alt="Classroom cover preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {!disabled && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 h-8 w-8 p-0"
                onClick={handleRemoveImage}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {!disabled && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>Change Cover Image</span>
            </Button>
          )}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg h-48 flex flex-col items-center justify-center space-y-4 bg-gray-50 dark:bg-gray-900/50">
          <div className="text-gray-400">
            <ImageIcon className="h-16 w-16" />
          </div>
          <div className="text-center">
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
              variant="default"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isUploading}
              className="flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>
                {isUploading ? 'Uploading...' : 'Upload Cover Image'}
              </span>
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Recommended: 16:9 aspect ratio, JPG or PNG, max 10MB
            </p>
          </div>
        </div>
      )}
    </div>
  )
} 