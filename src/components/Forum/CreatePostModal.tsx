'use client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '../ui/input'
import { createPost } from '@/app/actions/post'
import { useState } from 'react'
import FileUploader from '@/components/FileUploader'
import Image from 'next/image'
import { X } from 'lucide-react'

export default function CreatePostModal({ fid }: { fid: string | number }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mediaUrls, setMediaUrls] = useState<string[]>([])

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    try {
      if (mediaUrls.length > 0) {
        mediaUrls.forEach((url) => {
          formData.append('mediaUrls[]', url)
        })
      }

      await createPost(formData)

      setOpen(false)
      setMediaUrls([])
    } catch (error) {
      console.error('[CreatePostModal] Error in form submission:', error)
      if (error instanceof Error) {
        console.error('[CreatePostModal] Error details:', {
          message: error.message,
          stack: error.stack,
        })
      }
    } finally {
      setLoading(false)
      console.log('[CreatePostModal] Form submission process ended')
    }
  }

  const handleModalStateChange = (newState: boolean) => {
    console.log('[CreatePostModal] Modal state changing:', {
      from: open,
      to: newState,
    })
    if (!newState) {
      console.log('[CreatePostModal] Modal closing, resetting state')
      setMediaUrls([])
    }
    setOpen(newState)
  }

  const removeMedia = (index: number) => {
    setMediaUrls((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <Dialog open={open} onOpenChange={handleModalStateChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground"
        >
          What&apos;s on your mind?
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader className="border-b p-4">
          <DialogTitle className="text-lg">Create Post</DialogTitle>
        </DialogHeader>

        <form action={handleSubmit}>
          <input type="hidden" name="fid" value={fid} />

          <Input
            required
            name="title"
            placeholder="Post Title"
            className="px-4 mt-4"
            onChange={(e) =>
              console.log('[CreatePostModal] Title input:', e.target.value)
            }
          />

          <Textarea
            required
            name="content"
            placeholder="What's on your mind, John?"
            className="px-4 mt-4 min-h-[150px] resize-none border-none shadow-none p-lg"
            onChange={(e) =>
              console.log('[CreatePostModal] Content input:', e.target.value)
            }
          />

          {/* Media Preview Section */}
          {mediaUrls.length > 0 && (
            <div className="m-4 rounded-lg border p-4">
              <h3 className="font-medium mb-3">Uploaded Media</h3>
              <div className="grid grid-cols-2 gap-3">
                {mediaUrls.map((url, index) => (
                  <div key={index} className="relative group aspect-video">
                    <Image
                      src={url}
                      alt={`Uploaded media ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeMedia(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="m-4 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Add to your post</span>
            </div>
            <div className="mt-3">
              <FileUploader
                accept="image/*,video/*"
                multiple={true}
                maxSize={16 * 1024 * 1024} // 16MB limit
                onUploadComplete={(urls) => {
                  console.log(
                    '[CreatePostModal] Files uploaded successfully:',
                    urls,
                  )
                  setMediaUrls((prev) => {
                    const newUrls = [...prev, ...urls]
                    console.log(
                      '[CreatePostModal] Updated media URLs:',
                      newUrls,
                    )
                    return newUrls
                  })
                }}
              />
            </div>
          </div>

          <div className="border-t p-4">
            <Button
              type="submit"
              className="w-full font-semibold"
              size="lg"
              disabled={loading}
              onClick={() =>
                console.log('[CreatePostModal] Submit button clicked')
              }
            >
              {loading ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
