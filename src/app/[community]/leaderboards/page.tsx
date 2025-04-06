import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const page = () => {
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
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Leaderboard</h1>

      <ol className="">
        {leaderboardData.map((item, index) => (
          <li key={index} className="p-4 my-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <span className="text-gray-500 font-medium">
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
                  <AvatarImage src="/download (3).jpeg" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h3 className="text-gray-700 font-semibold">{item.name}</h3>
              </div>
              <span className="text-green-600 p font-bold">+{item.points}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default page
