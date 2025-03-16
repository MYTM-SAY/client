'use client'
import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Upload, X, Image } from 'lucide-react'

interface BannerUploadProps {
  selectedImage: string | null
  onImageSelect: (file: File) => void
  onImageRemove: () => void
}

export const BannerUpload = ({
  selectedImage,
  onImageSelect,
  onImageRemove,
}: BannerUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onImageSelect(file)
    }
  }

  return (
    <div className="space-y-2">
      <Label>Community Banner Image</Label>
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 max-w-md">
        {selectedImage ? (
          <div className="relative">
            <img
              src={selectedImage}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={onImageRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <Image className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4 flex flex-col items-center">
              <input
                type="file"
                ref={inputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <Button
                variant="secondary"
                onClick={() => inputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" /> Upload Image
              </Button>
              <p className="mt-2 text-sm text-muted-foreground">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
