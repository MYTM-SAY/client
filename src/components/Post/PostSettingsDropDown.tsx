import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EllipsisIcon, Trash } from 'lucide-react'

const PostSettingsDropdown = () => {
  return (
    <DropdownMenu>
        <DropdownMenuTrigger className="absolute top-2 right-2 z-10 bg-foreground/70 text-background rounded-sm cursor-pointer h-8 w-8 flex items-center justify-center">
          <EllipsisIcon size={25} />
        </DropdownMenuTrigger>
      <DropdownMenuContent className="custom-dropdown-content">
        <DropdownMenuItem className="custom-dropdown-item dropdown-cancel">
          <Trash />
          Delete Post
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default PostSettingsDropdown
