'use client'

import Image from 'next/image'
import { FaLock } from 'react-icons/fa'
import { Eye, Users, Loader2 } from 'lucide-react'
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
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface CommunityCardDiscoverProps {
  isLoading?: boolean
  num: number
}

export const CommunityCardSkeleton = () => (
  <Card className="relative h-[300px] overflow-hidden">
    <Skeleton className="h-[140px] w-full rounded-t-lg" />
    <CardHeader className="p-4 pb-2">
      <Skeleton className="h-6 w-3/4 mx-auto" />
    </CardHeader>
    <CardContent className="p-4 py-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3 mt-2" />
    </CardContent>
    <CardFooter className="p-4 pt-2 flex justify-between">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-20" />
    </CardFooter>
  </Card>
)

const CommunityCardDiscover = ({
  isLoading,
  num,
}: CommunityCardDiscoverProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isActionLoading, setIsActionLoading] = useState(false)

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

  if (isLoading) {
    return <CommunityCardSkeleton />
  }

  return (
    <Card
      className="relative overflow-hidden group hover:shadow-lg transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div className="relative h-[140px] w-full">
        <Image
          src="/Card image.png"
          alt="Community Cover"
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority
        />
        {/* Overlay */}
        <div
          className={cn(
            'absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300',
            isHovered ? 'opacity-100' : 'opacity-0',
          )}
          aria-hidden="true"
        >
          <Link href="/adonas" passHref>
            <Button
              variant="secondary"
              className="gap-2"
              onClick={handleView}
              disabled={isActionLoading}
              aria-label="View Community"
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
      <div className="flex flex-col h-[160px] justify-between">
        <div className="space-y-2">
          <CardHeader className="p-4 pb-0">
            <h2 className="font-semibold text-lg text-center tracking-tight">
              Community Name {num}
            </h2>
          </CardHeader>

          <CardContent className="p-4 pt-2">
            <p className="text-sm text-muted-foreground line-clamp-2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam
              hic aut sequi nihil maxime natus provident,
            </p>
          </CardContent>
        </div>

        <CardFooter className="p-4 pt-2 flex justify-between items-center border-t">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  aria-label="Community Members"
                >
                  <Users className="h-4 w-4" />
                  <span className="text-sm">88K Members</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>88,000 community members</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 p-sm-muted">
                  <FaLock />

                  <p>Private</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>This is a private community</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardFooter>
      </div>
    </Card>
  )
}

export default CommunityCardDiscover
