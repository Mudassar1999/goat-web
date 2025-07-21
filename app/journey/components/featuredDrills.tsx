import React from "react";
import CustomCarousel from "@/components/shared/CustomCarousel";
import { useJourney } from "@/providers/JourneyProvider";
import "../../auth/signup/components/AllComponent.scss"

function FeaturedDrill() {
  const { journey } = useJourney();

  return (
    <div className="flex items-center justify-center relative rounded-[16px] mb-[24px]">
      <CustomCarousel />
      {journey?.featuredDrill?.length > 0 &&
        <div className="absolute left-[16px] top-[16px]  z-1">
          <h1 className="heading-bold-22">
            Featured Drill
          </h1>
        </div>
      }
    </div>
  );
}

export default FeaturedDrill;
