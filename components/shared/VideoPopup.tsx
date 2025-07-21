import { useState } from "react";
import { BsPlayFill } from "react-icons/bs";
import Loading from "react-loading";
import ReactPlayer from "react-player";
import CommentOnPost from "./CommentOnPost";
import { IoCloseOutline } from "react-icons/io5";
import "../../app/auth/signup/components/AllComponent.scss";
import "./Comment.scss";
import CommentHeader from "./comment/CommentHeader";
import ReactOnPostHeader from "./comment/ReactOnPostHeader";
import ReactOnPostTabs from "./comment/ReactTab";

function VideoPopup({ onClose, post, setPost, isUserDeleted, notificationReply }: any) {
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [commentsOnPost, setCommentsOnPost] = useState<[]>([]);
  const [openReactOnPost, setOpenReactOnPost] = useState<boolean>(false)
  const [reactOnPostTab, setReactOnPostTab] = useState("All");

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black">
        <div className="">
          {loading ? (
            <div className="flex justify-center">
              <Loading type="spokes" color="#747474" />
            </div>
          ) : (
            <div className="flex main-commentSection">
              <div className="flex flex-1 w-full flex-wrap relative overflow-hidden goatReel-otr">
                <div>
                  <img
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${post?.thumbnailPath}`}
                    className="w-full h-full blur-[150px] absolute object-cover -z-10"
                  />
                </div>

                {/* close btn */}
                <div
                  className="w-8 h-8 bg-zinc-500 bg-opacity-40 rounded-full flex-col justify-center items-center gap-2 inline-flex mt-3 ml-3 cursor-pointer absolute z-10"
                  onClick={onClose}
                >
                  <IoCloseOutline className="text-right text-white text-xs font-semibold font-['SF Pro Text'] leading-none w-[14px] h-[18px]" />
                </div>
                <div
                  className="relative mx-auto forResponsiveReels goatReel-inr"
                  onClick={() => setIsPaused(!isPaused)}
                >
                  {/* video player btns */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    {isPaused && (
                      <BsPlayFill
                        className="text-5xl"
                        onClick={() => setIsPaused(false)}
                      />
                    )}
                  </div>
                  {/* player */}
                  <ReactPlayer
                    url={`${process.env.NEXT_PUBLIC_IMAGE_URL}${post?.reelPath}`}
                    className="comment-reel"
                    loop={true}
                    playing={isPaused ? false : true}
                    width="100%"
                    height="100%"
                  />
                </div>
              </div>
              <div className="w-[390px] relative flex flex-col comments-section">

                {openReactOnPost ?
                  <ReactOnPostHeader
                    setOpenReactOnPost={setOpenReactOnPost}
                  />
                  :
                  <CommentHeader
                    post={post}
                  />
                }
                {
                  openReactOnPost ?
                    <ReactOnPostTabs
                      reactOnPostTab={reactOnPostTab}
                      setReactOnPostTab={setReactOnPostTab}
                      post={post}
                    />
                    :
                    <CommentOnPost
                      post={post}
                      setPost={setPost}
                      notificationReply={notificationReply}
                      commentsOnPost={commentsOnPost}
                      setCommentsOnPost={setCommentsOnPost}
                      isUserDeleted={isUserDeleted}
                      setOpenReactOnPost={setOpenReactOnPost}
                    />
                }

              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
export default VideoPopup;
