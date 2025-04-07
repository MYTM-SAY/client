import CommunityPage from '../_components/CommunityPage'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div className="container mx-auto py-6 px-4">
      <CommunityPage id={id} />
    </div>
  )
}
