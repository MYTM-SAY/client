import React from "react";

const OverView = ({ description }: { description?: string }) => {
  return (
    <div className="p-8">
      <p>{description || "No description provided."}</p>
    </div>
  );
};

export default OverView;
