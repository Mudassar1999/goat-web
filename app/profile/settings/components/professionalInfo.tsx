"use client"
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import ForwordIcon from "@/assests/svg/forwordIcon";
import { useState, useEffect } from "react";
import "../settings.scss"
import "../../../auth/signup/components/AllComponent.scss"
import Popup from "@/components/shared/Popup";
import EditProfessionalInfo from "./professionalComponent/edit-professional-information";
import { getUserProfile } from "@/api/profile/getUserProfile";
import ProfileInfoSkeleton from "./skeltons/profileInfoSkelton";

const ProfessionalInfo = () => {
     const [isEditProfessionalInfoPop, setEditProfessionalInfoPop] = useState<boolean>(false)
     const [editTitle, setEditTitle] = useState("")
     const [loading, setLoading] = useState<boolean>(false)
     const [userProfile, setUserProfile] = useState<any>("")

     const router = useRouter();

     const goBack = () => {
          router.back();
     };

     const PersonaInfoData = [
          {
               "title": "Club",
               "subTitle": userProfile && ((userProfile?.user?.roleId === 2) ?
                    userProfile?.sportsData[0]?.coachingClub?.name :
                    userProfile?.sportsData[0]?.playingClub?.name),
          },
          {
               "title": "Club's team",
               "subTitle": userProfile && ((userProfile?.user?.roleId === 2) ?
                    userProfile?.sportsData[0]?.coachingClubTeam?.name :
                    userProfile?.sportsData[0]?.playingClubTeam?.name)
          },
          {
               "title": "Dominance",
               "subTitle": userProfile && userProfile?.sportsData[0]?.dominantFoot?.name,
          },
     ];

     const PersonaInfoScount = [
          {
               "title": "Countries",
               "subTitle": userProfile && userProfile?.sportsData[0]?.countries.map((country: any) => country.Country.name).join(", ")
          },
          {
               "title": "Leagues",
               "subTitle": userProfile && userProfile?.sportsData[0]?.leagues.map((league: any) => league.League.name).join(", ")
          },
     ];

     if (userProfile?.user?.roleId !== 2) {
          const positionEntry = ({
               "title": "Position",
               "subTitle": userProfile && userProfile?.sportsData[0]?.playingPositions.map((position: any) => position.PlayerPosition.name).join(", ")
          });
          PersonaInfoData.splice(2, 0, positionEntry);
     }

     const handleEdit = (title: string) => {
          setEditTitle(title)
          setEditProfessionalInfoPop(true)
     }

     const fetchProfile = async () => {
          const profileData = await getUserProfile({ setLoading })
          setUserProfile(profileData)
     }

     useEffect(() => {
          fetchProfile()
     }, [])

     const PersonalMapingData = userProfile?.user?.roleId === 3 ? PersonaInfoScount : PersonaInfoData

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
                                   <span className="heading-bold">Professional Details</span>
                              </div>

                              {userProfile &&
                                   <p className="text-13 color-dark-gray">{userProfile?.sportsData[0]?.sport?.name}</p>
                              }

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

                         {isEditProfessionalInfoPop &&
                              <Popup onClose={() => setEditProfessionalInfoPop(false)}>
                                   <EditProfessionalInfo
                                        editTitle={editTitle}
                                        fetchProfile={fetchProfile}
                                        userProfile={userProfile}
                                        setEditProfessionalInfoPop={setEditProfessionalInfoPop}
                                   />
                              </Popup>
                         }
                    </div>
               }
          </>
     )
}

export default ProfessionalInfo