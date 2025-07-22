import Popup from "@/components/shared/Popup";
import { usePosts } from "@/providers/PostsProvider";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Loading from "react-loading";
import ReactPlayer from "react-player";
import { toast } from "react-toastify";
import "../../../auth/signup/components/AllComponent.scss";
import "./PostVideo.scss";

function PostVideoPopup({ onClose, setPauseVideo }: any) {
  const { posts, setPosts } = usePosts();
  const fileInputRef = useRef<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [postVideoData, setPostVideoData] = useState({
    content: "",
    reelPath: "",
    thumbnailPath: "",
    gifPath: "",
    allowComments: true,
    allowShares: true,
  });

  const uploadVideo = async (video: any) => {
    // setVideoPostStatus("postVideo");
    setLoading(true);
    const form = new FormData();
    form.append("post-media", video);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/post-media`,
        form,
        {
          headers: {
            "Content-Type": `multipart/form-data`,
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      // console.log(JSON.stringify(response.data));
      setPostVideoData((prevPostData) => ({
        ...prevPostData,
        reelPath: response.data.videoPath,
        thumbnailPath: response.data.thumbnailPath,
        gifPath: response.data.gifPath,
      }));

      toast.success(response.data.message);
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  const postVideo = async () => {
    postVideoData;
    if (postVideoData.reelPath === "") {
      toast.warning("Please upload video first");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/posts`,
        postVideoData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      const user_info = localStorage.getItem("user_info");
      const userInfo = user_info ? JSON.parse(user_info) : null;
      // Update the posts state with the new data
      const newPost = {
        ...response.data.data,
        createdBy: {
          id: userInfo?.id,
          userName: userInfo?.userName,
          firstName: userInfo?.firstName,
          lastName: userInfo?.lastName,
          profileImage: userInfo?.profileImage,
        },
      };

      setPosts((prev) => [newPost, ...prev]);

      toast.success(response.data.message);
      setPauseVideo(false)
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const video = e.target.files[0];
      if (video) {
        uploadVideo(video);
      }
    }
  };
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const discardMediaFileHandler = async () => {
    if (postVideoData.reelPath) {
      try {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/posts/post-media`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            params: {
              reelPath: postVideoData?.reelPath,
              thumbnailPath: postVideoData?.thumbnailPath,
              gifPath: postVideoData?.gifPath,
            },
          }
        );

        toast.success(response.data.message);
        setPostVideoData({
          ...postVideoData,
          reelPath: "",
          thumbnailPath: "",
          gifPath: "",
        });
      } catch (error: any) {
        console.log(error);
        toast.error(error.message);
      }
    } else {
      setPauseVideo(false)
      onClose();
      return;
    }
  };

  useEffect(() => {
    setPauseVideo(true)
  }, [])
  return (
    <>
      <Popup onClose={onClose} width="1/2">
        <div>
          <h2 className="heading-bold pb-[20px]">New Post</h2>
          <div>
            <div className="relative min-h-[140px] w-full rounded-[14px] bg-[#3A3A3C] p-[16px] flex items-center justify-between gap-[16px] mb-[20px] border-b-[0.33px] border-b-[#545458a6]">
              <textarea
                name="content"
                className="block !bg-transparent min-h-[110px]  w-2/3 resize-none focus:outline-none text-15"
                placeholder="Share your thoughts in 150 characters"
                value={postVideoData.content}
                onChange={(e: any) => {
                  if (e.target.value.length > 150) {
                    toast.warning(
                      "The description should not exceed 150 characters."
                    );
                    return;
                  }
                  setPostVideoData({
                    ...postVideoData,
                    ["content"]: e.target.value,
                  });
                }}
              ></textarea>
              {loading ? (
                <div className="w-1/3 h-[129px] rounded-[14px] relative bg-black flex justify-center items-center">
                  <Loading type="spokes" color="#747474" />
                </div>
              ) : (
                <>
                  {postVideoData?.reelPath ? (
                    <div className="w-1/3 h-[129px] rounded-[14px] relative bg-black">
                      <>
                        <ReactPlayer
                          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${postVideoData?.reelPath}`}
                          className="uploaded-reel"
                          loop={true}
                          width="100%"
                          height="100%"
                        />
                        <input
                          type="file"
                          name="reelPath"
                          accept="video/*"
                          onChange={handleVideoChange}
                          style={{ display: "none" }}
                          ref={fileInputRef}
                        />
                        <button
                          onClick={handleButtonClick}
                          className="bg-black opacity-80 text-white absolute bottom-0 text-xs font-normal leading-none rounded-bl-[14px] rounded-br-[14px] w-full py-2"
                        >
                          Change Video
                        </button>
                      </>
                    </div>
                  ) : (
                    <div className="upload-reel-bg w-[129px] h-[129px] rounded-[14px] relative">
                      <input
                        type="file"
                        name="reelPath"
                        accept="video/*"
                        onChange={handleVideoChange}
                        style={{ display: "none" }}
                        ref={fileInputRef}
                      />
                      <button
                        onClick={handleButtonClick}
                        className="bg-black opacity-80 text-white absolute bottom-0 text-xs font-normal leading-none rounded-bl-[14px] rounded-br-[14px] w-full py-2"
                      >
                        Upload Video
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="rounded-[14px] bg-[#2C2C2E] pl-[16px]">
              <div className="border-b border-zinc-600 border-opacity-60 py-[11px] justify-between items-center flex">
                <label className="desc color-white">Allow Comment</label>
                <div className="relative flex flex-col items-center justify-center">
                  <div className="flex pr-[16px] pl-[8px]">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={postVideoData.allowComments}
                      readOnly
                    />
                    <div
                      onClick={() =>
                        setPostVideoData({
                          ...postVideoData,
                          ["allowComments"]: !postVideoData.allowComments,
                        })
                      }
                      className="w-11 h-6 bg-gray-900 rounded-full peer cursor-pointer peer-focus:ring-[#34C759] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[10px] after:bg-white after:border-gray-900 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#34C759]"
                    ></div>
                  </div>
                </div>
              </div>
              <div className="py-[11px] justify-between items-center flex">
                <label className="desc color-white">Allow share</label>
                <div className="relative flex flex-col items-center justify-center">
                  <div className="flex pr-[16px] pl-[8px]">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={postVideoData.allowShares}
                      readOnly
                    />
                    <div
                      onClick={() =>
                        setPostVideoData({
                          ...postVideoData,
                          ["allowShares"]: !postVideoData.allowShares,
                        })
                      }
                      className="w-11 h-6 bg-gray-900 rounded-full peer cursor-pointer peer-focus:ring-[#34C759] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[10px] after:bg-white after:border-gray-900 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#34C759]"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="videoAtions-otr pt-8">
              <div
                className="poUpsAtionsOtr cursor-pointer"
                onClick={() => discardMediaFileHandler()}
              >
                <div className="heading-bold poUpsAtionsInr">Discard</div>
              </div>
              <div
                className="poUpsAtionsOtr2 cursor-pointer"
                onClick={() => postVideo()}
              >
                <div className="poUpsAtionsInr2">Post</div>
              </div>
            </div>
          </div>
        </div>
      </Popup>
    </>
  );
}
export default PostVideoPopup;
