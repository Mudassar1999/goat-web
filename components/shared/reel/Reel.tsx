"use client";
import { usePosts } from "@/providers/PostsProvider";
import Post from "./Post";
import { useEffect } from "react";
import axios from "axios";
import { useProfile } from "@/providers/ProfileProvider";

interface reelProps {
  showDeleteIcon?: any,
  pauseVideo?: any
}

function Reel({ showDeleteIcon, pauseVideo }: reelProps) {
  const { posts } = usePosts();
  const { setProfile } = useProfile();

  const fetchUser = async () => {
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/users/profile`;

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setProfile(response?.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUser()
  }, [])
  return (
    <>
      {posts?.map((item: any, index: number) => (
        <Post
          key={item.id}
          index={index}
          singlePost={item}
          showDeleteIcon={showDeleteIcon}
          pauseVideo={pauseVideo}
        />
      ))}
    </>
  );
}
export default Reel;
