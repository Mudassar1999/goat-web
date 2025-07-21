import { useEffect, useState } from "react";
import { CheckIcon } from "lucide-react";
import Loading from "react-loading";
import InfiniteScroll from "react-infinite-scroll-component";
import { Images } from "@/public/Images";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "./search.scss";
import { getSearchPosts } from "@/api/search/search";
import Footer from "@/components/Footer";
import { useSearch } from "@/providers/SearchProvider";
import { FollowAndUnfollow } from "@/api/profile/followAndUnfollow";
import { useSearchTab } from "@/providers/SearchTabProvider";

const SearchUsers = () => {
  const [loading, setLoading] = useState<any>(false);
  const [userInfo, setUserInfo] = useState<any>("");
  const [paginatedUser, setPaginatedUser] = useState<any>([]);
  const { userSearch, setUserSearch, searchValue, searchLoading } = useSearch();
  const { searchTab } = useSearchTab();

  const router = useRouter();

  const fetchSearchUser = async (currentPage: any) => {
    if (searchValue !== "") {
      try {
        setLoading(true);
        let pageType = searchTab === "users" ? "usersPage" : "reelsPage";
        const searchResults = await getSearchPosts(
          currentPage,
          searchValue,
          pageType
        );

        if (searchResults) {
          setUserSearch((prevState: any) => ({
            ...prevState,
            results: [
              ...prevState.results,
              ...searchResults.usersPagination.results,
            ],
            page: searchResults.usersPagination.page,
            totalPages: searchResults.usersPagination.totalPages,
          }));
        }

        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching next page:", error);
      }
    }
  };

  const handleFollowAndUnfollow = async (
    id: number,
    action: "follow" | "unfollow",
    name: string
  ) => {
    try {
      const res = await FollowAndUnfollow(id, action, name);
      if (res === 200) {
        const updatedResults = userSearch?.results?.map((user: any) => {
          if (user.id === id) {
            return { ...user, isFollowing: !user.isFollowing };
          }
          return user;
        });

        setUserSearch((prevState) => {
          if (prevState) {
            return {
              ...prevState,
              results: updatedResults,
            };
          }
          return prevState;
        });
      }
    } catch (e: any) {
      console.log("error");
    }
  };

  useEffect(() => {
    let userData: any = localStorage.getItem("user_info");
    userData = userData ? JSON.parse(userData) : null;
    setUserInfo(userData);
  }, []);

  useEffect(() => {
    if (!loading && userSearch?.results) {
      setPaginatedUser((prev: any) => ({
        ...prev,
        results: userSearch?.results,
      }));
    }
  }, [userSearch?.results]);

  return (
    <div className="post-otr-search">
      {searchLoading ?
        <Loading type="spokes" color="#747474" className="search-loader " />
        :
        paginatedUser?.results?.length ? (
          userSearch && (
            <InfiniteScroll
              dataLength={paginatedUser?.results?.length}
              next={() => fetchSearchUser(userSearch?.page + 1)}
              hasMore={userSearch?.page < userSearch?.totalPages}
              scrollThreshold="200px"
              className=""
              loader={
                <Loading type="spokes" color="#747474" className="mx-auto " />
              }
            >
              {paginatedUser?.results?.map((item: any) => {
                return (
                  <div className="followPopup-otr my-2">
                    <div className="followPopup-inr for border-bottom-user-search">
                      <div className="followPopup-userImag-otr">
                        <img
                          className="followPopup-userImag cursor-pointer"
                          onClick={() => router.push(`/profile?id=${item?.id}`)}
                          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item?.profileImage}`}
                          alt="img"
                        />
                        {/* <div className="followPopup-clubImg-otr">
                        <img
                          className="followPopup-clubImg"
                          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item?.thumbnailProfileImage}`}
                          // src="https://images.unsplash.com/photo-1705407193485-98a3cca5d125?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxOHx8fGVufDB8fHx8fA%3D%3D"
                          alt="img"
                        />
                      </div> */}
                      </div>
                      <div className="followPopup-content">
                        <p
                          className="followPopup-UserName cursor-pointer"
                          onClick={() => router.push(`/profile?id=${item?.id}`)}
                        >
                          {item?.firstName + " " + item?.lastName}
                        </p>
                        <p className="followPopup-UserDesc">{item?.userName}</p>
                        {userInfo?.id !== item?.id && (
                          <div className="followPopup-actions">
                            <div
                              className="followPopup-btn-otr cursor-pointer"
                              onClick={() =>
                                router.push(`/profile/chats?id=${item?.id}`)
                              }
                            >
                              <div className="followPopup-btn">Messsage</div>
                            </div>
                            <div className="followPopup-btn-otr">
                              <div
                                className="followPopup-btn cursor-pointer"
                                onClick={() => {
                                  handleFollowAndUnfollow(
                                    item?.id,
                                    item?.isFollowing === true
                                      ? "unfollow"
                                      : "follow",
                                    item?.firstName
                                  );
                                }}
                              >
                                {item?.isFollowing === true ? (
                                  <>
                                    <CheckIcon className="w-[14px] h-[18px] object-contain" />
                                    Followed
                                  </>
                                ) : (
                                  <>
                                    <div className="followPopup-btnIcon">+</div>
                                    Follow
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </InfiniteScroll>
          )
        ) : (
          <div className="flex justify-center items-center flex-col h-[300px] overflow-y-auto">
            <Image src={Images.HeartOff} alt="" className="h-[120px] w-[120px]" />
            <p className="text-13">Required Data is Not Available</p>
          </div>
        )
      }
      <Footer />
      {/* popup for post video */}
      {/* {videoPostStatus !== "" && (
                    <PostVideoPopup onClose={() => setVideoPostStatus("")} />
               )} */}
    </div>
  );
};

export default SearchUsers;
