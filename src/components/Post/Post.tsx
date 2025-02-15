import React from "react";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostActions from "./PostActions";
import PostSettingsDropdown from "./PostSettingsDropDown";

const Post = ({ num }: { num: number }) => {
  return (
    <div className="relative p-6 rounded-lg bg-card text-foreground dark-gray-shadow">
      <PostSettingsDropdown />
      <PostHeader
        profileImage="/download (3).jpeg"
        username={`${num}`}
        timestamp="6h ago"
        category="General"
      />
      <PostContent
        title="Curious, how do you manage the full ML lifecycle?"
        content="Hi guys! I’ve been pondering a specific question/idea that I would like to pose as a discussion. It concerns the idea of more quickly going from idea to Hie as a discussion. It concerns the idea of more quickly going from idea to Hie as a discussion. It concerns the idea of more quickly going from idea to Hie as a discussion. It concerns the idea of more quickly going from idea to Hi"
      />
      <PostActions />
    </div>
  );
};

export default Post;
