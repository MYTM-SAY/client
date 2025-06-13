import { getUserProfileInfo } from '@/app/actions/profile'
import ProfileForm from './ProfileForm'
import { getAuthenticatedUserDetails } from '@/app/actions/user'

interface Tag {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}

export default async function ProfilePage() {
  const userReq = await getAuthenticatedUserDetails()

  const profileResponse = await getUserProfileInfo(userReq.data.id)

  if (!profileResponse.success || !profileResponse.data) {
    return (
      <div className="container mx-auto py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>
        <p>Failed to load profile data. Please try again later.</p>
      </div>
    )
  }

  const tagNames = ((profileResponse.data.Tags as Tag[]) || []).map(
    (tag: Tag) => tag.name,
  )
  const profileData = {
    bio: profileResponse.data.bio || '',
    twitter: profileResponse.data.twitter || '',
    facebook: profileResponse.data.facebook || '',
    instagram: profileResponse.data.instagram || '',
    linkedin: profileResponse.data.linkedin || '',
    youtube: profileResponse.data.youtube || '',
    profilePictureURL: profileResponse.data.profilePictureURL || '',
    tags: tagNames,
  }

  return <ProfileForm initialData={profileData} />
}
