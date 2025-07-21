import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "react-loading";
import "../../app/auth/signup/components/AllComponent.scss";

function PostLikeUsers({ post }: any) {
  const [postLikeUsers, setPostLikeUsers] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const getUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${post.id}/likes`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setPostLikeUsers(response?.data?.results);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUsers();
  }, []);
  console.log("postLikeUsers", postLikeUsers);
  return (
    <>
      {loading ? (
        <Loading type="spokes" color="#747474" />
      ) : (
        postLikeUsers?.map((item: any) => (
          <div className="mb-3" key={item.id}>
            <div className="flex gap-2 my-3">
              {/* <div className="w-1/6">
                <img
                  className="networkUser-img"
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item?.user?.profileImage}`}
                  alt="avatar"
                />
              </div> */}
              <div className="w-5/6">
                <div className="w-full">
                  <h5 className="text-xl font-bold">{item?.user?.firstName}</h5>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </>
  );
}
export default PostLikeUsers;
