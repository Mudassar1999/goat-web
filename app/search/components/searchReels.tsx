import { useEffect, useState } from "react";
import Loading from "react-loading";
import { useRouter } from "next/navigation";
import ReactPlayer from "react-player";
import { IoPlayOutline } from "react-icons/io5";
import InfiniteScroll from "react-infinite-scroll-component";
import { Images } from "@/public/Images";
import Image from "next/image";
import { getSearchPosts } from "@/api/search/search";
import { useSearch } from "@/providers/SearchProvider";
import "./search.scss";
import { useSearchTab } from "@/providers/SearchTabProvider";

const SearchReels = () => {
  const [paginatedReels, setPaginatedReels] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { reelsSearch, setReelsSearch, searchValue, searchLoading } = useSearch();
  const [isPlaying, setIsPlaying] = useState<any>(null);

  const router = useRouter();
  const { searchTab } = useSearchTab();

  const fetchNextPage = async (currentPage: any) => {
    if (searchValue !== "") {
      setLoading(true);
      try {
        let pageType = searchTab === "users" ? "usersPage" : "reelsPage";
        const searchResults = await getSearchPosts(
          currentPage,
          searchValue,
          pageType
        );

        if (searchResults) {
          console.log(reelsSearch, "reelsSearch");
          setReelsSearch((prevState: any) => ({
            ...prevState,
            results: [
              ...prevState.results,
              ...searchResults?.reelsPagination?.results,
            ], // Concatenating new results with existing ones
            page: searchResults.reelsPagination.page, // Update current page
            totalPages: searchResults.reelsPagination.totalPages, // Update total pages
          }));
        }

        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching next page:", error);
      }
    }
  };

  useEffect(() => {
    if (!loading && reelsSearch?.results) {
      setPaginatedReels((prev: any) => ({
        ...prev,
        results: reelsSearch.results, // Assuming setPaginatedUser updates results
      }));
    }
  }, [reelsSearch?.results]);

  return (
    <div className="post-otr-search">
      {
        searchLoading ?
          <Loading type="spokes" color="#747474" className="search-loader" /> :
          paginatedReels?.results?.length ? (
            reelsSearch &&
            searchValue && (
              <div
                className={`flex-wrap post-inr ${(paginatedReels?.results).length > 0 ? "" : "flex justify-center"
                  }`}
              >
                <InfiniteScroll
                  dataLength={paginatedReels?.results?.length}
                  next={() => fetchNextPage(reelsSearch?.page + 1)}
                  hasMore={reelsSearch?.page < reelsSearch?.totalPages}
                  scrollThreshold="200px"
                  className="flex flex-wrap gap-[2px] pt-[8px]"
                  loader={
                    <Loading type="spokes" color="#747474" className="mx-auto" />
                  }
                >
                  {paginatedReels?.results?.map((item: any) => {
                    return (
                      <div className="individual-post relative" key={item.id}>
                        <div
                          onMouseEnter={() => setIsPlaying(item.id)}
                          onMouseLeave={() => setIsPlaying(null)}
                          onClick={() =>
                            router.push(`/profile/posts?id=${item?.id}&user=${item?.createdById}`)
                          }
                          className="h-[100%] pata-nahi"
                        >
                          <ReactPlayer
                            className="posts-reel"
                            url={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item?.reelPath}`}
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
                    );
                  })}
                </InfiniteScroll>
              </div>
            )
          ) : (
            <div className="flex justify-center items-center flex-col h-[300px] overflow-y-auto">
              <Image src={Images.HeartOff} alt="" className="h-[120px] w-[120px]" />
              <p className="text-13">Required Data is Not Available</p>
            </div>
          )
      }
    </div>
  );
};

export default SearchReels;
