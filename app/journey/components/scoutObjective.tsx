import React from "react";
import { useRouter } from "next/navigation";
import ForwordIcon from "@/assests/svg/forwordIcon";

function ScoutObjective() {
  const router = useRouter();

  const handleReviewDrill = () => {
    router.push("/journey/review-drills");
  };

  return (
    <div className="scout-otr">
      <div className="justify-between items-center inline-flex w-full mb-[16px] mt-[24px]">
        <p className="heading-bold-28">
          Objectives
        </p>
        <div
          onClick={handleReviewDrill}
          className="text-17 color-green font-weight-400 cursor-pointer"
        >
          Show all
        </div>
      </div>

      <div className="bg-[#1C1C1E] rounded-[14px]" onClick={handleReviewDrill}>
        <div className={`w-full flex flex-wrap justify-between items-center pl-[16px] py-[11px]`}>
          <div className="text-17 font-weight-400">
            Review player drills
            {/* <span className="font-normal"></span> */}
          </div>
          <div className="pr-[16px] pl-[8px] cursor-pointer">
            <ForwordIcon />
          </div>
        </div>
      </div>
      <p
        className="text-12 mx-[16px] pt-[8px]"
      >
        Click into each objective to view details and complete the objectives.
      </p>
    </div>
  );
}

export default ScoutObjective;
