import React from 'react'
import axios from 'axios'
import { toast } from "react-toastify";
import CustomButton from '@/components/Button/CustomButton'

function ToBeReview({ ToBeReviewedData, router, getAllToBeReviewLogs, getAllReviewedLogs }: any) {

     const handleAcceptLog = async (logId: number) => {
          try {
               const payload = {
                    "logId": logId,
                    "action": "accept",
               }
               const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/journies/logs/review/action`,
                    payload,
                    {
                         headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                         },
                    }
               )
               if (res?.status === 200) {
                    toast.success(res?.data?.message);
                    getAllToBeReviewLogs()
                    getAllReviewedLogs()
               }
          } catch (error) {
               console.log(error)
          }
     }

     return (
          <div className="w-full">
               {ToBeReviewedData.length > 0 ?
                    ToBeReviewedData?.map((data: any) => {
                         return (
                              <div key={data?.id} className='border-b border-zinc-600 border-opacity-60 pt-[24px]'>
                                   <p className="text-17-bold pb-[16px]">
                                        {data?.User?.firstName + ' ' + data?.User?.lastName} has submitted a log.
                                   </p>
                                   {data?.stats?.length > 0 &&
                                        <div className={`w-full ${data?.stats && 'rounded-[14px] border border-zinc-600 border-opacity-60'} flex-col justify-start items-start flex`}>
                                             {data?.stats?.map((item: any, index: number) => {
                                                  return (
                                                       <div className={`w-full px-2 py-1.5 
                                                       ${index % 2 === 0 && 'bg-zinc-500 bg-opacity-25'} 
                                                       ${(index === data?.stats?.length - 1) && 'rounded-b-[14px]'} 
                                                       ${(index === 0) && 'rounded-t-[14px]'} border border-zinc-600 border-opacity-60 
                                                       justify-between items-start inline-flex text-16`}>
                                                            <div className="">{item?.stat?.name}</div>
                                                            <div className="text-white">{item?.counter}</div>
                                                       </div>
                                                  )
                                             })}
                                        </div>
                                   }
                                   <div className='w-full flex gap-[8px] pb-[24px] pt-[16px]'>
                                        <div className="w-[50%]">
                                             <CustomButton title='Accept' onClick={() => handleAcceptLog(data?.id)} />
                                        </div>
                                        <div className="w-[50%]">
                                             <CustomButton title='Reject' redButton={true} onClick={() => router.push(`/journey/review-feedback?action=true&logId=${data?.id}`)} />
                                        </div>
                                   </div>
                              </div>
                         )
                    })
                    :
                    <div className="text-violet-100 text-opacity-60 font-sans text-subheadline font-regular font-feature-case text-15 leading-20 tracking-tight flex items-center justify-center w-full h-[100px]">
                         No data
                    </div>
               }
          </div>
     )
}

export default ToBeReview