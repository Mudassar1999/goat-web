import Popup from "@/components/shared/Popup";
import ExperienceForm from "../experiences/ExperienceForm";
import TrophiesForm from "../trophies/TrophiesForm";
import { useEffect } from "react";

function ProfilePopup({
  openPopup,
  setOpenPopup,
  editExperience,
  clubsAndPlayerPosition,
  playingClubData,
  leaguesData,
  experienceId,
  editTrophy,
  trophyId,
}: any) {
  useEffect(() => {
    const handleBodyOverflow = () => {
      document.body.style.overflow = openPopup ? "hidden" : "auto";
    };

    // Set initial state when the component mounts
    handleBodyOverflow();

    // Clean up the effect when the component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openPopup]);
  return (
    <>
      <Popup onClose={() => setOpenPopup("")}>
        <div className="overflow-y-auto max-h-[90vh] scroll-remover">
          {openPopup === "experiences" ? (
            <ExperienceForm
              editExperience={editExperience}
              clubsAndPlayerPosition={clubsAndPlayerPosition}
              experienceId={experienceId}
              setOpenPopup={setOpenPopup}
            />
          ) : openPopup === "trophies" ? (
            <TrophiesForm
              editTrophy={editTrophy}
              playingClubData={playingClubData}
              leaguesData={leaguesData}
              trophyId={trophyId}
              setOpenPopup={setOpenPopup}
            />
          ) : (
            ""
          )}
        </div>
      </Popup>
    </>
  );
}
export default ProfilePopup;
