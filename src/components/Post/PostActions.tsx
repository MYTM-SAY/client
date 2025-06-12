'use client'
import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import {
  BiUpvote,
  BiDownvote,
  BiSolidUpvote,
  BiSolidDownvote,
} from 'react-icons/bi'
import { FaRegComment } from 'react-icons/fa'
import PostShare from './PostShare'
import Link from 'next/link'
import { upVote, downVote } from '@/app/actions/post'
import { usePathname } from 'next/navigation'

interface Props {
  id: string | number
  votes: number
  commentCount: number
  title: string
  initialVoteStatus: 'UPVOTE' | 'DOWNVOTE' | null
}

export default function PostActions({
  id,
  votes,
  commentCount,
  title,
  initialVoteStatus,
}: Props) {
  const [isUpvoted, setIsUpvoted] = useState(initialVoteStatus === 'UPVOTE')
  const [isDownvoted, setIsDownvoted] = useState(
    initialVoteStatus === 'DOWNVOTE',
  )
  const [voteCount, setVoteCount] = useState(votes)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const handlePostClick = () => {
    router.push(`/p/${id}`)
  }

  const handleVote = async (
    voteType: 'up' | 'down',
    currentUp: boolean,
    currentDown: boolean,
  ) => {
    const originalVoteCount = voteCount
    const originalIsUpvoted = isUpvoted
    const originalIsDownvoted = isDownvoted

    let newCount = voteCount
    if (voteType === 'up') {
      newCount = currentUp
        ? voteCount - 1
        : voteCount + 1 + (currentDown ? 1 : 0)
      setIsUpvoted(!currentUp)
      setIsDownvoted(false)
    } else {
      newCount = currentDown
        ? voteCount + 1
        : voteCount - 1 - (currentUp ? 1 : 0)
      setIsUpvoted(false)
      setIsDownvoted(!currentDown)
    }

    setVoteCount(newCount)

    startTransition(async () => {
      try {
        const result = voteType === 'up' ? await upVote(id) : await downVote(id)
        if (!result.success) {
          setVoteCount(originalVoteCount)
          setIsUpvoted(originalIsUpvoted)
          setIsDownvoted(originalIsDownvoted)
        }
      } catch {
        setVoteCount(originalVoteCount)
        setIsUpvoted(originalIsUpvoted)
        setIsDownvoted(originalIsDownvoted)
      }
    })
  }

  const handleUpvote = () => {
    if (!isPending) handleVote('up', isUpvoted, isDownvoted)
  }

  const handleDownvote = () => {
    if (!isPending) handleVote('down', isUpvoted, isDownvoted)
  }

  return (
    <div className="flex flex-wrap items-center gap-3 mt-6">
      <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-card shadow-md transition-all">
        <button
          aria-label="Upvote"
          title="Upvote"
          onClick={handleUpvote}
          disabled={isPending}
          className={`transition-colors ${
            isUpvoted
              ? 'text-green-500'
              : 'text-foreground hover:text-green-500'
          }`}
        >
          {isUpvoted ? (
            <BiSolidUpvote className="w-6 h-6" />
          ) : (
            <BiUpvote className="w-6 h-6" />
          )}
        </button>
        <span className="text-lg font-medium">{voteCount}</span>
        <button
          aria-label="Downvote"
          title="Downvote"
          onClick={handleDownvote}
          disabled={isPending}
          className={`transition-colors ${
            isDownvoted ? 'text-red-500' : 'text-foreground hover:text-red-500'
          }`}
        >
          {isDownvoted ? (
            <BiSolidDownvote className="w-6 h-6" />
          ) : (
            <BiDownvote className="w-6 h-6" />
          )}
        </button>
      </div>

      <Link
        href={`/p/${id}`}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card hover:bg-primary/90 text-foreground hover:text-white shadow-md transition-all"
        title="View comments"
        onClick={handlePostClick}
      >
        <FaRegComment className="w-5 h-5" /> <span>{commentCount}</span>
      </Link>

      <PostShare url={`${window.location.origin}/p/${id}`} title={title} />
    </div>
  )
}
