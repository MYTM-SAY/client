'use client'

import { useState } from 'react'
import { createComment } from '@/app/actions/comment'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Comment } from '@/app/actions/post'
interface Props {
  postId: number
  comments?: Comment[]
  setComments?: React.Dispatch<React.SetStateAction<Comment[]>>
}

export default function CommentForm({ postId, comments, setComments }: Props) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)
    try {
      console.log(postId, content)
      const result = await createComment({
        content: content.trim(),
        postId: postId,
      })

      if (!result.success) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message,
        })
      } else {
        setContent('')
        toast({
          title: 'Success',
          description: 'Comment posted successfully!',
        })
        console.log(comments)
        if (setComments && result.data) {
          const normalizedComment = {
            ...result.data,
            voteCount: 0,
            voteType: 'NONE',
            Author: {
              id: result.data.authorId,
              fullname: result.data.Author.username,
              ...result.data.Author,
            },
          }

          setComments([...(comments || []), normalizedComment])
        }
      }
    } catch (err) {
      console.error('Failed to post comment:', err)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to post comment. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Write a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[100px]"
      />
      <Button type="submit" disabled={isSubmitting || !content.trim()}>
        {isSubmitting ? 'Posting...' : 'Post Comment'}
      </Button>
    </form>
  )
}
