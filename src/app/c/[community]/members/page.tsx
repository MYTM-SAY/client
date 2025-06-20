import Link from 'next/link'
import { getUsersOfCommunity } from '@/app/actions/community'
import Btn from '@/components/ui/Btn'
import MemberCard from '@/components/MemberCard'

interface Props {
  params: Promise<{ community: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

interface User {
  id: number
  fullname: string
  email: string
  profilePictureURL: string | null
  role: string
  username: string
}

export const dynamic = 'force-dynamic'

export default async function Page({ params }: Props) {
  const { community: communityId } = await params
  const usersResponse = await getUsersOfCommunity(communityId)

  if (!usersResponse.success) {
    return <div>Error loading users</div>
  }

  const allUsers = usersResponse.data
  return (
    <div className="pb-10">
      <div className="grid md:grid-cols-3 gap-5">
        {allUsers.map((user: User) => (
          <MemberCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  )
}
