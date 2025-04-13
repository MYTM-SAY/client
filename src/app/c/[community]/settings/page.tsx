'use client'
import { useState, useEffect } from 'react'
import Btn from '@/components/ui/Btn'

const Page = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)
  const [selectedAction, setSelectedAction] = useState(null)
  const [email, setEmail] = useState('')

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (isDropdownVisible && !target.closest('.dropdown-container')) {
        setIsDropdownVisible(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isDropdownVisible])

  const handleAction = (action) => {
    setIsDropdownVisible(false)
    setSelectedAction(action)
  }

  const handleConfirm = () => {}

  return (
    <div className="relateive">
      {selectedAction && (
        <div className="absolute inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center h-[calc(100vh+42px)]">
          <div className=" p-6 rounded-lg space-y-4 max-w-[400px] w-[400px]">
            <input
              type="email"
              placeholder="Enter user email"
              className="w-full p-2 border rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <Btn className="p-4" onClick={() => setSelectedAction(null)}>
                Cancel
              </Btn>
              <Btn className="p-4" onClick={handleConfirm}>
                Confirm
              </Btn>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between dropdown-container mb-6">
        <div>
          <p className="h5">Change repository visibility</p>
          <p className="p-muted">This repository is currently public.</p>
        </div>
        <div className="relative">
          <Btn
            className="p-4"
            onClick={() => setIsDropdownVisible(!isDropdownVisible)}
          >
            Change visibility
          </Btn>
          {isDropdownVisible && (
            <div className="absolute bottom-[-50px] left-[-55px] custom-dropdown-content rounded-lg p-3 custom-dropdown-item cursor-pointer bg-white shadow-lg">
              Change to private
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between mb-6">
        <div>
          <p className="h5">Mute member in the community</p>
          <p className="p-muted">
            You will prevent the user from interacting in the forum
          </p>
        </div>
        <Btn className="p-4" onClick={() => handleAction('mute')}>
          Mute member
        </Btn>
      </div>

      <div className="flex justify-between mb-6">
        <div>
          <p className="h5">Delete member from the community</p>
          <p className="p-muted">You will delete a user from the community</p>
        </div>
        <Btn className="p-4" onClick={() => handleAction('delete')}>
          Delete member
        </Btn>
      </div>

      <div className="flex justify-between mb-6">
        <div>
          <p className="h5">Ban member in the community</p>
          <p className="p-muted">
            The user will be removed from the community and will not be able to
            see it again
          </p>
        </div>
        <Btn className="p-4" onClick={() => handleAction('ban')}>
          Ban member
        </Btn>
      </div>

      <div className="flex justify-between mb-6">
        <div>
          <p className="h5">Change the role of a member in the community</p>
          <p className="p-muted">
            You can change the role of a member in the community
          </p>
        </div>
        <Btn className="p-4" onClick={() => handleAction('role')}>
          Change role
        </Btn>
      </div>
    </div>
  )
}

export default Page
