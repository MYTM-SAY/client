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

  // Function to check screen width
  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 1024)
  }, [])

  useEffect(() => {
    handleResize() // Check on initial render
    window.addEventListener('resize', handleResize) // Add resize listener
    return () => window.removeEventListener('resize', handleResize) // Cleanup listener
  }, [handleResize])

  return (
    <div>
      <ul className="flex gap-4 text-gray-500 h5 font-semibold pb-4">
        {isMobile && (
          <li
            className={`cursor-pointer ${
              under === 4 ? 'text-accent underline' : ''
            }`}
            onClick={() => {
              setUnder(4)
              setShowContent(true)
            }}
          >
            <span>Course Content</span>
          </li>
        )}
        <li
          className={`cursor-pointer ${
            under === 1 ? 'text-accent underline' : ''
          }`}
          onClick={() => {
            setUnder(1)
            setShowContent(false)
          }}
        >
          <span>OverView</span>
        </li>
        <li
          className={`cursor-pointer ${
            under === 2 ? 'text-accent underline' : ''
          }`}
          onClick={() => {
            setUnder(2)
            setShowContent(false)
          }}
        >
          <span>Notes</span>
        </li>
        <li
          className={`cursor-pointer ${
            under === 3 ? 'text-accent underline' : ''
          }`}
          onClick={() => {
            setUnder(3)
            setShowContent(false)
          }}
        >
          <span>Reviews</span>
        </li>
      </ul>
      {under === 1 ? <OverView description={description} /> : under === 2 ? <Notes /> : <CourseReviews />}
    </div>
  )
}

export default Under
