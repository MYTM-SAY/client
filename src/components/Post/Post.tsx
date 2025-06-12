'use client'
import PostContent from './PostContent'
import PostActions from './PostActions'
import PostSettingsDropdown from './PostSettingsDropDown'
import Image from 'next/image'
import Link from 'next/link'
import { PostsResponse } from '@/app/actions/post'
import { formatDateTime } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from '@/components/ui/dialog'
import { useState } from 'react'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Comments from './Comments'

// Define fallback image path
const IMG_FALLBACK = '/imgFallBack.581a9fe3.png'

interface Props {
  post: PostsResponse
  communityId: number | string
  communityName: string
  isAuthor: boolean
  initialVoteStatus: 'UPVOTE' | 'DOWNVOTE' | null
}

const visuallyHidden =
  'absolute w-[1px] h-[1px] p-0 -m-[1px] overflow-hidden clip-[rect(0,0,0,0)] whitespace-nowrap border-0'

// Helper function to determine file type
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

export default function PostCard({
  post,
  communityId,
  communityName,
  isAuthor,
  initialVoteStatus,
}: Props) {
  const [selectedAttachment, setSelectedAttachment] = useState<{
    url: string
    type: 'image' | 'pdf' | 'other'
  } | null>(null)
  const router = useRouter()
  // State to handle broken profile images
  const [profileImageError, setProfileImageError] = useState(false)

  const handleAttachmentClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation()
    const { type } = getFileInfo(url)
    setSelectedAttachment({ url, type })
  }

  const handlePostClick = () => {
    router.push(`/p/${post.id}`)
  }

  return (
    <>
      <div
        className="relative p-6 rounded-lg bg-card text-foreground shadow cursor-pointer"
        onClick={handlePostClick}
      >
        {isAuthor && (
          <PostSettingsDropdown
            postId={post.id}
            forumId={post.forumId}
            post={post}
          />
        )}

        <header className="flex gap-4 items-center">
          <div className="relative w-[68px] h-[68px]">
            <Image
              src={
                !profileImageError && post.Author.UserProfile.profilePictureURL
                  ? post.Author.UserProfile.profilePictureURL
                  : IMG_FALLBACK
              }
              className="rounded-full"
              alt="Profile Image"
              fill
              onError={() => setProfileImageError(true)}
            />
          </div>
          <div>
            <Link
              href={`/profile/${post?.Author?.username || 'ERROR'}`}
              className="h4"
              onClick={(e) => e.stopPropagation()}
            >
              {post?.Author?.fullname || 'ERROR'}
            </Link>
            <p className="p-muted">
              {formatDateTime(post.createdAt)} in{' '}
              <Link
                href={`/c/${communityId}`}
                className="font-bold underline"
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
          <div className="mt-4 grid grid-cols-2 gap-2">
            {post.attachments.map((url, index) => {
              const { type, extension } = getFileInfo(url)
              return (
                <div
                  key={index}
                  className="relative aspect-video cursor-pointer group"
                  onClick={(e) => handleAttachmentClick(e, url)}
                >
                  {type === 'image' ? (
                    <Image
                      src={url}
                      alt={`Attachment ${index + 1}`}
                      fill
                      className="object-cover rounded-lg transition-transform group-hover:scale-[1.02]"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="relative w-full h-full bg-gray-100 rounded-lg border flex items-center justify-center">
                      <span className="text-lg font-bold">
                        {extension.toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-4">
          <PostActions
            id={post.id}
            votes={post?.voteCounter || 0}
            commentCount={post?.commentsCount || 0}
            title={post.title}
            initialVoteStatus={initialVoteStatus}
          />
        </div>

        <div className="mt-6">
          <Comments postId={post.id} />
        </div>
      </div>

      <Dialog
        open={!!selectedAttachment}
        onOpenChange={() => setSelectedAttachment(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
          <DialogTitle className={visuallyHidden}>
            View attachment from post: {post.title}
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          {selectedAttachment && (
            <div className="relative w-full max-h-[80vh] overflow-auto">
              {selectedAttachment.type === 'image' ? (
                <div className="relative w-full h-full">
                  <Image
                    src={selectedAttachment.url}
                    alt="Attachment preview"
                    fill
                    className="object-contain"
                    sizes="100vw"
                  />
                </div>
              ) : selectedAttachment.type === 'pdf' ? (
                <iframe
                  src={selectedAttachment.url}
                  className="w-full h-full min-h-[50vh]"
                  title="PDF Preview"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full p-6">
                  <div className="text-center">
                    <p className="mb-4">This file type cannot be previewed.</p>
                    <a
                      href={selectedAttachment.url}
                      download={selectedAttachment.url.split('/').pop()}
                      className="text-blue-500 underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Download File
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
