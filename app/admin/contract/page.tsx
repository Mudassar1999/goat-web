"use client";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Contracts from "@/components/Contracts";

// without this the component renders on server and throws an error

const ContractsPage: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Contracts" />
      <div className="grid-cols-13 2xl:mt-7.5 2xl:gap-7.5 mt-4 grid gap-4 md:mt-6 md:gap-6">
        <div className="col-span-12 xl:col-span-8">
          <Contracts />
        </div>
      </div>
    </>
  );
};

export default ContractsPage;
