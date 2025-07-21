import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "react-loading";
import "../../../journey/components/ForPopUp.scss";
import { CheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FollowAndUnfollow } from "@/api/profile/followAndUnfollow";
import { currentUserFollowing } from "../../../../api/profile/getCurrentUserFollowing";
import { otherUserFollowing } from "../../../../api/profile/getOtherUserFollowing";
import { useProfile } from "@/providers/ProfileProvider";
import PersonIcon from "@/assests/svg/person";
import { Images } from "@/public/Images";
import Image from "next/image";

const Follower = () => {
  const [userInfo, setUserInfo] = useState<any>("");
  const [currentFollower, setCurrentFollower] = useState<any>({});
  const [paginatedFollower, setPaginatedFollower] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const { profile } = useProfile();

  const fetchFollowing = async (currentPage: any) => {
    setLoading(true);
    let userFollower;
    let pageType = "followersPage";
    if (profile?.user) {
      userFollower = await currentUserFollowing(currentPage, pageType);
    } else if (profile?.otherUser) {
      userFollower = await otherUserFollowing(
        profile.otherUser.id,
        currentPage,
        pageType
      );
    } else {
      return;
    }
    setCurrentFollower(userFollower);
    const userFollowData = userFollower?.followersPagination?.results;
    if (userFollowData) {
      setPaginatedFollower((prevData: any) => [...prevData, ...userFollowData]);
    }
    setLoading(false);
  };

  const handleFollowAndUnfollow = async (
    id: number,
    action: "follow" | "unfollow",
    name: string
  ) => {
    try {
      await FollowAndUnfollow(id, action, name);
      setPaginatedFollower((prevData: any) =>
        prevData.map((item: any) =>
          item.id === id
            ? { ...item, isFollowing: action === "follow" ? true : false }
            : item
        )
      );
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
      ) : paginatedFollower?.length ? (
        currentFollower && (
          <div className="h-[500px] overflow-y-auto" id="scrollableDiv">
            <InfiniteScroll
              dataLength={paginatedFollower?.length}
              next={() => fetchFollowing(currentFollower?.page + 1)}
              hasMore={
                currentFollower?.page < currentFollower?.totalPages ||
                currentFollower?.page < currentFollower?.totalPostsPages
              }
              scrollableTarget="scrollableDiv"
              loader={
                <Loading type="spokes" color="#747474" className="mx-auto" />
              }
            >
              {paginatedFollower?.map((item: any) => {
                return (
                  <div className="followPopup-otr">
                    <div className="followPopup-inr">
                      <div className="followPopup-userImag-otr cursor-pointer">
                        <img
                          className="followPopup-userImag"
                          onClick={() => router.push(`/profile?id=${item?.id}`)}
                          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item?.profileImage}`}
                          alt="img"
                        />
                      </div>
                      <div className="followPopup-content">
                        <p
                          className="followPopup-UserName cursor-pointer"
                          onClick={() => router.push(`/profile?id=${item?.id}`)}
                        >
                          {item?.firstName + " " + item?.lastName}
                        </p>
                        <p className="followPopup-UserDesc">{item?.userName}</p>
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
                                    <div className="followPopup-btnIcon">+</div>
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
              })}
            </InfiniteScroll>
          </div>
        )
      ) : profile?.otherUser &&
        profile?.otherUser?.followersPrivacy === "No one" ? (
        <div className="flex justify-center items-center flex-col h-[500px] overflow-y-auto">
          <Image src={Images.HeartOff} alt="" className="h-[120px] w-[120px]" />
          <p className="heading-bold-28">Followers</p>
          <p className="text-13">
            Follower list is hidden due to this user's privacy settings
          </p>
        </div>
      ) : profile?.otherUser?.followersPrivacy === "Followers" &&
        !profile?.isFollowing ? (
        <div className="flex justify-center items-center flex-col h-[500px] overflow-y-auto">
          <Image src={Images.HeartOff} alt="" className="h-[120px] w-[120px]" />
          <p className="heading-bold-28">Followers</p>
          <p className="text-13">
            Followers list is hidden due to this user's privacy settings
          </p>
        </div>
      ) : (
        <div className="flex justify-center items-center flex-col h-[500px] overflow-y-auto">
          <Image src={Images.HeartOff} alt="" className="h-[120px] w-[120px]" />
          <p className="heading-bold-28">Followers</p>
          <p className="text-13">
            When someone follow you, you'll see them here
          </p>
        </div>
      )}
    </>
  );
};

export default Follower;
