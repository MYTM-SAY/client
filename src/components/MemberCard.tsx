import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Btn from './ui/Btn'
import { SlCalender } from 'react-icons/sl'

const MemberCard = () => {
  return (
    <div className="rounded-lg p-6 shadow-md space-y-4 max-w-[350px]">
      <div className="flex justify-end">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="">Online Now</span>
        </div>
      </div>

      <Avatar className="rounded-full w-[150px] h-[150px] mx-auto">
        <AvatarImage src="/download (3).jpeg" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      <h2 className="text-center h4">Sara Ahmed</h2>

      <div className="space-y-1 p">
        <p>Earned 6-Figure in Affiliate Marketing.</p>
        <p>Community manager for 8-Figure marketer.</p>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center p-sm-muted">
          <SlCalender />
          <span className="">Joined Feb 19, 2024</span>
        </div>

        <Btn className="px-5 py-3 bg-accent text-white">View Profile</Btn>
      </div>
    </div>
  )
}

export default MemberCard
