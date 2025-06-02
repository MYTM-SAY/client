import ClassroomList from './_components/ClassroomList'

export default async function Page({
  params,
}: {
  params: { community: string }
}) {
  const { community: communityId } = await params
  return <ClassroomList communityId={communityId} />
}
