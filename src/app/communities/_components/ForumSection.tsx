'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import usePosts from '@/hooks/usePosts'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Image from 'next/image'

interface ForumSectionProps {
  communityId: string
}

export default function ForumSection({ communityId }: ForumSectionProps) {
  const { posts, isLoading, error, createPost, deletePost } =
    usePosts(communityId)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newPostTitle, setNewPostTitle] = useState('')
  const [newPostContent, setNewPostContent] = useState('')
  const [formError, setFormError] = useState('')
  const [postToDelete, setPostToDelete] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  
  const generateRandomAttachments = () => {
    const attachmentCount = Math.floor(Math.random() * 11) // Random number from 0 to 10
    const attachments = []
    
    for (let i = 0; i < attachmentCount; i++) {
      attachments.push(`https://picsum.photos/seed/${Math.random()}/200/300`)
    }
    
    return attachments
  }

  const handleCreatePost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      setFormError('Please provide both title and content')
      return
    }

    try {
      await createPost({
        title: newPostTitle,
        content: newPostContent,
        attachments: generateRandomAttachments(),
      })

      setNewPostTitle('')
      setNewPostContent('')
      setIsCreateDialogOpen(false)
      setFormError('')
    } catch (err) {
      setFormError('Failed to create post. Please try again.')
      console.error(err)
    }
  }

  const openDeleteDialog = (postId: string) => {
    setPostToDelete(postId)
    setIsDeleteDialogOpen(true)
  }

  const handleDeletePost = async () => {
    if (!postToDelete) return

    try {
      await deletePost(postToDelete)
      setIsDeleteDialogOpen(false)
      setPostToDelete(null)
    } catch (err) {
      console.error('Failed to delete post:', err)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePost}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
            <DialogDescription>
              Share your thoughts with the community
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {formError && (
              <div className="flex items-center gap-2 text-red-500 mb-2">
                <AlertCircle size={16} />
                <span>{formError}</span>
              </div>
            )}
            <div className="space-y-2">
              <Input
                placeholder="Post title"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Write your post content here..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreatePost}>Submit Post</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Forum Discussions</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>New Post</Button>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>
                    Posted by author id {post.authorId} on {new Date(post.createdAt).toLocaleString()}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => openDeleteDialog(post.id)}
                >
                  Delete
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p>{post.content}</p>
              
              {post.attachments && post.attachments.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Attachments ({post.attachments.length})</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {post.attachments.map((attachment, index) => (
                      <div key={index} className="relative h-24 rounded overflow-hidden">
                        <Image
                          src={attachment}
                          alt={`Attachment ${index + 1}`}
                          className="object-cover w-full h-full"
                          width={200}
                          height={300}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <span>0 replies</span>
              <Button variant="outline">View Discussion</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
