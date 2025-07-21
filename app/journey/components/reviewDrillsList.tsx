"use client"
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from 'lucide-react'
import CustomButton from '@/components/Button/CustomButton'
import "../../auth/signup/components/AllComponent.scss"
import Popup from '@/components/shared/Popup';
import { TextArea } from "@/components/ui/textArea";
import axios from "axios";
import { toast } from "react-toastify";
import "./ForPopUp.scss"


function ReviewDrillsList() {
  const [reviewDrillsData, setReviewDrillsData] = useState<any>([]);
  const [isPlaying, setIsPlaying] = useState<boolean[]>(Array(reviewDrillsData.length).fill(false));
  const [openFeedPopup, setFeedPopup] = useState(false);
  const [drillId, setDrillId] = useState('');
  const [formState, setFormState] = useState<any>({
    feedback: "",
  });


  const getReviewDrills = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/journies/drills/review`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setReviewDrillsData(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!openFeedPopup) {
      getReviewDrills();
    }
  }, [openFeedPopup]);

  const videoRefs = useRef<any>(Array(reviewDrillsData.length).fill(null));

  const router = useRouter()

  const togglePlayPause = (index: number) => {
    if (videoRefs.current[index]) {
      if (isPlaying[index]) {
        videoRefs.current[index].pause();
      } else {
        videoRefs.current[index].play();
      }
      setIsPlaying((prev) => {
        const newState = [...prev];
        newState[index] = !newState[index];
        return newState;
      });
    }
  };

  const changeHandler = (e: any) => {
    const { name, value } = e.target;
    setFormState((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmitFeedback = async () => {
    try {

      if (formState.feedback === "") {
        toast.error("Something went wrong!")
        return
      }

      const payload = {
        content: formState.feedback,
      };

      const endPoint = `/journies/userDrill/${drillId}/feedback`

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
      setFeedPopup(false)
      toast.success(res.data.status);
    } catch (error) {
      console.log(error);
      setFeedPopup(false)
      toast.error("Something went wrong!");
    }
  };

  const handleFeedback = (id: any) => {
    console.log(id, "idddd")
    setFeedPopup(true)
    setDrillId(id)
    // router.push(`/journey/review-feedback?id=${id}`)
  }

  const handleDiscard = () => {
    setFeedPopup(false)
    setFormState({
      feedback: ""
    })
  }

  return (
    <div>
      <div className="p-2 rounded-full w-10 bg-zinc-500 bg-opacity-20 rounded">
        <ArrowLeftIcon
          className="cursor-pointer hover:font-bold"
          onClick={() => router.back()}
        />
      </div>
      <p className="heading-bold-28 py-[12px]">
        Review Drills
      </p>
      <div className="flex flex-wrap gap-[24px] border-b-[0.33px] border-b-[#545458a6] pb-[24px]">
        {reviewDrillsData?.length > 0 ?
          reviewDrillsData?.map((item: any, index: number) => (
            <div key={item.id} className="drillContainer flex flex-col gap-[9px]">
              <div className="relative">
                <video
                  ref={(el) => (videoRefs.current[index] = el)}
                  muted
                  loop
                  className="w-full h-[179px] object-cover rounded-[14px]"
                  onClick={() => togglePlayPause(index)}
                  controls
                >
                  <source
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item?.drillUrl}`}
                    type="video/mp4"
                  />
                </video>
              </div>

              <div className="flex flex-col gap-[2px]">
                <p className="text-17-bold">
                  {item?.User?.firstName + ' ' + item?.User?.lastName} has submitted a drill.
                </p>
                <p className="text-16 h-[40px] w-full overflow-hidden line-clamp-2">
                  View the drill to determine whether {item?.User?.firstName + ' ' + item?.User?.lastName} has successfully completed the drill or not.
                </p>
              </div>
              <CustomButton title={"Leave Feedback"} onClick={() => handleFeedback(item.id)} />
            </div>
          ))
          :
          <div className="text-violet-100 text-opacity-60 font-sans text-subheadline font-regular font-feature-case text-15 leading-20 tracking-tight flex items-center justify-center w-full h-[100px]">
            No data
          </div>}
      </div>

      {openFeedPopup &&
        <Popup onClose={() => setFeedPopup(false)}>
          <div className="">
            <h2 className="heading-bold popupHeading text-2xl font-bold">
              What did the player do wrong...or right?
            </h2>
            <TextArea
              name="feedback"
              onChange={changeHandler}
              onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                if (e.currentTarget.value.length >= 150 && e.key !== "Backspace") {
                  e.preventDefault();
                  toast.warning("You have reached the maximum character limit.");
                }
              }}
              placeholder="share your thought in 150 characters"
              rows={8}
              cols={40}
              className="desc mt-4 drillTextArea"
            />

            <div className='poUpsAtions-otr'>
              <div className='poUpsAtionsOtr cursor-pointer' onClick={handleDiscard}>
                <div className='heading-bold poUpsAtionsInr'>Discard</div>
              </div>
              <div className='poUpsAtionsOtr2 cursor-pointer' onClick={() => handleSubmitFeedback()}>
                <div className='heading-bold poUpsAtionsInr2'>Submit Feedback</div>
              </div>
            </div>
          </div>
        </Popup>
      }
    </div>
  )
}

export default ReviewDrillsList