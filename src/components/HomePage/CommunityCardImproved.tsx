'use client'
import Btn from '../ui/Btn'
import { GiExitDoor } from 'react-icons/gi'
import { Earth, GlobeLock, Users, EllipsisIcon } from 'lucide-react'
import Link from 'next/link'
import { leaveCommunity } from '@/app/actions/community'
import { useState, useEffect } from 'react' // Added useEffect
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FaRegHeart, FaHeart } from 'react-icons/fa' // Combined import
import { toggleFav } from '@/app/actions/community'

interface CommunityCardProps {
  name?: string
  id: number | string
  userRole: string
  members?: number
  isPublic?: boolean
  creator?: string
  image?: string
  isFavorite?: boolean // Added new prop for initial favorite state
}

export default function JoinedCommunityCard({
  name = 'Community Name',
  id,
  userRole,
  members = 0,
  isPublic = true,
  creator = 'Unknown',
  image = '/pp-fallback.svg',
  isFavorite = false, // Default to false
}: CommunityCardProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [showLeaveDialog, setShowLeaveDialog] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  // Favorite state management
  const [isFav, setIsFav] = useState(isFavorite)
  const [isFavLoading, setIsFavLoading] = useState(false)

  const isOwner = userRole === 'OWNER'

  // Sync with prop changes
  useEffect(() => {
    setIsFav(isFavorite)
  }, [isFavorite])

  const handleToggleFavorite = async () => {
    if (isFavLoading) return

    setIsFavLoading(true)
    const prevFavState = isFav // Store previous state for rollback

    try {
      // Optimistic UI update
      setIsFav(!isFav)

      const result = await toggleFav(id)

      if (!result.success) {
        // Revert on error
        setIsFav(prevFavState)
        toast({
          variant: 'destructive',
          title: 'Favorite Error',
          description: result.message || 'Failed to update favorite status',
        })
      } else {
        toast({
          title: isFav ? 'Removed from Favorites' : 'Added to Favorites',
          description: `"${name}" ${
            isFav ? 'removed from' : 'added to'
          } your favorites`,
        })
      }
    } catch (error) {
      // Revert on exception
      setIsFav(prevFavState)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update favorite status',
      })
    } finally {
      setIsFavLoading(false)
    }
  }

  const handleLeave = async () => {
    setIsLeaving(true)
    try {
      const result = await leaveCommunity(id)

      if (result.success) {
        toast({
          title: 'Success',
          description: `You've left the ${name} community`,
        })
        router.refresh()
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message || 'Failed to leave community',
        })
      }
    } catch (error) {
      console.error('Error leaving community:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred while leaving the community',
      })
    } finally {
      setIsLeaving(false)
      setShowLeaveDialog(false)
    }
  }

  return (
    <div className="relative flex flex-col bg-card items-center overflow-hidden rounded-lg justify-between gap-5 min-w-[200px] pb-5">
      {/* Favorite Button */}
      <button
        className="absolute top-2 left-2 z-10 bg-foreground/70 text-background rounded-sm cursor-pointer h-8 w-8 flex items-center justify-center"
        onClick={handleToggleFavorite}
        disabled={isFavLoading}
        aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
      >
        {isFav ? (
          <FaHeart className="text-red-500" size={20} />
        ) : (
          <FaRegHeart size={20} />
        )}
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger
          className="absolute top-2 right-2 z-10 bg-foreground/70 text-background rounded-sm cursor-pointer h-8 w-8 flex items-center justify-center"
          disabled={isOwner}
        >
          <EllipsisIcon size={25} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="custom-dropdown-content">
          {!isOwner ? (
            <DropdownMenuItem
              className="custom-dropdown-item dropdown-cancel flex items-center gap-2 text-red-500 hover:text-red-600"
              onClick={() => setShowLeaveDialog(true)}
            >
              <GiExitDoor />
              Leave the community
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              className="custom-dropdown-item flex items-center gap-2 text-amber-500"
              disabled
            >
              <GiExitDoor />
              Owner cannot leave
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Leave Confirmation Dialog */}
      <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Leave Community</DialogTitle>
            <DialogDescription>
              Are you sure you want to leave the <strong>{name}</strong>{' '}
              community? You'll need to be re-invited to join again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowLeaveDialog(false)}
              disabled={isLeaving}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleLeave}
              disabled={isLeaving}
            >
              {isLeaving ? 'Leaving...' : 'Leave Community'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div>
        <img
          src={image}
          className="object-cover h-24 w-full"
          alt={`${name} cover image`}
        />
        <p className="h5 px-5 pt-3 text-center">{name}</p>
      </div>

      <div className="flex items-center gap-3 px-5">
        <Avatar className="w-8 h-8">
          <AvatarImage src={image} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <p className="p-sm-muted">By {creator}</p>
      </div>

      <div className="flex flex-col justify-between w-full p-muted px-5">
        <div className="flex justify-around w-full p-muted pb-3">
          <p className="flex gap-1 items-center">
            <Users size={20} />
            {members.toLocaleString()}
          </p>
          {isPublic ? (
            <p className="flex gap-1 items-center">
              <Earth size={20} />
              Public
            </p>
          ) : (
            <p className="flex gap-1 items-center">
              <GlobeLock size={20} />
              Private
            </p>
          )}
        </div>
        <Link href={`/c/${id}`} className="w-full">
          <Btn className="w-full p-2 text-white">View</Btn>
        </Link>
      </div>
    </div>
  )
}
