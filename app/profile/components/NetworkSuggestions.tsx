import CustomButton from "@/components/Button/CustomButton";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useProfile } from "@/providers/ProfileProvider";
import { Images } from "@/public/Images";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useNetworkSuggestion } from "@/providers/NetworkSuggestionProvider";

function NetworkSuggestions() {
  // const [recommendedProfiles, setRecommendedProfiles] = useState<any>([]);
  const [loginUser, setLoginUser] = useState<any>();

  const { profile, setProfile } = useProfile();
  const { recommendedProfiles, setRecommendedProfiles } = useNetworkSuggestion()

  const router = useRouter();

  const getRecommendedProfiles = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/profile/recommendedProfiles`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      const chunkData = response?.data.slice(0, 4);
      setRecommendedProfiles(chunkData);
    } catch (error) {
      console.log(error);
    }
  };

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

      // setProfile((prevProfile: any) => {
      //   const newFollowingCount =
      //     action === "follow"
      //       ? prevProfile?.user?._count?.following + 1
      //       : prevProfile?.user?._count?.following - 1;

      //   return {
      //     ...prevProfile,
      //     user: {
      //       ...prevProfile?.user,
      //       _count: {
      //         ...prevProfile?.user?._count,
      //         following: newFollowingCount,
      //       },
      //     },
      //   };
      // });

      // Find the user in recommendedProfiles
      setProfile((prevProfile: any) => {
        if (prevProfile?.user) {
          const newFollowingCount =
            action === "follow"
              ? prevProfile?.user?._count?.following + 1
              : prevProfile?.user?._count?.following - 1;

          return {
            ...prevProfile,
            user: {
              ...prevProfile?.user,
              _count: {
                ...prevProfile?.user?._count,
                following: newFollowingCount,
              },
            },
          };
        }
        return prevProfile;
      });
      const followedUser = recommendedProfiles?.find(
        (item: any) => item?.id === friendId
      );

      toast.success(
        `You ${action === "follow"
          ? "followed"
          : action === "unfollow"
            ? "unfollowed"
            : ""
        } ${followedUser?.firstName}`
      );

      // Update state or perform additional actions as needed
      setRecommendedProfiles((prevProfiles: any) => {
        return prevProfiles.map((profile: any) => {
          if (profile?.id === friendId) {
            return {
              ...profile,
              isFollowing: action === "follow" ? true : false,
            };
          }
          return profile;
        });
      });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getRecommendedProfiles();
  }, []);

  useEffect(() => {
    let login_user: any = localStorage.getItem("user_info");
    login_user = login_user ? JSON.parse(login_user) : null;
    setLoginUser(login_user);
  }, []);

  return (
    <>
      {recommendedProfiles &&
        <div className="network-inr">
          <h3 className="heading-bold network-heading">People you may know</h3>
          <div className="networkprofile-main">
            {recommendedProfiles
              ?.filter(
                (item: any) =>
                  item.id !== loginUser?.id && item.id !== profile?.otherUser?.id
              )?.map((item: any, index: any) => (
                <div className="networkprofile-otr" key={item.id}>
                  <div className="networkprofile-inr">
                    <div className="networkuserImg-otr">
                      <img
                        className="networkUser-img"
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item?.profileImage}`}
                        alt="avatar"
                        onClick={() => router.push(`/profile?id=${item?.id}`)}
                      />
                    </div>
                    <div className="networkProflie-content">
                      <h4 className="Network-userName" onClick={() => router.push(`/profile?id=${item?.id}`)}>{item?.firstName}</h4>
                      {item?.roleId === 1 &&
                        item?.userSports[0]?.playingClub?.name && (
                          <h5 className="desc Network-userdesc">
                            {
                              item?.userSports[0]?.playingPositions[0]
                                ?.PlayerPosition?.name
                            }{" "}
                            At {item?.userSports[0]?.playingClub?.name}
                          </h5>
                        )}
                      {/* <CustomButton
                  title={item?.isFollowing ? "Following" : "+ Follow"}
                  className="!bg-transparent !rounded-lg border !border-[#9FE870] !text-[#9FE870] my-6"
                  onClick={() =>
                    handleFriendAction(
                      item?.id,
                      item?.isFollowing ? "unfollow" : "follow"
                    )
                  }
                /> */}
                      <div
                        className={`networkProfilebtn-otr ${item?.roleId !== 1 && "pt-[4px]"
                          }`}
                      >
                        <div
                          className="networkProfilebtn-inr"
                          onClick={() =>
                            handleFriendAction(
                              item?.id,
                              item?.isFollowing ? "unfollow" : "follow"
                            )
                          }
                        >
                          {item?.isFollowing ? (
                            "Followed"
                          ) : (
                            <>
                              <div className="icon-otr">
                                <Image
                                  className="plusIcon"
                                  src={Images.PlusImage}
                                  alt="Add"
                                />
                              </div>
                              Follow
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      }
    </>
  );
}
export default NetworkSuggestions;
