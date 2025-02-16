"use client";
import Btn from "../ui/Btn";
import Group from "./Group";
import * as React from "react";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import { FaRegArrowAltCircleRight } from "react-icons/fa";

const JoinedGroups = () => {
  const carouselRef = React.useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -145,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: 145,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="h4">Joined groups</h2>
        <Btn className="py-2 px-4 text-white">View more</Btn>
      </div>

      <div className="relative">
        <button
          onClick={scrollLeft}
          className="absolute top-1/2 -translate-y-1/2 left-0 cursor-pointer z-10"
        >
          <FaRegArrowAltCircleLeft fontSize="28" />
        </button>
        <button
          onClick={scrollRight}
          className="absolute top-1/2 -translate-y-1/2 right-0 cursor-pointer z-10"
        >
          <FaRegArrowAltCircleRight fontSize="28" />
        </button>
        <div
          ref={carouselRef}
          className="flex overflow-x-auto no-scrollbar gap-6 p-6"
        >
          {Array.from({ length: 20 }).map((_, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[200px] h-[280px] text-center"
            >
              <Group num={index} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JoinedGroups;
