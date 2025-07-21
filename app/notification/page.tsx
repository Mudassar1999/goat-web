"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Post from "@/components/shared/reel/Post";
import VideoPopup from "@/components/shared/VideoPopup";
import { useRouter } from "next/navigation";
import ViewOffer from "../profile/components/offers/ViewOffer";
import FeedbackNotification from "../journey/components/FeedbackNotification";
import { useNotifications } from "@/providers/NotificationProvider";

function Notification() {
  const [singleNotification, setSingleNotification] = useState<any>({});
  const [notification, setNotification] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");

  const router = useRouter();
  const { notifications } = useNotifications();


  const getNotificationPost = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/clicked/${postId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setLoading(false);
      setNotification(response?.data);
      // if (response?.data?.type === "follow_notification") {
      //   router.push(`/profile?id=${response?.data?.followerId}`);
      // } else {
      //   setNotification(response?.data);
      // }
    } catch (error) {
      console.log(error);
    }
  };

  const getSingleNotification = () => {
    const selectedNotification = notifications?.results?.find(
      (notification: any) => notification.id === Number(postId)
    );
    setSingleNotification(selectedNotification);
  };

  useEffect(() => {
    getSingleNotification();
  }, []);

  useEffect(() => {
    getNotificationPost();
  }, [postId]);

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />
        {/* className="container flex-grow flex justify-center items-center flex-col" */}
        <div >
          {loading ? (
            // <Loading type="spokes" color="#747474" />
            <></>
          ) : notification?.type === "like_notification" ? (
            <Post
              singlePost={notification?.Like?.post}
              showDeleteIcon={false}
            />
          ) : notification?.type === "like_comment_notification" ? (
            <VideoPopup
              post={singleNotification?.CommentLike?.Comment?.post}
              onClose={() => router.push("/")}
            />
          ) :
            notification?.type === "comment_notification" ? (
              <VideoPopup
                post={notification?.Comment?.post}
                onClose={() => router.push("/")}
              />
            ) : notification?.type === "reply_notification" ? (
              <VideoPopup
                post={notification?.Reply?.comment?.post}
                notificationReply={singleNotification?.Reply}
                onClose={() => router.push("/")}
              />
            ) :
              notification?.type === "drill_approved_notification" ? (
                <Post
                  singlePost={singleNotification?.Post}
                  showDeleteIcon={false}
                />
              ) : notification?.type === "contract_offer" ? (
                <ViewOffer offerDetails={notification?.Contract} />
              ) : notification?.type === "counterOffer_notification" ? (
                <ViewOffer offerDetails={notification?.CounterContract} />
              ) : (notification?.type === "contract_accepted_notification" || notification?.type === "contract_rejected_notification") ? (
                <ViewOffer offerDetails={notification?.Contract ?? notification?.CounterContract} />
              ) :
                (notification?.type === "feedback_notification") ? (
                  <FeedbackNotification feedback={notification?.DrillFeedback} />
                ) : (
                  ""
                )}
        </div>
        <Footer />
      </div>
    </>
  );
}
export default Notification;
