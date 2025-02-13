import React from "react";
import { SignedIn, SignOutButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/NavBar/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
const NavProfile = () => {
  return (
    <div className="flex shrink-0 items-center justify-end gap-4">
      <SignedIn>
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Image
              src="/download (3).jpeg"
              className=" rounded-full"
              alt="Hello"
              width={48}
              height={48}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <Link href="/profile/AlTarek">
              <DropdownMenuItem className="!cursor-pointer p-lg">
                Profile
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem className="p-lg cursor-pointer hover:!bg-destructive hover:!text-background !text-destructive">
              <SignOutButton />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SignedIn>
    </div>
  );
};

export default NavProfile;
