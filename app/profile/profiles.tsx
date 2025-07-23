"use client";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Popup from "@/components/shared/Popup";
import CompleteProfileForm from "@/components/shared/CompleteProfileForm";
import { useSearchParams } from "next/navigation";
import { useProfile } from "@/providers/ProfileProvider";
// import "../profiles.scss"
import './Profile.scss';


import { usePostsPagination } from "@/providers/PostsPaginationProvider";
import { useFavoritesPagination } from "@/providers/FavoritesPaginationProvider";
import { Images } from "@/public/Images";
import Image from "next/image";
import { Suspense } from "react";
import NetworkSuggestions from "./components/NetworkSuggestions";
import Posts from "./components/posts/Posts";
import Favorites from "./components/Favorites";
import Footer from "@/components/Footer";
import Stat from "./components/Stat";
import Offers from "./components/offers/Offers";
import ViewOffer from "./components/offers/ViewOffer";
import axios from "axios";
import SendOffer from "./components/offers/SendOffer";
import Loading from "react-loading";
import ProfileInfo from "./components/profileInfo/ProfileInfo";
import Trophies from "./components/trophies/Trophies";
import Experience from "./components/experiences/Experience";

const  Profiles = () => {
  const { profile, setProfile } = useProfile();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [currentTab, setCurrentTab] = useState("experiences");
  const [loading, setLoading] = useState<boolean>(false);
  const [offerDetails, setOfferDetails] = useState<any>();
  const [scoutPlayer, setScoutPlayer] = useState<boolean>(false);
  const [message, setMessage] = useState<boolean>(false);
  const [user, setUser] = useState<any>("");
  const [followTab, setFollowTab] = useState("");

  const [completeProfilePopup, setCompleteProfilePopup] =
    useState<boolean>(false);
  const { setPostsPagination } = usePostsPagination();
  const { setFavoritesPagination } = useFavoritesPagination();

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    const handleBodyOverflow = () => {
      document.body.style.overflow = completeProfilePopup ? "hidden" : "auto";
    };

    // Set initial state when the component mounts
    handleBodyOverflow();

    // Clean up the effect when the component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [completeProfilePopup]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = id
        ? `${process.env.NEXT_PUBLIC_API_URL}/users/profile/${id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/users/profile`;

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setProfile(response?.data);
      setPostsPagination(response?.data?.postsPagination);
      setFavoritesPagination(response?.data?.favoritesPagination);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUser = async () => {
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/users/profile`;

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setUser(response?.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (profile?.user?.roleId === 4) {
      setCurrentTab("posts");
    }
  }, [profile]);

  return (
    <>
      <Header
        setCurrentTab={setCurrentTab}
        // message={message}
        // setMessage={setMessage}
      />
      <div className="">
        {offerDetails ? (
          <ViewOffer
            offerDetails={offerDetails}
            setOfferDetails={setOfferDetails}
          />
        ) : scoutPlayer ? (
          <SendOffer profile={profile} setScoutPlayer={setScoutPlayer} />
        ) : (
          <div className="profile-otr">
            <div className="profileContent-left">
              <div className="profileContent-left-otr rounded-[14px]  border-[0.33px] border-[#545458A6] bg-[#1C1C1E]">
                {(profile?.user?.roleId || profile?.otherUser?.roleId) &&
                  profile?.user?.roleId !== 1 &&
                  profile?.otherUser?.roleId !== 1 && (
                    <div className="LastImageProfileImgOtr">
                      <Image
                        src={Images.scoutGround}
                        className="LastImageProfileImgInr"
                        alt="img"
                      />
                    </div>
                  )}
                {loading ? (
                  <div className="flex items-center justify-center py-5">
                    <Loading type="spokes" color="#747474" />
                  </div>
                ) : (
                  <>
                    {profile && (
                      <ProfileInfo
                        setScoutPlayer={setScoutPlayer}
                        currentTab={currentTab}
                        setCurrentTab={setCurrentTab}
                        followTab={followTab}
                        setFollowTab={setFollowTab}
                        user={user}
                        setMessage={setMessage}
                        setCompleteProfilePopup={setCompleteProfilePopup}
                      />
                    )}
                  </>
                )}
                {/* {profile?.user?.roleId !== 1 && <div className="userProfileimgOtr">
                  <img className="userProfileimg" src="https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="img" />
                  <div className="forTry">
                    <button className="addIcon">
                    </button>
                  </div>
                </div>} */}
              </div>
              {/* shows details except fan */}
              {profile?.user?.roleId !== 4 && (
                <>
                  {currentTab === "experiences" && (
                    <>
                      <div className="rounded-[14px] againexpborder  bg-[#1C1C1E] py-[32px]">
                        <div className="px-[32px]">
                          {loading ? (
                            <div className="flex items-center justify-center">
                              <Loading type="spokes" color="#747474" />
                            </div>
                          ) : (
                            <>
                              <Experience />
                            </>
                          )}
                        </div>
                      </div>
                      <div className="tophy-otr rounded-[14px] border-[0.33px] border-[#545458A6] bg-[#1C1C1E] py-[32px]">
                        <div className="trophy-inr px-[32px]">
                          {loading ? (
                            <div className="flex items-center justify-center">
                              <Loading type="spokes" color="#747474" />
                            </div>
                          ) : (
                            <>
                              <Trophies />
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                  {currentTab === "posts" && <Posts />}{" "}
                  {currentTab === "favorites" && <Favorites />}
                  {currentTab === "stat" && <Stat />}
                  {currentTab === "offer" && (
                    <Offers setOfferDetails={setOfferDetails} />
                  )}
                </>
              )}
              {profile?.user?.roleId === 4 && (
                <>
                  {currentTab === "posts" && <Posts />}{" "}
                  {currentTab === "favorites" && <Favorites />}
                </>
              )}
            </div>
            <div className="profileContent-right">
              <div className="network-otr">
                <NetworkSuggestions />
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />

      {completeProfilePopup && (
        <Popup onClose={() => setCompleteProfilePopup(false)}>
          <CompleteProfileForm
            onClose={() => setCompleteProfilePopup(false)}
            user={user}
          />
        </Popup>
      )}
    </>
  );
}

export default Profiles