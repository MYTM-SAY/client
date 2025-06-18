'use client'
import PostContent from './PostContent'
import PostActions from './PostActions'
import PostSettingsDropdown from './PostSettingsDropDown'
import Image from 'next/image'
import Link from 'next/link'
import { PostsResponse } from '@/app/actions/post'
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from '@/components/ui/dialog'
import { useState } from 'react'
import { X } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Comments from './Comments'
import { Comment } from '@/app/actions/post'
const IMG_FALLBACK = '/imgFallBack.581a9fe3.png'

interface Props {
  post: PostsResponse
  communityId: number | string
  communityName: string | undefined
  isAuthor: boolean
  initialVoteStatus: 'UPVOTE' | 'DOWNVOTE' | null
  comments?: Comment[]
  setComments?: React.Dispatch<React.SetStateAction<Comment[]>>
}

const visuallyHidden = 'sr-only'

function getFileInfo(url: string): {
  type: 'image' | 'pdf' | 'other'
  extension: string
} {
  const base = url.split('?')[0]
  const extension = base.split('.').pop()?.toLowerCase() || 'file'

  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
    return { type: 'image', extension }
  } else if (extension === 'pdf') {
    return { type: 'pdf', extension }
  }
  return { type: 'other', extension }
}

type AttachmentType = {
  url: string
  type: 'image' | 'pdf' | 'other'
  extension: string
}

export default function PostCard({
  post,
  communityId,
  communityName,
  isAuthor,
  initialVoteStatus,
  comments,
  setComments,
}: Props) {
  const [selectedAttachment, setSelectedAttachment] =
    useState<AttachmentType | null>(null)

  const [profileImageError, setProfileImageError] = useState(false)

  const handleAttachmentClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation()
    const fileInfo = getFileInfo(url)
    setSelectedAttachment({ url, ...fileInfo })
  }
  return (
    <>
      <div className="relative p-5 rounded-xl bg-card border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
        {isAuthor && (
          <div className="absolute top-4 right-4 z-10">
            <PostSettingsDropdown
              postId={post.id}
              forumId={post.forumId}
              post={post}
            />
          </div>
        )}

        <header className="flex gap-4 items-start">
          <div className="relative w-12 h-12 flex-shrink-0">
            <Image
              src={
                !profileImageError &&
                post.Author?.UserProfile?.profilePictureURL
                  ? post.Author?.UserProfile?.profilePictureURL
                  : IMG_FALLBACK
              }
              className="rounded-full object-cover border-2 border-white dark:border-gray-800"
              alt="Profile Image"
              fill
              sizes="48px"
              onError={() => setProfileImageError(true)}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-baseline gap-2">
              <Link
                href={`/profile/${post?.Author?.username || 'ERROR'}`}
                className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
                onClick={(e) => e.stopPropagation()}
              >
                {post?.Author?.fullname || 'ERROR'}
              </Link>

              <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              in{' '}
              <Link
                href={`/c/${communityId}`}
                className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                onClick={(e) => e.stopPropagation()}
              >
                {communityName}
              </Link>
            </p>
          </div>
        </header>

        <div className="mt-4">
          <PostContent
            title={post?.title || ''}
            content={post?.content || ''}
          />
        </div>

        {post.attachments && post.attachments.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {post.attachments.map((url, index) => {
              const { type, extension } = getFileInfo(url)
              return (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group"
                  onClick={(e) => handleAttachmentClick(e, url)}
                >
                  {type === 'image' ? (
                    <Image
                      src={url}
                      alt={`Attachment ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="relative w-full h-full bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center p-2">
                      <div className="bg-gray-200 dark:bg-gray-700 rounded-lg w-10 h-10 flex items-center justify-center mb-2">
                        <span className="text-xs font-bold uppercase">
                          {extension.slice(0, 3)}
                        </span>
                      </div>
                      <span className="text-xs text-gray-700 dark:text-gray-300 text-center truncate w-full px-1">
                        {url.split('/').pop()}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-2 left-2 right-2 text-xs text-white truncate opacity-0 group-hover:opacity-100 transition-opacity">
                    {url.split('/').pop()}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="border-t border-gray-100 dark:border-gray-800">
          <PostActions
            id={post.id}
            votes={post?.voteCounter || 0}
            commentCount={post.commentsCount}
            title={post.title}
            initialVoteStatus={initialVoteStatus}
          />
        </div>

        <div className="mt-5">
          <Comments
            postId={post.id}
            comments={comments}
            setComments={setComments}
          />
        </div>
      </div>

      <Dialog
        open={!!selectedAttachment}
        onOpenChange={() => setSelectedAttachment(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden bg-gray-900">
          <DialogTitle className={visuallyHidden}>
            View attachment from post: {post.title}
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors">
            <X className="h-5 w-5" />
            <span className={visuallyHidden}>Close</span>
          </DialogClose>
          {selectedAttachment && (
            <div className="relative w-full h-full flex items-center justify-center">
              {selectedAttachment.type === 'image' ? (
                <div className="relative w-full h-full min-h-[50vh] cursor-pointer">
                  <Image
                    src={selectedAttachment.url}
                    alt="Attachment preview"
                    fill
                    className="object-contain"
                    sizes="100vw"
                  />
                </div>
              ) : selectedAttachment.type === 'pdf' ? (
                <div className="w-full h-[80vh] flex flex-col">
                  <div className="bg-gray-800 p-3 text-white text-sm flex justify-between items-center">
                    <span className="truncate">
                      {selectedAttachment.url.split('/').pop()}
                    </span>
                    <a
                      href={selectedAttachment.url}
                      download={selectedAttachment.url.split('/').pop()}
                      className="ml-4 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Download
                    </a>
                  </div>
                  <iframe
                    src={selectedAttachment.url}
                    className="w-full flex-1 bg-white"
                    title="PDF Preview"
                  />
                </div>
              ) : (
                <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl text-center">
                  <div className="mx-auto bg-gray-200 dark:bg-gray-700 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    <span className="text-xl font-bold uppercase">
                      {selectedAttachment.extension.slice(0, 3)}
                    </span>
                  </div>
                  <h3 className="font-medium text-lg mb-2 text-gray-900 dark:text-white">
                    {selectedAttachment.url.split('/').pop()}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    This file type cannot be previewed
                  </p>
                  <a
                    href={selectedAttachment.url}
                    download={selectedAttachment.url.split('/').pop()}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Download File
                  </a>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
