"use client";

import Reel from "@/components/shared/reel/Reel";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { usePosts } from "@/providers/PostsProvider";
import { useProfile } from "@/providers/ProfileProvider";
import Footer from "@/components/Footer";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "react-loading";
import { useFavoritesPagination } from "@/providers/FavoritesPaginationProvider";
import ProtectedRoutes from "../../ProtectedRoutes";

function Favorites() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { profile } = useProfile();
  const { posts, setPosts } = usePosts();
  const { favoritesPagination, setFavoritesPagination } =
    useFavoritesPagination();

  useEffect(() => {
    const currentPosts = profile?.favorites || [];

    if (currentPosts.length === 0) {
      getNextPosts(1);
    } else {
      postsHandler(currentPosts);
    }
  }, []);

  const postsHandler = (currentPosts: any) => {
    const fetchedPosts = currentPosts;

    if (id) {
      // Find the index of the post with the specified ID

      const index = fetchedPosts.findIndex(
        (item: any) => item?.post?.id === parseInt(id)
      );

      // If the post with the specified ID is found, move it to the beginning of the array
      if (index !== -1) {
        const updatedPosts = [
          fetchedPosts[index],
          ...fetchedPosts.slice(0, index),
          ...fetchedPosts.slice(index + 1),
        ];

        // Update the state with the rearranged array
        const updatedPostObjects = updatedPosts.map((item: any) => item.post);

        // Update the state with the rearranged array of post objects
        setPosts(updatedPostObjects);
      }
    } else {
      // If the id is not present, set the posts as they are
      setPosts(fetchedPosts.map((item: any) => item.post));
    }
  };
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

      const newPosts = response?.data?.results?.map((item: any) => item.post);

      if (currentPage === 1) {
        setPosts(newPosts);
      } else {
        setPosts((prevPosts: any) => [...prevPosts, ...newPosts]);
      }

      setFavoritesPagination(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Header />
      <div >
        <InfiniteScroll
          dataLength={posts.length}
          next={() => getNextPosts(favoritesPagination?.page + 1)}
          hasMore={
            favoritesPagination?.page < favoritesPagination?.totalPages ||
            favoritesPagination?.page < favoritesPagination?.totalFavoritesPages
          }
          scrollThreshold="200px"
          loader={<Loading type="spokes" color="#747474" className="mx-auto" />}
        // endMessage={
        //   <p className="text-center">
        //     <p className="text-center">No more favorites posts to show.</p>
        //   </p>
        // }
        >
          <div >
            <Reel />
          </div>
        </InfiniteScroll>
        <Footer />
      </div>
    </>
  );
}
export default ProtectedRoutes(Favorites);
