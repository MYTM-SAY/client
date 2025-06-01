import { ReactNode } from 'react'

type ActionType = 'mute' | 'delete' | 'ban' | 'role' | 'transfer' | 'archive'

interface SettingCardProps {
  icon: ReactNode
  title: string
  description: string
  action: ActionType
  actionText: string
  danger?: boolean
  onAction: (action: ActionType) => void
}

const SettingCard = ({
  icon,
  title,
  description,
  action,
  actionText,
  danger = false,
  onAction,
}: SettingCardProps) => {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 mb-5 hover:shadow-md transition-shadow">
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-1 mr-4 text-indigo-600 dark:text-indigo-400">
          {icon}
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-lg text-gray-900 dark:text-white">
            {title}
          </h4>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{description}</p>
        </div>
        <div>
          <button
            className={`px-4 py-2.5 rounded-lg font-medium ${
              danger
                ? 'bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700'
                : 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
            }`}
            onClick={() => onAction(action)}
          >
            {actionText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingCard
