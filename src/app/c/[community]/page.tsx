import { getCommunity } from '@/app/actions/community'
import CommunityNavBar from '@/components/Community/CommunityNavBar'
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

  const { name } = res.data

  return (
    <section className="flex flex-col gap-4">
      <header className="">
        <h2 className="text-4xl text-center font-bold my-10">
          Welcome to the {name} Community!
        </h2>
      </header>
      <CommunityNavBar />

      <Forum name={res.data.name} />
    </section>
  )
}
