"use client";
import React, { useState } from "react";
import { PostContentProps } from "@/types";
const PostContent = ({ title, content }: PostContentProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <h2 className="h4 mt-3">{title}</h2>
      <p
        className={`mt-2 p-lg-muted text-foreground relative ${
          !isExpanded ? "two-lines-truncate" : ""
        }`}
      >
        {content}
        {!isExpanded && (
          <span
            className="text-accent pl-2 cursor-pointer absolute right-0 -bottom-1 bg-card pr-2"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            ... view more
          </span>
        )}
      </p>
      {isExpanded && (
        <span
          className="text-accent pl-2 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          view less
        </span>
      )}
    </>
  );
};

export default PostContent;
