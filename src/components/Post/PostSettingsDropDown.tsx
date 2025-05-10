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
import { EllipsisIcon, Trash } from 'lucide-react'
import { deletePost } from '@/app/actions/post'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

interface Props {
  postId: number | string
  forumId: number | string
}

const PostSettingsDropdown = ({ postId, forumId }: Props) => {
  const { toast } = useToast()
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent post click event from firing
    setShowDeleteDialog(true)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deletePost(postId)
      
      if (result.success) {
        setShowDeleteDialog(false)
        router.refresh()
        router.push(`/c/${forumId}`) // Redirect to community page
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

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="absolute top-2 right-2 z-10 bg-foreground/70 text-background rounded-sm cursor-pointer h-8 w-8 flex items-center justify-center">
          <EllipsisIcon size={25} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="custom-dropdown-content">
          <DropdownMenuItem 
            className="custom-dropdown-item dropdown-cancel flex items-center gap-2 text-red-500 hover:text-red-600"
            onClick={handleDeleteClick}
          >
            <Trash size={16} />
            Delete Post
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
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
    </>
  )
}

export default PostSettingsDropdown
