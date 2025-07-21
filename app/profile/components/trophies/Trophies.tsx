import axios from "axios";
import Image from "next/image";
import { BsPlusLg } from "react-icons/bs";
import { MdDelete, MdEdit } from "react-icons/md";
import { toast } from "react-toastify";
import ProfilePopup from "../profileInfo/ProfilePopup";
import { useEffect, useState } from "react";
import { useProfile } from "@/providers/ProfileProvider";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { useTrophyFormData } from "@/providers/TrophyFormProvider";
import "./Trophy.scss";
import CustomButton from "@/components/Button/CustomButton";
import Popup from "@/components/shared/Popup";

function Trophies() {
  const { profile, setProfile } = useProfile();
  const [openPopup, setOpenPopup] = useState("");
  const [editTrophy, setEditTrophy] = useState<boolean>(false);
  const [trophyId, setTrophyId] = useState<number>();
  const [playingClubData, setPlayingClubsData] = useState<[]>([]);
  const [leaguesData, setLeaguesData] = useState<any>([]);
  const [showAction, setShowAction] = useState<boolean>(false);
  const [alertPopup, setAlertPopup] = useState<boolean>(false);
  const [viewAllTrophies, setViewAllTrophies] = useState<boolean>(false);
  // const [trophyFormData, setTrophyFormData] = useState({
  //   sportId: null,
  //   clubId: null,
  //   leagueId: null,
  //   winningDate: "",
  // });
  const { setTrophyFormData } = useTrophyFormData();
  const fetchPlayingClubsData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/clubs/bySportId/${profile?.sportsData[0]?.sport?.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setPlayingClubsData(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchLeaguesData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/leagues/bySportId/${profile?.sportsData[0]?.sport?.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setLeaguesData(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const addTrophyHandler = () => {
    setOpenPopup("trophies");
    setEditTrophy(false);
    setTrophyFormData({
      sportId: profile?.sportsData[0]?.sport?.id,
      clubId: null,
      teamId: null,
      leagueId: null,
      winningDate: "",
    });
    fetchPlayingClubsData();
    fetchLeaguesData();
  };
  const editTrophyHandler = async (trophyId: number) => {
    setOpenPopup("trophies");
    setEditTrophy(true);
    setTrophyId(trophyId);
    fetchPlayingClubsData();
    fetchLeaguesData();
    setTrophyFormData({
      sportId: null,
      clubId: null,
      teamId: null,
      leagueId: null,
      winningDate: "",
    });
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/trophies/view/${trophyId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setTrophyFormData(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const deleteTrophyHandler = async (trophyId: boolean) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/trophies/delete/${trophyId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      setProfile({
        ...profile,
        user: {
          ...profile.user,
          Trophy: profile.user.Trophy.filter(
            (item: any) => item.id !== trophyId
          ),
        },
      });
      toast.success("Trophy Deleted Successfully");
      setAlertPopup(false);
    } catch (error: any) {
      console.log(error);
      toast.error(error);
    }
  };
  function formatDate(dateString: any) {
    const date = new Date(dateString);
    const options: any = { year: "numeric", month: "short" };
    return date.toLocaleDateString(undefined, options);
  }
  const userTrophy = profile?.user?.Trophy || profile?.otherUser?.Trophy;
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
      document.body.style.overflow = viewAllTrophies ? "hidden" : "auto";
    };

    // Set initial state when the component mounts
    handleBodyOverflow();

    // Clean up the effect when the component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [viewAllTrophies]);

  return (
    <>
      <div className="mb-4 flex items-center justify-between tophy-main">
        <h2 className="heading-bold  tophy-heading text-[22px] font-bold leading-7">
          Trophies
        </h2>
        <div className="flex items-center gap-3">
          {userTrophy?.length > 2 && (
            <p
              className="text-[17px] text-[#9FE870] cursor-pointer"
              onClick={() => setViewAllTrophies(true)}
            >
              View All
            </p>
          )}
          {profile?.user && (
            <div className="flex gap-3 ">
              <BsPlusLg
                className="text-[17px] text-[#9FE870] cursor-pointer"
                onClick={() => addTrophyHandler()}
              />
              {userTrophy?.length > 0 && (
                <MdEdit
                  className="text-[17px] text-[#9FE870] cursor-pointer"
                  onClick={() => setViewAllTrophies(true)}
                />
              )}
            </div>
          )}
        </div>
      </div>
      <div className=" tophy-content">
        {userTrophy?.length > 0 ? (
          userTrophy?.slice(0, 2).map((item: any) => (
            <div
              className="tophy-content-inr flex justify-between py-4"
              key={item.id}
            >
              <div className="flex gap-[15px] tophy-img">
                <img
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.league.image}`}
                  alt=""
                  width={32}
                  height={32}
                  className="tophy-image"
                />
                <div className="tophy-detail">
                  <h4 className="heading-bold text-[17px] font-semibold leading-[22px] tophy-name">
                    {item.league.name}
                  </h4>
                  <h5 className="text-[15px] leading-5 tophy-Cname desc">
                    {item.club.name}
                  </h5>
                  <p className="text-[#EBEBF99A] tophy-desc desc">
                    {" "}
                    {formatDate(item.winningDate)}
                  </p>
                </div>
              </div>
              {/* {!viewProfile && showAction && (
                <div className="flex items-center gap-2">
                  <MdEdit
                    className="text-[17px] text-[#9FE870]"
                    onClick={() => editTrophyHandler(item.id)}
                  />
                  <MdDelete
                    className="text-2xl text-[#FF453A]"
                    onClick={() => setAlertPopup(true)}
                    // onClick={() => deleteTrophyHandler(item.id)}
                  />
                </div>
              )} */}
              {/* {alertPopup && (
                <Popup onClose={() => setAlertPopup(false)}>
                  <AiOutlineExclamationCircle className="text-5xl mx-auto mb-3" />
                  <h2 className="text-center mb-3">
                    Are you sure you want to delete this trophy?
                  </h2>
                  <div className="flex gap-3 justify-center">
                    <CustomButton
                      title="Yes, I'm sure"
                      redButton={true}
                      onClick={() => deleteTrophyHandler(item.id)}
                    />
                    <CustomButton
                      title="No, cancel"
                      onClick={() => setAlertPopup(false)}
                    />
                  </div>
                </Popup>
              )} */}
            </div>
          ))
        ) : (
          <div className="text-violet-100 text-opacity-60 font-sans text-subheadline font-regular font-feature-case text-15 leading-20 tracking-tight flex items-center justify-center w-full h-[100px]">
            No Trophy Found
          </div>
        )}
      </div>
      {viewAllTrophies && (
        <Popup onClose={() => setViewAllTrophies(false)}>
          <h2 className="heading-bold  tophy-heading text-[22px] font-bold leading-7">
            Trophies
          </h2>
          <div className="tophy-content h-[280px] overflow-hidden overflow-y-auto">
            {userTrophy?.map((item: any) => (
              <div
                className="tophy-content-inr flex justify-between py-4"
                key={item.id}
              >
                <div className="flex gap-[15px] tophy-img">
                  <img
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.league.image}`}
                    alt=""
                    width={32}
                    height={32}
                    className="tophy-image"
                  />
                  <div className="tophy-detail">
                    <h4 className="heading-bold text-[17px] font-semibold leading-[22px] tophy-name">
                      {item.league.name}
                    </h4>
                    <h5 className="text-[15px] leading-5 tophy-Cname desc">
                      {item.club.name}
                    </h5>
                    <p className="text-[#EBEBF99A] tophy-desc desc">
                      {" "}
                      {formatDate(item.winningDate)}
                    </p>
                  </div>
                </div>
                {profile?.user && (
                  // <div className="flex items-center gap-2">
                  <MdEdit
                    className="text-[17px] text-[#9FE870]"
                    onClick={() => editTrophyHandler(item.id)}
                  />
                  /* <MdDelete
                      className="text-2xl text-[#FF453A]"
                      onClick={() => setAlertPopup(true)}
                    />
                  </div> */
                )}
                {alertPopup && (
                  <Popup onClose={() => setAlertPopup(false)}>
                    <AiOutlineExclamationCircle className="text-5xl mx-auto mb-3" />
                    <h2 className="text-center mb-3">
                      Are you sure you want to delete this trophy?
                    </h2>
                    <div className="flex gap-3 justify-center">
                      <CustomButton
                        title="Yes, I'm sure"
                        redButton={true}
                        onClick={() => deleteTrophyHandler(item.id)}
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
          editTrophy={editTrophy}
          // trophyFormData={trophyFormData}
          // setTrophyFormData={setTrophyFormData}
          playingClubData={playingClubData}
          leaguesData={leaguesData}
          trophyId={trophyId}
        />
      )}
    </>
  );
}
export default Trophies;
