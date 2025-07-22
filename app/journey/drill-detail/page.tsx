"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import GraduationCap from "@/assests/svg/graduationCap";
import PlayCircleIcon from "@/assests/svg/playCircle";
import PlusIcon from "@/assests/svg/plus";
import TickCircleIcon from "@/assests/svg/tickCircle";
import Header from "@/components/Header";
import Popup from "@/components/shared/Popup";
import DrillFeedback from "../components/drillFeedback";
import { convertTimeDuration } from "@/utils/convertTimeDuration";
import { getJournies } from "@/api/Journey/getJournies";
import { uploadDrill } from "@/api/Journey/uploadDrill";
import "../../auth/signup/components/AllComponent.scss";
import CustomButton13 from "@/components/Button/CustomButton13";
import { Images } from "@/public/Images";
import Image from "next/image";
import { Suspense } from "react";

function DrillDetails() {
  const [isWatchDrill, setWatchDrill] = useState<boolean>(false);
  const [isViewFeedback, setViewFeedback] = useState<boolean>(false);
  const [submitDrill, setSubmitDrill] = useState<boolean>(false);
  const [drillsData, setDrillsData] = useState<any>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  const fileInputRef = useRef<any>(null);
  const searchParams = useSearchParams();
  const drillId: any = searchParams.get("id");

  const drill = drillsData?.find((data: any) => data.id == drillId);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const video = e.target.files[0];
      if (video) {
        const formData = new FormData();
        formData.append("drill-video", video);
        uploadDrill(formData, drillId, setSubmitDrill, setLoading);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const journeyData = await getJournies();
        setDrillsData(journeyData?.drills);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [submitDrill]);

  return (
    <>
      <div className="relative">
        <Header />
        <div className="journeyContainer drill-detail-otr">
          <div className="drill-detail-inner">
            <div className="relative">
              <img
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${drill?.drillBannerForMobile}`}
                alt="Rank"
                className="w-full h-[275px] object-cover rounded-[14px]"
              />
              <span className="heading-bold-28 absolute bottom-[16px] left-[16px]">
                {drill?.title}
              </span>
            </div>

            <div className="drill-content">
              <div className="left-content">
                <div className="flex gap-2">
                  <GraduationCap />
                  <p className="heading-bold-22 color-green">Roy Kent</p>
                </div>
                <div className=" flex items-center gap-[6px]">
                  <p className="text-11">{drill?.category?.name}</p>
                  <p className="flex gap-[6px] text-11 text-center pb-[4px]">
                    .
                  </p>
                  <p className="text-11">
                    {convertTimeDuration(Math.round(drill?.drillDuration))}
                  </p>
                </div>
                <div>
                  <p className="text-13 color-white">{drill?.description}</p>
                </div>
              </div>
              <div className="right-content">
                <div>
                  <input
                    type="file"
                    name="reelPath"
                    accept="video/*"
                    onChange={handleVideoChange}
                    style={{ display: "none" }}
                    ref={fileInputRef}
                  />
                  <CustomButton13
                    onClick={handleButtonClick}
                    isLoading={isLoading}
                    icon={<PlusIcon />}
                    title={"Submit Drill"}
                    className={
                      drill?.userDrill[0]?.isApproved
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                    }
                    disabled={drill?.userDrill[0]?.isApproved ? true : false}
                  />
                </div>
                <div className="w-full">
                  <CustomButton13
                    onClick={() => setWatchDrill(true)}
                    icon={<PlayCircleIcon />}
                    title={"Watch Drill"}
                    darkButton
                  />
                </div>
              </div>
            </div>

            <div className="drill-objective">
              <div className="flex flex-col gap-[2px]">
                <p className="heading-bold-22">Drill Objectives</p>
                <p className="text-13">
                  Follow these general guidelines to help you get the most out
                  of this drill.
                </p>
              </div>
              <div className="flex flex-col gap-[12px]">
                {drill?.objectives?.map((data: any) => {
                  return (
                    <div className="flex items-center gap-[6px]">
                      <TickCircleIcon />
                      <p className="text-13 color-white">{data?.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="heading-bold-22 mb-[4px]">Additional Info</p>
              {drill?.userDrill[0]?.isApproved === "accepted" ? (
                <div className="flex justify-between">
                  <p className="text-16">Drill Status</p>
                  <div
                    className="bg-transparent rounded-[16px] pr-[8px] pb-[2px] pl-[8px] flex items-center color-green font-weight-500 text-12 gap-[4px] border-[1px] border-[#9fe870] cursor-pointer"
                    onClick={() => {
                      setViewFeedback(true);
                    }}
                  >
                    View Feedback
                    <Image
                      src={Images.ForwardArrow}
                      alt=""
                      className="feedback"
                    />
                  </div>
                </div>
              ) : (
                drill?.userDrill && (
                  <div className="flex justify-between">
                    <p
                      className="text-violet-100 text-opacity-60 font-sans text-[16px]
        font-normal leading-[21px] tracking-[-0.32px]"
                    >
                      Drill Status
                    </p>
                    <div className="bg-white rounded-[16px] pr-[8px] pb-[2px] pl-[8px] text-12 font-weight-500 flex items-center justify-center color-amber">
                      {drill?.userDrill[0]?.isApproved === "pending"
                        ? "Under Review"
                        : "Pending"}
                    </div>
                  </div>
                )
              )}
              {/* <div className="px-2 py-1.5 bg-zinc-500 bg-opacity-20 rounded justify-between items-start inline-flex w-full mt-3">
            <p className="text-violet-100 text-opacity-60 text-base font-normal font-['SF Pro Text'] leading-[21px]">
              Logs
            </p>
            <div className="text-violet-100 text-opacity-60 text-base font-normal leading-[21px] flex items-center gap-1">12 <ForwordIcon /></div>
          </div> */}
            </div>
          </div>
        </div>
      </div>

      {isWatchDrill && (
        <Popup onClose={() => setWatchDrill(false)}>
          <div className="container p-3 sm:p-8 h-[625px]">
            <video
              autoPlay
              muted
              loop
              className="h-full w-full object-cover object-center"
              controls
            >
              <source
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${drill?.drillUrl}`}
                type="video/mp4"
              />
            </video>
          </div>
        </Popup>
      )}

      {isViewFeedback && (
        <Popup onClose={() => setViewFeedback(false)}>
          <DrillFeedback feedback={drill?.userDrill[0]} />
        </Popup>
      )}
    </>
  );
}

function DrillDetail() {
  return (
    // You could have a loading skeleton as the `fallback` too
    <Suspense>
      <DrillDetails />
    </Suspense>
  );
}

export default DrillDetail;
