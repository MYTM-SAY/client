'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import ForumSection from '@/app/communities/_components/ForumSection'
// import ClassroomSection from '@/app/communities/_components/ClassroomSection'
import useCommunity from '@/hooks/useCommunity'

export default function CommunityPage({ id }: { id: string }) {
  const { community, isLoading, error } = useCommunity(id)

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{community?.name}</h1>
        <p className="text-gray-500">Community ID: {id}</p>
      </div>
      <Tabs defaultValue="forum" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="forum">Forum</TabsTrigger>
          <TabsTrigger value="classroom">Classroom</TabsTrigger>
        </TabsList>

        <TabsContent value="forum">
          {/* <ForumSection communityId={id} /> */}
          <div>Forum</div>
        </TabsContent>

        <TabsContent value="classroom">
          {/* <ClassroomSection communityId={id} /> */}
          <div>Classroom</div>
        </TabsContent>
      </Tabs>
    </>
  )
}
