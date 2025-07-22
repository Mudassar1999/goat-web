"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ReactPlayer from "react-player";
import VideoActions from "../VideoActions";
import VideoPopup from "../VideoPopup";
import SharePopup from "../SharePopup";
import "../../../app/auth/signup/components/AllComponent.scss";
import "./Post.scss";
import React from "react";

interface postProps {
  singlePost: any,
  showDeleteIcon?: any,
  index?: any,
  pauseVideo?: any
}

const ReadMore = ({ children }: any) => {
  const text = children;
  const [isReadMore, setIsReadMore] = useState(true); // Check if text is longer than 100 characters initially

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  const truncatedText = isReadMore ? text?.slice(0, 100) : text;
  const displayText = isReadMore ? truncatedText : text;

  const lastSpaceIndex = displayText?.lastIndexOf("");
  const truncatedWords =
    lastSpaceIndex !== -1 ? displayText?.slice(0, lastSpaceIndex) : displayText;

  const shouldDisplayLink = text?.length > 100; // Check if the text has more than 100 characters to decide whether to show the link

  return (
    <p className="color-white text-16 post-desc-responsive">
      {truncatedWords}
      {shouldDisplayLink && ( // Conditionally render the "See more" or "See less" link only if the text has more than 100 characters
        <span
          onClick={toggleReadMore}
          className={`cursor-pointer ${isReadMore ? "desc exp-moreL text-16" : "exp-more desc"}`}
        // style={{ color: "#64aed3", transitionDuration: ".4s" }}
        >
          {isReadMore ? " ...see more" : " ...see less"}
        </span>
      )}
    </p>
  );
};

function Post({ singlePost, showDeleteIcon, index, pauseVideo }: postProps) {
  const [post, setPost] = useState<any>();
  const [isVideoPopupOpen, setIsVideoPopupOpen] = useState(false);
  const [sharePopup, setSharePopup] = useState<any>(false);
  const [isInViewport, setIsInViewport] = useState(false);
  const router = useRouter();
  const playerRef = useRef<any>();
  const divRef = useRef<any>(null);

  const handleIntersection = (entries: any) => {
    entries.forEach((entry: any) => {
      if (entry.isIntersecting) {
        setIsInViewport(true);
      } else {
        setIsInViewport(false);
        playerRef?.current?.seekTo(0);
      }
    });
  };

  const handleVideoClick = (event: any) => {
    event.preventDefault(); // Prevent default behavior of ReactPlayer
    setIsInViewport(!isInViewport); // Toggle play/pause state manually
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.7,
    });

    if (divRef.current) {
      observer.observe(divRef.current);
    }

    return () => {
      if (divRef.current) {
        observer.unobserve(divRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (singlePost) {
      setPost(singlePost);
    }
  }, [singlePost]);

  useEffect(() => {
    const handleBodyOverflow = () => {
      document.body.style.overflow = isVideoPopupOpen ? "hidden" : "auto";
    };

    // Set initial state when the component mounts
    handleBodyOverflow();

    // Clean up the effect when the component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isVideoPopupOpen]);

  return (
    <>
      <div className={`mainallReels`}>
        <div className={`reelsContainer ${index == 0 ? "" : ""}`}>
          <div className="flex mainReelOtr">
            <div className="ReelimgOtr">
              <img
                className="h-[36px] w-[36px] rounded-[36px] border-[2px] border-white cursor-pointer Reelimginr"
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${post?.createdBy?.profileImage}`}
                alt="avatar"
                onClick={() => router.push(`/profile?id=${post?.createdById}`)}
              />
            </div>
            <div className="">
              <div className="img-reelContent flex gap-[16px]">
                <div className=" forSmallView">
                  <img
                    className="h-[36px] w-[36px] rounded-[36px] border-[2px] border-white cursor-pointer Reelimginr"
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${post?.createdBy?.profileImage}`}
                    alt="avatar"
                    onClick={() =>
                      router.push(`/profile?id=${post?.createdById}`)
                    }
                  />
                </div>
                <div className="ReelContent">
                  <h3
                    className="text-17 pb-[4px] cursor-pointer"
                    onClick={() =>
                      router.push(`/profile?id=${post?.createdById}`)
                    }
                  >
                    {post?.createdBy?.firstName}
                  </h3>
                  <div className="pb-[24px]">
                    <ReadMore>
                      {post?.content}
                    </ReadMore>
                  </div>
                </div>
              </div>

              <div
                className="relative rounded-[14px] ReelVideo-otr"
                // onClick={() => setIsInViewport(!isInViewport)}
                onClick={handleVideoClick}
                ref={divRef}
              >
                <ReactPlayer
                  ref={playerRef}
                  className="react-player home-reel ReelVideo-inr"
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${post?.reelPath}`}
                  loop={true}
                  playing={(isInViewport && !pauseVideo)}
                  controls={true}
                  width="100%"
                  height="100%"
                />
              </div>
            </div>
            <div className="reelsActionOtr">
              <VideoActions
                post={post}
                setPost={setPost}
                // onOpen={() => setIsVideoPopupOpen(true)}
                onOpen={() => {
                  setIsVideoPopupOpen(true);
                  setIsInViewport(false);
                }}
                setSharePopup={setSharePopup}
                showDeleteIcon={showDeleteIcon}
              />
            </div>
          </div>
        </div>
      </div >
      {isVideoPopupOpen && (
        <VideoPopup
          // onClose={() => {
          //   setIsVideoPopupOpen(false);
          // }}
          onClose={() => {
            setIsVideoPopupOpen(false);
            setIsInViewport(true);
          }}
          post={post}
          setPost={setPost}
          onOpen={() => setIsVideoPopupOpen(true)}
          showDeleteIcon={false}
          showIcons={false}
          isUserDeleted={showDeleteIcon}
          setIsVideoPopupOpen={setIsVideoPopupOpen}
        />
      )
      }
      {
        sharePopup && (
          <SharePopup
            setSharePopup={setSharePopup}
            post={post}
            setPost={setPost}
          />
        )
      }
    </>
  );
}
export default Post;
