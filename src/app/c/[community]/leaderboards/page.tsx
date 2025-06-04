import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getTopTen } from '@/app/actions/leaderboard'

interface Props {
  params: {
    id: string
  }
}

interface leaderboardDataTypes {
  id: number
  username: string
  fullname: string
  score: number
}

export default async function Page({ params }: Props) {
  const { community: communityId } = params
  const leaderboardReq = await getTopTen(communityId)

  if (!leaderboardReq.success) {
    return 'An error has occurred'
  }

  const leaderboardData = leaderboardReq.data

  // Handle empty leaderboard
  if (leaderboardData.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-gray-100 border rounded-lg p-8 max-w-md mx-auto">
          <div className="text-5xl mb-4">🏆</div>
          <h1 className="text-2xl font-bold mb-2">Leaderboard is Empty</h1>
          <p className="text-gray-600">
            Be the first to join and start earning points!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="">
      <h1 className="text-3xl font-bold text-center py-8">Leaderboard</h1>

      <ol className="">
        {leaderboardData.map((item: leaderboardDataTypes, index: number) => (
          <li key={item.id} className="p-4 my-4 rounded-lg shadow-md border">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <span className="font-medium w-6">
                  {index === 0 ? (
                    <Avatar className="rounded-full w-8 h-8 mx-auto">
                      <AvatarImage src="/Gold.png" alt="Gold medal" />
                      <AvatarFallback>G</AvatarFallback>
                    </Avatar>
                  ) : index === 1 ? (
                    <Avatar className="rounded-full w-8 h-8 mx-auto">
                      <AvatarImage src="/Silver.png" alt="Silver medal" />
                      <AvatarFallback>S</AvatarFallback>
                    </Avatar>
                  ) : index === 2 ? (
                    <Avatar className="rounded-full w-8 h-8 mx-auto">
                      <AvatarImage src="/Bronze.png" alt="Bronze medal" />
                      <AvatarFallback>B</AvatarFallback>
                    </Avatar>
                  ) : (
                    <p className="text-center">{index + 1}</p>
                  )}
                </span>
                <Avatar className="rounded-full w-12 h-12">
                  <AvatarImage src="/pp-fallback.svg" alt={item.username} />
                  <AvatarFallback>
                    {item.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold">{item.username}</h3>
              </div>
              <span className="text-green-600 font-bold">+{item.score}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
