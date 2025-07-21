import "./ForPopUp.scss";
import { calimDrillReward } from "@/api/Journey/claimDrillReward";

const ClaimDrill = ({ pendingClaimDrills, setClaimDrillPopup }: any) => {

  const handleDrillClaim = async () => {
    const res = await calimDrillReward(pendingClaimDrills[0]?.id);
    if (res === 200) {
      setClaimDrillPopup(false)
    }
  }

  return (
    <>
      <div className="smallPopUp-otr">
        <div className="smallPopUp-inr">
          <div className="smallPopUp-img-otr">
            <img
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${pendingClaimDrills[0]?.thumbnailUrl}`}
              className="smallPopUp-img"
              alt="drill-img"
            />
          </div>
          <div className="smallPopUp-content-main">
            {pendingClaimDrills[0]?.Drill?.category?.name &&
              <p className="smallPopUp-heading">
                {pendingClaimDrills[0]?.Drill?.category?.name} drill approved!
              </p>
            }
            {pendingClaimDrills[0]?.Drill?.category?.name &&
              <p className="smallPopUp-desc">
                The {pendingClaimDrills[0]?.Drill?.category?.name} drill has been approved by GOAT, great job.
              </p>
            }
            <div className="smallPopUpbtn-otr">
              <div className="smallPopUpbtn-inr" onClick={handleDrillClaim}>
                Claim Rewards
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClaimDrill;
