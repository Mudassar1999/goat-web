import { BsFillHeartFill } from "react-icons/bs";
import { IoIosShareAlt } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCommentDots } from "react-icons/fa";
import { usePosts } from "@/providers/PostsProvider";
import CustomButton from "../Button/CustomButton";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { useState } from "react";
import Popup from "./Popup";

function VideoActions({
  showDeleteIcon,
  onOpen,
  setSharePopup,
  post,
  setPost,
}: any) {
  const [alertPopup, setAlertPopup] = useState<boolean>(false);
  const { posts, setPosts } = usePosts();

  const likedPost = async (videoId: any) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/like-post/${videoId}`,
        "",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      setPost((prevData: any) => ({
        ...prevData,
        isLikedByYou: !prevData?.isLikedByYou,
        _count: {
          ...prevData._count,
          likes: prevData?.isLikedByYou
            ? prevData?._count?.likes - 1
            : prevData?._count?.likes + 1,
        },
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const deletePostHandler = async () => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${post.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      toast.success(response.data.message);
      const updatedResults = posts.filter(
        (currentPost: any) => currentPost.id !== post.id
      );

      // Update the context state with the filtered results
      setPosts(updatedResults);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="reelIconMainOtr flex flex-wrap gap-[24px] flex-col">
        <div className="flex items-center gap-[4px] flex-col">
          <div className="heading-bold">
            <BsFillHeartFill
              className={`font-normal reelIcon cursor-pointer ${post?.isLikedByYou && "text-[#FE2C55]"
                }`}
              onClick={() => likedPost(post?.id)}
            />
          </div>
          <div className="text-13">
            <span className="text-white">{post?._count?.likes ?? 0}</span>
          </div>
        </div>
        <div className="flex items-center gap-[4px] flex-col">
          {post?.allowComments ? (
            <div className="heading-bold">
              <FaCommentDots
                className="font-normal reelIcon cursor-pointer"
                onClick={onOpen}
              />
            </div>
          ) : (
            <div className="heading-bold">
              <button className="cursor-not-allowed opacity-50" disabled>
                <FaCommentDots
                  className="font-normal reelIcon"
                  onClick={onOpen}
                />
              </button>
            </div>
          )}
          <div className="text-13">
            <span className="text-white">{post?._count?.comments ?? 0}</span>
          </div>
        </div>
        <div className="flex items-center gap-[4px] flex-col">
          {post?.allowShares ? (
            <div className="heading-bold">
              <IoIosShareAlt
                className="font-normal reelIcon cursor-pointer"
                onClick={() => setSharePopup(true)}
              />
            </div>
          ) : (
            <div className="heading-bold">
              <button className="cursor-not-allowed opacity-50" disabled>
                <IoIosShareAlt
                  className="font-normal"
                  onClick={() => setSharePopup(true)}
                />
              </button>
            </div>
          )}
          <div className="text-13">
            <span className="text-white">{post?._count?.sharedPosts ?? 0}</span>
          </div>
        </div>
        <div className="flex items-center gap-[4px] flex-col">
          {showDeleteIcon && (
            <div className="heading-bold">
              <MdDelete
                className="font-normal reelIcon cursor-pointer"
                onClick={() => setAlertPopup(true)}
              />
            </div>
          )}
        </div>
        {alertPopup && (
          <Popup onClose={() => setAlertPopup(false)}>
            <AiOutlineExclamationCircle className="text-5xl mx-auto mb-3" />
            <h2 className="text-center mb-3">
              Are you sure you want to delete this post?
            </h2>
            <div className="flex gap-3 justify-center">
              <CustomButton
                title="Yes, I'm sure"
                redButton={true}
                onClick={() => deletePostHandler()}
              />
              <CustomButton
                title="No, cancel"
                onClick={() => setAlertPopup(false)}
              />
            </div>
          </Popup>
        )}
      </div>
    </>
  );
}
export default VideoActions;
