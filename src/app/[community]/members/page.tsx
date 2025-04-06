import MemberCard from '@/components/MemberCard'
import Btn from '@/components/ui/Btn'

const page = () => {
  return (
    <div className="p-4 mx-auto w-full max-w-[1300px]">
      <div className="flex justify-between">
        <div className="space-x-4">
          <Btn className="px-5 py-3 bg-accent text-white">Members</Btn>
          <Btn className="px-5 py-3 bg-accent text-white">Admins</Btn>
          <Btn className="px-5 py-3 bg-accent text-white">Online</Btn>
        </div>

        <Btn className="px-10 py-3 bg-accent text-white">Invite</Btn>
      </div>

      <div className="p-4 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-8">
        <MemberCard />
        <MemberCard />
        <MemberCard />
        <MemberCard />
        <MemberCard />
        <MemberCard />
      </div>
    </div>
  )
}

export default page
