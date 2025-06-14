'use client'

import { useState } from 'react'
import Btn from '@/components/ui/Btn'
import { joinCommunity } from '../../../../actions/community'

interface JoinCommunityButtonProps {
  communityId: string
  userRole: 'OWNER' | 'MEMBER' | 'MODERATOR' | null
  isPending?: boolean
}

export default function JoinCommunityButton({
  communityId,
  userRole,
  isPending
}: JoinCommunityButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [hideJoinButton, setHideJoinButton] = useState(isPending)

  // Hide the button if user is already a member (has any role in the community)
  if (userRole) {
    return null
  }

  const handleJoinCommunity = async () => {
    setIsLoading(true)
    setMessage(null)

    try {
      const result = await joinCommunity(communityId)

      if (result.success) {
        setMessage('Join request sent successfully!')
        setHideJoinButton(true)
      } else {
        setMessage(result.message || 'Failed to send join request')
      }
    } catch {
      setMessage('An error occurred while sending the join request')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      {!hideJoinButton && (
        <Btn
          onClick={handleJoinCommunity}
          className={`w-full py-3 text-base bg-accent hover:bg-accent/90 text-white transition-all duration-300 hover:scale-[1.02] ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Sending Request...' : 'Join Community'}
        </Btn>
      )}
      {message && (
        <p
          className={`text-sm text-center ${
            message.includes('successfully') ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  )
}
