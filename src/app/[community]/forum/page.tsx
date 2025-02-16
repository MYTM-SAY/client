import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Post from "@/components/Post/Post";
import Image from "next/image";
import Btn from "@/components/ui/Btn";

import { CreatePost } from "@/components/Fourm/CreatePost";
const page = () => {
  const posts = Array.from({ length: 40 }, (_, i) => <Post key={i} num={i} />);
  const bio = `ANDY ELLIOTT'S #1 GROUP FOR
SALES & PERSONAL
DEVELOPMENT`;
  return (
    <div className="flex gap-4 justify-between">
      <div className=" max-w-[1000px] w-full">
        <div className="flex-center gap-1 px-4 py-2 rounded-lg border-[2px] border-foreground max-w-[700px] w-full mb-8">
          <Avatar>
            <AvatarImage src="/download (3).jpeg" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <CreatePost />
        </div>
        <div className="space-y-8">{posts}</div>
      </div>

      <div className="bg-card rounded-lg overflow-hidden shrink-0 self-start pb-8 mr-4 mmd:hidden">
        <Image
          src="/Rectangle 76.png"
          className=" border border-gray-300 dark:border-gray-700 mb-2"
          alt="Profile Picture"
          width={300}
          height={100}
        />
        <div className="px-2 space-y-4">
          <h2 className="h4">Community Name</h2>
          <div className="p-muted" style={{ whiteSpace: "pre" }}>
            {bio}
          </div>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/Rectangle 83.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <p className="p font-medium">By Ian Macklin 👑</p>
          </div>
          <div className="flex justify-center space-x-2 text-center border-y mx-2 p-muted">
            <div className="flex-1">
              <p>18.8K</p>
              <p>Members</p>
            </div>
            <div className="border-x px-2 flex-1">
              <p>48</p>
              <p>Online</p>
            </div>
            <div className="flex-1">
              <p>8</p>
              <p>Admins</p>
            </div>
          </div>
          <Btn className="mx-auto w-full py-4">Settings</Btn>
        </div>
      </div>
    </div>
  );
};

export default page;
