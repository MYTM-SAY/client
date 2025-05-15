'use client'

import React, { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { EllipsisIcon, Trash, Pencil, X } from 'lucide-react'
import { deletePost, updatePost } from '@/app/actions/post'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import FileUploader from '@/components/FileUploader'
import { PostsResponse } from '@/app/actions/post'
import Image from 'next/image'

interface Props {
  postId: number | string
  forumId: number | string
  post: PostsResponse
}

const PostSettingsDropdown = ({ postId, forumId, post }: Props) => {
  const { toast } = useToast()
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [mediaUrls, setMediaUrls] = useState<string[]>(post.attachments || [])

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDeleteDialog(true)
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowEditDialog(true)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deletePost(postId)

      if (result.success) {
        setShowDeleteDialog(false)
        router.refresh()
        router.push(`/c/${forumId}`)
        toast({
          title: 'Success',
          description: 'Post deleted successfully',
        })
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message || 'Failed to delete post',
        })
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete post. Please try again.',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUpdate = async (formData: FormData) => {
    setIsUpdating(true)
    try {
      if (mediaUrls.length > 0) {
        mediaUrls.forEach((url) => {
          formData.append('mediaUrls[]', url)
        })
      }

      formData.append('postId', postId.toString())
      formData.append('forumId', forumId.toString())

      await updatePost(formData)
      setShowEditDialog(false)
      router.refresh()
      toast({
        title: 'Success',
        description: 'Post updated successfully',
      })
    } catch (error) {
      console.error('Error updating post:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update post. Please try again.',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const removeImage = (index: number) => {
    setMediaUrls((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="absolute top-2 right-2 z-10 bg-foreground/70 text-background rounded-sm cursor-pointer h-8 w-8 flex items-center justify-center">
          <EllipsisIcon size={25} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="custom-dropdown-content">
          <DropdownMenuItem
            className="custom-dropdown-item flex items-center gap-2 text-primary hover:text-primary/90 cursor-pointer"
            onClick={handleEditClick}
          >
            <Pencil size={16} />
            Edit Post
          </DropdownMenuItem>
          <DropdownMenuItem
            className="custom-dropdown-item dropdown-cancel flex items-center gap-2 text-red-500 hover:text-red-600"
            onClick={handleDeleteClick}
          >
            <Trash size={16} />
            Delete Post
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Post'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="border-b p-4">
            <DialogTitle className="text-lg">Edit Post</DialogTitle>
          </DialogHeader>

          <form action={handleUpdate}>
            <Input
              required
              name="title"
              placeholder="Post Title"
              className="px-4 mt-4"
              defaultValue={post.title}
            />

            <Textarea
              required
              name="content"
              placeholder="What's on your mind?"
              className="px-4 mt-4 min-h-[150px] resize-none border-none shadow-none p-lg"
              defaultValue={post.content}
            />

            {/* Existing Images Preview */}
            {mediaUrls.length > 0 && (
              <div className="px-4 mt-4">
                <h3 className="font-medium mb-2">Current Images</h3>
                <div className="grid grid-cols-2 gap-2">
                  {mediaUrls.map((url, index) => (
                    <div key={index} className="relative group aspect-video">
                      <Image
                        src={url}
                        alt={`Attachment ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="px-4 mt-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Add more images</span>
              </div>
              <div className="mt-3">
                <FileUploader
                  accept="image/*,video/*"
                  multiple={true}
                  maxSize={16 * 1024 * 1024} // 16MB limit
                  onUploadComplete={(urls) => {
                    setMediaUrls((prev) => [...prev, ...urls])
                  }}
                />
              </div>
            </div>

            <div className="border-t p-4">
              <Button
                type="submit"
                className="w-full font-semibold"
                size="lg"
                disabled={isUpdating}
              >
                {isUpdating ? 'Updating...' : 'Update Post'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default PostSettingsDropdown
