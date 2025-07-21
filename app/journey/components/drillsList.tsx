import React from "react";
import { useRouter } from "next/navigation";
import ClockSVG from "@/assests/svg/clock";
import PlaySVG from "@/assests/svg/play";
import { useJourney } from "@/providers/JourneyProvider";
import "../../auth/signup/components/AllComponent.scss";
import CustomButton13 from "@/components/Button/CustomButton13";
import ClaimDrillPopup from "@/components/shared/ClaimPopup";
import ClaimDrill from "./claimDrill";
import ClaimBadge from "./ClaimBadge";
import { getFirstCharCap } from "@/utils/getFirstCharCap";

interface drillProps {
  isClaimDrillPopup: boolean,
  setClaimDrillPopup: React.Dispatch<React.SetStateAction<boolean>>,
  isClaimBadgePopup: boolean,
  setClaimBadgePopup: React.Dispatch<React.SetStateAction<boolean>>,
}

function DrillsList({ isClaimDrillPopup, setClaimDrillPopup, isClaimBadgePopup, setClaimBadgePopup }: drillProps) {
  const groupedData: { [key: string]: any[] } = {};


  const router = useRouter();
  const { journey } = useJourney();

  journey?.drills?.forEach((data: any) => {
    const categoryName = data.category.name;
    if (!groupedData[categoryName]) {
      groupedData[categoryName] = [];
    }
    groupedData[categoryName].push(data);
  });

  const handleStartDrill = (id: number) => {
    router.push(`/journey/drill-detail?id=${id}`);
  };

  return (
    <div>
      {Object.keys(groupedData).map((categoryName) => (
        <div key={categoryName} className="pt-[24px]">
          <p className="heading-bold-28 pb-[12px]">{categoryName}</p>

          <div className="flex flex-wrap gap-[24px] border-b-[0.33px] border-b-[#545458a6] pb-[24px]">
            {groupedData[categoryName].map((data: any) => (
              <div
                key={data.id}
                className="drillContainer flex flex-col gap-[9px]"
              >
                <div className="flex flex-col gap-[16px]">
                  <div className="relative">
                    {data?.userDrill.length > 0 &&
                      <div
                        className={`bg-[#FFFAEB] rounded-[16px] px-[8px] py-[2px] 
                        flex items-center justify-center absolute top-[16px] right-[16px] text-12 font-weight-500
                        ${data?.userDrill[0]?.isApproved === "accepted" ? "color-green-dark" : "color-amber"}`}
                      >
                        {
                          data?.userDrill[0]?.isApproved === "accepted" ? getFirstCharCap("Approved") :
                            data?.userDrill[0]?.isApproved === "pending" ? getFirstCharCap("Under Review") :
                              getFirstCharCap("Pending")}
                      </div>
                    }
                    <img
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${data?.drillBannerForMobile}`}
                      alt="Rank"
                      className="w-full h-[179px] object-cover rounded-[14px]"
                    />
                  </div>

                  <div className="flex flex-col gap-[9px]">
                    <p className="text-13 flex items-center">
                      <span className="pr-[5px]">
                        <ClockSVG color={"#EBEBF599"} />
                      </span>
                      {data?.drillDuration} min
                    </p>
                    <div className="flex flex-col gap-[2px]">
                      <p className="text-17-bold">{data?.title}</p>
                      <p className="text-16 h-[40px] w-full overflow-hidden line-clamp-2">
                        {data?.description}
                      </p>
                    </div>
                  </div>
                </div>

                <CustomButton13
                  icon={!data?.userDrill[0]?.isApproved && <PlaySVG color="#163300" />}
                  title={data?.userDrill[0]?.isApproved ? "View Submission" : "Start Drill"}
                  onClick={() => handleStartDrill(data.id)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
      {isClaimDrillPopup && <ClaimDrillPopup onClose={() => setClaimDrillPopup(false)}>
        <ClaimDrill pendingClaimDrills={journey?.pendingClaimDrills} setClaimDrillPopup={setClaimDrillPopup} />
      </ClaimDrillPopup>}
      {isClaimBadgePopup && <ClaimDrillPopup onClose={() => setClaimBadgePopup(false)}>
        <ClaimBadge isBadgeClaimed={journey?.isBadgeClaimed} setClaimBadgePopup={setClaimBadgePopup} />
      </ClaimDrillPopup>}
    </div>
  );
}

export default DrillsList;
