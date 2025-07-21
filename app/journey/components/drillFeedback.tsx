import React from 'react'
import { getFirstCharCap } from '@/utils/getFirstCharCap'

function DrillFeedback({ feedback }: any) {

  return (
    <div>
      <div className="container p-3 sm:p-8 relative">
        <div
          className={`bg-[#FFFAEB] rounded-[16px] px-[8px] py-[2px] 
                        flex items-center justify-center absolute top-[16px] right-[16px]
                        ${feedback?.isApproved === "accepted" ? "color-green-dark" : "color-amber"}`}
        >
          {feedback?.isApproved === "accepted" ? getFirstCharCap("Approved") : getFirstCharCap(feedback?.isApproved)}
        </div>
        <video
          muted
          loop
          className="max-h-[300px] w-full object-cover"
          controls
        >
          <source
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${feedback?.drillUrl}`}
            type="video/mp4"
          />
        </video>
        <div>
          <p className="text-18">
            Coach Ahmed has left the following feedback.
          </p>
          <p className="text-13 color-white">
            {feedback?.Feedback[0]?.content}
          </p>
        </div>
      </div>
    </div>
  )
}

export default DrillFeedback