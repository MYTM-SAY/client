'use client'

import Image from 'next/image'
import { FaLock, FaGlobe } from 'react-icons/fa'
import { Eye, Users, Loader2, Calendar, Hash } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface Tag {
  id: number
  name: string
  count?: number
}

interface CommunityCardDiscoverProps {
  communityId: string | number
  communityName: string
  communityDescription: string
  communityCover: string
  tags: Tag[]
  isPublic: boolean
  createdAt: string
  slug?: string
}

export const CommunityCardSkeleton = () => (
  <Card className="relative h-[380px] overflow-hidden bg-background/50 backdrop-blur">
    <Skeleton className="h-[180px] w-full" />
    <CardHeader className="p-4 pb-2">
      <Skeleton className="h-6 w-3/4 mx-auto" />
    </CardHeader>
    <CardContent className="p-4 py-2 space-y-3">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex gap-2 mt-3">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
    </CardContent>
    <CardFooter className="p-4 pt-2 flex justify-between">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-20" />
    </CardFooter>
  </Card>
)

const CommunityCardDiscover = ({
  communityId,
  communityName,
  communityDescription,
  communityCover,
  tags,
  isPublic,
  createdAt,
  slug = 'community',
}: CommunityCardDiscoverProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleView = async () => {
    try {
      setIsActionLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (error) {
      console.error('Error viewing community:', error)
    } finally {
      setIsActionLoading(false)
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  return (
    <Card
      className={cn(
        'relative overflow-hidden group',
        'hover:shadow-xl transition-all duration-300',
        'bg-card dark:bg-card/50 backdrop-blur-sm',
        'border-border/50 hover:border-primary/20',
        'h-[400px] flex flex-col',
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div className="relative h-[180px] w-full flex-shrink-0">
        <Image
          src={imageError ? '/Card image.png' : communityCover}
          alt={`${communityName} Cover`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          onError={() => setImageError(true)}
          priority
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <Badge
            variant={isPublic ? 'secondary' : 'destructive'}
            className={cn(
              'backdrop-blur-sm',
              isPublic
                ? 'bg-green-500/20 text-green-100 border-green-500/30'
                : 'bg-red-500/20 text-red-100 border-red-500/30',
            )}
          >
            {isPublic ? (
              <>
                <FaGlobe className="w-3 h-3 mr-1" /> Public
              </>
            ) : (
              <>
                <FaLock className="w-3 h-3 mr-1" /> Private
              </>
            )}
          </Badge>
        </div>

        {/* Overlay with View Button */}
        <div
          className={cn(
            'absolute inset-0 bg-black/70 backdrop-blur-sm',
            'flex items-center justify-center transition-all duration-300',
            isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none',
          )}
        >
          <Link href={`/c/${communityId}`} passHref>
            <Button
              variant="secondary"
              size="sm"
              className={cn(
                'gap-2 shadow-lg',
                'bg-white/90 hover:bg-white text-black',
                'dark:bg-gray-800/90 dark:hover:bg-gray-800 dark:text-white',
                'transform transition-all duration-300',
                isHovered ? 'scale-100' : 'scale-95',
              )}
              onClick={handleView}
              disabled={isActionLoading}
              aria-label={`View ${communityName} Community`}
            >
              {isActionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  View Community
                </>
              )}
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 justify-between">
        <div className="space-y-3">
          <CardHeader className="p-4 pb-2">
            <h2 className="font-semibold text-lg text-center tracking-tight line-clamp-1">
              {communityName}
            </h2>
          </CardHeader>

          <CardContent className="p-4 pt-0 space-y-3">
            <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
              {communityDescription}
            </p>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className={cn(
                      'text-xs px-2 py-0.5',
                      'bg-primary/5 hover:bg-primary/10',
                      'dark:bg-primary/10 dark:hover:bg-primary/20',
                      'border-primary/20 transition-colors',
                    )}
                  >
                    <Hash className="w-3 h-3 mr-0.5" />
                    {tag.name}
                  </Badge>
                ))}
                {tags.length > 3 && (
                  <Badge
                    variant="outline"
                    className="text-xs px-2 py-0.5 bg-muted"
                  >
                    +{tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </div>

        <CardFooter
          className={cn(
            'p-4 pt-2 flex justify-between items-center',
            'border-t border-border/50',
            'bg-muted/30 dark:bg-muted/10',
          )}
        >
          <TooltipProvider>
            <div className="flex items-center gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      'flex items-center gap-1.5',
                      'text-muted-foreground hover:text-primary',
                      'transition-colors cursor-pointer',
                    )}
                    aria-label="Created Date"
                  >
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{formatDate(createdAt)}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Created on {new Date(createdAt).toLocaleDateString()}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </CardFooter>
      </div>
    </Card>
  )
}

export default CommunityCardDiscover
