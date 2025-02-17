"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { FaCompass, FaUserGroup } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { BsFillPlusCircleFill } from "react-icons/bs";

import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import SideBarIcon from "./SideBarIcon";

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const pathname = usePathname();
  const arr: string[] = ["adonas", "jolly", "AlTarek", "Hassan"];
  // console.log(pathname);
  // console.log(`/${arr[0]}`);
  // console.log(pathname.startsWith(`/${arr[0]}`));
  return (
    <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
      <SidebarHeader className="p-0">
        <SidebarMenu className="py-6  gap-6 flex-col-center">
          <SideBarIcon href="/" isActive={pathname === "/"}>
            <FaHome className="!w-8 !h-8" />
          </SideBarIcon>
          <SideBarIcon
            href="/my-communities"
            isActive={pathname === "/my-communities"}
          >
            <FaUserGroup className="!w-8 !h-8" />
          </SideBarIcon>
        </SidebarMenu>
        <SidebarSeparator className="mb-4 h-[2px]" />
      </SidebarHeader>
      <SidebarContent className=" no-scrollbar">
        <SidebarMenu className=" gap-6 flex-col-center">
          {arr.map((i, idx) => (
            <SideBarIcon
              key={idx}
              href={`/${i}`}
              isActive={pathname.startsWith(`/${i}`)}
            >
              <Image
                src="/download (3).jpeg"
                width={56}
                height={56}
                alt="Community"
                className="!w-14 !h-14 rounded-full"
              />
            </SideBarIcon>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-0">
        <SidebarSeparator className="mt-4 h-[2px]" />
        <SidebarMenu className="py-4 gap-8 flex-col-center">
          <SideBarIcon href="/create" isActive={pathname === "/create"}>
            <BsFillPlusCircleFill className="!w-8 !h-8" />
          </SideBarIcon>
          <SideBarIcon href="/discover" isActive={pathname === "/discover"}>
            <FaCompass className="!w-8 !h-8" />
          </SideBarIcon>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
