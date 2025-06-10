import { getCommunity } from '@/app/actions/community'
import Forum from '@/components/Forum/forum'
import { getUser } from '@/lib/actions/auth'
import { redirect } from 'next/navigation'

interface Props {
  params: Promise<{
    community: string
  }>
}

export default async function Page({ params }: Props) {
  const userReq = await getUser()
  if (!userReq.success) {
    return <>Internal server error</> // TODO: replace with 500 erorr component
  }

  const { community: communityId } = await params
  const res = await getCommunity(communityId)

  if (!res.success) {
    if (res.statusCode === 404) {
      return <>Page not found</>
    }
    return <>Internal server error</>
  }

  if (!res.data.role) {
    redirect(`/c/${communityId}/about`)
  }

  return <Forum forumId={res.data.forumId} community={res.data} authedUserId={userReq.user.id} />
}
