import axios from "axios";
import { useEffect, useState, useRef, useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "react-loading";
import { toast } from "react-toastify";
import { GoHeart } from "react-icons/go";
import { BiDislike } from "react-icons/bi";
import "../../app/auth/signup/components/AllComponent.scss";
import Popup from "./Popup";
import PostLikeUsers from "./PostLikeUsers";
import { BsFillHeartFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import "./Comment.scss";
import { useProfile } from "@/providers/ProfileProvider";

const emojiList = [
  { emoji: "😊" },
  { emoji: "❤️" },
  { emoji: "😂" },
  { emoji: "😳" },
  { emoji: "😢" },
  { emoji: "😫" },
];

function CommentOnPost({
  commentsOnPost,
  setCommentsOnPost,
  notificationReply,
  post,
  setPost,
  isUserDeleted,
  setOpenReactOnPost
}: any) {
  const [commentContent, setCommentContent] = useState<any>("");
  const [replyOnCommentContent, setReplyOnCommentContent] = useState<any>("");
  const [replyOnCommentId, setReplyOnCommentId] = useState<any>();
  const [repliesOnComments, setRepliesOnComments] = useState<any>([]);
  const [loading, setLoading] = useState<any>(false);
  const [actionOnPost, setActionOnPost] = useState<any>();
  const [showReplyInput, setShowReplyInput] = useState<boolean>(false);
  const [loginUser, setLoginUser] = useState<any>();
  const [postLikePopup, setPostLikePopup] = useState(false);
  const [commentDetails, setCommentDetails] = useState<any>();
  const [commentsLength, setCommentsLength] = useState<any>([]);

  const router = useRouter();
  const { profile } = useProfile();
  const inputRef = useRef<any>(null);

  useEffect(() => {
    let login_user: any = localStorage.getItem("user_info");
    login_user = login_user ? JSON.parse(login_user) : null;
    setLoginUser(login_user);
  }, []);

  useEffect(() => {
    getComments(1);
  }, []);
  useEffect(() => {
    inputRef.current.focus();
  }, []);
  const getComments = async (currentPage: any) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${post.id}/comment`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          params: {
            page: currentPage,
            limit: 9,
          },
        }
      );

      // setCommentsOnPost(response.data);
      setCommentsOnPost((prevComments: any) => ({
        results: [
          ...(prevComments.results || []),
          ...(response?.data?.results || []),
        ],
        page: response?.data?.page,
        totalPages: response?.data?.totalPages,
        totalResults: response?.data?.totalResults,
      }));
      const newComments = response?.data?.results;
      setCommentsLength((prevComments: any) => [
        ...prevComments,
        ...newComments,
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  //   api call for comment on video
  const commentOnVideo = async (e: any) => {
    if (e.key === "Enter") {
      setCommentContent({ content: "" });
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/posts/${post.id}/comment`,
          commentContent,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        const newComment = {
          ...response.data.comment,
          user: {
            profileImage: profile?.user?.profileImage,
            firstName: profile?.user?.firstName,
            userName: profile?.user?.userName
          },
          _count: {
            dislikes: 0,
            likes: 0,
            replies: 0,
          },
        };
        const existingComments = commentsOnPost.results;
        let updatedComments = [newComment, ...existingComments];
        setCommentsOnPost({ ...commentsOnPost, results: updatedComments });

        setPost((prevData: any) => ({
          ...prevData,
          _count: {
            ...prevData._count,
            comments: prevData?._count?.comments + 1,
          },
        }));
        inputRef.current.blur();
      } catch (error) {
        console.log(error);
      }
    }
  };
  //   delete comment
  const deleteComment = async (commentId: number) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      const remainingComments = commentsOnPost.results.filter(
        (item: any) => item.id !== commentId
      );
      setCommentsOnPost({ ...commentsOnPost, results: remainingComments });
      setPost((prevData: any) => ({
        ...prevData,
        _count: {
          ...prevData._count,
          comments: prevData?._count?.comments - 1,
        },
      }));
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };
  //   api call for like or dislike a comment
  const likeOrDislikeOnCommentHandler = async (
    commentId: any,
    action: string
  ) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/comments/${commentId}/likeOrDislikeComment`,
        {
          action: action,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      // Find the index of the comment in the array based on its id
      const commentIndex = commentsOnPost?.results?.findIndex(
        (comment: any) => comment.id === commentId
      );
      if (commentIndex !== -1) {
        const currentComment = commentsOnPost?.results[commentIndex];

        if (action === "like") {
          const updatedComment = {
            ...currentComment,
            isLikedByYou: !currentComment.isLikedByYou,
            isDisLikedByYou:
              !currentComment.isDisLikedByYou && currentComment.isDisLikedByYou,
            _count: {
              ...currentComment._count,
              likes: currentComment.isLikedByYou
                ? currentComment._count.likes - 1
                : currentComment._count.likes + 1,
            },
          };

          setCommentsOnPost((prev: any) => {
            const newComments = [...prev.results];
            newComments[commentIndex] = updatedComment;
            return { ...prev, results: newComments };
          });
        } else if (action === "dislike") {
          const updatedComment = {
            ...currentComment,
            isLikedByYou:
              !currentComment.isLikedByYou && currentComment.isLikedByYou,
            isDisLikedByYou: !currentComment.isDisLikedByYou,
            _count: {
              ...currentComment._count,
              likes:
                currentComment.isLikedByYou && currentComment._count.likes > 0
                  ? currentComment._count.likes - 1
                  : currentComment._count.likes,
              // likes:
              //   currentComment.isDisLikedByYou &&
              //   currentComment._count.likes > 0 &&
              //   currentComment._count.likes - 1,
            },
          };

          setCommentsOnPost((prev: any) => {
            const newComments = [...prev.results];
            newComments[commentIndex] = updatedComment;
            return { ...prev, results: newComments };
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  //   api call for reply on comment
  const postCommentReply = async (e: any) => {
    if (e.key === "Enter") {
      setReplyOnCommentContent({ content: "" });
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/posts/comments/${replyOnCommentId}/reply`,
          replyOnCommentContent,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        const newReply = {
          ...response.data.post,
          user: {
            profileImage: profile?.user?.profileImage,
            firstName: profile?.user?.firstName,
          },
        };
        const updatedComments = commentsOnPost?.results?.map((comment: any) => {
          if (comment.id === replyOnCommentId) {
            const existingReplies = comment?.replies?.results?.replies || [];
            const updatedReplies = [...existingReplies, newReply];

            return {
              ...comment,
              replies: {
                results: {
                  replies: updatedReplies,
                },
                page: comment?.replies?.page,
                totalPages: comment?.replies?.totalPages,
                totalReplies: comment?.replies?.totalReplies,
              },
            };
          }
          return comment;
        });

        setCommentsOnPost({
          ...commentsOnPost,
          results: updatedComments,
        });

        setShowReplyInput(false);
        inputRef.current.blur();
      } catch (error) {
        console.log(error);
      }
    }
  };
  //   api call for get comment replies
  const getRepliesOnComments = async (commentId: any, currentPage: any) => {
    setLoading(true);
    setReplyOnCommentId(commentId);
    setReplyOnCommentContent({ content: "" });

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/comments/${commentId}/reply`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          params: {
            page: currentPage,
            limit: 3,
          },
        }
      );
      const newReplies = response?.data?.results?.replies;

      // Update your state or object with the fetched replies
      const updatedComments = commentsOnPost?.results?.map((comment: any) => {
        if (comment.id === commentId) {
          const existingReplies = comment?.replies?.results?.replies || [];
          const updatedReplies = [...existingReplies, ...newReplies];
          return {
            ...comment,
            replies: {
              results: {
                replies: updatedReplies,
              },
              page: response?.data?.page,
              totalPages: response?.data?.totalPages,
              totalReplies: response?.data?.totalReplies,
            },
          };
        }
        return comment;
      });
      setCommentsOnPost({
        ...commentsOnPost,
        results: updatedComments,
      });

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const replyOnCommentHandler = (comment: any) => {
    inputRef.current.focus();
    setShowReplyInput(true);
    setReplyOnCommentId(comment?.id);
    setCommentDetails(comment);
  };

  function getCommentTime(commentTime: any) {
    // Get the current time
    const currentTime: any = new Date();

    // Get the time of the specific comment
    const commentTimeDate: any = new Date(commentTime);

    // Calculate the time difference in milliseconds
    const timeDifference = currentTime - commentTimeDate;

    // Convert the time difference to minutes
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));

    // Check different cases and format accordingly
    if (minutesDifference < 1) {
      // Less than 1 hour
      return `now`;
    } else if (minutesDifference < 60) {
      // Less than 1 hour
      return `${minutesDifference} min`;
    } else if (minutesDifference < 24 * 60) {
      // Less than 1 day
      const hoursDifference = Math.floor(minutesDifference / 60);
      return `${hoursDifference} ${hoursDifference === 1 ? "hour" : "hours"}`;
    } else {
      // More than 1 day
      let daysDifference = Math.floor(minutesDifference / (24 * 60));

      if (daysDifference > 6) {
        // If days are more than 7, divide by 2 and return weeks
        const weeksDifference = Math.floor(daysDifference / 7);
        return `${weeksDifference}w`;
      } else {
        return `${daysDifference}d`;
      }
    }
  }
  const addEmoji = (emoji: any) => {
    setCommentContent((prevComment: any) => ({
      ...prevComment,
      content:
        prevComment && prevComment.content !== ""
          ? prevComment.content + emoji
          : emoji,
    }));
  };

  return (
    <>
      <div className="text-13-bold text-center border-y border-zinc-600 border-opacity-60 p-[16px] relative">
        {isUserDeleted &&
          <div
            className="comment-Likes-otr absolute top-[16px] left-[16px] flex gap-1 items-center cursor-pointer"
            onClick={() => setOpenReactOnPost(true)}
          >
            <div className="comment-emoji">❤️</div>
            <div className="comment-Likes">{post?._count?.likes ?? 0} {post?._count?.likes === 1 ? "Like" : "Likes"}</div>
          </div>
        }
        {post?._count?.comments} comments
      </div>
      {/* comments */}
      <div
        className=" overflow-y-auto scroll-remover px-[16px] flex-grow my-5 commentsArea"
        id="scrollableDiv"
      >
        <InfiniteScroll
          dataLength={commentsLength?.length}
          next={() => getComments(commentsOnPost?.page + 1)}
          hasMore={commentsOnPost?.page < commentsOnPost?.totalPages}
          scrollableTarget="scrollableDiv"
          loader={<Loading type="spokes" color="#747474" className="mx-auto" />}
        >
          {commentsOnPost?.results?.map((item: any, index: any) => (
            <div className={`${index !== 0 && "mt-3"}`} key={item.id}>
              <div className="flex gap-[8px]">
                <div>
                  <img
                    className="h-[36px] w-[36px] rounded-[36px] cursor-pointer"
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item?.user?.profileImage}`}
                    alt="avatar"
                    onClick={() => router.push(`/profile?id=${item?.user?.id}`)}
                  />
                </div>
                <div className="flex-1">
                  <div className="pb-[12px]">
                    <div
                      className="comment-heading pb-[2px]"
                      onClick={() => router.push(`/profile?id=${item?.user?.id}`)}
                    >
                      {item?.user?.firstName}
                    </div>
                    <p className="comment-desc">{item?.content}</p>
                  </div>
                  {/* actions on comment */}

                  <div className="flex justify-between text-12">
                    <div>
                      <span className="pr-[16px]">
                        {getCommentTime(item?.createdAt)}
                      </span>
                      <span
                        className="cursor-pointer"
                        onClick={() => replyOnCommentHandler(item)}
                      >
                        Reply
                      </span>
                    </div>
                    <div className="flex items-center gap-[16px]">
                      <div className="flex items-center gap-[2px]">
                        {item.isLikedByYou ? (
                          <BsFillHeartFill
                            className="text-xs font-normal e cursor-pointer text-[#FE2C55]"
                            onClick={() =>
                              likeOrDislikeOnCommentHandler(item.id, "like")
                            }
                          />
                        ) : (
                          <GoHeart
                            className={`cursor-pointer ${item.isLikedByYou && "!text-blue-500"
                              }`}
                            onClick={() =>
                              likeOrDislikeOnCommentHandler(item.id, "like")
                            }
                          />
                        )}
                        <span className="font-normal">
                          {item?._count?.likes || 0}
                        </span>
                      </div>
                      <BiDislike
                        className={`text-violet-100 text-xs font-normal e cursor-pointer ${item.isDisLikedByYou && "!text-blue-500"
                          }`}
                        onClick={() =>
                          likeOrDislikeOnCommentHandler(item.id, "dislike")
                        }
                      />
                    </div>
                  </div>
                  {/* replies of comments */}
                  {/* {item.id === replyOnCommentId && (
                    <>
                      {repliesOnComments?.results?.replies?.map(
                        (item: any, index: any) => (
                          <div key={item.id}>
                            <div className="flex gap-[8px] items-center my-[12px]">
                              <div>
                                <img
                                  className="h-[32px] w-[32px] rounded-full"
                                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item?.user?.profileImage}`}
                                  alt="avatar"
                                  onClick={() =>
                                    router.push(`/profile?id=${item?.user?.id}`)
                                  }
                                />
                              </div>
                              <div className="w-[270px]">
                                <div className="">
                                  <h5
                                    className="comment-heading"
                                    onClick={() =>
                                      router.push(
                                        `/profile?id=${item?.user?.id}`
                                      )
                                    }
                                  >
                                    {item?.user?.firstName}
                                  </h5>
                                  <p className="comment-desc">
                                    {item?.content}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </>
                  )} */}

                  {notificationReply?.commentId &&
                    notificationReply?.commentId === item.id && (
                      <div>
                        <div className="flex gap-[8px] items-center my-[12px]">
                          <div>
                            <img
                              className="h-[32px] w-[32px] rounded-full"
                              src={`${process.env.NEXT_PUBLIC_IMAGE_URL} ${notificationReply?.user?.profileImage}`}
                              alt="avatar"
                              onClick={() =>
                                router.push(
                                  `/profile?id=${notificationReply?.id}`
                                )
                              }
                            />
                          </div>
                          <div className="w-[270px]">
                            <div className="">
                              <h5
                                className="comment-heading"
                                onClick={() =>
                                  router.push(
                                    `/profile?id=${notificationReply?.id}`
                                  )
                                }
                              >
                                {notificationReply?.user?.firstName}
                              </h5>
                              <p className="comment-desc">
                                {notificationReply?.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}


                  {item?.replies?.results?.replies
                    ?.filter((reply: any) =>
                      notificationReply
                        ? reply.id !== notificationReply?.id
                        : item?.replies?.results?.replies
                    )
                    ?.map((reply: any) => (
                      <div key={reply.id}>
                        <div className="flex gap-[8px] items-center my-[12px]">
                          <div>
                            <img
                              className="h-[32px] w-[32px] rounded-full"
                              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${reply?.user?.profileImage}`}
                              alt="avatar"
                              onClick={() =>
                                router.push(`/profile?id=${reply?.user?.id}`)
                              }
                            />
                          </div>
                          <div className="w-[270px]">
                            <div className="">
                              <h5
                                className="comment-heading"
                                onClick={() =>
                                  router.push(`/profile?id=${reply?.user?.id}`)
                                }
                              >
                                {reply?.user?.firstName}
                              </h5>
                              <p className="comment-desc">{reply?.content}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                  {/* {item._count?.replies > 0 && (
                    <span
                      className={`cursor-pointer pl-[32px] text-13 ${repliesOnComments?.page ===
                        repliesOnComments?.totalPages &&
                        item.id === replyOnCommentId &&
                        "hidden"
                        }`}
                      onClick={() => {
                        const currentPage =
                          item.id !== replyOnCommentId
                            ? 1
                            : repliesOnComments?.page + 1;
                        getRepliesOnComments(item.id, currentPage);
                      }}
                    >
                      View{" "}
                      {repliesOnComments?.page > 0 && item.id === replyOnCommentId
                        ? item._count?.replies - repliesOnComments?.page * 3
                        : item._count?.replies}{" "}
                      replies
                    </span>
                  )} */}
                  {item._count?.replies > 0 && !notificationReply && (
                    <span
                      className={`cursor-pointer pl-[32px] text-13 ${item?.replies?.page &&
                        item?.replies?.page === item?.replies?.totalPages &&
                        "hidden"
                        }`}
                      onClick={() => {
                        const currentPage = !item?.replies?.page
                          ? 1
                          : item?.replies?.page + 1;
                        getRepliesOnComments(item.id, currentPage);
                      }}
                    >
                      View{" "}
                      {item?.replies?.page > 0
                        ? item._count?.replies - item?.replies?.page * 3
                        : item._count?.replies}{" "}
                      replies
                    </span>
                  )}
                  {item._count?.replies > 1 && notificationReply && (
                    <span
                      className={`cursor-pointer pl-[32px] text-13 ${item?.replies?.page &&
                        item?.replies?.page === item?.replies?.totalPages &&
                        "hidden"
                        }`}
                      onClick={() => {
                        const currentPage = !item?.replies?.page
                          ? 1
                          : item?.replies?.page + 1;
                        getRepliesOnComments(item.id, currentPage);
                      }}
                    >
                      View{" "}
                      {item?.replies?.page > 0
                        ? item._count?.replies - item?.replies?.page * 3
                        : item._count?.replies - 1}{" "}
                      replies
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </InfiniteScroll>
      </div>

      {/* <div className="h-[0.5px] bg-transparent " /> */}

      {/* comment bar */}
      <div className="w-full px-[16px] py-[24px] border-t-[0.33px] border-t-[#545458a6]">
        <div className="flex justify-between items-center mb-2">
          {emojiList.map((item, index) => (
            <span
              key={index}
              className="text-[32px]"
              onClick={() => addEmoji(item.emoji)}
            >
              {item.emoji}
            </span>
          ))}
        </div>
        <div className="flex gap-[12px]">
          <img
            className="h-[36px] w-[36px] rounded-[36px]"
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${profile?.user?.profileImage}`}
          />
          {/* reply on comment bar */}
          {showReplyInput ? (
            <div className="w-full">
              <input
                className="w-full comment-input-field px-[24px] py-[4px] border-transparent h-[36px] text-16 rounded-[8px]"
                placeholder={`Reply to ${commentDetails?.user?.userName}...`}
                value={replyOnCommentContent.content}
                onChange={(e: any) =>
                  setReplyOnCommentContent({ content: e.target.value })
                }
                onBlur={() => {
                  setShowReplyInput(false);
                }}
                onKeyDown={postCommentReply}
                ref={inputRef}
              />
            </div>
          ) : (
            <div className="w-full">
              <input
                className="w-full comment-input-field px-[24px] py-[4px] border-transparent h-[36px] text-16 rounded-[8px]"
                placeholder="add comment..."
                value={commentContent.content}
                onChange={(e: any) =>
                  setCommentContent({ content: e.target.value })
                }
                onKeyDown={commentOnVideo}
                ref={inputRef}
              />
            </div>
          )}
        </div>
      </div>
      {postLikePopup && (
        <Popup onClose={() => setPostLikePopup(false)}>
          <PostLikeUsers post={post} />
        </Popup>
      )}
    </>
  );
}
export default CommentOnPost;
