'use client'
import { useState, useEffect } from 'react'
import { FiUserX, FiUserCheck, FiTrash2, FiX } from 'react-icons/fi'
import ActionModal from '@/components/Community/Settings/ActionModal'
import SettingCard from '@/components/Community/Settings/SettingCard'
import VisibilitySetting from '@/components/Community/Settings/VisibilitySetting'
import { getUsersOfCommunity, deleteMember } from '@/app/actions/community'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

type ActionType =
  | 'mute'
  | 'delete'
  | 'ban'
  | 'role'
  | 'transfer'
  | 'archive'
  | null

interface Member {
  id: number
  fullname: string
  email: string
  profilePictureURL: string | null
  role: string
}

interface Props {
  communityId: string
}

const SettingsClient = ({ communityId }: Props) => {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAction, setSelectedAction] = useState<ActionType>(null)
  const [showMembersModal, setShowMembersModal] = useState(false)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('member')
  const [communityVisibility, setCommunityVisibility] = useState<
    'public' | 'private'
  >('public')
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true)
        const result = await getUsersOfCommunity(communityId)

        if (result.success && result.data) {
          setMembers(result.data)
        } else {
          setError(result.message || 'Failed to load members')
        }
      } catch (error) {
        setError('An unexpected error occurred')
        console.error('Failed to fetch members:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMembers()
  }, [communityId])

  const handleDeleteMember = async (userId: number) => {
    setDeletingId(userId)
    setError(null)

    try {
      const result = await deleteMember(communityId, userId)

      if (result.success) {
        setMembers((prev) => prev.filter((member) => member.id !== userId))
      } else {
        setError(result.message || 'Failed to delete member')
      }
    } catch (error) {
      setError('An error occurred while deleting the member')
      console.error('Error deleting member:', error)
    } finally {
      setDeletingId(null)
    }
  }

  const handleAction = (action: ActionType) => {
    if (action === 'delete') {
      setShowMembersModal(true)
    } else {
      setSelectedAction(action)
    }
  }

  const handleConfirm = () => {
    setSelectedAction(null)
    setEmail('')
  }

  const handleVisibilityChange = (newVisibility: 'public' | 'private') => {
    setCommunityVisibility(newVisibility)
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

      {/* Members List Modal for Deletion */}
      {showMembersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white dark:bg-gray-800 z-10">
              <h2 className="text-xl font-bold">Remove Members</h2>
              <button
                onClick={() => setShowMembersModal(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="p-4">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  <p>{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                  >
                    Try Again
                  </button>
                </div>
              ) : members.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No members found in this community
                  </p>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                      {error}
                    </div>
                  )}

                  <ul className="space-y-3">
                    {members.map((member) => (
                      <li
                        key={member.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage
                              src={
                                member.profilePictureURL || '/pp-fallback.svg'
                              }
                              alt={member.fullname}
                              className="object-cover"
                            />
                            <AvatarFallback className="bg-gray-200 dark:bg-gray-600">
                              {member.fullname.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{member.fullname}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[200px]">
                              {member.email}
                            </p>
                            <span
                              className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                                member.role === 'OWNER'
                                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100'
                                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                              }`}
                            >
                              {member.role}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteMember(member.id)}
                          disabled={
                            deletingId === member.id || member.role === 'OWNER'
                          }
                          className={`p-2 rounded-full transition-colors ${
                            member.role === 'OWNER'
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50'
                          }`}
                          aria-label={`Remove ${member.fullname}`}
                          title={
                            member.role === 'OWNER'
                              ? 'Cannot remove community owner'
                              : 'Remove member'
                          }
                        >
                          {deletingId === member.id ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                          ) : (
                            <FiTrash2 size={20} />
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <div className="p-4 border-t flex justify-end">
              <button
                onClick={() => setShowMembersModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Content */}
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
          icon={<FiUserX size={20} />}
          title="Remove member from the community"
          description="Delete a user from the community"
          action="delete"
          actionText="Remove Member"
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
      </div>
    </div>
  )
}

export default SettingsClient 