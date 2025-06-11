'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Comment,
  updateComment,
  deleteComment,
  replyComment,
} from '@/app/actions/comment'
import { useToast } from '@/hooks/use-toast'
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
import { Textarea } from '@/components/ui/textarea'
import { EllipsisIcon, Trash, Pencil } from 'lucide-react'

interface Props {
  comment: Comment & { parentId?: number }
  childrenArray: (Comment & { parentId?: number })[]
  isAuthor: boolean
  currentUserId: string | number
  onNewReply: (newComment: Comment & { parentId?: number }) => void
}

export default function CommentCard({
  comment,
  childrenArray,
  isAuthor,
  currentUserId,
  onNewReply,
}: Props) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showReplyDialog, setShowReplyDialog] = useState(false)
  const [editedContent, setEditedContent] = useState(comment.content)
  const [replyContent, setReplyContent] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isReplying, setIsReplying] = useState(false)
  const [localComment, setLocalComment] = useState(comment)
  const [isDeleted, setIsDeleted] = useState(false)
  const { toast } = useToast()

  const handleEditClick = () => {
    setEditedContent(localComment.content)
    setShowEditDialog(true)
  }

  const handleDeleteClick = () => {
    setShowDeleteDialog(true)
  }

  const handleUpdate = async () => {
    setIsUpdating(true)
    try {
      const result = await updateComment(localComment.id, editedContent)

      if (result.success) {
        setShowEditDialog(false)
        setLocalComment({ ...localComment, content: editedContent })
        toast({
          title: 'Success',
          description: 'Comment updated successfully',
        })
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message || 'Failed to update comment',
        })
      }
    } catch (error) {
      console.error('Error updating comment:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update comment. Please try again.',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteComment(localComment.id)

      if (result.success) {
        setShowDeleteDialog(false)
        setIsDeleted(true)
        toast({
          title: 'Success',
          description: 'Comment deleted successfully',
        })
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message || 'Failed to delete comment',
        })
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete comment. Please try again.',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleReply = async () => {
    setIsReplying(true)
    try {
      const result = await replyComment({
        content: replyContent,
        postId: localComment.postId,
        parentId: localComment.id,
      })
      console.log(replyContent, localComment.postId, localComment.id)
      if (result.success && result.data) {
        toast({
          title: 'Success',
          description: 'Reply posted successfully',
        })
        setShowReplyDialog(false)
        setReplyContent('')

        onNewReply({
          ...result.data,
          parentId: localComment.id,
          Author: result.data.Author
            ? {
                ...result.data.Author,
                UserProfile: result.data.Author.UserProfile || null,
              }
            : null,
        })
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message || 'Failed to post reply',
        })
      }
    } catch (error) {
      console.error('Error replying to comment:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to post reply. Please try again.',
      })
    } finally {
      setIsReplying(false)
    }
  }

  if (isDeleted) {
    return null
  }

  return (
    <div className="mb-4">
      <div className="flex gap-4 items-start p-4 rounded-lg bg-card shadow">
        <Image
          src={
            localComment.Author?.UserProfile?.profilePictureURL ||
            '/pp-fallback.svg'
          }
          alt="Profile Image"
          width={48}
          height={48}
          className="rounded-full mt-1 flex-shrink-0"
        />
        <div className="flex-1">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <Link
                href={`/u/${localComment.Author.username}`}
                className="font-medium hover:underline"
              >
                {localComment?.Author?.fullname || 'ERROR'}
              </Link>
              <span className="text-sm text-muted-foreground">
                {new Date(localComment.createdAt).toLocaleDateString()}
              </span>
            </div>
            {isAuthor && (
              <DropdownMenu>
                <DropdownMenuTrigger className="bg-foreground/70 text-background rounded-sm cursor-pointer h-8 w-8 flex items-center justify-center">
                  <EllipsisIcon size={20} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="custom-dropdown-content">
                  <DropdownMenuItem
                    className="custom-dropdown-item flex items-center gap-2 text-primary hover:text-primary/90 cursor-pointer"
                    onClick={handleEditClick}
                  >
                    <Pencil size={16} />
                    Edit Comment
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="custom-dropdown-item dropdown-cancel flex items-center gap-2 text-red-500 hover:text-red-600"
                    onClick={handleDeleteClick}
                  >
                    <Trash size={16} />
                    Delete Comment
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <p className="mt-1 text-foreground">{localComment.content}</p>

          {/* Reply button - text only */}
          <div className="mt-2">
            <Button
              variant="link"
              size="sm"
              onClick={() => setShowReplyDialog(true)}
              className="text-muted-foreground hover:text-primary p-0 h-auto"
            >
              Reply
            </Button>
          </div>
        </div>
      </div>

      {childrenArray.filter((c) => c.parentId === localComment.id).length >
        0 && (
        <div className="ml-12 mt-2 border-l-2 border-border pl-4">
          {childrenArray
            .filter((c) => c.parentId === localComment.id)
            .map((c) => (
              <CommentCard
                key={c.id}
                comment={c}
                childrenArray={childrenArray}
                isAuthor={c.authorId === currentUserId}
                currentUserId={currentUserId}
                onNewReply={onNewReply}
              />
            ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Comment</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowEditDialog(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={isUpdating || !editedContent.trim()}
            >
              {isUpdating ? 'Updating...' : 'Update Comment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Comment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this comment? This action cannot
              be undone.
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
              {isDeleting ? 'Deleting...' : 'Delete Comment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog open={showReplyDialog} onOpenChange={setShowReplyDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reply to Comment</DialogTitle>
            <DialogDescription>
              Replying to {localComment.Author?.fullname}'s comment
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="min-h-[100px]"
              placeholder="Write your reply..."
            />
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowReplyDialog(false)}
              disabled={isReplying}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReply}
              disabled={isReplying || !replyContent.trim()}
            >
              {isReplying ? 'Posting...' : 'Post Reply'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
