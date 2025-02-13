import React from "react";
import Link from "next/link";
import { SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { SideBarIconProps } from "@/types";

const SideBarIcon = ({ children, href, isActive }: SideBarIconProps) => {
  const { open, setOpen, openMobile, setOpenMobile } = useSidebar();
  return (
    <SidebarMenuItem
      className={`relative w-full flex-center  ${
        isActive &&
        "before:h-8  before:w-2 before:pointer-events-none before:transition-all before:duration-300 before:ease-in-out  flex-center cursor-pointer   before:-left-1   before:bg-gray-900 dark:before:bg-white before:rounded-full before:abs-vertical-center "
      }`}
      onClick={() => {
        setOpen(!open);
        setOpenMobile(!openMobile);
      }}
    >
      <Link href={href}>{children}</Link>
    </SidebarMenuItem>
  );
};

export default SideBarIcon;
