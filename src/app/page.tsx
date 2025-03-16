import React from 'react'
import CalendarHolder from '../components/HomePage/CalendarHolder'
import Post from '../components/Post/Post'

const page = () => {
  const posts = Array.from({ length: 40 }, (_, i) => <Post key={i} />)

  return (
    <div className="grid grid-cols-8 gap-5">

      <div className="col-span-6">
        {/* <JoinedGroups /> */}
        <div className="space-y-5">{posts}</div>
      </div>

      <CalendarHolder />
    </div>
  )
}

export default page
