'use client'
import React, { useState, useEffect, useCallback } from 'react'
import OverView from './OverView'
import Notes from './Notes'
import { CourseReviews } from './reviews/CourseReviews'

interface UnderProps {
  setShowContent: (show: boolean) => void;
  description?: string;
}

const Under = ({ setShowContent, description }: UnderProps) => {
  const [under, setUnder] = useState(1)
  const [isMobile, setIsMobile] = useState(false)

  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 1024)
  }, [])

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  const handleTabClick = (tabNumber: number, showContent: boolean) => {
    setUnder(tabNumber)
    setShowContent(showContent)
  }

  const tabs = [
    ...(isMobile ? [{ id: 4, label: 'Course Content', showContent: true }] : []),
    { id: 1, label: 'Overview', showContent: false },
    { id: 2, label: 'Notes', showContent: false },
    // { id: 3, label: 'Reviews', showContent: false },
  ]

  return (
    <div className="w-full">
      <div className="w-full border-b border-gray-200 mb-4">
        <nav className="-mb-px">
          <ul className={`flex ${isMobile ? 'flex-wrap gap-2' : 'gap-6'} text-gray-500 font-semibold`}>
            {tabs.map((tab) => (
              <li
                key={tab.id}
                className={`
                  cursor-pointer transition-all duration-200 ease-in-out
                  ${isMobile 
                    ? 'flex-1 min-w-0 text-center py-3 px-2 rounded-t-lg text-sm' 
                    : 'py-4 px-2 text-base'
                  }
                  ${under === tab.id 
                    ? 'text-accent border-b-2 border-accent bg-accent/5' 
                    : 'hover:text-gray-700 hover:border-b-2 hover:border-gray-300'
                  }
                  ${isMobile ? 'min-h-[44px] flex items-center justify-center' : ''}
                `}
                onClick={() => handleTabClick(tab.id, tab.showContent)}
              >
                <span className={`${isMobile ? 'truncate' : ''}`}>
                  {tab.label}
                </span>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="w-full">
        {under === 1 && <OverView description={description} />}
        {under === 2 && <Notes />}
        {under === 3 && <CourseReviews />}
        {under === 4 && isMobile && (
          <div className="text-center text-gray-500 py-8">
            <p>Course content is now visible in the sidebar</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Under
