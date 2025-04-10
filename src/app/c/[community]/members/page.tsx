import MemberCard from '@/components/MemberCard'
import Btn from '@/components/ui/Btn'

export default async function Page() {
  return (
    <div className="pb-10"> {/* temp padding */}
      <div className="flex justify-between mb-5">
        <div className="space-x-4">
          <Btn className="px-5 py-3 bg-accent text-white">Members</Btn>
          <Btn className="px-5 py-3 bg-accent text-white">Admins</Btn>
        </div>

        <Btn className="px-10 py-3 bg-accent text-white">Invite</Btn>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
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
