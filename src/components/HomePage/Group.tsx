import React from "react";
import Image from "next/image";
import Btn from "../ui/Btn";
import { VscSettings } from "react-icons/vsc";
import { GiExitDoor } from "react-icons/gi";
import { GroupProps } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Group = ({ num }: GroupProps) => {
  return (
    <div className="relative flex flex-col bg-card items-center px-4 pt-4 pb-12 space-y-1 rounded-lg overflow-hidden dark-gray-shadow">
      <DropdownMenu>
        <DropdownMenuTrigger className="absolute h-[18px] top-2 right-2 z-10 bg-foreground text-background rounded-sm cursor-pointer">
          <VscSettings fontSize={18} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="custom-dropdown-content">
          <DropdownMenuItem className="custom-dropdown-item dropdown-cancel">
            <GiExitDoor />
            Leave the community
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Image
        src="/download (3).jpeg"
        className=" rounded-full"
        alt="Hello"
        width={56}
        height={56}
      />
      <p className="h5">{num}</p>
      <div className="flex justify-between w-full p-muted">
        <p>13k</p>
        <p>Public</p>
      </div>
      <Btn className="absolute bottom-0 left-0 w-full rounded-none p-2 text-white">
        View
      </Btn>
    </div>
  );
};

export default Group;
