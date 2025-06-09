import SettingsClient from './_components/SettingsClient'

interface Props {
  params: {
    community: string
  }
}

const Page = ({ params }: Props) => {
  const { community: communityId } = params

  return <SettingsClient communityId={communityId} />
}

export default Page
