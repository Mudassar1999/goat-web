import { convertTimeDuration } from "@/utils/convertTimeDuration";
import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useJourney } from "@/providers/JourneyProvider";
import "./Comment.scss";

const CustomCarousel = () => {
  const { journey } = useJourney();

  return (
    <Carousel
      showThumbs={false}
      infiniteLoop={true}
      stopOnHover={true}
      autoPlay={true}
      interval={2000}
      showArrows={false}
      showStatus={false}
    >
      {journey?.featuredDrill?.map((data: any, index: any) => (
        <div key={index} className="relative rounded-[16px]">
          <div className="w-full h-[450px] relative  rounded-[16px]">
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, rgba(0, 0, 0, 0.00) 61.33%, #000 100%)`,
                // backgroundPosition: "50%",
                bottom: "0",
                left: "0",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                borderRadius: "16px",
              }}
            />
            <img
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${data?.drillBannerForMobile}`}
              alt={`image-${index}`}
              className="rounded w-full h-full object-cover rounded-[16px]"
            />
          </div>
          <div className="sliderContent absolute  left-[16px] text-white  gap-[9px] flex flex-col">
            <div className=" carasoul-font text-[#ebebf599] text-[11px] font-normal leading-[13px] tracking-[0.066px]  flex items-center gap-[6px] ">
              <p>Dribbling</p>
              <span className="flex gap-[6px] text-center pb-[4px]">.</span>
              <p>{convertTimeDuration(Math.round(data?.drillDuration))}</p>
            </div>
            <p className="  carasoul-fonttext-white text-justify text-[11px] font-normal leading-[13px] tracking-[0.066px] flex items-start">
              {data?.description}
            </p>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default CustomCarousel;
