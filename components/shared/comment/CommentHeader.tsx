import React from "react"

const CommentHeader = ({ post }: any) => {
     return (
          <div className="flex p-[24px] gap-[20px]">
               <div className="min-w-[36px] min-h-[36px]">
                    <img
                         className="h-[36px] w-[36px] rounded-[36px] border-[2px] border-white"
                         src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${post?.createdBy?.profileImage}`}
                         alt="avatar"
                    />
               </div>
               <div className="">
                    <div className="pb-[4px]">
                         <span className="text-17">
                              {post?.createdBy?.firstName}
                         </span>
                    </div>

                    <div>
                         <p className="text-16 commentDesc">
                              <span className="text-white">{post?.content}</span>
                         </p>
                         {/* <h4 className="text-16">
                        {" "}
                        <span className="text-white font-semibold">
                          #dribbling #soccer
                        </span>
                      </h4> */}
                    </div>
               </div>
          </div>
     )
}

export default CommentHeader