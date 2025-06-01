import { FiX, FiMail, FiUserCheck, FiArchive } from 'react-icons/fi'

type ActionType = 'mute' | 'delete' | 'ban' | 'role' | 'transfer' | 'archive'

interface ActionModalProps {
  selectedAction: ActionType
  onClose: () => void
  onConfirm: () => void
  email: string
  setEmail: (email: string) => void
  role: string
  setRole: (role: string) => void
}

const ActionModal = ({
  selectedAction,
  onClose,
  onConfirm,
  email,
  setEmail,
  role,
  setRole,
}: ActionModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
            {selectedAction === 'role'
              ? 'Change Member Role'
              : selectedAction === 'archive'
              ? 'Archive Community'
              : `${selectedAction} Member`}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <FiX size={24} />
          </button>
        </div>

        {selectedAction !== 'archive' && (
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enter user email
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="user@example.com"
                className="w-full pl-10 p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
        )}

        {selectedAction === 'role' && (
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select new role
            </label>
            <div className="relative">
              <FiUserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full pl-10 p-3 border rounded-lg appearance-none bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
                <option value="member">Member</option>
              </select>
            </div>
          </div>
        )}

        {selectedAction === 'archive' && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 mb-5 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiArchive className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  This will archive the entire community. Archived communities
                  are read-only.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            className="px-5 py-2.5 bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-5 py-2.5 bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-lg font-medium"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

export default ActionModal
