'use client'
import { useState } from 'react'
import {
  FiVolumeX,
  FiUserX,
  FiShield,
  FiUserCheck,
  FiMail,
  FiArchive,
} from 'react-icons/fi'
import ActionModal from '@/components/Community/Settings/ActionModal'
import SettingCard from '@/components/Community/Settings/SettingCard'
import VisibilitySetting from '@/components/Community/Settings/VisibilitySetting'

type ActionType =
  | 'mute'
  | 'delete'
  | 'ban'
  | 'role'
  | 'transfer'
  | 'archive'
  | null

const Page = () => {
  const [selectedAction, setSelectedAction] = useState<ActionType>(null)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('member')
  const [communityVisibility, setCommunityVisibility] = useState<
    'public' | 'private'
  >('public')

  const handleAction = (action: ActionType) => {
    setSelectedAction(action)
  }

  const handleConfirm = () => {
    // Handle confirmation logic here
    setSelectedAction(null)
    setEmail('')
  }

  const handleVisibilityChange = (newVisibility: 'public' | 'private') => {
    setCommunityVisibility(newVisibility)
    // Here you would typically make an API call to update community visibility
    console.log(`Community visibility changed to: ${newVisibility}`)
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {selectedAction && (
        <ActionModal
          selectedAction={selectedAction}
          onClose={() => setSelectedAction(null)}
          onConfirm={handleConfirm}
          email={email}
          setEmail={setEmail}
          role={role}
          setRole={setRole}
        />
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Community Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your community settings and member permissions
        </p>
      </div>

      <VisibilitySetting
        initialVisibility={communityVisibility}
        onVisibilityChange={handleVisibilityChange}
      />

      <div className="grid gap-5">
        <SettingCard
          icon={<FiVolumeX size={20} />}
          title="Mute member in the community"
          description="Prevent the user from interacting in the forum"
          action="mute"
          actionText="Mute Member"
          onAction={handleAction}
        />

        <SettingCard
          icon={<FiUserX size={20} />}
          title="Remove member from the community"
          description="Delete a user from the community"
          action="delete"
          actionText="Remove Member"
          danger
          onAction={handleAction}
        />

        <SettingCard
          icon={<FiShield size={20} />}
          title="Ban member from the community"
          description="User will be removed and blocked from rejoining"
          action="ban"
          actionText="Ban Member"
          danger
          onAction={handleAction}
        />

        <SettingCard
          icon={<FiUserCheck size={20} />}
          title="Change member role"
          description="Modify permissions and access levels"
          action="role"
          actionText="Change Role"
          onAction={handleAction}
        />

        <SettingCard
          icon={<FiMail size={20} />}
          title="Transfer ownership"
          description="Transfer community ownership to another member"
          action="transfer"
          actionText="Transfer"
          onAction={handleAction}
        />

        <SettingCard
          icon={<FiArchive size={20} />}
          title="Archive community"
          description="Make this community read-only"
          action="archive"
          actionText="Archive"
          danger
          onAction={handleAction}
        />
      </div>
    </div>
  )
}

export default Page
