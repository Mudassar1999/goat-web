
"use client";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ClubTeams from '@/components/ClubTeams';

// without this the component renders on server and throws an error


const ClubTeamsPage: React.FC = () => {
  return (
    <>
     <Breadcrumb pageName="Club Teams" />
      <div className="mt-4 grid grid-cols-13 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">    
        <div className="col-span-12 xl:col-span-8">
          <ClubTeams/>
        </div>
       
      </div>
    </>
  );
};

export default ClubTeamsPage;
