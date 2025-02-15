import React from "react";
import { VscSettings } from "react-icons/vsc";
import { MdDelete } from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PostSettingsDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="absolute top-2 right-2 z-10 bg-foreground text-background rounded-sm cursor-pointer">
        <VscSettings fontSize={24} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="custom-dropdown-content">
        <DropdownMenuItem className="custom-dropdown-item dropdown-cancel">
          <MdDelete />
          Delete Post
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PostSettingsDropdown;
