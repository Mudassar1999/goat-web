import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BsPlusLg } from "react-icons/bs";
import { MdDelete, MdEdit } from "react-icons/md";
import { toast } from "react-toastify";
import ProfilePopup from "../profileInfo/ProfilePopup";
import { useProfile } from "@/providers/ProfileProvider";
import { useExperienceFormData } from "@/providers/ExperienceFormProvider";
import Popup from "@/components/shared/Popup";
import CustomButton from "@/components/Button/CustomButton";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import "./Experience.scss";

const ReadMore = ({ children }: any) => {
  const text = children;
  const [isReadMore, setIsReadMore] = useState(true);

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  const truncatedText = isReadMore ? text?.slice(0, 63) : text;
  const displayText = isReadMore ? truncatedText : text;

  const lastSpaceIndex = displayText?.lastIndexOf(" ");
  const truncatedWords =
    lastSpaceIndex !== -1 ? displayText?.slice(0, lastSpaceIndex) : displayText;

  const shouldDisplayLink = text?.length > 63;

  return (
    <p className="color-white text-16 ">
      {truncatedWords}
      {shouldDisplayLink && (
        <span
          onClick={toggleReadMore}
          className={`cursor-pointer ${isReadMore ? "desc exp-moreL text-16" : "exp-more desc"
            }`}
        // style={{ color: "#64aed3", transitionDuration: ".4s" }}
        >
          {isReadMore ? " ...see more" : " ...see less"}
        </span>
      )}
    </p>
  );
};

