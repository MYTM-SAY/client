// import { useState } from "react";
// import AdminSidebar from "./_components/AdminSidebar";
// import UserManagement from "./_components/UserManagement";
// import ContentModeration from "./_components/ContentModeration";
// import CommunitySettings from "./_components/CommunitySettings";
// import Analytics from "./_components/Analytics";
import { getCommunityClassrooms } from '@/app/actions/classroom'
import ClassroomManagement from './_components/ClassroomManagement'

export default async function AdminDashboard({
  params,
}: {
  params: { community: string }
}) {
  //   const [activeTab, setActiveTab] = useState("classroom");
  const { community: communityId } = await params
  const classrooms = await getCommunityClassrooms(communityId)

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} /> */}

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Community Admin Dashboard</h1>

        <div className="bg-white rounded-lg shadow p-6">
          {/* {activeTab === "users" && <UserManagement />} */}
          {/* {activeTab === "content" && <ContentModeration />} */}
          {/* {activeTab === "settings" && <CommunitySettings />} */}
          {/* {activeTab === "analytics" && <Analytics />} */}
          {/* {activeTab === "classroom" && <ClassroomManagement />} */}
          <ClassroomManagement
            communityId={communityId}
            classrooms={classrooms.success ? classrooms.data : []}
          />
        </div>
      </div>
    </div>
  )
}
