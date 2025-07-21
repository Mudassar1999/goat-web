
"use client";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import FeaturedDrills from "@/components/Journey/FeaturedDrills";

// without this the component renders on server and throws an error


const FeaturedDrillsPage: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Featured Drills" />
      <div className="mt-4 grid grid-cols-13 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12 xl:col-span-8">
          <FeaturedDrills />
        </div>

      </div>
    </>
  );
};

export default FeaturedDrillsPage;
