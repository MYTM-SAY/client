import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default async function Page() {
  const leaderboardData = [
    { name: 'Sara Ahmed', points: 17134 },
    { name: 'Sara Ahmed', points: 10532 },
    { name: 'Sara Ahmed', points: 5063 },
    { name: 'Sara Ahmed', points: 1000 },
    { name: 'Sara Ahmed', points: 500 },
    { name: 'Sara Ahmed', points: 17134 },
    { name: 'Sara Ahmed', points: 17134 },
  ]

  return (
    <div className="">
      <h1 className="text-3xl font-bold text-center py-8">Leaderboard</h1>

      <ol className="">
        {leaderboardData.map((item, index) => (
          <li key={index} className="p-4 my-4 rounded-lg shadow-md border">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <span className="font-medium">
                  {index === 0 ? (
                    <Avatar className="rounded-full w-[40px] h-[40px] mx-auto">
                      <AvatarImage src="/Gold.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  ) : index === 1 ? (
                    <Avatar className="rounded-full w-[40px] h-[40px] mx-auto">
                      <AvatarImage src="/Silver.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  ) : index === 2 ? (
                    <Avatar className="rounded-full w-[40px] h-[40px] mx-auto">
                      <AvatarImage src="/Bronze.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  ) : (
                    <p>{index + 1}.</p>
                  )}
                </span>
                <Avatar className="rounded-full w-[50px] h-[50px] mx-auto">
                  <AvatarImage src="/pp-fallback.svg" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold">{item.name}</h3>
              </div>
              <span className="text-green-600 p font-bold">+{item.points}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
