import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "react-loading";
import { getLikesOnPost } from "@/api/post/getLikesOnPost";
import "../../app/auth/signup/components/AllComponent.scss";
import "./Comment.scss";
import "../../app/journey/components/ForPopUp.scss"

function ReactOnPost({ post }: any) {
     const [likesOnPostData, setLikesOnPostData] = useState<any>({})
     const [paginatedLikesPost, setPaginatedLikesPost] = useState<any>([])

     const likesOnPost = async (page: number) => {
          const likesData = await getLikesOnPost(post?.id, page)
          setLikesOnPostData(likesData)
          const newData = likesData?.results
          setPaginatedLikesPost((prevData: any) => [...prevData, ...newData])
     }

     useEffect(() => {
          likesOnPost(1)
     }, [])

     return (
          <div className="comments-section">
               {likesOnPostData?.results &&
                    <div
                         className="overflow-y-auto scroll-remover px-[16px] flex-grow mb-5 commentsArea"
                         id="scrollableDiv"
                    >
                         <InfiniteScroll
                              dataLength={paginatedLikesPost?.length}
                              next={() => likesOnPost(likesOnPostData?.page + 1)}
                              hasMore={
                                   likesOnPostData?.page < likesOnPostData?.totalPages
                              }
                              scrollableTarget="scrollableDiv"
                              loader={
                                   <Loading type="spokes" color="#747474" className="mx-auto" />
                              }
                         >
                              <ul className="commentInfo-ul">
                                   {paginatedLikesPost.map((item: any) => (
                                        <li className="commentInfo-li">
                                             <div className="commentInfo-userImg-otr">
                                                  <img
                                                       className="commentInfo-userImg"
                                                       src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item?.user?.profileImage}`}
                                                       alt="img"
                                                  />
                                             </div>
                                             <p className="commentInfo-userName">{item?.user?.firstName}</p>
                                        </li>
                                   ))
                                   }
                              </ul>
                         </InfiniteScroll>
                    </div>
               }
          </div>
     );
}
export default ReactOnPost;
