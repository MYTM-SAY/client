import React from "react";
import Calendarr from "../components/HomePage/Calendarr";
import JoinedGroups from "../components/HomePage/JoinedGroups";
import Post from "../components/Post/Post";
const page = () => {
  const posts = Array.from({ length: 40 }, (_, i) => <Post key={i} num={i} />);
  return (
    <div className="flex w-full space-x-4 px-4 overflow-y-hidden mlg:flex-col mlg:overflow-y-auto">
      <div className="mx-auto max-w-[1000px] w-full overflow-y-auto  no-scrollbar mlg:order-2 mlg:overflow-y-visible">
        <JoinedGroups />
        <div className="space-y-8 p-4 rounded-lg">{posts}</div>
      </div>
      <Calendarr />
    </div>
  );
};

export default page;
