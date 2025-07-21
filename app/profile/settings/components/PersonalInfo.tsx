"use client"
import React, { useState, useEffect } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import "../settings.scss"
import "../../../auth/signup/components/AllComponent.scss"
import ForwordIcon from "@/assests/svg/forwordIcon";
import EditInformationPopup from "@/components/shared/EditInformationPopup";
import EditPersonalInfo from "./edit-personal-inofrmation";
import { getUserProfile } from "@/api/profile/getUserProfile";
import ProfileInfoSkeleton from "./skeltons/profileInfoSkelton";

const PersonalInfo = () => {
     const [isEditPersonalInfoPop, setEditPersonalInfoPop] = useState<boolean>(false)
     const [editName, setEditName] = useState("")
     const [loading, setLoading] = useState<boolean>(false)
     const [userProfile, setUserProfile] = useState<any>("")

     const router = useRouter();

     const goBack = () => {
          router.back();
     };

     const formatDate = (dateString: any) => {
          const dateObject = new Date(dateString);
          const day = dateObject.toLocaleString("en-US", { day: "2-digit" });
          const month = dateObject.toLocaleString("en-US", { month: "long" });
          const year = dateObject.toLocaleString("en-US", { year: "numeric" });

          const formattedDate = `${day} ${month} ${year}`;
          return formattedDate;
     };
     
     const PersonaInfoData = [
          {
               "title": "Name",
               "subTitle": userProfile?.user?.firstName + " " + userProfile?.user?.lastName,
          },
          {
               "title": "Username",
               "subTitle": userProfile?.user?.userName,
          },
          {
               "title": "Passport number",
               "subTitle": userProfile?.user?.passportNumber,
          },
          {
               "title": "Scouting license number",
               "subTitle": userProfile?.user?.scoutingLiscenseNumber,
          },
          {
               "title": "Date Of Birth",
               "subTitle": formatDate(userProfile?.user?.dateOfBirth),
          },
          {
               "title": "Sex",
               "subTitle": userProfile?.user?.gender,
          },
          {
               "title": "Height",
               "subTitle": userProfile?.user?.height,
          },
          {
               "title": "Weight",
               "subTitle": userProfile?.user?.weight,
          },
     ]

     const handleEdit = (editName: string) => {
          setEditName(editName)
          setEditPersonalInfoPop(true)
     }

     const fetchProfile = async () => {
          const profileData = await getUserProfile({ setLoading })
          setUserProfile(profileData)
     }

     useEffect(() => {
          fetchProfile()
     }, [])

     const PersonalMapingData = (userProfile?.user?.roleId === 3 || userProfile?.user?.roleId === 2) ? PersonaInfoData.splice(0, 6) :
          (userProfile?.user?.roleId === 4) ? PersonaInfoData.splice(0, 2) : PersonaInfoData

     return (
          <>
               {loading ?
                    <div className="journeyContainer settings-otr">
                         <div className="settings-inner">
                              <ProfileInfoSkeleton />
                         </div>
                    </div>
                    :
                    <div className="journeyContainer settings-otr">
                         <div className="p-2 rounded-full w-10 bg-[#7878805c] ">
                              <ArrowLeftIcon
                                   className="cursor-pointer hover:font-bold"
                                   onClick={goBack}
                              />
                         </div>

                         <div className="settings-inner">
                              <div className="pb-[5px]">
                                   <span className="heading-bold">Personal Information</span>
                              </div>

                              <div className="general-container">
                                   {PersonalMapingData.map((item: any, index: number) => (
                                        <div
                                             className={`card-container ${index !== PersonalMapingData.length - 1 && "border-below"}`}
                                             onClick={() => handleEdit(item?.title)}
                                        >
                                             <div>
                                                  <p className="text-13 color-white">{item?.title}</p>
                                                  <p className="text-13 color-dark-gray">{item?.subTitle}</p>
                                             </div>
                                             <div className=" cursor-pointer">
                                                  <ForwordIcon />
                                             </div>
                                        </div>
                                   ))}
                              </div>
                         </div>

                         {isEditPersonalInfoPop &&
                              <EditInformationPopup onClose={() => setEditPersonalInfoPop(false)}>
                                   <EditPersonalInfo
                                        editName={editName}
                                        userProfile={userProfile}
                                        fetchProfile={fetchProfile}
                                        setEditPersonalInfoPop={setEditPersonalInfoPop}
                                   />
                              </EditInformationPopup>
                         }
                    </div>
               }
          </>
     )
}

export default PersonalInfo