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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Group = ({ num }: GroupProps) => {
  return (
    <div className="relative flex flex-col bg-card items-center px-4 py-4 rounded-lg overflow-hidden dark-gray-shadow h-full justify-between">
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
      <div className="flex-col-center">
        <Image
          src="/download (3).jpeg"
          className=" rounded-full"
          alt="Hello"
          width={56}
          height={56}
        />
        <p className="h5">Front-end community</p>
      </div>
      <div className="flex items-center gap-3">
        <Avatar className="w-8 h-8">
          <AvatarImage src="/Rectangle 83.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <p className="p-sm-muted">By Ian Macklin 👑</p>
      </div>
      <div className="flex flex-col justify-between w-full p-muted">
        <div className="flex justify-between w-full p-muted">
          <p>13k</p>
          <p>Public</p>
        </div>
        <Btn className="w-full p-2 text-white">View</Btn>
      </div>
    </div>
  );
};

export default Group;
