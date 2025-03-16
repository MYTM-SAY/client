'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TagInput } from './TagInput'

interface NameAndTagsProps {
  name: string
  tags: string[]
  onChange: (name: string, tags: string[]) => void
}

export const NameAndTags = ({ name, tags, onChange }: NameAndTagsProps) => {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value, tags)
  }

  const handleAddTag = (tag: string) => {
    onChange(name, [...tags, tag])
  }

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(
      name,
      tags.filter((tag) => tag !== tagToRemove),
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="communityName">Community Name</Label>
        <Input
          id="communityName"
          placeholder="Enter your community name"
          value={name}
          onChange={handleNameChange}
          className="max-w-md"
        />
      </div>
      <TagInput
        tags={tags}
        onAddTag={handleAddTag}
        onRemoveTag={handleRemoveTag}
      />
    </div>
  )
}
