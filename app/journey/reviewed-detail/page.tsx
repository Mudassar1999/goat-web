"use client";
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeftIcon } from 'lucide-react'
import axios from 'axios'
import "../../auth/signup/components/AllComponent.scss"
import { getFirstCharCap } from '@/utils/getFirstCharCap';

function ReviewedLogDetail() {
  const [individualLog, setIndividualLog] = useState<any>([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const id: any = searchParams.get("id");

  const getAllReviewedLogs = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/journies/logs/reviewed`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      const individualLog = response?.data?.find(
        (item: any) => item.id === parseInt(id)
      );
      setIndividualLog(individualLog);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllReviewedLogs();
  }, []);
  
  return (
    <>
      <div className="w-full lg:w-[80%] m-auto px-[32px] pt-[24px]">
        <div className="p-2 rounded-full w-10 bg-zinc-500 bg-opacity-20 rounded">
          <ArrowLeftIcon
            className="cursor-pointer hover:font-bold"
            onClick={() => router.back()}
          />
        </div>

        {individualLog && (
          <div className="w-full pt-[24px]">
            <span className="heading-bold-22">
              Details of log are given below.
            </span>
            <p className="text-[#ebebf599] text-[12px] 
        font-normal font-sans leading-[16px]">
              The name of player who has send the Log is{" "}
              {individualLog?.User?.firstName +
                " " +
                individualLog?.User?.lastName}
              .
            </p>
            {individualLog?.status && <div className="flex gap-2 justify-end text-16">
              <p>
                Log Status:
              </p>
              <span className="text-white">{getFirstCharCap(individualLog?.status)}</span>
            </div>}

            {individualLog?.stats?.length > 0 ? (
              <div
                className={`w-full ${individualLog?.stats &&
                  "rounded-[14px] border border-zinc-600 border-opacity-60"
                  } flex-col justify-start items-start flex mt-3`}
              >
                {individualLog?.stats?.map((data: any, index: number) => {
                  return (
                    <div
                      className={`w-full px-2 py-1.5 ${index % 2 === 0 && "bg-zinc-500 bg-opacity-25"
                        }
                   ${index === individualLog?.stats?.length - 1 &&
                        "rounded-b-[14px]"
                        } 
                   ${index === 0 && "rounded-t-[14px]"
                        } border border-zinc-600 border-opacity-60 
                   justify-between items-start inline-flex text-16`}
                    >
                      <div>
                        {data?.stat?.name}
                      </div>
                      <div className="text-white">
                        {data?.counter}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-violet-100 text-opacity-60 font-sans text-subheadline font-regular font-feature-case text-15 leading-20 tracking-tight flex items-center justify-center w-full h-[100px]">
                Stats for this log is not exist.
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default ReviewedLogDetail;
