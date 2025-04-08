import React from "react";
import { FaPlay } from "react-icons/fa6";

const VideoPart = () => {
  return (
    <div className="max-w-[700px] ">
      <div className="w-full h-[300] bg-card rounded-lg relative">
        <FaPlay
          className="cursor-pointer absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
          fontSize={40}
        />
        <span className="absolute text-background bottom-2 right-2 bg-foreground rounded-md px-2 py-1 text-sm">
          1:30
        </span>
      </div>
    </div>
  );
};

export default VideoPart;
