'use client'

import { useState } from 'react'
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
import { Camera, UserPlus } from 'lucide-react'
import PostHeader from '../Post/PostHeader'

export function CreatePost() {
  const [postContent, setPostContent] = useState('')

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground"
        >
          What&apos;s on your mind, Joe?
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader className="border-b p-4">
          <DialogTitle className="text-lg">Create Post</DialogTitle>
        </DialogHeader>
        <PostHeader
          profileImage="/download (3).jpeg"
          username={'Youssif'}
          timestamp="6h ago"
          community="General"
        />
        <Textarea
          placeholder="What's on your mind, John?"
          className="px-4 mt-4 min-h-[150px] resize-none border-none shadow-none p-lg"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
        />

        <div className="m-4 rounded-lg border p-4 p-lg">
          <div className="flex items-center justify-between">
            <span className="font-medium">Add to your post</span>
          </div>

          <div className="mt-3 flex gap-4">
            <Button variant="outline" className="gap-2 relative" asChild>
              <label>
                <div className="flex items-center gap-2 relative">
                  <Camera className="h-5 w-5 text-green-600" />
                  <span>Photo/Video</span>
                  <Input
                    type="file"
                    className="absolute left-0 top-0 h-full w-full opacity-0 cursor-pointer"
                  />
                </div>
              </label>
            </Button>

            <Button variant="outline" className="gap-2">
              <UserPlus className="h-5 w-5 text-blue-600" />
              Tag People
            </Button>
          </div>
        </div>

        <div className="border-t p-4">
          <Button className="w-full font-semibold" size="lg">
            Post
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
