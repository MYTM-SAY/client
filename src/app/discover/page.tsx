import DiscoverContent from './components/DiscoverContent'
import { getAllCommunities } from '../actions/community'
export default async function Page() {
  const communities = await getAllCommunities()
  return (
    <div className="flex-col-center gap-16 container py-4">
      <h1 className="h1">Discover</h1>
      <DiscoverContent communities={communities.data} />
    </div>
  )
}
