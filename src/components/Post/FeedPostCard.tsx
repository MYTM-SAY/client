'use client'
import PostContent from './PostContent'
import PostActions from './PostActions'
import Image from 'next/image'
import Link from 'next/link'
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
import { FeedPost } from '@/hooks/useFeed'

interface Props {
  post: FeedPost
}

const visuallyHidden =
  'absolute w-[1px] h-[1px] p-0 -m-[1px] overflow-hidden clip-[rect(0,0,0,0)] whitespace-nowrap border-0'

export default function FeedPostCard({ post }: Props) {
  const [selectedAttachment, setSelectedAttachment] = useState<string | null>(
    null,
  )
  const router = useRouter()

  const handleAttachmentClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation()
    setSelectedAttachment(url)
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
        <header className="flex gap-4 items-center">
          <Image
            src={post.author.profilePictureURL || "/pp-fallback.svg"}
            className="rounded-full"
            alt="Profile Image"
            width={68}
            height={68}
          />
          <div>
            <Link
              href={`/profile/${post.author.username}`}
              className="h4"
              onClick={(e) => e.stopPropagation()}
            >
              {post.author.fullname}
            </Link>
            <p className="p-muted">
              {formatDateTime(post.createdAt)}
            </p>
          </div>
        </header>

        <div className="mt-4">
          <PostContent
            title={post.title}
            content={post.content}
          />
        </div>

        {post.attachments && post.attachments.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {post.attachments.map((url, index) => (
              <div
                key={index}
                className="relative aspect-video cursor-pointer group"
                onClick={(e) => handleAttachmentClick(e, url)}
              >
                <Image
                  src={url}
                  alt={`Attachment ${index + 1}`}
                  fill
                  className="object-cover rounded-lg transition-transform group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
              </div>
            ))}
          </div>
        )}

        <div className="mt-4">
          <PostActions
            id={post.id}
            votes={post.voteCounter}
            commentCount={post.commentCount}
            title={post.title}
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
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <DialogTitle className={visuallyHidden}>
            View attachment from post: {post.title}
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          {selectedAttachment && (
            <div className="relative w-full aspect-[16/9]">
              <Image
                src={selectedAttachment}
                alt="Attachment preview"
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
} 