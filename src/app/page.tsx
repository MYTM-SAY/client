'use client'
import CalendarHolder from '../components/HomePage/CalendarHolder'
import FeedPostCard from '../components/Post/FeedPostCard'
import useFeed from '../hooks/useFeed'
import { Button } from '@/components/ui/button'
import { Loader2, RefreshCw } from 'lucide-react'

export default function Page() {
  const { posts, isLoading, error, refetchFeed } = useFeed()

  const handleRefresh = () => {
    refetchFeed()
  }

  return (
    <div className="grid grid-cols-8 gap-5">
      <div className="col-span-6">
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Your Feed</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Refresh
            </Button>
          </div>
          
          {isLoading && posts.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Loading your feed...</span>
              </div>
            </div>
          )}
          
          {error && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={handleRefresh} variant="outline">
                  Try Again
                </Button>
              </div>
            </div>
          )}
          
          {!isLoading && !error && posts.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  No posts in your feed yet. Start following some communities!
                </p>
                <Button onClick={handleRefresh} variant="outline">
                  Refresh
                </Button>
              </div>
            </div>
          )}
          
          {posts.length > 0 && (
            <div className="space-y-4">
              {posts.map((post) => (
                <FeedPostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>

      <CalendarHolder />
    </div>
  )
}

