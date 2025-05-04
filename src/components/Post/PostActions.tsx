'use client'
import React, { useState } from 'react'
import {
  BiUpvote,
  BiDownvote,
  BiSolidUpvote,
  BiSolidDownvote,
} from 'react-icons/bi'
import { FaRegComment } from 'react-icons/fa'
import PostShare from './PostShare'
import Link from 'next/link'

interface Props {
  id: string | number
  votes: number
  commentCount: number
  title: string
}

export default function PostActions({ id, votes, commentCount, title }: Props) {
  const [isUpvoted, setIsUpvoted] = useState(false)
  const [isDownvoted, setIsDownvoted] = useState(false)

  const handleUpvote = () => {
    setIsUpvoted(!isUpvoted)
    if (isDownvoted) setIsDownvoted(false)
  }

  const handleDownvote = () => {
    setIsDownvoted(!isDownvoted)
    if (isUpvoted) setIsUpvoted(false)
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
        {votes}
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

      <Link href={`/p/${id}`} className="flex items-center gap-2 px-4 py-2 text-foreground p-lg bg-card hover:text-white">
        <FaRegComment className="!w-6 !h-6" /> {commentCount}
      </Link>

      <PostShare url={`/p/${id}`} title={title} />
    </div>
  )
}

