'use client'
import Btn from '../ui/Btn'
import { GiExitDoor } from 'react-icons/gi'
import { Earth, GlobeLock, Users, EllipsisIcon, Loader } from 'lucide-react'
import Link from 'next/link'
import { leaveCommunity, getTheRoleOfAuth } from '@/app/actions/community'
import { useState, useOptimistic, useEffect } from 'react'
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
import { FaRegHeart, FaHeart } from 'react-icons/fa'
import { toggleFav } from '@/app/actions/community'

interface CommunityCardProps {
  name?: string
  id: number | string
  communityId: number | string // Add communityId prop
  members?: number
  isPublic?: boolean
  creator?: string
  image?: string
  isFavorite?: boolean
}

export default function JoinedCommunityCard({
  name = 'Community Name',
  id,
  communityId, // Destructure communityId
  members = 0,
  isPublic = true,
  creator = 'Unknown',
  image = '/pp-fallback.svg',
  isFavorite = false,
}: CommunityCardProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [showLeaveDialog, setShowLeaveDialog] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loadingRole, setLoadingRole] = useState(true)

  // State for cover image error handling
  const [coverImageError, setCoverImageError] = useState(false)
  const fallbackCoverImage = '/cover-fallback.svg'

  // Optimistic favorite state
  const [optimisticFavorite, setOptimisticFavorite] = useOptimistic(
    isFavorite,
    (state, newValue: boolean) => newValue,
  )
  const [isFavLoading, setIsFavLoading] = useState(false)

  // Fetch user role for this community
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        setLoadingRole(true)
        const roleReq = await getTheRoleOfAuth(communityId)
        if (roleReq.success) {
          setUserRole(roleReq.data)
        } else {
          toast({
            variant: 'destructive',
            title: 'Role Error',
            description: roleReq.message || 'Failed to fetch user role',
          })
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch user role',
        })
      } finally {
        setLoadingRole(false)
      }
    }

    fetchUserRole()
  }, [communityId, toast])

  const isOwner = userRole === 'OWNER'

  const handleToggleFavorite = async () => {
    if (isFavLoading) return

    setIsFavLoading(true)
    const prevFavState = optimisticFavorite

    try {
      setOptimisticFavorite(!optimisticFavorite)

      const result = await toggleFav(id)

      if (!result.success) {
        setOptimisticFavorite(prevFavState)
        toast({
          variant: 'destructive',
          title: 'Favorite Error',
          description: result.message || 'Failed to update favorite status',
        })
      } else {
        toast({
          title: !optimisticFavorite
            ? 'Added to Favorites'
            : 'Removed from Favorites',
          description: `"${name}" ${
            !optimisticFavorite ? 'added to' : 'removed from'
          } your favorites`,
        })
        router.refresh()
      }
    } catch (error) {
      setOptimisticFavorite(prevFavState)
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

  // Handle cover image errors
  const handleImageError = () => {
    setCoverImageError(true)
  }

  return (
    <div className="relative flex flex-col bg-card border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 min-w-[220px] max-w-[280px] group">
      {/* Favorite Button with smooth fill animation */}
      <button
        className="absolute top-3 left-3 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full p-2 shadow-md cursor-pointer transition-all duration-300 hover:scale-110 group-hover:opacity-100"
        onClick={handleToggleFavorite}
        disabled={isFavLoading}
        aria-label={
          optimisticFavorite ? 'Remove from favorites' : 'Add to favorites'
        }
      >
        <div className="relative w-5 h-5">
          {/* Empty heart with transition */}
          <FaRegHeart
            className={`absolute inset-0 transition-all duration-300 ${
              optimisticFavorite
                ? 'opacity-0 scale-125'
                : 'opacity-100 scale-100'
            } text-gray-600 dark:text-gray-300`}
            size={18}
          />

          {/* Filled heart with fill animation */}
          <FaHeart
            className={`absolute inset-0 transition-all duration-300 ${
              optimisticFavorite
                ? 'opacity-100 scale-100 text-red-500'
                : 'opacity-0 scale-75'
            }`}
            size={18}
          />
        </div>
      </button>

      {/* Community Cover Image with fallback */}
      <div className="relative h-32 w-full overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
        {!coverImageError ? (
          <img
            src={image}
            className="object-cover w-full h-full"
            alt={`${name} cover image`}
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center text-gray-400">
              <span className="text-xs font-medium text-center px-1">
                {name.substring(0, 2).toUpperCase()}
              </span>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card" />
      </div>

      {/* Community Info */}
      <div className="px-4 py-3 flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <h3 className="font-bold text-lg line-clamp-1 text-gray-900 dark:text-white">
            {name}
          </h3>

          {/* Dropdown Menu */}
          {loadingRole ? (
            <div className="ml-2 rounded-full p-1.5">
              <Loader className="animate-spin w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="ml-2 rounded-full p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                disabled={isOwner}
                aria-label="Community options"
              >
                <EllipsisIcon
                  size={20}
                  className="text-gray-500 dark:text-gray-400"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="min-w-[200px] border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl bg-white dark:bg-gray-900"
                align="end"
              >
                {!isOwner ? (
                  <DropdownMenuItem
                    className="flex items-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded cursor-pointer transition-colors"
                    onClick={() => setShowLeaveDialog(true)}
                  >
                    <GiExitDoor className="text-lg" />
                    <span>Leave community</span>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    className="flex items-center gap-2 text-amber-500 px-3 py-2"
                    disabled
                  >
                    <GiExitDoor className="text-lg" />
                    <span>Owner cannot leave</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Creator Info */}
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8 border-2 border-white dark:border-gray-800">
            <AvatarImage
              src={image}
              alt={`${creator} avatar`}
              onError={(e) => {
                e.currentTarget.src = '/pp-fallback.svg'
              }}
            />
            <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-xs text-gray-800 dark:text-white">
              {name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
            By {creator}
          </p>
        </div>

        {/* Stats */}
        <div className="flex justify-between py-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
            <Users size={16} className="text-indigo-600 dark:text-indigo-400" />
            <span>
              {members.toLocaleString()} {members === 1 ? 'member' : 'members'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
            {isPublic ? (
              <Earth size={16} className="text-green-600 dark:text-green-400" />
            ) : (
              <GlobeLock
                size={16}
                className="text-amber-600 dark:text-amber-400"
              />
            )}
            <span>{isPublic ? 'Public' : 'Private'}</span>
          </div>
        </div>

        {/* View Button */}
        <Link href={`/c/${id}`} className="mt-1">
          <Btn className="w-full py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg shadow-blue-500/20 dark:shadow-indigo-800/30">
            View Community
          </Btn>
        </Link>
      </div>

      {/* Leave Confirmation Dialog */}
      <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <DialogContent className="sm:max-w-[425px] rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-lg text-gray-900 dark:text-white">
              Leave Community
            </DialogTitle>
            <DialogDescription className="pt-2 text-gray-600 dark:text-gray-300">
              Are you sure you want to leave the{' '}
              <strong className="text-foreground">{name}</strong> community?
              You'll need to be re-invited to join again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 mt-2">
            <Button
              variant="outline"
              onClick={() => setShowLeaveDialog(false)}
              disabled={isLeaving}
              className="rounded-lg border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleLeave}
              disabled={isLeaving}
              className="rounded-lg bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
            >
              {isLeaving ? 'Leaving...' : 'Leave Community'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
