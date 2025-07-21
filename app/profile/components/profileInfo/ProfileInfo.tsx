import { useState, useEffect } from "react";
import ProfilePicturePopup from "./ProfilePicturePopup";
import PlayerProfileInfo from "./PlayerProfileInfo";
import ScoutProfileInfo from "./ScoutProfileInfo";
import Tabs from "./Tabs";
import axios from "axios";
import { toast } from "react-toastify";
import { useProfile } from "@/providers/ProfileProvider";
import { PlusIcon, CheckIcon } from "lucide-react";
import { IoSettings } from "react-icons/io5";
import { useRouter } from "next/navigation";
import Popup from "@/components/shared/Popup";
import ProfileFollowTabs from "./ProfileFollowTab";
import CustomButton13 from "@/components/Button/CustomButton13";

function ProfileInfo({
  setScoutPlayer,
  currentTab,
  setCurrentTab,
  followTab,
  setFollowTab,
  user,
  setMessage,
  setCompleteProfilePopup,
}: any) {
  const { profile, setProfile } = useProfile();
  const [userInfo, setUserInfo] = useState<any>("");
  const [isFollowPopup, setFollowPopup] = useState<boolean>(false);
  const [isLikePopup, setLikePopup] = useState<boolean>(false);
  const [profilePicturePopup, setProfilePicturePopup] =
    useState<boolean>(false);

  const router = useRouter();

  const handleFriendAction = async (
    friendId: number,
    action: "follow" | "unfollow"
  ) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/friends/${action}/${friendId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      setProfile((prevProfile: any) => ({
        ...prevProfile,
        isFollowing: action === "follow" ? true : false,
        otherUser: {
          ...prevProfile.otherUser,
          _count: {
            followers:
              action === "follow"
                ? prevProfile.otherUser?._count.followers + 1
                : prevProfile.otherUser?._count.followers - 1,
            following: prevProfile.otherUser?._count.following,
          },
        },
      }));
      toast.success(
        `You ${action === "follow"
          ? "followed"
          : action === "unfollow"
            ? "unfollowed"
            : ""
        } ${profile?.otherUser?.firstName}`
      );
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const displayMutualFollowers = (mutualFollowers: any) => {
    const displayedFollowersPictures = mutualFollowers?.slice(0, 5);
    const displayedFollowers = mutualFollowers?.slice(0, 2);

    const remainingFollowersCount = mutualFollowers?.length - 2;
    const remainingFollowers =
      remainingFollowersCount > 0
        ? "are mutual follower"
        : remainingFollowersCount > 1
          ? ` and ${remainingFollowersCount} other mutual followers`
          : "";

    return {
      displayedFollowersPictures,
      displayedFollowers,
      remainingFollowers,
    };
  };

  const { displayedFollowersPictures, displayedFollowers, remainingFollowers } =
    displayMutualFollowers(profile?.mutualFriends);

  const currentRoles = [2, 3, 4];
  const currentUser =
    currentRoles.includes(profile?.user?.roleId) ||
    currentRoles.includes(profile?.otherUser?.roleId);

  const handleScountPlayer = () => {
    if (user && user?.user?.isDetailsVerified === "accepted") {
      setScoutPlayer(true);
    } else {
      setCompleteProfilePopup(true);
    }
  };

  const handleFollowing = () => {
    setFollowPopup(true)
    setFollowTab("following")
  }

  const handleFollower = () => {
    setFollowPopup(true)
    setFollowTab("followers")
  }

  useEffect(() => {
    let userData: any = localStorage.getItem("user_info");
    userData = userData ? JSON.parse(userData) : null;
    setUserInfo(userData);
  }, []);

  useEffect(() => {
    const handleBodyOverflow = () => {
      document.body.style.overflow = profilePicturePopup ? "hidden" : "auto";
    };

    handleBodyOverflow();

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [profilePicturePopup]);

  useEffect(() => {
    const handleBodyOverflow = () => {
      document.body.style.overflow = isFollowPopup ? "hidden" : "auto";
    };

    handleBodyOverflow();

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isFollowPopup]);

  return (
    <div>
      {profile?.user?.roleId === 1 || profile?.otherUser?.roleId === 1 ? (
        <PlayerProfileInfo setProfilePicturePopup={setProfilePicturePopup} />
      ) : currentUser ? (
        <ScoutProfileInfo setProfilePicturePopup={setProfilePicturePopup} />
      ) : (
        ""
      )}

      <div
        className={`absolute top-[13px] ${profile?.user?.showScoutedBadge ? "right-[100px]" : "right-[16px]"
          }`}
      >
        {profile?.user && (
          <div onClick={() => router.push("/profile/settings")} className="cursor-pointer">
            <IoSettings
              className="nav-icon"
              style={{ color: "#0A84FF", fontSize: "24px" }}
            />
          </div>
        )}
      </div>

      <div className="profileUserimages-otr">
        <ul className="profileUserimages-inr  ">
          {displayedFollowersPictures?.map((follower: any, index: any) => (
            <li>
              <img
                className="userImage"
                // className={`w-[16px] h-[16px] rounded-[16px] border-1[px] border-[#1C1C1E] ${index !== 0 && "!-ml-3"
                //   }`}
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${follower?.profileImage}`}
                key={follower.id}
              />
            </li>
          ))}
        </ul>

        <div>
          <p className="desc-userImages">
            {displayedFollowers?.map((follower: any, index: any) => (
              <>
                <span key={follower.id}>{follower.firstName},&nbsp;</span>
              </>
            ))}
            {remainingFollowers && remainingFollowers}
          </p>
        </div>
      </div>

      <div className="pt-[16px]">
        <div className="flex pb-[16px]">
          <div className="w-1/3 text-center border-r-[1px] border-r-[#545458a6] cursor-pointer" onClick={handleFollowing}>
            <h5 className="text-15-bold">
              {profile?.user?._count?.following ||
                profile?.otherUser?._count?.following ||
                0}
            </h5>
            <p className="text-13">Following</p>
          </div>
          <div className="w-1/3 text-center border-r-[1px] border-r-[#545458a6] cursor-pointer" onClick={handleFollower}>
            <h5 className="text-15-bold">
              {profile?.user?._count?.followers ||
                profile?.otherUser?._count?.followers ||
                0}
            </h5>
            <p className="text-13">Followers</p>
          </div>
          <div className="w-1/3 text-center cursor-pointer" onClick={() => setLikePopup(true)} >
            <h5 className="text-15-bold">{profile?.postsLikesCount}</h5>
            <p className="text-13">{profile?.postsLikesCount === 1 ? "Like" : "Likes"}</p>
          </div>
        </div>

        <div className="profileMainActions">
          <div className="profileMainActions-inr">
            {profile?.otherUser && (
              <div
                className="profileMainActionsbtnOtr"
                onClick={() =>
                  handleFriendAction(
                    profile?.otherUser?.id,
                    profile?.isFollowing ? "unfollow" : "follow"
                  )
                }
              >
                <div className="profileMainActionsbtnInr heading-bold cursor-pointer">
                  <div className="profileMainActionsbtnInrIcon">
                    {profile?.isFollowing ?
                      <CheckIcon className="w-[14px] h-[18px] object-contain mr-[6px]" />
                      : <PlusIcon className="w-[14px] h-[18px] object-contain mr-[6px]" />
                    }
                  </div>
                  {profile?.isFollowing ? "Followed" : " Follow"}
                </div>
              </div>
            )}
            {profile?.otherUser && (
              <div
                className="profileMainActionsbtnOtr cursor-pointer"
                // onClick={() => setMessage(true)}
                onClick={() => router.push(`/profile/chats`)}
              >
                <div className="profileMainActionsbtnInr heading-bold">
                  Message
                </div>
              </div>
            )}
            {userInfo?.roleId === 3 && profile?.otherUser?.roleId === 1 && (
              <div
                className="profileMainActionsbtnOtr cursor-pointer"
                onClick={handleScountPlayer}
              >
                <div className="profileMainActionsbtnInr heading-bold">
                  Scout Player
                </div>
              </div>
            )}
          </div>
        </div>



        {/* shows tabs of details except fan */}
        {<Tabs currentTab={currentTab} setCurrentTab={setCurrentTab} />}
      </div>

      {
        isFollowPopup && (
          <Popup onClose={() => setFollowPopup(false)}>
            <ProfileFollowTabs followTab={followTab} setFollowTab={setFollowTab} setMessage={setMessage} />
          </Popup>
        )
      }

      {
        isLikePopup && (
          <Popup onClose={() => setLikePopup(false)}>
            <div>
              <p className="heading-bold-28">Likes</p>
              <p className="text-13">{profile?.user?.firstName} received a total of {profile?.postsLikesCount + " "}
                Likes across all posts
              </p>

              <div className="mt-[16px]">
                <CustomButton13
                  onClick={() => setLikePopup(false)}
                  title={"Okay"}
                  className={"cursor-pointer"}
                />
              </div>
            </div>
          </Popup>
        )
      }

      {
        profilePicturePopup && (
          <ProfilePicturePopup onClose={() => setProfilePicturePopup(false)} />
        )
      }
    </div >
  );
}
export default ProfileInfo;
