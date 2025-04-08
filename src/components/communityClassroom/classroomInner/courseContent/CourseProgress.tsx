import { Progress } from "@/components/ui/progress";
import { FaTrophy } from "react-icons/fa";

import React from "react";
const CourseProgress = () => {
  return (
    <div className="flex gap-2 justify-center items-center">
      <FaTrophy fontSize={22} className="text-yellow-500" />
      <div className="h-5 w-full relative">
        <span className="absolute top-[50%] translate-y-[-50%] left-2 z-10 p-sm">
          30%
        </span>
        <Progress value={30} className="bg-gray-300 h-5" />
      </div>
    </div>
  );
};

export default CourseProgress;
