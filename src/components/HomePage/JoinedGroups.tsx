'use client'
import Btn from '../ui/Btn'
import * as React from 'react'
import { FaRegArrowAltCircleLeft } from 'react-icons/fa'
import { FaRegArrowAltCircleRight } from 'react-icons/fa'
import JoinedCommunityCard from './CommunityCardImproved'

const JoinedGroups = () => {
  const carouselRef = React.useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -145,
        behavior: 'smooth',
      })
    }
  }

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: 145,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="h4">Joined groups</h2>
        <Btn className="py-2 px-4 text-white">View more</Btn>
      </div>

      <div className="relative">
        <button
          onClick={scrollLeft}
          className="absolute top-1/2 -translate-y-1/2 left-0 cursor-pointer z-10"
        >
          <FaRegArrowAltCircleLeft fontSize="28" />
        </button>
        <button
          onClick={scrollRight}
          className="absolute top-1/2 -translate-y-1/2 right-0 cursor-pointer z-10"
        >
          <FaRegArrowAltCircleRight fontSize="28" />
        </button>
        <div
          ref={carouselRef}
          className="flex overflow-x-auto no-scrollbar gap-6 p-6"
        >
          {Array.from({ length: 20 }).map((_, index) => (
            <JoinedCommunityCard 
              key={index} 
              id={index + 1}
              userRole="MEMBER"
              name={`Community ${index + 1}`}
              members={Math.floor(Math.random() * 1000) + 10}
              isPublic={index % 2 === 0}
              creator={`Creator ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default JoinedGroups
