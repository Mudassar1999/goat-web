"use client";
import Reel from "@/components/shared/reel/Reel";
import axios from "axios";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { usePosts } from "@/providers/PostsProvider";

function SharedReel({ params }: any) {
  const [loading, setLoading] = useState<any>(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sharedPost, setSharedPost] = useState<any>();

  const { setPosts } = usePosts();

  useEffect(() => {
    getSharedPost();
  }, []);
  useEffect(() => {
    getAllPosts();
  }, []);
  useEffect(() => {
    if (sharedPost) {
      setPosts((prevPosts: any) => [sharedPost, ...prevPosts]);
    }
  }, []);
  const getSharedPost = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/shared/${params?.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      setSharedPost(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const getAllPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/home/getHomeReelsNew`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      setPosts(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Reel />
    </>
  );
}
export default SharedReel;
