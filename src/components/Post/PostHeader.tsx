import Image from "next/image";
import React from "react";
import { PostHeaderProps } from "@/types";
const PostHeader = ({
  profileImage,
  username,
  timestamp,
  category,
}: PostHeaderProps) => {
  return (
    <div className="flex gap-4 items-center">
      <Image
        src={profileImage}
        className="rounded-full"
        alt="Profile Image"
        width={68}
        height={68}
      />
      <div>
        <p className="h4">{username}</p>
        <p className="p-muted">
          {timestamp} in <strong>{category}</strong>
        </p>
      </div>
    </div>
  );
};

export default PostHeader;
