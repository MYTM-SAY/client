import { getCommunityClassrooms } from '@/app/actions/classroom'
import { getUsersOfCommunity } from '@/app/actions/community'
import AdminDashboardClient from './_components/AdminDashboardClient'

interface AdminDashboardProps {
  params: Promise<{ community: string }>
}

export default async function AdminDashboard({
  params,
}: AdminDashboardProps) {
  const { community: communityId } = await params
  
  // Fetch initial data on the server
  const [classroomsResult, membersResult] = await Promise.all([
    getCommunityClassrooms(communityId),
    getUsersOfCommunity(communityId)
  ])

  const initialClassrooms = classroomsResult.success ? classroomsResult.data : []
  const initialMembers = membersResult.success && membersResult.data ? membersResult.data : []

  return (
    <AdminDashboardClient 
      communityId={communityId}
      initialClassrooms={initialClassrooms}
      initialMembers={initialMembers}
    />
  )
} 