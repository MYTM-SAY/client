import { useState, useRef, useEffect } from 'react'
import { FiChevronDown, FiGlobe, FiLock } from 'react-icons/fi'

interface VisibilitySettingProps {
  initialVisibility: 'public' | 'private'
  onVisibilityChange: (newVisibility: 'public' | 'private') => void
}

const VisibilitySetting = ({
  initialVisibility = 'public',
  onVisibilityChange,
}: VisibilitySettingProps) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)
  const [visibility, setVisibility] = useState<'public' | 'private'>(
    initialVisibility,
  )
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownVisible(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const handleToggleVisibility = (newVisibility: 'public' | 'private') => {
    setVisibility(newVisibility)
    onVisibilityChange(newVisibility)
    setIsDropdownVisible(false)
  }

  return (
    <div className="mb-8 relative" ref={dropdownRef}>
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1 mr-4 text-indigo-600 dark:text-indigo-400">
            {visibility === 'public' ? (
              <FiGlobe size={20} />
            ) : (
              <FiLock size={20} />
            )}
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-lg text-gray-900 dark:text-white">
              Community Visibility
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              This community is currently{' '}
              <span
                className={`font-semibold ${
                  visibility === 'public' ? 'text-green-600' : 'text-amber-500'
                }`}
              >
                {visibility}
              </span>
            </p>
          </div>
          <div className="relative">
            <button
              className="px-4 py-2.5 flex items-center bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-lg font-medium"
              onClick={() => setIsDropdownVisible(!isDropdownVisible)}
            >
              Change visibility <FiChevronDown className="ml-2" />
            </button>
            {isDropdownVisible && (
              <div className="absolute z-10 top-full left-0 mt-2 w-56 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div
                  className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center"
                  onClick={() =>
                    handleToggleVisibility(
                      visibility === 'public' ? 'private' : 'public',
                    )
                  }
                >
                  {visibility === 'public' ? (
                    <>
                      <FiLock className="mr-3 text-gray-500" />
                      <span>Change to private</span>
                    </>
                  ) : (
                    <>
                      <FiGlobe className="mr-3 text-gray-500" />
                      <span>Change to public</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VisibilitySetting
