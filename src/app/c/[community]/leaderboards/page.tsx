import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getTopTen } from '@/app/actions/leaderboard'
import { Trophy } from 'lucide-react'

interface Props {
  params: Promise<{ community: string }>
}

interface LeaderboardDataType {
  userId: number
  username: string
  fullname: string
  profilePictureURL: string
  totalScore: number
}

function PodiumTopThree({ topThree }: { topThree: LeaderboardDataType[] }) {
  const podiumOrder = [1, 0, 2]

  return (
    <div className="flex justify-center items-end gap-6 mb-10 min-h-[180px]">
      {podiumOrder.map((pos) => {
        const item = topThree[pos]

        if (!item) {
          return (
            <div
              key={`empty-${pos}`}
              className="w-24 h-24 rounded-t-xl bg-gray-100 flex items-end justify-center text-gray-400 text-sm"
            >
              ---
            </div>
          )
        }

        const height = pos === 0 ? 'h-40' : pos === 1 ? 'h-32' : 'h-28'
        const bgColor =
          pos === 0
            ? 'bg-yellow-400'
            : pos === 1
            ? 'bg-gray-300'
            : 'bg-amber-700 text-white'

        return (
          <div
            key={item.userId}
            className={`flex flex-col items-center justify-end w-24 ${height} ${bgColor} rounded-t-xl relative`}
          >
            <Avatar className="w-14 h-14 -mt-10 ring-4 ring-white">
              <AvatarImage
                src={item.profilePictureURL || '/default-avatar.png'}
              />
              <AvatarFallback>{item.username.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="text-center mt-2">
              <h3 className="font-bold text-sm truncate">{item.username}</h3>
              <p className="text-xs">{item.totalScore} pts</p>
            </div>
            <div className="absolute -top-4 text-white text-xl font-bold bg-black/20 backdrop-blur px-2 py-1 rounded-full">
              #{pos + 1}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function LeaderboardList({ data }: { data: LeaderboardDataType[] }) {
  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div
          key={item.userId}
          className="bg-white border border-gray-200 p-4 rounded-xl flex items-center shadow-sm hover:shadow-md transition"
        >
          <div className="w-10 h-10 bg-blue-100 text-blue-800 font-bold rounded-full flex items-center justify-center mr-4">
            {index + 4}
          </div>
          <Avatar className="w-12 h-12">
            <AvatarImage
              src={item.profilePictureURL || '/default-avatar.png'}
            />
            <AvatarFallback>{item.username.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 flex-1">
            <h4 className="font-bold">{item.username}</h4>
            <p className="text-gray-600 text-sm">{item.fullname}</p>
          </div>
          <div className="font-bold text-blue-600">{item.totalScore} pts</div>
        </div>
      ))}
    </div>
  )
}

export default async function Page({ params }: Props) {
  const { community: communityId } = await params
  const leaderboardReq = await getTopTen(communityId)
  console.log(leaderboardReq)
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

  const topThree = leaderboardData.slice(0, 3)
  const others = leaderboardData.slice(3)

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-sky-600 p-3 rounded-full mb-4">
          <Trophy className="w-8 h-8 text-white" fill="currentColor" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-700 mb-2">
          Community Leaderboard
        </h1>
        <p className="text-gray-600">Top performers this week</p>
      </div>

      {/* Podium for Top 3 */}
      <PodiumTopThree topThree={topThree} />

      {/* List for 4 to 10 */}
      {others.length > 0 && <LeaderboardList data={others} />}
    </div>
  )
}
