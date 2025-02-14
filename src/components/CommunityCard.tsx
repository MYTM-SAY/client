"use client";

import Image from "next/image";
import { FaLock } from "react-icons/fa";
import { FaShare } from "react-icons/fa";
import { VscSettings } from "react-icons/vsc";
import { IoIosHeartEmpty } from "react-icons/io";
import { IoMdHeart } from "react-icons/io";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdOutlineCancel } from "react-icons/md";
import { CommunityCardProps } from "@/types";
import { MdHeartBroken } from "react-icons/md";
import { GiExitDoor } from "react-icons/gi";

const CommunityCard = ({ status }: CommunityCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFav = () => {
    setIsFavorite(!isFavorite);
  };
  return (
    <div className="relative flex flex-col h-[300px] bg-card gap-2 pb-2 rounded-lg overflow-hidden drop-shadow-lg">
      <DropdownMenu>
        <DropdownMenuTrigger className="absolute h-[18px] top-2 right-2 z-10 bg-foreground text-background rounded-sm cursor-pointer">
          <VscSettings fontSize={18} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="custom-dropdown-content">
          {status == "pending" ? (
            <DropdownMenuItem className="custom-dropdown-item dropdown-cancel">
              <MdOutlineCancel />
              Cancel join request
            </DropdownMenuItem>
          ) : status == "favorite" ? (
            <>
              <DropdownMenuItem className="custom-dropdown-item dropdown-cancel">
                <MdHeartBroken />
                Remove from favorites
              </DropdownMenuItem>

              <DropdownMenuItem className="custom-dropdown-item dropdown-cancel">
                <GiExitDoor />
                Leave the community
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem className="custom-dropdown-item dropdown-cancel">
              <GiExitDoor />
              Leave the community
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="relative flex-1 w-full">
        <Image
          src="/Card image.png"
          className=" border border-gray-300 dark:border-gray-700"
          alt="Profile Picture"
          fill={true}
          objectFit="cover"
        />
      </div>
      <div className="flex justify-between space-x-2 items-center px-2">
        <h2 className="h5">Community Name</h2>
        <div className="flex gap-3">
          <FaShare fontSize={20} className="cursor-pointer" />

          <div className="relative w-5 h-5">
            <IoMdHeart
              fontSize={20}
              onClick={handleFav}
              className={`absolute transition-all duration-300 cursor-pointer
                ${
                  isFavorite
                    ? "opacity-100 transform scale-100 text-red-500"
                    : "opacity-0 transform scale-0"
                }
              `}
            />
            <IoIosHeartEmpty
              fontSize={20}
              onClick={handleFav}
              className={`absolute transition-all duration-300 cursor-pointer hover:text-red-300
                ${
                  isFavorite
                    ? "opacity-0 transform scale-0"
                    : "opacity-100 transform scale-100"
                }
              `}
            />
          </div>
        </div>
      </div>
      <p className="px-2 p-sm-muted" style={{ whiteSpace: "pre-wrap" }}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam hic aut
        sequi nihil maxime natus provident,
      </p>
      <div className="flex justify-between itmes-center w-full px-2 p-sm">
        <p>88K Members</p>
        <div className="flex items-center gap-2">
          <div>
            <FaLock />
          </div>

          <p>Private</p>
        </div>
      </div>
    </div>
  );
};

export default CommunityCard;
