"use client"
import React, { useState, useEffect } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import "../settings.scss"
import "../../../auth/signup/components/AllComponent.scss"
import ForwordIcon from "@/assests/svg/forwordIcon";
import { getUserProfile } from "@/api/profile/getUserProfile";
import ProfileInfoSkeleton from "./skeltons/profileInfoSkelton";
import EditInformationPopup from "@/components/shared/EditInformationPopup";
import EditPrivacy from "./privacyComponent/editPrivacy";



const PrivacyInfo = () => {
     const [isEditProfessionalInfoPop, setEditPrivacyPop] = useState<boolean>(false)
     const [editTitle, setEditTitle] = useState("")
     const [loading, setLoading] = useState<boolean>(false)
     const [userProfile, setUserProfile] = useState<any>("")

     const router = useRouter();

     const goBack = () => {
          router.back();
     };

     const PrivacyInfoData = [
          {
               "title": "Scouted Badge",
               "subTitle": userProfile && ((userProfile?.user?.showScoutedBadge === true) ?
                    "Visible" :
                    "Private"),
          },
          {
               "title": "My Favorites",
               "subTitle": userProfile && userProfile?.user?.favoritesPrivacy,
          },
          {
               "title": "My Followers",
               "subTitle": userProfile && userProfile?.user?.followersPrivacy,
          },
          {
               "title": "My Following",
               "subTitle": userProfile && userProfile?.user?.followingsPrivacy,
          },
     ];

     const handleEdit = (title: string) => {
          setEditTitle(title)
          setEditPrivacyPop(true)
     }

     const fetchProfile = async () => {
          const profileData = await getUserProfile({ setLoading })
          setUserProfile(profileData)
     }

     useEffect(() => {
          fetchProfile()
     }, [])

     const PrivacyMapingData = (userProfile?.user?.roleId !== 1) ?
          PrivacyInfoData.filter((data) => data.title !== "Scouted Badge")
          : PrivacyInfoData

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
                                   <span className="heading-bold">Privacy</span>
                              </div>

                              <p className="text-13 color-dark-gray">Controls</p>

                              <div className="general-container">
                                   {PrivacyMapingData.map((item: any, index: number) => (
                                        <div
                                             className={`card-container ${index !== PrivacyMapingData.length - 1 && "border-below"}`}
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

                         {isEditProfessionalInfoPop &&
                              <EditInformationPopup onClose={() => setEditPrivacyPop(false)}>
                                   <EditPrivacy
                                        editTitle={editTitle}
                                        fetchProfile={fetchProfile}
                                        userProfile={userProfile}
                                        setEditPrivacyPop={setEditPrivacyPop}
                                   />
                              </EditInformationPopup>
                         }
                    </div>
               }
          </>
     )
}

export default PrivacyInfo