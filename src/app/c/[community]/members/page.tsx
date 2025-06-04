import Link from 'next/link'
import { getUsersOfCommunity } from '@/app/actions/community'
import Btn from '@/components/ui/Btn'
import MemberCard from '@/components/MemberCard'

interface Props {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export const dynamic = 'force-dynamic'

export default async function Page({ params, searchParams }: Props) {
  const { community: communityId } = params
  const filter = searchParams?.filter || 'all'
  const usersResponse = await getUsersOfCommunity(communityId)

  if (!usersResponse.success) {
    return <div>Error loading users</div>
  }

  const allUsers = usersResponse.data
  const filteredUsers =
    filter === 'admins'
      ? allUsers.filter(
          (user) => user.role === 'OWNER' || user.role === 'MODERATOR',
        )
      : allUsers

  return (
    <div className="pb-10">
      <div className="flex justify-between mb-5">
        <div className="space-x-4">
          <Link href="?filter=all">
            <Btn
              className={`px-5 py-3 ${
                filter === 'all' ? 'bg-primary' : 'bg-accent'
              } text-white`}
            >
              Members
            </Btn>
          </Link>
          <Link href="?filter=admins">
            <Btn
              className={`px-5 py-3 ${
                filter === 'admins' ? 'bg-primary' : 'bg-accent'
              } text-white`}
            >
              Admins
            </Btn>
          </Link>
        </div>
        <Btn className="px-10 py-3 bg-accent text-white">Invite</Btn>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {filteredUsers.map((user) => (
          <MemberCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  )
}
