"use client";
import React, { useState } from 'react'
import { toast } from "react-toastify";
import axios from "axios";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import CustomButton from "@/components/Button/CustomButton";
import Header from "@/components/Header";
import { TextArea } from "@/components/ui/textArea";

function Feedback() {
  const [formState, setFormState] = useState<any>({
    feedback: "",
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const drillId = searchParams.get("id");
  const logId: any = searchParams.get("logId");
  const action = searchParams.get("action");

  const changeHandler = (e: any) => {
    const { name, value } = e.target;
    setFormState((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmitFeedback = async () => {
    try {
      const drillFeedbackPayload = {
        content: formState.feedback,
      };
      const logActionPayload: any = {
        logId: parseInt(logId),
        action: "reject",
        rejectionReason: formState.feedback,
      };

      const payload = action ? logActionPayload : drillFeedbackPayload;
      const endPoint = action
        ? `/journies/logs/review/action`
        : `/journies/userDrill/${drillId}/feedback`;

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}${endPoint}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (res?.status === 200) {
        toast.success(res?.data?.message);
        router.back();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <>
      <Header />
      <div className="journeyContainer">
        <div className="p-2 rounded-full w-10 bg-zinc-500 bg-opacity-20 rounded">
          <ArrowLeftIcon
            className="cursor-pointer hover:font-bold"
            onClick={() => router.back()}
          />
        </div>

        <div className="w-full md:1/2 lg:w-4/12 m-auto mt-8">
          <h2 className="text-2xl font-bold mt-8">
            What did the player do wrong...or right?
          </h2>
          <p className="text-violet-100 text-opacity-60 text-base font-normal font-['SF Pro Text'] leading-[21px] font-sans h-14 overflow-hidden line-clamp-2">
            Leaving constructive criticism and feedback allows the player to
            improve.
          </p>
          <TextArea
            name="feedback"
            onChange={changeHandler}
            placeholder="Type something here..."
            rows={8}
            cols={40}
            className="mt-4"
          />

          <CustomButton
            title={"Submit Feedback"}
            onClick={handleSubmitFeedback}
            className="mt-4"
          />
        </div>
      </div>
    </>
  );
}

export default Feedback;
