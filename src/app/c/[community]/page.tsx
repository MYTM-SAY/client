import { getCommunity } from '@/app/actions/community'
import Forum from '@/components/Forum/forum'

interface Props {
  params: {
    community: string
  }
}

export default async function Page({ params }: Props) {
  const { community: communityId } = await params
  const res = await getCommunity(communityId)

  if (!res.success) {
    if (res.statusCode === 404) {
      return <>Page not found</>
    }
    return <>Internal server error</>
  }

  return <Forum forumId={res.data.forumId} community={res.data} />
}
