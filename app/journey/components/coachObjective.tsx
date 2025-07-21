import React from "react";
import { useRouter } from "next/navigation";
import ForwordIcon from "@/assests/svg/forwordIcon";
import "./ForPopUp.scss"

function CoachObjective() {
  const router = useRouter();

  const handleReviewDrill = () => {
    router.push("/journey/review-drills");
  };

  const handleReviewLogs = () => {
    router.push("/journey/review-logs");
  };

  return (
    <div >
      <div className="justify-between items-center inline-flex w-full pt-[24px] pb-[16px]">
        <p className="heading-bold-28">
          Objectives
        </p>
        <div
          onClick={handleReviewLogs}
          className="text-17"
        >
          <span className="text-[#9FE870] font-normal cursor-pointer">Show all</span>
        </div>
      </div>
      {/* <p
          className="text-violet-100 text-opacity-60 text-[13px] 
        font-normal font-sans leading-[18px] mt-1"
        >
          Click into each objective to view details and complete the objectives.
        </p> */}
      <div className="bg-[#1C1C1E] rounded-[14px] pl-[16px]">
        <div className={`w-full flex flex-wrap justify-between items-center py-[11px] border-b border-zinc-600 border-opacity-60 cursor-pointer`} onClick={handleReviewLogs}>
          <div className="text-17">
            <span className="font-normal">Review player logs</span>
          </div>
          <div className="pr-[16px] pl-[8px]">
            <ForwordIcon />
          </div>
        </div>
        <div className={`w-full flex flex-wrap justify-between items-center py-[11px] cursor-pointer`} onClick={handleReviewDrill}>
          <div className="text-17">
            <span className="font-normal">Review player drills</span>
          </div>
          <div className="pr-[16px] pl-[8px]">
            <ForwordIcon />
          </div>
        </div>
      </div>
      <p
        className=" forDESC  
         mx-[16px] pt-[8px]"
      >
        Click into each objective to view details and complete the objectives.
      </p>
    </div>
  );
}

export default CoachObjective;
