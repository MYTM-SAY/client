import React from "react";
import Image from "next/image";
import Btn from "../ui/Btn";
const CommunitiesProfile = () => {
  return (
    <div>
      <p className="h4 mb-4">Communities</p>
      <div className="p-6 flex flex-col gap-10 bg-card  rounded-lg shadow-md">
        {[1, 2, 3].map((_, index) => (
          <div
            key={index}
            className="flex w-full justify-between items-start msm:items-center msm:flex-col "
          >
            <div>
              <div className="flex gap-4 flex-wrap msm:justify-center ">
                <Image
                  src="/download (3).jpeg"
                  className="rounded-lg"
                  alt="Community"
                  width={68}
                  height={68}
                />
                <div>
                  <p className="h5">Complete Front-end course</p>
                  <p className="p-muted">Private • 167.6k • Admin</p>
                </div>
              </div>
              <p className="mt-4 p-lg-muted">
                Lorem, ipsum dolor sit amet consectetur
              </p>
            </div>
            <Btn className="px-10 py-2 msm:mt-4 text-white bg-accent">
              Visit
            </Btn>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunitiesProfile;
