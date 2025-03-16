import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

interface TagInputProps {
  tags: string[]
  onAddTag: (tag: string) => void
  onRemoveTag: (tag: string) => void
}

export const TagInput = ({ tags, onAddTag, onRemoveTag }: TagInputProps) => {
  const [input, setInput] = useState('')

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim() !== '') {
      onAddTag(input.trim())
      setInput('')
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="tags">Tags</Label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, idx) => (
          <Badge
            key={idx}
            variant="secondary"
            className="px-3 py-1"
            onClick={() => onRemoveTag(tag)}
          >
            {tag}
            <X className="ml-2 h-3 w-3 cursor-pointer" />
          </Badge>
        ))}
      </div>
      <Input
        id="tags"
        placeholder="Type a tag and press Enter"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="max-w-md"
      />
      <p className="text-sm text-muted-foreground mt-1">
        Press Enter to add a new tag
      </p>
    </div>
  )
}
