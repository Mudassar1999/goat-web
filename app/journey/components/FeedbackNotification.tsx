import React from 'react'
import { getFirstCharCap } from '@/utils/getFirstCharCap'

function FeedbackNotification({ feedback }: any) {
  console.log(feedback, "feedback")
  return (
    <div>
      <div className="journeyContainer relative">
        <div
          className={`bg-[#FFFAEB] rounded-[16px] px-[8px] py-[2px] 
                        flex items-center justify-center absolute top-[30px] right-[16px]
                        ${feedback?.isApproved === "accepted" ? "color-green-dark" : "color-amber"}`}
        >
          {feedback?.UserDrill?.isApproved === "accepted" ? getFirstCharCap("Approved") : getFirstCharCap(feedback?.UserDrill?.isApproved)}
        </div>
        <video
          muted
          loop
          className="max-h-[500px] w-full object-cover"
          controls
        >
          <source
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${feedback?.UserDrill?.drillUrl}`}
            type="video/mp4"
          />
        </video>
        <div>
          <p className="text-18 mt-[4px]">
            {feedback?.User?.firstName + " " + feedback?.User?.lastName} has left the following feedback.
          </p>
          <p className="text-13 color-white">
            {feedback?.content}
          </p>
        </div>
      </div>
    </div>
  )
}

export default FeedbackNotification