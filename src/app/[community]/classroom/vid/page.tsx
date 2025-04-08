import CourseContent from "@/components/communityClassroom/classroomInner/courseContent/CourseContent";
import CourseProgress from "@/components/communityClassroom/classroomInner/courseContent/CourseProgress";
import Under from "@/components/communityClassroom/classroomInner/VideoPart/underVideo/Under";
import VideoPart from "@/components/communityClassroom/classroomInner/VideoPart/VideoPart";
import React from "react";

const page = () => {
  return (
    <div className="flex gap-4">
      <div className="flex flex-1 flex-col gap-4 ">
        <VideoPart />
        <Under />
      </div>
      <div className="w-[300px]">
        <CourseProgress />
        <CourseContent />
      </div>
    </div>
  );
};

export default page;
