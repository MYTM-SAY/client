import { getCommunityClassrooms } from '@/app/actions/classroom'
import { getUsersOfCommunity, getCommunity } from '@/app/actions/community'
import AdminDashboardClient from './_components/AdminDashboardClient'

interface AdminDashboardProps {
  params: Promise<{ community: string }>
}

export default async function AdminDashboard({
  params,
}: AdminDashboardProps) {
  const { community: communityId } = await params
  
  // Fetch initial data on the server
  const [classroomsResult, membersResult, communityResult] = await Promise.all([
    getCommunityClassrooms(communityId),
    getUsersOfCommunity(communityId),
    getCommunity(communityId)
  ])

  const initialClassrooms = classroomsResult.success ? classroomsResult.data : []
  const initialMembers = membersResult.success && membersResult.data ? membersResult.data : []
  const initialVisibility = communityResult.success && communityResult.data 
    ? (communityResult.data.isPublic ? 'public' : 'private') 
    : 'public'

  return (
    <AdminDashboardClient 
      communityId={communityId}
      initialClassrooms={initialClassrooms}
      initialMembers={initialMembers}
      initialVisibility={initialVisibility}
    />
  )
} 