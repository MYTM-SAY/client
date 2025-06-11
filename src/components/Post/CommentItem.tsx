'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  getComments,
  deleteComment,
  upVote,
  downVote,
  updateComment, // ADDED: Import update function
} from '@/app/actions/comment'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'

export function CommentItem({
  comment,
  depth = 0,
  currentUserId,
  onCommentChange, // RENAMED: More generic name
}: {
  comment: any
  depth?: number
  currentUserId: string | null
  onCommentChange: () => void // RENAMED: For both delete and edit updates
}) {
  const maxDepth = 5
  const indentClass = depth > 0 ? `ml-${Math.min(depth * 4, maxDepth * 4)}` : ''
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [editError, setEditError] = useState<string | null>(null) // ADDED: Edit error state

  // ADDED: Edit state management
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(comment.content)
  const [isSaving, setIsSaving] = useState(false)

  const [voteCount, setVoteCount] = useState(comment.voteCount || 0)
  const [currentVote, setCurrentVote] = useState(comment.voteType || null)
  const [isVoting, setIsVoting] = useState(false)

  // ADDED: Handle comment edit
  const handleEdit = async () => {
    if (!currentUserId || currentUserId !== comment.authorId) return
    setIsSaving(true)
    setEditError(null)

    try {
      const result = await updateComment(comment.id, editedContent)
      if (result.success) {
        setIsEditing(false)
        onCommentChange() // Refresh comments
      } else {
        setEditError(result.message || 'Failed to update comment')
      }
    } catch (err) {
      setEditError('An unexpected error occurred')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!currentUserId || currentUserId !== comment.authorId) return
    setIsDeleting(true)
    setDeleteError(null)

    try {
      const result = await deleteComment(comment.id)
      if (result.success) {
        onCommentChange() // RENAMED: More generic
      } else {
        setDeleteError(result.message || 'Failed to delete comment')
      }
    } catch (err) {
      setDeleteError('An unexpected error occurred')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleVote = async (type: 'UPVOTE' | 'DOWNVOTE') => {
    if (!currentUserId || isVoting) return

    setIsVoting(true)
    const originalVote = currentVote
    const originalCount = voteCount

    try {
      let newCount = voteCount
      let newVote: 'UPVOTE' | 'DOWNVOTE' | null = type
      if (currentVote === 'NONE') {
        newCount = type === 'UPVOTE' ? voteCount + 1 : voteCount - 1
      } else if (currentVote === type) {
        newVote = null
        newCount = type === 'UPVOTE' ? voteCount - 1 : voteCount + 1
      } else if (currentVote) {
        newCount = type === 'UPVOTE' ? voteCount + 2 : voteCount - 2
      }

      setVoteCount(newCount)
      setCurrentVote(newVote)

      const action = type === 'UPVOTE' ? upVote : downVote
      const result = await action(comment.id)

      if (!result.success) throw new Error(result.message || 'Vote failed')

      if (result.data?.voteCount !== undefined)
        setVoteCount(result.data.voteCount)
      if (result.data?.voteType !== undefined)
        setCurrentVote(result.data.voteType)
    } catch (error) {
      setVoteCount(originalCount)
      setCurrentVote(originalVote)
      setDeleteError(error instanceof Error ? error.message : 'Vote failed')
    } finally {
      setIsVoting(false)
    }
  }

  // ADDED: Cancel edit and reset content
  const cancelEdit = () => {
    setIsEditing(false)
    setEditedContent(comment.content)
    setEditError(null)
  }

  return (
    <div className={`mb-4 ${depth > 0 ? 'pt-3' : ''}`}>
      <div className={`flex ${indentClass}`}>
        <div className="flex-shrink-0 mr-3">
          <Image
            src={
              comment.Author?.UserProfile?.profilePictureURL ||
              '/default-avatar.png'
            }
            alt={comment.Author?.fullname || 'User'}
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
        <div className="flex-1 bg-card rounded-lg px-4 py-2">
          <div className="flex items-center mb-1">
            <span className="font-semibold mr-2">
              {comment.Author?.fullname || 'Unknown User'}
            </span>
            <span className="text-gray-500 text-sm">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>

          {/* EDIT MODE */}
          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                rows={3}
                className="w-full p-2 border rounded-md"
                disabled={isSaving}
              />
              <div className="flex justify-end space-x-2 mt-2">
                <Button
                  onClick={cancelEdit}
                  variant="outline"
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleEdit}
                  disabled={isSaving || editedContent.trim() === ''}
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              </div>
              {editError && (
                <p className="text-red-500 text-xs mt-1">{editError}</p>
              )}
            </div>
          ) : (
            /* VIEW MODE */
            <>
              <p className="">{comment.content}</p>

              <div className="flex items-center mt-2 text-sm text-gray-500">
                <div className="flex items-center mr-4">
                  <button
                    onClick={() => handleVote('UPVOTE')}
                    disabled={!currentUserId || isVoting}
                    className={`mr-1 ${
                      currentVote === 'UPVOTE'
                        ? 'text-blue-600'
                        : 'hover:text-blue-600'
                    }`}
                    aria-label="Upvote"
                  >
                    ▲
                  </button>
                  <span className="mx-1 min-w-[20px] text-center">
                    {voteCount}
                  </span>
                  <button
                    onClick={() => handleVote('DOWNVOTE')}
                    disabled={!currentUserId || isVoting}
                    className={`ml-1 ${
                      currentVote === 'DOWNVOTE'
                        ? 'text-blue-600'
                        : 'hover:text-blue-600'
                    }`}
                    aria-label="Downvote"
                  >
                    ▼
                  </button>
                </div>

                <button className="mr-3 hover:text-blue-600">Reply</button>
                {currentUserId === comment.authorId && (
                  <div className="flex">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="mr-3 hover:text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className={`hover:text-red-600 ${
                        isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {!isEditing && deleteError && (
            <p className="text-red-500 text-xs mt-1">{deleteError}</p>
          )}
        </div>
      </div>

      {/* Recursively render replies */}
      {comment.Children && comment.Children.length > 0 && (
        <div
          className={`${
            depth > 0 ? 'ml-10' : 'ml-14'
          } mt-2 border-l-2 border-gray-200 pl-4`}
        >
          {comment.Children.map((child: any) => (
            <CommentItem
              key={child.id}
              comment={child}
              depth={depth + 1}
              currentUserId={currentUserId}
              onCommentChange={onCommentChange} // RENAMED: More generic
            />
          ))}
        </div>
      )}
    </div>
  )
}
