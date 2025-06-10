import SettingsClient from './_components/SettingsClient'

interface Props {
  params: Promise<{
    community: string
  }>
}

const Page = async ({ params }: Props) => {
  const { community: communityId } = await params

  return <SettingsClient communityId={communityId} />
}

export default Page
