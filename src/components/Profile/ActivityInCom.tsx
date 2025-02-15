"use client";

import React, { MouseEvent, useState } from "react";
import Post from "../Post/Post";
// import { Pagination } from "../Pagination";
import Pagination from "@mui/material/Pagination";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ActivityInCom = () => {
  const [active, setActive] = useState(1);
  const [com, setCom] = useState("12 ");

  // You can move this data outside the component or keep it inside
  const communityData = [
    { value: "AI Geeks", label: "12" },
    { value: "CSS Geeks", label: "48" },
    { value: "JS Geeks", label: "52" },
    { value: "BI Geeks", label: "34" },
    { value: "CI Geeks", label: "5" },
  ];

  const posts = Array.from({ length: 40 }, (_, i) => <Post key={i} num={i} />);
  const postPerPage = 4;

  const paginate = (pageNumber: number, e: MouseEvent<HTMLAnchorElement>) => {
    setActive(pageNumber);
  };

  const startIndex = (active - 1) * postPerPage;
  const endIndex = startIndex + postPerPage;
  const currentPosts = posts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(posts.length / postPerPage);

  const handleSelectChange = (value: string) => {
    setCom(value);
  };
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setActive(page);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Optional: scroll to top on page change
  };
  return (
    <div className="flex flex-col gap-8 w-full mt-10 ">
      <div className="flex-between flex-wrap gap-6 rounded-lg  text-foreground  px-4 py-2">
        <div className="h4 font-medium">{com} contributions to:</div>
        <Select onValueChange={handleSelectChange}>
          <SelectTrigger className="p-lg h-[50px] w-[380px] msm:w-full  bg-card ">
            <SelectValue placeholder="AI Geeks" />
          </SelectTrigger>
          <SelectContent className="bg-card  text-foreground ">
            {communityData.map(({ value, label }) => (
              <SelectItem key={value} value={label} className="p-lg">
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {currentPosts}
      <Pagination
        className="mb-10  mt-5 scale-125 mmd:scale-100 self-center"
        count={totalPages}
        page={active}
        size="large"
        color="primary"
        onChange={handlePageChange}
      />
    </div>
  );
};

export default ActivityInCom;
