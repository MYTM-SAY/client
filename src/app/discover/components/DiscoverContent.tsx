'use client'
import React, { useState, useEffect } from 'react'
import CommunityCardDiscover from '@/components/CommunityCardDiscover'
import TagList from '@/components/Discover/TagList'
import { Input } from '@/components/ui/input'
import { IoSearch } from 'react-icons/io5'

interface Tag {
  id: number
  name: string
  count?: number
}

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

export interface Community {
  id: number
  name: string
  description: string
  bio: string
  createdAt: string
  updatedAt: string
  coverImgURL: string
  logoImgURL: string
  ownerId: number
  isPublic: boolean
  Tags: Tag[]
}
interface DiscoverContentProps {
  communities: Community[]
}
export default function DiscoverContent(communities: DiscoverContentProps) {
  const [selectedTags, setSelectedTags] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('')
  
  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const handleTagClick = (tagId: number) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    )
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  console.log(communities.communities)

  // Filter communities based on debounced search term
  const filteredCommunities = communities.communities.filter((community) => {
    const searchLower = debouncedSearchTerm.toLowerCase()
    return (
      debouncedSearchTerm === '' ||
      community.name.toLowerCase().includes(searchLower) ||
      community.description.toLowerCase().includes(searchLower) ||
      community.bio.toLowerCase().includes(searchLower)
    )
  })

  const allComunitites = filteredCommunities.map((community) => (
    <CommunityCardDiscover
      communityId={community.id}
      key={community.id}
      communityName={community.name}
      communityDescription={community.description}
      communityCover={community.coverImgURL}
      tags={community.Tags}
      isPublic={community.isPublic}
      createdAt={community.createdAt}
    />
  ))

  return (
    <>
      <div className="flex-center gap-1 px-4 py-4 rounded-full border-[2px] border-foreground max-w-[800px] w-full">
        <IoSearch fontSize={28} />
        <Input
          type="text"
          placeholder="Search ..."
          className="border-0 w-full text-xl font-normal tracking-tight md:text-2xl"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="relative w-full">
        <TagList
          tags={tags}
          selectedTags={selectedTags}
          onTagClick={handleTagClick}
          className="rounded-lg"
        />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10" />
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-8 w-full">
        {allComunitites}
      </div>
    </>
  )
}
