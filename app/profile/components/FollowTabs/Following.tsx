import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "react-loading";
import "../../../journey/components/ForPopUp.scss";
import { CheckIcon } from "lucide-react";
import { FollowAndUnfollow } from "@/api/profile/followAndUnfollow";
import { currentUserFollowing } from "../../../../api/profile/getCurrentUserFollowing";
import { otherUserFollowing } from "../../../../api/profile/getOtherUserFollowing";
import { useProfile } from "@/providers/ProfileProvider";
import { useRouter } from "next/navigation";
import { Images } from "@/public/Images";
import Image from "next/image";
import { useNetworkSuggestion } from "@/providers/NetworkSuggestionProvider";

const Following = () => {
  const [currentFollowing, setCurrentFollowing] = useState<any>({});
  const [paginatedFollowing, setPaginatedFollowing] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<any>("");

  const router = useRouter();

  const { profile, setProfile } = useProfile();
  const { setRecommendedProfiles } = useNetworkSuggestion()

  const fetchFollowing = async (currentPage: any) => {
    // const userFollowing = await currentUserFollowing(currentPage)
    setLoading(true);
    let userFollowing;
    let pageType = "followingsPage";
    if (profile?.user) {
      userFollowing = await currentUserFollowing(currentPage, pageType);
    } else if (profile?.otherUser) {
      userFollowing = await otherUserFollowing(
        profile.otherUser.id,
        currentPage,
        pageType
      );
    } else {
      return;
    }

    // {profile?.user ? currentUserFollowing(currentPage) : otherUserFollowing( profile?.otherUser?.id,currentPage)}
    setCurrentFollowing(userFollowing?.followingsPagination);
    const userFollowData = userFollowing?.followingsPagination?.results;
    if (userFollowData) {
      setPaginatedFollowing((prevData: any) => [
        ...prevData,
        ...userFollowData,
      ]);
    }
    setLoading(false);
  };

  const handleFollowAndUnfollow = async (
    id: number,
    action: "follow" | "unfollow",
    name: string
  ) => {
    try {
      const res = await FollowAndUnfollow(id, action, name);
      if (res === 200) {
        setProfile((prevProfile: any) => {
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
        });

        setPaginatedFollowing((prevData: any) =>
          prevData.map((item: any) =>
            item.id === id
              ? { ...item, isFollowing: action === "follow" ? true : false }
              : item
          )
        );

        setRecommendedProfiles((prevProfiles: any) => {
          return prevProfiles.map((profile: any) => {
            if (profile?.id === id) {
              return {
                ...profile,
                isFollowing: action === "follow" ? true : false,
              };
            }
            return profile;
          });
        });
      }
    } catch (e: any) {
      console.log("error");
    }
  };

  useEffect(() => {
    let userData: any = localStorage.getItem("user_info");
    userData = userData ? JSON.parse(userData) : null;
    setUserInfo(userData);
    fetchFollowing(1);
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-[500px] w-full">
          <Loading type="spokes" />
        </div>
      ) : paginatedFollowing?.length ? (
        currentFollowing && (
          <div className="h-[500px] overflow-y-auto" id="scrollableDiv">
            <InfiniteScroll
              dataLength={paginatedFollowing?.length}
              next={() => fetchFollowing(currentFollowing?.page + 1)}
              hasMore={
                currentFollowing?.page < currentFollowing?.totalFollowingsPages
              }
              scrollableTarget="scrollableDiv"
              loader={
                <Loading type="spokes" color="#747474" className="mx-auto" />
              }
            >
              {loading ? (
                <div className="flex justify-center items-center h-full w-full">
                  <Loading type="spokes" />
                </div>
              ) : (
                paginatedFollowing?.map((item: any) => {
                  return (
                    <div className="followPopup-otr">
                      <div className="followPopup-inr">
                        <div className="followPopup-userImag-otr">
                          <img
                            className="followPopup-userImag cursor-pointer"
                            onClick={() =>
                              router.push(`/profile?id=${item?.id}`)
                            }
                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item?.profileImage}`}
                            alt="img"
                          />
                        </div>
                        <div className="followPopup-content">
                          <p
                            className="followPopup-UserName cursor-pointer"
                            onClick={() =>
                              router.push(`/profile?id=${item?.id}`)
                            }
                          >
                            {item?.firstName + " " + item?.lastName}
                          </p>
                          <p className="followPopup-UserDesc">
                            {item?.userName}
                          </p>
                          {userInfo?.id !== item?.id && (
                            <div className="followPopup-actions">
                              <div
                                className="followPopup-btn-otr cursor-pointer"
                                onClick={() =>
                                  router.push(`/profile/chats?id=${item?.id}`)
                                }
                              >
                                <div className="followPopup-btn">Messsage</div>
                              </div>
                              <div className="followPopup-btn-otr">
                                <div
                                  className="followPopup-btn cursor-pointer"
                                  onClick={() => {
                                    handleFollowAndUnfollow(
                                      item?.id,
                                      item?.isFollowing === true
                                        ? "unfollow"
                                        : "follow",
                                      item?.firstName
                                    );
                                  }}
                                >
                                  {item?.isFollowing === true ? (
                                    <>
                                      <CheckIcon className="w-[14px] h-[18px] object-contain" />
                                      Followed
                                    </>
                                  ) : (
                                    <>
                                      <div className="followPopup-btnIcon">
                                        +
                                      </div>
                                      Follow
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </InfiniteScroll>
          </div>
        )
      ) : profile?.otherUser &&
        profile?.otherUser?.followingsPrivacy === "No one" ? (
        <div className="flex justify-center items-center flex-col h-[500px] overflow-y-auto">
          <Image src={Images.HeartOff} alt="" className="h-[120px] w-[120px]" />
          <p className="heading-bold-28">Following</p>
          <p className="text-13">
            Following list is hidden due to this user's privacy settings
          </p>
        </div>
      ) : profile?.otherUser?.followingsPrivacy === "Followers" &&
        !profile?.isFollowing ? (
        <div className="flex justify-center items-center flex-col h-[500px] overflow-y-auto">
          <Image src={Images.HeartOff} alt="" className="h-[120px] w-[120px]" />
          <p className="heading-bold-28">Following</p>
          <p className="text-13">
            Following list is hidden due to this user's privacy settings
          </p>
        </div>
      ) : (
        <div className="flex justify-center items-center flex-col h-[500px] overflow-y-auto">
          <Image src={Images.HeartOff} alt="" className="h-[120px] w-[120px]" />
          <p className="heading-bold-28">Following</p>
          <p className="text-13">
            When you follow someone, you'll see them here
          </p>
        </div>
      )}
    </>
  );
};

export default Following;
