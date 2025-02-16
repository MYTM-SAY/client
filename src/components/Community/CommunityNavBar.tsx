"use client";
import { useState } from "react";

const CommunityNavBar = () => {
  const [active, setActive] = useState("Forum");
  const navItems = [
    "Forum",
    "Classroom",
    "Leaderboards",
    "Members",
    "Calendar",
    "About",
  ];
  const baseClasses =
    "cursor-pointer relative before:absolute before:w-0 before:h-1 before:bg-accent before:-bottom-4 hover:before:w-full before:transition-all before:duration-700";

  const handleOnClick = (item: string) => {
    setActive(item);
  };
  return (
    <ul className="flex justify-evenly bg-card rounded-md py-4 max-w-[1000px] mb-12">
      {navItems.map((item) => (
        <li
          onClick={() => handleOnClick(item)}
          key={item}
          className={`${baseClasses} ${
            active.toLowerCase() === item.toLowerCase()
              ? "text-accent before:w-full"
              : ""
          }`}
        >
          {item}
        </li>
      ))}
    </ul>
  );
};

export default CommunityNavBar;
