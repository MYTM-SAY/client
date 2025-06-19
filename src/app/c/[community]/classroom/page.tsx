import ClassroomList from './_components/ClassroomList'

interface Props {
  params: Promise<{ community: string }>
}

export default async function Page({ params }: Props) {
  const { community: communityId } = await params
  return <ClassroomList communityId={communityId} />
}
