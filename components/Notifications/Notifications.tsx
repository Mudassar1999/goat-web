import axios from "axios";
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import Loading from "react-loading";
import { CheckIcon } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";
import "./Notification.scss";
import { FollowAndUnfollow } from "@/api/profile/followAndUnfollow";
import { useNotifications } from "@/providers/NotificationProvider";

interface CloseNotifications {
  notificationRef: any;
  setNotificationCount: Dispatch<SetStateAction<number | undefined>>;
}
function Notifications({
  notificationRef,
  setNotificationCount,
}: CloseNotifications) {
  const [loading, setLoading] = useState<boolean>(false);
  const [paginatedNotifi, setpaginatedNotifi] = useState<any>([]);
  // const [notification, setNotification] = useState<any>({});

  const router = useRouter();
  const { notifications, setNotifications } = useNotifications();

  const getAllNotifications = async (currentPage: any) => {
    // setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          params: {
            limit: 20,
            page: currentPage,
          },
        }
      );

      setNotifications(response?.data);
      const newNoti = response?.data?.results;
      setpaginatedNotifi((prevNoti: any) => [...prevNoti, ...newNoti]);
      // setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (notificationDate: any) => {
    // Get the current time
    const currentTime: any = new Date();

    // Get the time of the specific message
    const notificationTimeDate: any = new Date(notificationDate);

    // Calculate the time difference in milliseconds
    const timeDifference = currentTime - notificationTimeDate;

    // Convert the time difference to minutes
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));

    // Check different cases and format accordingly
    if (minutesDifference < 1) {
      // Less than 1 hour
      return "Just Now";
    } else if (minutesDifference < 60) {
      // Less than 1 hour
      return `${minutesDifference} min`;
    } else if (minutesDifference < 24 * 60) {
      // Less than 1 day
      const hoursDifference = Math.floor(minutesDifference / 60);
      return `${hoursDifference} ${hoursDifference === 1 ? "hour" : "hours"}`;
    } else {
      // More than 1 day
      const options: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "numeric",
      };
      return notificationTimeDate.toLocaleDateString("en-US", options);
    }
  };

  const handleFollowAndUnfollow = async (
    id: number,
    action: "follow" | "unfollow",
    name: string,
    index: number
  ) => {
    try {
      const res = await FollowAndUnfollow(id, action, name);
      if (res === 200) {
        setpaginatedNotifi((prevNotifications: any) => {
          const updatedNotifications = [...prevNotifications];
          const updatedNotification = { ...updatedNotifications[index] };
          updatedNotification.Follower.isFollowing = action === 'follow';
          updatedNotifications[index] = updatedNotification;
          return updatedNotifications;
        });
      }
    } catch (e: any) {
      console.log("error");
    }
  };

  useEffect(() => {
    getAllNotifications(1);
    setNotificationCount(0);
  }, []);

  return (
    <>
      {notifications?.results && (
        <div
          className="notificatio-main fixed h-[610px] right-[90px] top-[112px] w-[390px]  z-50 bg-black  rounded-[14px] overflow-y-auto"
          ref={notificationRef}
          id="scrollableDiv"
        >
          <InfiniteScroll
            dataLength={paginatedNotifi?.length}
            next={() => getAllNotifications(notifications?.page + 1)}
            hasMore={
              notifications?.page < notifications?.totalPages ||
              notifications?.page < notifications?.totalPostsPages
            }
            scrollableTarget="scrollableDiv"
            loader={
              <Loading type="spokes" color="#747474" className="mx-auto" />
            }
          >
            <h1 className="text-2xl font-bold notification-header">
              Notifications
            </h1>
            {loading ? (
              <div className="flex justify-center items-center h-full w-full">
                <Loading type="spokes" />
              </div>
            ) : (
              paginatedNotifi?.map((item: any, index: number) => (
                <div key={item.id} className="trybody-border">
                  <div
                    className={`flex justify-between p-4 cursor-pointer relative notification-body ${!item.isClicked && "bg-[#1C1C1E]"
                      } ${index === paginatedNotifi?.length - 1 && "border-none"
                      }`}
                    onClick={() =>
                      item.type !== "follow_notification"
                      && router.push(`/notification?id=${item.id}`)
                      // : router.push(`/profile?id=${item?.followerId}`)
                    }
                  >
                    <div className="flex gap-3">
                      <img
                        className="notificationUser-img"
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item?.user?.profileImage}`}
                        alt=""
                      />
                      <div className="notification-wrapper">
                        {/* {formatNotificationMessage(item)} */}
                        {item.message && (
                          <>
                            {item.message.split('*^').map((part: any, partIndex: number) => (
                              <span key={partIndex}>
                                {partIndex === 0 ? (
                                  part.length > 20 ?
                                    <span className="notificationUser-sms">{part.trim() + " "}</span> :
                                    <span className="notificationUser-name">{part.trim() + " "}</span>
                                ) : (
                                  <span className="notificationUser-sms">{part.trim()}</span>
                                )}
                              </span>
                            ))}
                          </>
                        )}
                        {item.type === "contract_offer" && (
                          <div className="notificationbtn-otr">
                            <div className="notificationbtn-inr">
                              View Offer
                            </div>
                          </div>
                        )}
                        {item.type === "follow_notification" && (
                          !item?.Follower?.isFollowing ?
                            <div className="notificationbtn-otr">
                              <div className="notificationbtn-inr"
                                onClick={() => {
                                  handleFollowAndUnfollow(
                                    item?.Follower?.id,
                                    "follow",
                                    item?.Follower?.firstName,
                                    index
                                  );
                                }}
                              >
                                Follow back
                              </div>
                            </div> :
                            <div className="notificationbtn-otr">
                              <div className="notificationbtn-inr flex flex-row justify-center gap-[6px]"
                                onClick={() => {
                                  handleFollowAndUnfollow(
                                    item?.Follower?.id,
                                    "unfollow",
                                    item?.Follower?.firstName,
                                    index
                                  );
                                }}>
                                <CheckIcon className="w-[14px] h-[18px] object-contain" />
                                Followed
                              </div>
                            </div>
                        )}
                      </div>
                    </div>
                    <span className="text-violet-100 absolute top-[16px] right-[16px] text-[11px] font-normal leading-[13px] tracking-[0.066px]">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </InfiniteScroll >
        </div >
      )
      }
    </>
  );
}
export default Notifications;

