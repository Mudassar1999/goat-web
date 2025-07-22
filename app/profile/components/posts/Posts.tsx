import { useEffect, useState } from "react";
import Loading from "react-loading";
import ReactPlayer from "react-player";
import axios from "axios";
import { IoPlayOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { usePosts } from "@/providers/PostsProvider";
import { useProfile } from "@/providers/ProfileProvider";
import InfiniteScroll from "react-infinite-scroll-component";
import { usePostsPagination } from "@/providers/PostsPaginationProvider";

function Posts() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState<any>(null);
  const { profile, setProfile } = useProfile();
  const { posts } = usePosts();
  const { postsPagination, setPostsPagination } = usePostsPagination();

  const getNextPosts = async (currentPage: any) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/all-posts`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          params: {
            limit: 9,
            page: currentPage,
          },
        }
      );

      const newPosts = response?.data?.results;
      setProfile((prevProfile: any) => ({
        ...prevProfile,
        [profile?.otherUser ? "otherUser" : "user"]: {
          ...prevProfile.user,
          Post: [
            ...(prevProfile[profile?.otherUser ? "otherUser" : "user"]?.Post ||
              []),
            ...newPosts,
          ],
        },
      }));

      setPostsPagination(response?.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <InfiniteScroll
        dataLength={posts.length}
        next={() => getNextPosts(postsPagination?.page + 1)}
        hasMore={
          postsPagination?.page < postsPagination?.totalPages ||
          postsPagination?.page < postsPagination?.totalPostsPages
        }
        scrollThreshold="200px"
        loader={<Loading type="spokes" color="#747474" className="mx-auto" />}
      >
        <div
          className={`flex-wrap post-otr ${(profile?.user?.Post || profile?.otherUser?.Post).length > 0
            ? ""
            : "flex justify-center"
            }`}
        >
          {(profile?.user?.Post || profile?.otherUser?.Post).length > 0 ? (
            (profile?.user?.Post || profile?.otherUser?.Post)?.map(
              (item: any) => (
                <div className="individual-post relative" key={item.id}>
                  <div
                    onMouseEnter={() => setIsPlaying(item.id)}
                    onMouseLeave={() => setIsPlaying(null)}
                    onClick={() => router.push(`/profile/posts?id=${item?.id}`)}
                    className="h-[100%]"
                  >
                    <ReactPlayer
                      className="posts-reel"
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item?.reelPath}`}
                      loop={true}
                      playing={isPlaying === item.id}
                      width="100%"
                      height="100%"
                    />
                  </div>
                  <div className="absolute bottom-1 left-1 flex items-center">
                    <IoPlayOutline />
                    <span className="text-white text-xs font-semibold font-['SF Pro Text'] leading-3 tracking-tight">
                      {item?._count?.views}
                    </span>
                  </div>
                </div>
              )
            )
          ) : (
            <div className="flex justify-center items-center flex-col h-[200px] overflow-y-auto">
              <p className="heading-bold-28">Posts</p>
              <p className="text-13">
                When you post video, you'll see them here
              </p>
            </div>
          )}
        </div>
      </InfiniteScroll>
    </>
  );
}
export default Posts;
