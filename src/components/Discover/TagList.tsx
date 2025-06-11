'use client'
import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface Tag {
  id: number
  name: string
  count?: number
}

interface TagListProps {
  tags: Tag[]
  selectedTags?: number[]
  onTagClick?: (tagId: number) => void
  className?: string
}

const TagList = ({
  tags,
  selectedTags = [],
  onTagClick,
  className,
}: TagListProps) => {
  return (
    <div className={cn('relative', className)}>
      <ScrollArea className="h-[100px] w-full whitespace-nowrap rounded-md">
        <div className="flex space-x-3 p-4">
          {/* Selected Tags First */}
          {tags
            .filter((tag) => selectedTags.includes(tag.id))
            .map((tag) => (
              <Badge
                key={tag.id}
                variant="default"
                className={cn(
                  'rounded-full px-6 py-2 p-lg ',
                  'transition-all duration-200',
                  'cursor-pointer',
                  'bg-primary hover:bg-primary/90',
                  'shadow-sm hover:shadow-md',
                )}
                onClick={() => onTagClick?.(tag.id)}
              >
                {tag.name}
              </Badge>
            ))}

          {/* Unselected Tags */}
          {tags
            .filter((tag) => !selectedTags.includes(tag.id))
            .map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className={cn(
                  'rounded-full px-6 py-2 p-lg',
                  'transition-all duration-200',
                  'cursor-pointer',
                  'hover:bg-secondary/80',
                  'border-2 border-transparent hover:border-primary/20',
                )}
                onClick={() => onTagClick?.(tag.id)}
              >
                {tag.name}
              </Badge>
            ))}
        </div>
        <ScrollBar
          orientation="horizontal"
          className="h-2.5 bg-secondary/20 hover:bg-secondary/40"
        />
      </ScrollArea>
    </div>
  )
}

export default TagList
