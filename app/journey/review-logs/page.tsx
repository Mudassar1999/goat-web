"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import ToBeReview from "../components/toBeReview";
import ReviewedLogs from "../components/reviewedLogs";
import { ArrowLeftIcon } from "lucide-react";
import "../../auth/signup/components/AllComponent.scss"
import "./Fortabsbtn.scss"

function ReviewLogs() {
  const [viewName, setViewName] = useState("ToBeReviewed");
  const [toBeReviewedData, setToBeReviewedData] = useState<any>([]);
  const [reviewedData, setReviewedData] = useState<any>([]);

  const router = useRouter();

  const toggleView = (name: string) => {
    setViewName(name);
  };

  const getAllToBeReviewLogs = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/journies/logs/review`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setToBeReviewedData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllReviewedLogs = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/journies/logs/reviewed`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setReviewedData(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllToBeReviewLogs();
    getAllReviewedLogs();
  }, []);

  return (
    <>
      <Header />
      <div className="journeyContainer ">
        <div className="p-2 rounded-full w-10 bg-[#7878805c] rounded">
          <ArrowLeftIcon
            className="cursor-pointer hover:font-bold"
            onClick={() => router.back()}
          />
        </div>
        <div className="py-[24px]">
          <span className="heading-bold-22">
            {viewName === "ToBeReviewed" ? "Review logs" : "Reviewed logs"}
          </span>
        </div>
        <div className="bg-[#7676803d] h-8 w-full flex justify-center items-center border-[#0000000a] border-[0.5px] rounded-[8px] p-[2px]  cursor-pointer">
          <div
            className={`w-2/4 h-7 ${viewName === "ToBeReviewed" && "bg-[#636366] font-semibold rounded-[7px] px-[8px] py-[6px]"
              } py-[6px] pr-[7px] pl-[8px] font-medium flex justify-center`}
            onClick={() => toggleView("ToBeReviewed")}
          >
            <span className="h-4 flex fortabsbtn justify-center items-center text-center text-white text-[13px] font-sans leading-[20px] tracking-[-0.08]">To be reviewed</span>
          </div>
          <div
            className={`w-2/4 h-7 ${viewName === "Reviewed" && "bg-[#636366] font-semibold rounded-[7px] px-[8px] py-[6px]"
              } py-[6px] pr-[7px] pl-[8px] font-medium flex justify-center`}
            onClick={() => toggleView("Reviewed")}
          >
            <span className="h-4 fortabsbtn flex justify-center items-center text-center text-white text-[13px] font-sans leading-[20px] tracking-[-0.08]">Reviewed</span>
          </div>
        </div>
        {viewName === "ToBeReviewed" ? (
          <ToBeReview
            ToBeReviewedData={toBeReviewedData}
            router={router}
            getAllToBeReviewLogs={getAllToBeReviewLogs}
            getAllReviewedLogs={getAllReviewedLogs} />
        ) : (
          <ReviewedLogs reviewedData={reviewedData} router={router} />
        )}
      </div>
    </>
  );
}

export default ReviewLogs;
