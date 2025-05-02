import { getCommunity } from '@/app/actions/community'
import Forum from '@/components/Forum/forum'

interface Props {
  params: {
    community: string
  }
}

// TODO: fix the layout thing

export default async function Page({ params }: Props) {
  const { community: communityId } = await params
  const res = await getCommunity(communityId)

  
  // TODO: add status code
  if (!res.success) {
    if (res.statusCode === 404) {
      return <>Page not found</>
    }
    return <>Internal server error</>
  }

  // TODO: awaiting the backend fix
  return <Forum posts={res.data.Forums[0].Posts || []} />
}
