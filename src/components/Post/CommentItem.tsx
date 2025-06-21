'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  replyComment,
  deleteComment,
  upVote,
  downVote,
  updateComment,
  getChildsOfComment,
} from '@/app/actions/comment'
import { Comment } from '@/app/actions/post'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import fallbackImg from '../../../public/imgFallBack.581a9fe3.png'

// Define extended comment type with vote info
type CommentWithVotes = Comment & {
  voteCount?: number
  voteType?: 'UPVOTE' | 'DOWNVOTE' | 'NONE'
}

export function CommentItem({
  comment,
  currentUserId,
  onCommentChange,
  canModerate,
}: {
  comment: CommentWithVotes
  currentUserId: string | null
  onCommentChange: () => void
  canModerate?: boolean
}) {
  // Comment management states
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [editError, setEditError] = useState<string | null>(null)

  // Editing states
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(comment.content)
  const [isSaving, setIsSaving] = useState(false)

  // Voting states
  const [voteCount, setVoteCount] = useState(comment.voteCount || 0)
  const [currentVote, setCurrentVote] = useState(comment.voteType)
  const [isVoting, setIsVoting] = useState(false)

  // Replying states
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [isReplyingLoading, setIsReplyingLoading] = useState(false)
  const [replyError, setReplyError] = useState<string | null>(null)

  // Replies management states
  const [showReplies, setShowReplies] = useState(false)
  const [childComments, setChildComments] = useState<CommentWithVotes[]>([])
  const [loadingReplies, setLoadingReplies] = useState(false)
  const [repliesError, setRepliesError] = useState<string | null>(null)
  const [hasReplies, setHasReplies] = useState(false)

  // Check if user has delete permissions (author or moderator)
  const canDelete =
    !!currentUserId &&
    (currentUserId === comment.authorId.toString() || canModerate === true)

  // Check if comment has replies
  useEffect(() => {
    const checkForReplies = async () => {
      try {
        const result = await getChildsOfComment(comment.id)
        setHasReplies(result.success && result.data.length > 0)
      } catch {
        setHasReplies(false)
      }
    }

    // Only check if we haven't already loaded replies
    if (!childComments.length) {
      checkForReplies()
    } else {
      setHasReplies(childComments.length > 0)
    }
  }, [comment.id, childComments])

  // Fetch child comments
  const fetchReplies = async () => {
    setLoadingReplies(true)
    setRepliesError(null)
    try {
      const result = await getChildsOfComment(comment.id)
      if (result.success) {
        setChildComments(result.data)
        setHasReplies(result.data.length > 0)
      } else {
        setRepliesError(result.message || 'Failed to load replies')
        setHasReplies(false)
      }
    } catch (error) {
      setRepliesError('An unexpected error occurred')
      setHasReplies(false)
    } finally {
      setLoadingReplies(false)
    }
  }

  // Toggle replies visibility
  const toggleReplies = () => {
    if (!showReplies && childComments.length === 0) {
      fetchReplies()
    }
    setShowReplies(!showReplies)
  }

  // Handle child comment changes
  const handleChildChange = () => {
    // Refresh child comments
    fetchReplies()
    // Propagate change to parent
    onCommentChange()
  }

  // Handle reply submission
  const handleReplySubmit = async () => {
    if (!currentUserId) return
    setIsReplyingLoading(true)
    setReplyError(null)

    try {
      const result = await replyComment({
        postId: comment.postId,
        content: replyContent,
        parentId: comment.id,
      })

      if (result.success) {
        setIsReplying(false)
        setReplyContent('')
        // Refresh child comments if shown
        if (showReplies) {
          fetchReplies()
        } else {
          // Update hasReplies state
          setHasReplies(true)
        }
      } else {
        setReplyError(result.message || 'Failed to post reply')
      }
    } catch (_) {
      setReplyError('An unexpected error occurred')
    } finally {
      setIsReplyingLoading(false)
    }
  }

  const handleEdit = async () => {
    if (!currentUserId || currentUserId !== comment.authorId.toString()) return
    setIsSaving(true)
    setEditError(null)

    try {
      const result = await updateComment(comment.id, editedContent)
      if (result.success) {
        setIsEditing(false)
        onCommentChange()
      } else {
        setEditError(result.message || 'Failed to update comment')
      }
    } catch (_) {
      setEditError('An unexpected error occurred')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!canDelete) return
    setIsDeleting(true)
    setDeleteError(null)

    try {
      const result = await deleteComment(comment.id)
      if (result.success) {
        onCommentChange()
      } else {
        setDeleteError(result.message || 'Failed to delete comment')
      }
    } catch (_) {
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
      let newVote: 'UPVOTE' | 'DOWNVOTE' | 'NONE' = type
      if (currentVote === 'NONE') {
        newCount = type === 'UPVOTE' ? voteCount + 1 : voteCount - 1
      } else if (currentVote === type) {
        newVote = 'NONE'
        newCount = type === 'UPVOTE' ? voteCount - 1 : voteCount + 1
      } else if (currentVote) {
        newCount = type === 'UPVOTE' ? voteCount + 2 : voteCount - 2
      }

      setVoteCount(newCount)
      setCurrentVote(newVote)

      const action = type === 'UPVOTE' ? upVote : downVote
      const result = await action(comment.id)

      if (!result.success) throw new Error(result.message || 'Vote failed')
    } catch (error) {
      setVoteCount(originalCount)
      setCurrentVote(originalVote)
      setDeleteError(error instanceof Error ? error.message : 'Vote failed')
    } finally {
      setIsVoting(false)
    }
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setEditedContent(comment.content)
    setEditError(null)
  }

  return (
    <div className={`mb-4`}>
      <div className={`flex`}>
        <div className="flex-shrink-0 mr-3">
          <Image
            src={comment.Author.UserProfile.profilePictureURL || fallbackImg}
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

                <button
                  onClick={() => setIsReplying(true)}
                  className={`mr-3 hover:text-blue-600 `}
                >
                  Reply
                </button>

                {/* Edit button (only for author) */}
                {currentUserId === comment.authorId.toString() && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mr-3 hover:text-blue-600"
                  >
                    Edit
                  </button>
                )}

                {/* Delete button (for author or moderator) */}
                {canDelete && (
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className={`hover:text-red-600 ${
                      isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                )}
              </div>
            </>
          )}

          {/* Reply form - now positioned directly under the comment actions */}
          {!isEditing && isReplying && (
            <div className="mt-3">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={3}
                className="w-full p-2 border rounded-md"
                placeholder="Write your reply..."
                disabled={isReplyingLoading}
              />
              <div className="flex justify-end space-x-2 mt-2">
                <Button
                  onClick={() => {
                    setIsReplying(false)
                    setReplyContent('')
                    setReplyError(null)
                  }}
                  variant="outline"
                  disabled={isReplyingLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReplySubmit}
                  disabled={isReplyingLoading || replyContent.trim() === ''}
                >
                  {isReplyingLoading ? 'Replying...' : 'Reply'}
                </Button>
              </div>
              {replyError && (
                <p className="text-red-500 text-xs mt-1">{replyError}</p>
              )}
            </div>
          )}

          {!isEditing && deleteError && (
            <p className="text-red-500 text-xs mt-1">{deleteError}</p>
          )}
        </div>
      </div>

      {/* Replies section */}
      <div className="mt-2 ml-10 pl-4 border-l-2 border-gray-200">
        {/* View Replies button - only show if has replies or we're showing replies */}
        {(hasReplies || showReplies) && (
          <button
            onClick={toggleReplies}
            disabled={loadingReplies}
            className={`mr-3 hover:text-blue-600 p-2 text-gray-500 text-sm`}
          >
            {loadingReplies
              ? 'Loading...'
              : showReplies
              ? 'Hide Replies'
              : 'View Replies'}
          </button>
        )}

        {/* Error message */}
        {repliesError && (
          <p className="text-red-500 text-sm mt-1">{repliesError}</p>
        )}

        {/* Child comments */}
        {showReplies && (
          <div>
            {loadingReplies ? (
              <p className="text-gray-500 text-sm">Loading replies...</p>
            ) : childComments.length > 0 ? (
              childComments.map((child) => (
                <CommentItem
                  key={child.id}
                  comment={child}
                  currentUserId={currentUserId}
                  onCommentChange={handleChildChange}
                  canModerate={canModerate}
                />
              ))
            ) : (
              <p className="text-gray-500 text-sm">No replies yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
