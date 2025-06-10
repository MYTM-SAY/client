'use client'
import React, { useState, useTransition } from 'react'
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
  const pathname = usePathname()

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
      if (currentUp) {
        newCount = voteCount - 1
      } else {
        newCount = voteCount + 1
        if (currentDown) newCount += 1
      }
      setVoteCount(newCount)
      setIsUpvoted(!currentUp)
      setIsDownvoted(false)
    } else {
      if (currentDown) {
        newCount = voteCount + 1
      } else {
        newCount = voteCount - 1
        if (currentUp) newCount -= 1
      }
      setVoteCount(newCount)
      setIsUpvoted(false)
      setIsDownvoted(!currentDown)
    }

    startTransition(async () => {
      try {
        const result = voteType === 'up' ? await upVote(id) : await downVote(id)

        if (!result.success) {
          setVoteCount(originalVoteCount)
          setIsUpvoted(originalIsUpvoted)
          setIsDownvoted(originalIsDownvoted)
        }
      } catch (error) {
        setVoteCount(originalVoteCount)
        setIsUpvoted(originalIsUpvoted)
        setIsDownvoted(originalIsDownvoted)
      }
    })
  }

  const handleUpvote = () => {
    if (isPending) return
    handleVote('up', isUpvoted, isDownvoted)
  }

  const handleDownvote = () => {
    if (isPending) return
    handleVote('down', isUpvoted, isDownvoted)
  }

  return (
    <div className="flex gap-4 items-center flex-wrap mt-6">
      <div className="flex items-center gap-2 px-4 py-2 text-foreground p-lg bg-card cursor-pointer">
        {isUpvoted ? (
          <BiSolidUpvote
            className="!w-6 !h-6 text-green-500"
            onClick={handleUpvote}
          />
        ) : (
          <BiUpvote
            className="!w-6 !h-6 text-green-500"
            onClick={handleUpvote}
          />
        )}
        {voteCount}
        {isDownvoted ? (
          <BiSolidDownvote
            className="!w-6 !h-6 text-red-500"
            onClick={handleDownvote}
          />
        ) : (
          <BiDownvote
            className="!w-6 !h-6 text-red-500"
            onClick={handleDownvote}
          />
        )}
      </div>

      <Link
        href={`/p/${id}`}
        className="flex items-center gap-2 px-4 py-2 text-foreground p-lg bg-card hover:text-white"
      >
        <FaRegComment className="!w-6 !h-6" /> {commentCount}
      </Link>

      <PostShare url={`${window.location.origin}/p/${id}`} title={title} />
    </div>
  )
}
