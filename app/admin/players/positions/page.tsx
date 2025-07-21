
"use client";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Positions from "@/components/Players/Positions";
// without this the component renders on server and throws an error


const PositionsPage: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Player Positions" />
      <div className="mt-4 grid grid-cols-13 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12 xl:col-span-8">
          <Positions />
        </div>

      </div>
    </>
  );
};

export default PositionsPage;
