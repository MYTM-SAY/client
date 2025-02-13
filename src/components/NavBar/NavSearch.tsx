import React from "react";
import { Input } from "@/components/ui/input";
import { IoSearch } from "react-icons/io5";

const NavSearch = () => {
  return (
    <div className="flex-center gap-1 px-4 py-2 rounded-lg border-[2px] border-foreground max-w-[400px] w-full">
      <IoSearch fontSize={28} />
      <Input
        type="text"
        placeholder="Search ..."
        className="border-0 w-full !p-lg "
      />
    </div>
  );
};

export default NavSearch;
