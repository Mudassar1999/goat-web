import React from "react";

const StatCard = ({ statData }: any) => {

  return (
    <div className="user-details-card w-full">
      <div className="flex flex-col justify-between">
        <div className="user-details-left mt-0 font-sans  rounded-[14px] p-2">
          {statData.length > 0 &&
            <div
              className={`w-full ${statData &&
                "rounded-[14px] border border-zinc-600 border-opacity-60"
                } flex-col justify-start items-start flex mt-[16px]`}
            >
              {statData.map((data: any, index: number) => {
                return (
                  <div
                    className={`w-full px-[8px] py-[6px] ${index % 2 === 0 && "bg-zinc-500 bg-opacity-25"
                      }
                            ${index === statData.length - 1 && "rounded-b-[14px]"
                      } 
                            ${index === 0 && "rounded-t-[14px]"
                      } border border-zinc-600 border-opacity-60 
                            justify-between items-start inline-flex text-[16px] font-normal font-sans leading-[21px]tracking-[-0.32px]`}
                  >
                    <div className="text-black">
                      {data.stat.name}
                    </div>
                    <div className="text-black">
                      {data.counter}
                    </div>
                  </div>
                );
              })}
            </div>
          }

        </div>
      </div>
    </div>
  )
}

export default StatCard