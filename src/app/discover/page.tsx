'use client'
import CommunityCardDiscover from '@/components/CommunityCardDiscover'
import TagList from '@/components/Discover/TagList'
import { Input } from '@/components/ui/input'
import React from 'react'
import Pagination from '@mui/material/Pagination'
import { IoSearch } from 'react-icons/io5'
import { useState } from 'react'
interface Tag {
  id: number
  name: string
  count?: number
}
export default function Page() {
  const tags: Tag[] = [
    { id: 1, name: 'Technology', count: 145 },
    { id: 2, name: 'Design', count: 89 },
    { id: 3, name: 'Development', count: 234 },
    { id: 4, name: 'UI/UX', count: 56 },
    { id: 5, name: 'Programming', count: 198 },
    { id: 6, name: 'Web', count: 167 },
    { id: 7, name: 'Mobile', count: 92 },
    { id: 8, name: 'Software', count: 143 },
    { id: 9, name: 'Frontend', count: 88 },
    { id: 10, name: 'Backend', count: 76 },
    { id: 11, name: 'Software', count: 143 },
    { id: 12, name: 'Frontend', count: 88 },
    { id: 13, name: 'Backend', count: 76 },
    { id: 14, name: 'Software', count: 143 },
    { id: 15, name: 'Frontend', count: 88 },
    { id: 16, name: 'Backend', count: 76 },
  ]
  const [selectedTags, setSelectedTags] = useState<number[]>([])

  const handleTagClick = (tagId: number) => {
    setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]))
  }
  const [active, setActive] = useState(1)

  const posts = Array.from({ length: 40 }, (_, i) => <CommunityCardDiscover key={i} isLoading={false} num={i} />)
  const postPerPage = 8

  const startIndex = (active - 1) * postPerPage
  const endIndex = startIndex + postPerPage
  const currentPosts = posts.slice(startIndex, endIndex)
  const totalPages = Math.ceil(posts.length / postPerPage)

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setActive(page)
    window.scrollTo({ top: 0, behavior: 'smooth' }) // Optional: scroll to top on page change
  }
  return (
    <div className="flex-col-center gap-16 container">
      <h1 className="h1">Discover</h1>
      <div className="flex-center gap-1 px-4 py-4 rounded-full border-[2px]  border-foreground max-w-[800px] w-full ">
        <IoSearch fontSize={28} />
        <Input
          type="text"
          placeholder="Search ..."
          className="border-0 w-full text-xl font-normal tracking-tight md:text-2xl"
        />
      </div>
      <div className="relative w-full">
        <TagList tags={tags} selectedTags={selectedTags} onTagClick={handleTagClick} className=" rounded-lg" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10" />
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-8 w-full">{currentPosts}</div>
      <Pagination
        className="mb-10  mt-5 scale-125 mmd:scale-100 self-center"
        count={totalPages}
        page={active}
        size="large"
        color="primary"
        onChange={handlePageChange}
      />
    </div>
  )
}
