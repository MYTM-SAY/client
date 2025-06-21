import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getTopTen } from '@/app/actions/leaderboard'
import { Trophy, Crown, Medal, Star, Gem } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface Props {
  params: Promise<{
    community: string
  }>
}

interface LeaderboardDataType {
  userId: number
  username: string
  fullname: string
  profilePictureURL: string
  totalScore: number
}

export default async function Page({ params }: Props) {
  const { community: communityId } = await params
  const leaderboardReq = await getTopTen(communityId)

  if (!leaderboardReq.success) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold text-blue-800 mb-2">
            Error Loading Leaderboard
          </h2>
          <p className="text-blue-600">Please try again later</p>
        </div>
      </div>
    )
  }

  const leaderboardData = leaderboardReq.data

  if (leaderboardData.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-200 rounded-2xl p-10 text-center shadow-sm">
          <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-12 h-12 text-blue-500" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Leaderboard is Empty
          </h1>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Be the first to participate and claim the top spot!
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition-all">
            Join Now
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-sky-600 p-3 rounded-full mb-4">
          <Trophy className="w-8 h-8 text-white" fill="currentColor" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-700 mb-2">
          Community Leaderboard
        </h1>
        <p className="text-gray-600">Top performers this week</p>
      </div>

      <div className="space-y-4">
        {leaderboardData.map((item: LeaderboardDataType, index: number) => {
          const isTopThree = index < 3
          const isFirst = index === 0

          return (
            <div
              key={item.userId}
              className={`
                relative rounded-2xl p-5 shadow-sm transition-all hover:shadow-md
                ${
                  isFirst
                    ? 'bg-gradient-to-r from-blue-50/80 to-sky-50/80 border-2 border-blue-200'
                    : 'bg-white border border-gray-200'
                }
                ${isTopThree ? 'pb-8' : ''}
              `}
            >
              {isTopThree && (
                <div
                  className={`absolute -top-3 left-6 z-10 ${
                    index === 0
                      ? 'text-blue-500'
                      : index === 1
                      ? 'text-sky-400'
                      : 'text-blue-300'
                  }`}
                >
                  {index === 0 ? (
                    <Crown className="w-8 h-8" fill="currentColor" />
                  ) : index === 1 ? (
                    <Medal className="w-8 h-8" fill="currentColor" />
                  ) : (
                    <Star className="w-8 h-8" fill="currentColor" />
                  )}
                </div>
              )}

              <div className="flex items-center">
                <div className="flex-shrink-0 mr-4 relative">
                  <div
                    className={`
                    w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold
                    ${
                      isTopThree
                        ? index === 0
                          ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white'
                          : index === 1
                          ? 'bg-gradient-to-br from-sky-400 to-sky-600 text-white'
                          : 'bg-gradient-to-br from-blue-300 to-blue-500 text-white'
                        : 'bg-blue-100 text-blue-700'
                    }
                  `}
                  >
                    {isTopThree ? '' : index + 1}
                  </div>
                </div>

                <Avatar
                  className={`${
                    isFirst ? 'ring-4 ring-blue-300' : ''
                  } w-14 h-14`}
                >
                  <AvatarImage
                    src={item.profilePictureURL || '/default-avatar.png'}
                    alt={item.username}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-blue-100 text-blue-800 font-medium">
                    {item.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="ml-4 flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate flex items-center">
                    {item.username}
                    {isFirst && (
                      <Badge
                        variant="default"
                        className="ml-2 bg-gradient-to-r from-blue-600 to-sky-700"
                      >
                        <Gem className="w-4 h-4 mr-1" />
                        Champion
                      </Badge>
                    )}
                  </h3>
                  <p className="text-gray-600 text-sm truncate">
                    {item.fullname}
                  </p>
                </div>

                <div className="ml-4 flex flex-col items-end">
                  <span className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-700">
                    +{item.totalScore}
                  </span>
                  <span className="text-xs text-gray-500">points</span>
                </div>
              </div>

              {isTopThree && (
                <div className="mt-4 flex justify-center">
                  <div className="w-16 h-1 rounded-full bg-gradient-to-r from-blue-300 to-sky-400"></div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