function Experience() {
  const { profile, setProfile } = useProfile();
  const [truncatedItems, setTruncatedItems] = useState<any>([]);
  const [openPopup, setOpenPopup] = useState("");
  const [editExperience, setEditExperience] = useState<boolean>(false);
  const [clubsAndPlayerPosition, setClubsAndPlayerPositions] = useState([]);
  const [experienceId, setExperienceId] = useState<number>();
  const [showAction, setShowAction] = useState<boolean>(false);
  const [viewAllExperiences, setViewAllExperiences] = useState<boolean>(false);
  const [alertPopup, setAlertPopup] = useState<boolean>(false);

  const { setExperienceFormData } = useExperienceFormData();

  const getClubsAndPositions = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/sports/getClubsAndPositions/${profile?.sportsData[0]?.sport?.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setClubsAndPlayerPositions(response?.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addExperienceHandler = async () => {
    setOpenPopup("experiences");
    setEditExperience(false);
    setExperienceFormData({
      sportId: profile?.sportsData[0]?.sport?.id,
      clubId: null,
      teamId: null,
      playerPositionId: null,
      startDate: "",
      endDate: "",
      currentlyPlayingHere: false,
      employmentType: "",
      description: "",
    });
    getClubsAndPositions();
  };

  const editExperienceHandler = async (experienceId: number) => {
    setOpenPopup("experiences");
    setEditExperience(true);
    setExperienceId(experienceId);
    getClubsAndPositions();

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/experiences/view/${experienceId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      setExperienceFormData(response?.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteExperienceHandler = async (experienceId: boolean) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/experiences/delete/${experienceId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      toast.success("Experience Deleted Successfully");
      setProfile({
        ...profile,
        user: {
          ...profile?.user,
          experiences: profile?.user?.experiences?.filter(
            (item: any) => item.id !== experienceId
          ),
        },
      });
      setAlertPopup(false);
    } catch (error: any) {
      console.log(error);
      toast.error(error);
    }
  };

  function formatDateString(startDate: any, endDate: any) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const startMonth = start.toLocaleDateString("en-US", { month: "short" });
    const startYear = start.getFullYear();
    if (endDate === "Present") {
      return `${startMonth} ${startYear} — Present`;
    } else {
      const endMonth = end.toLocaleDateString("en-US", { month: "short" });
      const endYear = end.getFullYear();

      return `${startMonth} ${startYear} — ${endMonth} ${endYear}`;
    }
  }

  const userExperiences =
    profile?.user?.experiences || profile?.otherUser?.experiences;
  useEffect(() => {
    const handleBodyOverflow = () => {
      document.body.style.overflow = alertPopup ? "hidden" : "auto";
    };

    // Set initial state when the component mounts
    handleBodyOverflow();

    // Clean up the effect when the component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [alertPopup]);

  useEffect(() => {
    const handleBodyOverflow = () => {
      document.body.style.overflow = viewAllExperiences ? "hidden" : "auto";
    };

    // Set initial state when the component mounts
    handleBodyOverflow();

    // Clean up the effect when the component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [viewAllExperiences]);

  return (
    <>
      <div className=" flex items-center justify-between">
        <h2 className="newExpHeading">Experience</h2>
        <div className="flex items-center gap-3">
          {userExperiences?.length > 2 && (
            <p
              className="text-[17px] text-[#9FE870] cursor-pointer"
              onClick={() => setViewAllExperiences(true)}
            >
              View All
            </p>
          )}
          {profile?.user && (
            <div className="flex gap-3">
              <BsPlusLg
                className="text-[17px] text-[#9FE870] cursor-pointer"
                onClick={() => addExperienceHandler()}
              />
              {userExperiences?.length > 0 && (
                <MdEdit
                  className="text-[17px] text-[#9FE870] cursor-pointer"
                  onClick={() => setViewAllExperiences(true)}
                />
              )}
            </div>
          )}
        </div>
      </div>
      <div className=" exp-otr">
        {userExperiences?.length > 0 ? (
          userExperiences?.slice(0, 2).map((item: any) => (
            <div className="flex justify-between py-4 exp-inr" key={item.id}>
              <div className="flex gap-[15px] exp-main w-full">
                <div>
                  <img
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.club.image}`}
                    alt=""
                    className="exp-img"
                  />
                </div>
                <div className="overflow-hidden exp-content w-full">
                  <h4 className="heading-bold positionName text-[17px] font-semibold leading-[22px] exp-heading">
                    {item.position.name}
                  </h4>
                  <h5 className="text-[15px] leading-5 exp-cName desc">
                    {item.club.name}
                    <span className=" inline-block w-4 text-center text-[15px] relative bottom-[4px]">
                      .
                    </span>
                    {item.employmentType}
                  </h5>
                  <p className="text-violet-100 exp-date desc">
                    {formatDateString(
                      item.startDate,
                      item.currentlyPlayingHere ? "Present" : item.endDate
                    )}
                  </p>
                  <div className="flex expDesc-main relative">
                    {item.description &&
                      <span className="relative bottom-[16px] text-[30px] mr-[10px]">.</span>
                    }
                    {item?.description &&
                      <ReadMore>
                        {item?.description}
                      </ReadMore>
                    }
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-violet-100 text-opacity-60 font-sans text-subheadline font-regular font-feature-case text-15 leading-20 tracking-tight flex items-center justify-center w-full h-[100px]">
            No Experience Found
          </div>
        )}
      </div>
      {viewAllExperiences && (
        <Popup onClose={() => setViewAllExperiences(false)}>
          <h2 className=" heading-bold expHeading text-white text-xl font-bold leading-7 tracking-tight">
            Experience
          </h2>
          <div className=" exp-otr h-[380px] overflow-hidden overflow-y-auto">
            {userExperiences?.map((item: any) => (
              <div className="flex justify-between py-4 exp-inr" key={item.id}>
                <div className="flex gap-[15px] exp-main">
                  <div>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.club.image}`}
                      alt=""
                      width={32}
                      height={32}
                      className="exp-img"
                    />
                  </div>
                  <div className="overflow-hidden exp-content">
                    <h4 className="heading-bold positionName text-[17px] font-semibold leading-[22px] exp-heading">
                      {item.position.name}
                    </h4>
                    <h5 className="text-[15px] leading-5 exp-cName desc">
                      {item.club.name}
                      <span className=" inline-block w-4 text-center text-[15px] relative bottom-[4px]">
                        .
                      </span>
                      {item.employmentType}
                    </h5>
                    <p className="text-violet-100 exp-date desc">
                      {formatDateString(
                        item.startDate,
                        item.currentlyPlayingHere ? "Present" : item.endDate
                      )}
                    </p>
                    <div className="flex expDesc-main relative">
                      {item.description && (
                        <span className="relative bottom-[5px] text-[15px] mr-[10px]">
                          .
                        </span>
                      )}
                      {item?.description && (
                        <ReadMore>{item?.description}</ReadMore>
                      )}
                    </div>
                  </div>
                </div>
                {profile?.user && (
                  <div className="flex items-center gap-2">
                    <MdEdit
                      className="text-[17px] text-[#9FE870]"
                      onClick={() => editExperienceHandler(item.id)}
                    />
                  </div>
                )}
                {alertPopup && (
                  <Popup onClose={() => setAlertPopup(false)}>
                    <AiOutlineExclamationCircle className="text-5xl mx-auto mb-3" />
                    <h2 className="text-center mb-3">
                      Are you sure you want to delete this experience?
                    </h2>
                    <div className="flex gap-3 justify-center">
                      <CustomButton
                        title="Yes, I'm sure"
                        redButton={true}
                        onClick={() => deleteExperienceHandler(item.id)}
                      />
                      <CustomButton
                        title="No, cancel"
                        onClick={() => setAlertPopup(false)}
                      />
                    </div>
                  </Popup>
                )}
              </div>
            ))}
          </div>
        </Popup>
      )}
      {openPopup !== "" && (
        <ProfilePopup
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
          editExperience={editExperience}
          clubsAndPlayerPosition={clubsAndPlayerPosition}
          experienceId={experienceId}
        />
      )}
    </>
  );
}
export default Experience;
