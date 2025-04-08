"use client";
import React, { useState } from "react";
import OverView from "./OverView";

const Under = () => {
  const [under, setUnder] = useState(1);
  return (
    <div>
      <ul className="flex gap-4  text-gray-500 h5 font-semibold pb-4">
        <li
          className={`cursor-pointer ${
            under === 1 ? "text-accent underline" : ""
          }`}
          onClick={() => setUnder(1)}
        >
          <span>OverView</span>
        </li>
        <li
          className={`cursor-pointer ${
            under === 2 ? "text-accent underline" : ""
          }`}
          onClick={() => setUnder(2)}
        >
          <span>Notes</span>
        </li>
        <li
          className={`cursor-pointer ${
            under === 3 ? "text-accent underline" : ""
          }`}
          onClick={() => setUnder(3)}
        >
          <span>Reviews</span>
        </li>
      </ul>
      {under === 1 ? (
        <OverView />
      ) : under === 2 ? (
        <div>Notes</div>
      ) : (
        <div>Reviews</div>
      )}
    </div>
  );
};

export default Under;
