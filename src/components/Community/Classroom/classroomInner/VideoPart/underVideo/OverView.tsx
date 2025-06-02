import React from "react";
import { FaStar } from "react-icons/fa";

const OverView = ({ description }: { description?: string }) => {
  return (
    <div className="">
      <p>{description || "No description provided."}</p>
      <div className="flex gap-16 flex-wrap pt-8">
        <div className="flex flex-col items-start gap-1">
          <div className="flex items-center justify-center gap-4">
            <p className="h-[20px]">4.8</p>
            <FaStar fontSize={20} className="text-yellow-500" />
          </div>
          <p className="p-muted">868 ratings</p>
        </div>
        <div className="flex flex-col items-start gap-1">
          <div className="flex ">
            <p className="h-[20px]">10.896</p>
          </div>
          <p className="p-muted">students</p>
        </div>
        <div className="flex flex-col items-start gap-1">
          <div className="flex ">
            <p className="h-[20px]">21.5 hours</p>
          </div>
          <p className="p-muted">total</p>
        </div>
      </div>
    </div>
  );
};

export default OverView;
