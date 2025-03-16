import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Plus, Video, Image } from 'lucide-react'

interface AdditionalMediaProps {
  onVideoUpload: () => void
  onGalleryUpload: () => void
}

export const AdditionalMedia = ({
  onVideoUpload,
  onGalleryUpload,
}: AdditionalMediaProps) => {
  return (
    <div className="space-y-2">
      <Label>Additional Media</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-4 hover:border-blue-500 transition-colors duration-200">
          <div className="flex items-center space-x-2">
            <Video className="h-5 w-5 text-blue-500" />
            <div className="flex-1">
              <h4 className="text-sm font-medium">Add Video Content</h4>
              <p className="text-sm text-muted-foreground">
                Upload video files (MP4, WebM)
              </p>
            </div>
            <Button
              size="sm"
              onClick={onVideoUpload}
              variant="outline"
              className="hover:bg-blue-500 hover:text-white transition-colors duration-200"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="border rounded-lg p-4 hover:border-blue-500 transition-colors duration-200">
          <div className="flex items-center space-x-2">
            <Image className="h-5 w-5 text-blue-500" />
            <div className="flex-1">
              <h4 className="text-sm font-medium">Add Images</h4>
              <p className="text-sm text-muted-foreground">
                Upload multiple images (PNG, JPG, GIF)
              </p>
            </div>
            <Button
              size="sm"
              onClick={onGalleryUpload}
              variant="outline"
              className="hover:bg-blue-500 hover:text-white transition-colors duration-200"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
