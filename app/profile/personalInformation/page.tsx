'use client'
import Header from '@/components/Header'
import React, { useState, useEffect } from 'react'
import '../../auth/signup/components/AllComponent.scss'
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDate } from '@/utils/formatDate';
import { RoleName } from '@/utils/roleName';


const PersonalInformation = () => {
     const [userInfo, setUserInfo] = useState<any>("");

     const router = useRouter();

     useEffect(() => {
          let userData: any = localStorage.getItem("user_info");
          userData = userData ? JSON.parse(userData) : null;
          setUserInfo(userData);
     }, []);

     return (
          <>
               <Header />
               <div className='journeyContainer'>
                    <div className="p-2 rounded-full w-10 bg-[#7878805c] rounded">
                         <ArrowLeftIcon
                              className="cursor-pointer hover:font-bold"
                              onClick={() => router.back()}
                         />
                    </div>

                    <div className="flex justify-between items-center py-[24px]">
                         <span className="heading-bold-22">
                              Profile
                         </span>
                    </div>

                    {userInfo ? <div
                         className={`w-full rounded-[14px] border border-zinc-600 border-opacity-60 flex-col justify-start items-start flex`}
                    >
                         <div
                              className={`w-full px-2 py-1.5 border border-zinc-600 border-opacity-60 rounded-t-[14px] 
                                        justify-between items-start inline-flex text-16`}
                         >
                              <div className="text-[#ebebf599]">
                                   First Name
                              </div>
                              <div className="text-white">
                                   {userInfo.firstName}
                              </div>
                         </div>
                         <div
                              className={`w-full px-2 py-1.5 border border-zinc-600 border-opacity-60 
                                        justify-between items-start inline-flex text-16`}
                         >
                              <div className="text-[#ebebf599]">
                                   Last Name
                              </div>
                              <div className="text-white">
                                   {userInfo.lastName}
                              </div>
                         </div>
                         <div
                              className={`w-full px-2 py-1.5 border border-zinc-600 border-opacity-60  
                                        justify-between items-start inline-flex text-16`}
                         >
                              <div className="text-[#ebebf599]">
                                   Date of birth
                              </div>
                              <div className="text-white">
                                   {formatDate(userInfo.dateOfBirth)}
                              </div>
                         </div>
                         <div
                              className={`w-full px-2 py-1.5 border border-zinc-600 border-opacity-60 rounded-b-[14px]
                                        justify-between items-start inline-flex text-16`}
                         >
                              <div className="text-[#ebebf599]">
                                   Your Role
                              </div>
                              <div className="text-white">
                                   {RoleName(userInfo.roleId)}
                              </div>
                         </div>
                    </div> :
                         <div className="desc flex items-center justify-center w-full h-[100px]">
                              No Profile found.
                         </div>
                    }
               </div>
          </>
     )
}

export default PersonalInformation