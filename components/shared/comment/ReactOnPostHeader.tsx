import React from "react";
import { Images } from "@/public/Images";
import Image from "next/image";

const ReactOnPostHeader = ({ setOpenReactOnPost }: any) => {
  return (
    <div className="flex p-[24px] gap-[20px] items-center justify-center">
      {/* <div className="min-w-[36px] min-h-[36px]" onClick={() => setOpenReactOnPost(false)}>
                    Back Icon
                    
               </div> */}
      <div
        className="absolute top-[20px] left-[20px] cursor-pointer"
        onClick={() => setOpenReactOnPost(false)}
      >
        <Image src={Images.BackArrow} alt="" className="back" />
      </div>
      <div className="text-13 font-weight-600 color-white text-center">
        People who reacted
      </div>
    </div>
  );
};

export default ReactOnPostHeader;
