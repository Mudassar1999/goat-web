"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import io, { Socket } from "socket.io-client";
import { useProfile } from "@/providers/ProfileProvider";
import InfiniteScroll from "react-infinite-scroll-component";
import "./Chat.scss";
import Loading from "react-loading";
import { CheckIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import ProtectedRoutes from "@/app/ProtectedRoutes";

let socket: Socket;
interface Message {
  content: string;
  createdAt: string;
  Sender: any;
  senderId: boolean;
  // other properties...
}

function Chat() {
  const { profile, setProfile } = useProfile();
  // const user_info = localStorage.getItem("user_info");
  // const userInfo = user_info ? JSON.parse(user_info) : null;
  const user_info =
    typeof window !== "undefined" ? localStorage.getItem("user_info") : null;
  const userInfo = user_info ? JSON.parse(user_info) : null;

  // State to store the messages
  const [messages, setMessages] = useState<any>([]);
  const [messagesPagination, setMessagesPagination] = useState<any>();
  const [conversations, setConversations] = useState<any>([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const chatId = searchParams.get("id");

  // State to store the current message
  const [currentMessage, setCurrentMessage] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [firstRender, setFirstRender] = useState<boolean>(false);

  useEffect(() => {
    // socket = io(`http://172.174.245.80:3000/`, {
    socket = io(`http://46.101.118.176:3000/`, {
      transports: ["websocket"],
      autoConnect: true,
      path: "/goat-app",
      query: { userId: userInfo?.id, otherUserId: profile?.otherUser?.id },
    });

    socket.on("connect", () => {
      console.log("Connected:", socket.connected); // true
    });

    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.connected); // false
    });

    socket.on("messageSent", (data) => {
      // setMessages([...messages, data]);
      // setMessages((prev: any) => [...prev, data]);
      setMessages((prev: any) => [data, ...(prev || [])]);
      getConversations();
      // TODO: update chat list
      // console.log("Message Sent", data);
    });

    socket.on("messageReceived", (data) => {
      // setMessages((prev: any) => [...prev, data]);
      // setMessages([...messages, data]);
      getConversations();
      if (data?.senderId === profile?.otherUser?.id) {
        setMessages((prev: any) => [data, ...(prev || [])]);
      }

      // TODO: update chat list
      // console.log("Message Received", data);
    });

    return () => {
      socket.disconnect();
    };
  }, [profile]);

  useEffect(() => {
    getChat(1);
    getConversations();
  }, []);

  const sendMessage = () => {
    try {
      // Send the message to the server
      socket.emit("message", {
        senderId: userInfo?.id,
        recipientId: profile?.otherUser?.id,
        message: currentMessage.trim(),
      });

      // Clear the currentMessage state
      setCurrentMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      // Prevent the default behavior of the Enter key (e.g., adding a new line)
      event.preventDefault();

      // Call the function to send the message
      sendMessage();
    }
  };
  const getChat = async (currentPage: any, currentUserId?: number) => {
    setLoading(true);

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/messages/chat`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          params: {
            userId: currentUserId ? currentUserId : profile?.otherUser?.id,
            limit: 9,
            page: currentPage,
          },
        }
      );
      console.log("response", response.data);
      // setMessages(response?.data?.results?.reverse());
      setMessages((prev: any) => [...prev, ...(response?.data?.results ?? [])]);
      setMessagesPagination(response?.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const getConversations = async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/messages`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      setConversations(response?.data?.results);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
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

      // Update state or perform additional actions as needed
      setProfile((prevProfile: any) => ({
        ...prevProfile,
        isFollowing: action === "follow" ? true : false,
      }));

      toast.success(
        `You ${
          action === "follow"
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
  const fetchUser = async (userId: any) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/profile/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setProfile(response.data);
      setMessages([]);
      setFirstRender(true);
      getChat(1, response?.data?.otherUser?.id);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };
  const formatDate = (dataDate: any) => {
    const utcDate = new Date(dataDate);
    const myLocalDate = utcDate.toLocaleString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }); // This will convert to the local time
    return myLocalDate;
  };
  function getMessageTime(messageTime: any) {
    // Get the current time
    const currentTime: any = new Date();

    // Get the time of the specific message
    const messageTimeDate: any = new Date(messageTime);

    // Calculate the time difference in milliseconds
    const timeDifference = currentTime - messageTimeDate;

    // Convert the time difference to minutes
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));

    // Check different cases and format accordingly
    if (minutesDifference < 60) {
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
      return messageTimeDate.toLocaleDateString("en-US", options);
    }
  }
  const redirectUserProfile = (id: number) => {
    router.push(`/profile?id=${id}`);
  };

  const isSameSenderAsPrevious = (message: any, index: number) => {
    return (
      index > 0 &&
      (message?.Sender?.id !== messages[index - 1]?.Sender?.id ||
        message?.senderId !== messages[index - 1]?.senderId)
    );
  };

  const toggleFirstRender = () => {
    setFirstRender(false);
  };
  useEffect(() => {
    if (chatId) {
      fetchUser(chatId);
    }
  }, [chatId]);

  return (
    <>
      <div className="Chat-otr">
        <div className="chatletfotr">
          <div className="chatleftotrInr">
            {conversations?.map((conversation: any, index: number) => (
              <div className="chatboxotr" key={conversation.id}>
                {conversation.senderId !== conversation.recipientId && (
                  <div
                    className={`${
                      index === 0
                        ? "chatboxinr"
                        : index === conversations.length - 1
                          ? "Last"
                          : "simple"
                    } ${
                      profile?.otherUser?.id === conversation.recipientId ||
                      profile?.otherUser?.id === conversation.senderId
                        ? "active-chat-box"
                        : "nonactive-chat-box"
                    }`}
                    onClick={() => {
                      toggleFirstRender();
                      fetchUser(
                        conversation.recipientId === userInfo.id
                          ? conversation.senderId
                          : conversation.recipientId
                      );
                    }}
                  >
                    <div className="chatinfo cursor-pointer">
                      <div className="chatimgotr">
                        {conversation.recipientId === userInfo?.id ? (
                          <img
                            className="chatimg"
                            src={
                              process.env.NEXT_PUBLIC_IMAGE_URL +
                              conversation?.Sender?.profileImage
                            }
                            alt="img"
                          />
                        ) : (
                          <img
                            className="chatimg"
                            src={
                              process.env.NEXT_PUBLIC_IMAGE_URL +
                              conversation?.Recipient?.profileImage
                            }
                            alt="img"
                          />
                        )}
                      </div>
                      <div className="chatdesc">
                        <p className="chatname">
                          {conversation.recipientId === userInfo?.id
                            ? conversation?.Sender?.firstName
                            : conversation?.Recipient?.firstName}
                        </p>
                        <p className="chatdetails">
                          {conversation?.messages[0]?.Sender?.id ===
                          userInfo?.id
                            ? "You"
                            : conversation?.messages[0]?.Sender?.id !==
                                userInfo?.id
                              ? conversation?.messages[0]?.Sender?.firstName
                              : conversation?.messages[0]?.Recipient?.firstName}
                          :{" "}
                          {
                            // conversation?.messages[0]?.content.length > 60
                            //   ? `${conversation?.messages[0]?.content.slice(
                            //       0,
                            //       60
                            //     )}...`
                            //   :
                            conversation?.messages[0]?.content
                          }
                        </p>
                      </div>
                    </div>
                    <div className="chatTimeotr">
                      <p className="chatTime">
                        {getMessageTime(conversation?.messages[0]?.createdAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="chatRightotr rounded-[14px] border border-[#7676803D] flex-col">
          {/* {(loading && !firstRender) ?
            <Loading type="spokes" color="#747474" className="mx-auto" />
            : */}
          <div className="chatRightInr">
            <div className="headerChat p-6 border-b border-[#7676803D]  gap-3 flex flex-1">
              <img
                className="Limage w-8 h-8 rounded-full cursor-pointer"
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${profile?.otherUser?.profileImage}`}
                onClick={() => redirectUserProfile(profile?.otherUser?.id)}
              />
              <div className="grow shrink basis-0 flex-col justify-start items-start gap-3 inline-flex">
                <div className="self-stretch flex-col justify-start items-start gap-1 flex">
                  <h3
                    className="LName cursor-pointer"
                    onClick={() => redirectUserProfile(profile?.otherUser?.id)}
                  >
                    {profile?.otherUser?.firstName}
                  </h3>
                  <div className="self-stretch justify-start items-start gap-1 inline-flex">
                    <div className="py-[4px] LDesc">
                      LW at Manchester United U18
                    </div>
                  </div>
                  <div className="chatbtn-otr">
                    <div
                      className="chatbtn-inr cursor-pointer"
                      onClick={() =>
                        handleFriendAction(
                          profile?.otherUser?.id,
                          profile?.isFollowing ? "unfollow" : "follow"
                        )
                      }
                    >
                      {profile?.isFollowing ? (
                        <div className="flex">
                          <CheckIcon className="w-[14px] h-[18px] object-contain mr-[6px]" />
                          Followed
                        </div>
                      ) : (
                        <>
                          <div>+</div>
                          Follow
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="chatbody overflow-y-scroll flex-col-reverse justify-start items-end gap-4 flex relative "
              id="scrollableDiv"
            >
              {loading && !firstRender ? (
                <Loading
                  type="spokes"
                  color="#747474"
                  className="forCharLoader"
                />
              ) : (
                <div className="w-full">
                  <InfiniteScroll
                    dataLength={messages.length}
                    next={() => getChat(messagesPagination?.page + 1)}
                    style={{
                      display: "flex",
                      flexDirection: "column-reverse",
                      gap: "6px",
                    }}
                    inverse={true}
                    hasMore={
                      messagesPagination?.page < messagesPagination?.totalPages
                    }
                    scrollThreshold="50px"
                    scrollableTarget="scrollableDiv"
                    loader={<></>}
                  >
                    {messages?.map((message: Message, index: number) => (
                      <div
                        key={index}
                        className={`${
                          message?.Sender?.id === userInfo?.id ||
                          message?.senderId === userInfo?.id
                            ? "items-end"
                            : "self-stretch items-start"
                        } flex-col justify-start gap-1.5 flex`}
                      >
                        <div
                          className={` ${
                            message?.Sender?.id === userInfo?.id ||
                            message?.senderId === userInfo?.id
                              ? `bg-[#1E9AF1]  ${
                                  isSameSenderAsPrevious(message, index) ||
                                  index === 0 ||
                                  formatDate(message?.createdAt) !==
                                    formatDate(messages[index - 1]?.createdAt)
                                    ? "rounded-tl-[20px] rounded-tr-[20px] rounded-bl-[20px] rounded-br"
                                    : "rounded-[20px]"
                                }`
                              : `bg-[#7676803D] ${
                                  isSameSenderAsPrevious(message, index) ||
                                  index === 0 ||
                                  formatDate(message?.createdAt) !==
                                    formatDate(messages[index - 1]?.createdAt)
                                    ? "rounded-tl-[20px] rounded-tr-[20px] rounded-bl rounded-br-[20px]"
                                    : "rounded-[20px]"
                                }`
                          } justify-center items-center gap-2 inline-flex message-content-otr ${
                            message?.content.length > 20 && ""
                          }`}
                        >
                          <p className="message-content p-4">
                            {message?.content}
                          </p>
                        </div>
                        {((isSameSenderAsPrevious(message, index) &&
                          formatDate(message?.createdAt) ===
                            formatDate(messages[index - 1]?.createdAt)) ||
                          formatDate(message?.createdAt) !==
                            formatDate(messages[index - 1]?.createdAt)) && (
                          <span className="text-violet-100 text-[11px] font-normal leading-[13px] tracking-[0.066px]">
                            {formatDate(message?.createdAt)}
                          </span>
                        )}
                      </div>
                    ))}
                  </InfiniteScroll>
                </div>
              )}
            </div>
            <div className="ChatType border-t border-[#7676803D]">
              <div className="ChatType-inr">
                <textarea
                  name="content"
                  className="chat-textarea"
                  placeholder="Write a message"
                  onKeyDown={handleKeyDown}
                  value={currentMessage}
                  onChange={(e: any) => setCurrentMessage(e.target.value)}
                ></textarea>
                {/* <CustomButton
                title="Send"
                className="!mt-6 !w-16 !text-[13px] !font-semibold !px-5 !py-3.5 ml-auto"
                onClick={() => sendMessage()}
              /> */}
                <div className="chatsmsbtn-otr">
                  <div
                    className="chatsmsbtn-inr cursor-pointer"
                    onClick={() => sendMessage()}
                  >
                    Send
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default ProtectedRoutes(Chat);
