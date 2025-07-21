import { useJourney } from "@/providers/JourneyProvider";
import "./ForPopUp.scss";
import { calimBadgeReward } from "@/api/Journey/claimBadgeReward";

const ClaimBadge = ({ isBadgeClaimed, setClaimBadgePopup }: any) => {

  const { journey } = useJourney();

  const handleDrillClaim = async () => {
    const res = await calimBadgeReward(isBadgeClaimed?.id);
    if (res === 200) {
      setClaimBadgePopup(false)
    }
  }

  return (
    <>
      <div className="smallPopUp-otr">
        <div className="smallPopUp-inr">
          <div className="smallPopUp-content-main secondClass">
            <div className="Badge-otr">
              <div className="badge-scroll">
                <div className="flex gap-[40px] overflow-hidden overflow-x-auto badges-parent">
                  {journey?.badges?.map((data: any, index: number) => {
                    const isCurrentBadge = journey?.isBadgeClaimed?.claimedBy[0]?.badgeId === data?.id;

                    return (
                      <div key={data?.id} className="flex flex-col gap-[16px]">
                        <div
                          className={` min-w-[73px] h-[82px] object-fit rounded transition-opacity ${isCurrentBadge ? "" : "opacity-50"
                            }`}
                        >
                          <img
                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${data?.imageUrl}`}
                            alt={data?.name}
                            className="object-cover rounded min-w-[73px] h-[82px] "
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <p className="smallPopUp-heading">New rank unlocked!</p>
            <p className="smallPopUp-desc">
              You’ve just been promoted to the <span> {journey?.isBadgeClaimed?.name}</span> rank.
            </p>
            <div className="smallPopUpbtn-otr">
              <div className="smallPopUpbtn-inr" onClick={handleDrillClaim}>Claim Rewards</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClaimBadge;
