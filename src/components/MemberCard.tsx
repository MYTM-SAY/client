import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SlCalender } from 'react-icons/sl'

interface User {
  id: number
  fullname: string
  email: string
  profilePictureURL: string | null
  role: string
  createdAt: string // Assuming API returns this
}

const MemberCard = ({ user }: { user: User }) => {
  // Format join date
  const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="rounded-lg p-5 shadow-md space-y-4 border">
      <div className="flex justify-between items-start">
        <div className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-sm">
          {user.role}
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span>Online</span>
        </div>
      </div>

      <Avatar className="rounded-full w-[150px] h-[150px] mx-auto">
        <AvatarImage src={user.profilePictureURL || '/pp-fallback.svg'} />
        <AvatarFallback>{user.fullname[0]}</AvatarFallback>
      </Avatar>

      <h2 className="text-center h4">{user.fullname}</h2>

      <div className="text-center text-gray-600">
        <p>{user.email}</p>
      </div>

      <div className="flex justify-center items-center text-sm text-gray-500">
        <SlCalender className="mr-2" />
        <span>Joined {joinDate}</span>
      </div>
    </div>
  )
}
export default MemberCard
