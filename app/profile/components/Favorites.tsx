import { useEffect, useState } from "react";
import { IoPlayOutline } from "react-icons/io5";
import Loading from "react-loading";
import ReactPlayer from "react-player";
import { useRouter } from "next/navigation";
import { useProfile } from "@/providers/ProfileProvider";
import InfiniteScroll from "react-infinite-scroll-component";
import { usePosts } from "@/providers/PostsProvider";
import axios from "axios";
import { useFavoritesPagination } from "@/providers/FavoritesPaginationProvider";
import { Images } from "@/public/Images";
import Image from "next/image";

function Favorites() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState<any>(null);
  const { profile, setProfile } = useProfile();
  const { posts } = usePosts();
  const { favoritesPagination, setFavoritesPagination } =
    useFavoritesPagination();

  const getNextPosts = async (currentPage: any) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/favourites`,
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

      // const newPosts = response?.data?.results;
      const newPosts = response?.data?.results.map((item: any) => ({
        post: item.post,
      }));

      setProfile((prevProfile: any) => ({
        ...prevProfile,
        favorites: [...(prevProfile.favorites || []), ...newPosts],
      }));

      setFavoritesPagination(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {
        (profile?.otherUser &&
          profile?.otherUser?.favoritesPrivacy === "No one") ? (
          <div className="flex justify-center items-center flex-col h-[500px] overflow-y-auto">
            <Image src={Images.HeartOff} alt="" className="h-[120px] w-[120px]" />
            <p className="heading-bold-28">Favorites</p>
            <p className="text-13">
              The user's likes videos are hidden due to this user's privacy settings
            </p>
          </div>
        ) :
          (profile?.otherUser && profile?.otherUser?.favoritesPrivacy === "Followers") &&
            !profile?.isFollowing ? (
            <div className="flex justify-center items-center flex-col h-[500px] overflow-y-auto">
              <Image src={Images.HeartOff} alt="" className="h-[120px] w-[120px]" />
              <p className="heading-bold-28">Favorites</p>
              <p className="text-13">
                The user's likes videos are hidden due to this user's privacy settings
              </p>
            </div>
          ) : (
            (profile?.favorites).length > 0 ?
              favoritesPagination && (
                <InfiniteScroll
                  dataLength={posts.length}
                  next={() => getNextPosts(favoritesPagination?.page + 1)}
                  hasMore={
                    favoritesPagination?.page < favoritesPagination?.totalPages ||
                    favoritesPagination?.page < favoritesPagination?.totalFavoritesPages
                  }
                  scrollThreshold="200px"
                  loader={<Loading type="spokes" color="#747474" className="mx-auto" />}
                >
                  <div
                    className={`flex-wrap post-otr ${(profile?.favorites).length > 0 ? "" : "justify-center"
                      }`}
                  >
                    {
                      profile?.favorites?.map((item: any) => (
                        <div
                          className="individual-post relative"
                          key={item?.post?.id | item?.id}
                        >
                          <div
                            onMouseEnter={() => setIsPlaying(item?.post?.id)}
                            onMouseLeave={() => setIsPlaying(null)}
                            onClick={() =>
                              router.push(`/profile/favorites?id=${item?.post?.id}`)
                            }
                            className="h-[100%]"
                          >
                            <ReactPlayer
                              className="posts-reel h-[100%]"
                              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item?.post?.reelPath}`}
                              loop={true}
                              playing={isPlaying === item?.post?.id}
                              width="100%"
                              height="100%"
                            />
                          </div>
                          <div className="absolute bottom-1 left-1 flex items-center">
                            <IoPlayOutline />
                            <span className="text-white text-xs font-semibold font-['SF Pro Text'] leading-3 tracking-tight">
                              {item?.post?._count?.views}
                            </span>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </InfiniteScroll>
              )
              :
              <div className="flex justify-center items-center flex-col h-[200px] overflow-y-auto">
                {/* <Image src={Images.HeartOff} alt="" className="h-[120px] w-[120px]" /> */}
                <p className="heading-bold-28">Favorites</p>
                <p className="text-13">
                  When you like someone's video, you'll see them here
                </p>
              </div>
          )
      }
    </>
  );
}
export default Favorites;
