import React from "react";
import NavSearch from "./NavSearch";
import NavProfile from "./NavProfile";
const NavBar = () => {
  return (
    <div className="flex-between py-4 px-2 gap-8">
      <NavSearch />
      <NavProfile />
    </div>
  );
};

export default NavBar;
