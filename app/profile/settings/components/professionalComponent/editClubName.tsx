import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { FaSearch } from "react-icons/fa";
import Image from "next/image";
import RadioInput from "@/components/ui/radioInput";
import useApiRequest from "@/custom_hooks/useGetApiRequest";
import Loading from "react-loading";
import "../../../../auth/signup/components/AllComponent.scss";
import { UpdateProfessionalDetail } from "@/api/profile/updateProfessionalDetail";
import CustomButtton17 from "@/components/Button/CustomButtton17";
import "./professional.scss"

interface responseType {
     id: number;
     name: string;
     image: string;
     createdAt: string;
     updatedAt: string;
}

const EditClubName = ({ userProfile, fetchProfile, editTitle, setEditProfessionalInfoPop }: any) => {
     const { responseData, loading, setLoading, fetchData } = useApiRequest();
     const [clubTeams, setClubTeams] = useState(false);
     const [checkValidation, setCheckValidation] = useState({
          club: false,
          team: false,
     });
     const [editClub, setEditClub] = useState<any>({})
     const [searchQuery, setSearchQuery] = useState("");

     const inputRef = useRef<any>(null);

     const playing_club_id =
          userProfile?.user?.roleId === 1
               ? (editClub?.playingClubId ?? userProfile?.sportsData[0].playingClubId)
               : (editClub?.coachingClubId ?? userProfile?.sportsData[0].coachingClubId);

     useEffect(() => {
          if (userProfile) {
               fetchPlayingClubs(userProfile?.sportsData[0]?.sportId);
               userProfile?.user?.roleId === 1 ?
                    setEditClub({
                         playingClubId: userProfile?.sportsData[0]?.playingClubId,
                         playingClubTeamId: userProfile?.sportsData[0]?.playingClubTeamId
                    }) :
                    setEditClub({
                         coachingClubId: userProfile?.sportsData[0]?.coachingClubId,
                         coachingClubTeamId: userProfile?.sportsData[0]?.coachingClubTeamId
                    })
          }
          if (editTitle === "Club's team") {
               setClubTeams(true);
               fetchPlayingClubsTeamData(playing_club_id)
          }
     }, []);

     const fetchPlayingClubs = async (sportId: number) => {
          try {
               await fetchData(`clubs/bySportId/${sportId}`, null);
          } catch (error) {
               console.error(error);
          }
     };

     const fetchPlayingClubsTeamData = (clubId: number) => {
          setCheckValidation({ ...checkValidation, club: true });
          if (
               userProfile &&
               (userProfile?.user?.roleId === 1
                    ? (userProfile?.sportsData[0]?.playingClubId !== null || editClub?.playingClubId !== null)
                    : (userProfile?.sportsData[0]?.coachingClubId !== null || editClub?.coachingClubId !== null))
          ) {
               setClubTeams(true);
               setLoading(true);
               fetchData(`clubTeams/byClubId/${clubId}`, null);
          }
     };

     const handleSubmit = async () => {
          try {
               const data = await UpdateProfessionalDetail(editClub, fetchProfile);
               setEditProfessionalInfoPop(false)
               // Handle success
          } catch (error) {
               console.error(error);
               // Handle error
          }
     };

     const Continue = () => {
          setCheckValidation({ ...checkValidation, team: true });
          if (
               userProfile &&
               (userProfile?.user?.roleId === 1
                    ? (userProfile?.sportsData[0]?.playingClubTeamId !== null || editClub?.playingClubTeamId !== null)
                    : (userProfile?.sportsData[0]?.coachingClubTeamId !== null || editClub?.coachingClubTeamId !== null))
          ) {
               handleSubmit();
          }
     };


     const selectPlayingClubsHandler = (clubId: number) => {
          userProfile?.user?.roleId === 1 ?
               setEditClub((sport: any) => ({
                    ...sport,
                    playingClubId: clubId,
               })) :
               setEditClub((sport: any) => ({
                    ...sport,
                    coachingClubId: clubId,
               }))
     };

     const selectPlayingClubsTeamHandler = (clubTeamId: number) => {
          userProfile?.user?.roleId === 1
               ?
               setEditClub((sport: any) => ({
                    ...sport,
                    playingClubTeamId: clubTeamId,
               }))
               :
               setEditClub((sport: any) => ({
                    ...sport,
                    coachingClubTeamId: clubTeamId,
               }))
     };

     const handleSearch = (e: any) => {
          setSearchQuery(e.target.value);
     };

     const filteredData = responseData?.filter((item: any) =>
          item?.name?.toLowerCase().includes(searchQuery?.toLowerCase())
     );

     const filteredTeams = responseData?.filter((item: any) =>
          item?.name?.toLowerCase().includes(searchQuery?.toLowerCase())
     );

     return (
          <div>
               {!clubTeams ? (
                    <h3 className="heading-bold heading-club">What’s the club’s name?</h3>
               ) : (
                    <h3 className="heading-bold heading-club">What’s your club’s team?</h3>
               )}
               <div className="relative mt-[8px]">
                    <FaSearch className="absolute search-icon" />
                    <Input
                         ref={inputRef}
                         type="search"
                         className="search-input"
                         placeholder="Search"
                         onChange={handleSearch}
                    />
               </div>
               {loading ? (
                    <div className="flex items-center justify-center">
                         <Loading type="spin" color="#747474" />
                    </div>
               ) : (
                    <>
                         {!clubTeams ? (
                              <>
                                   {searchQuery === "" ? (
                                        <>
                                             <div className="images-main edit-club-images">
                                                  {responseData?.map((item: responseType) => (
                                                       <div className="" key={item.id}>
                                                            <div className={``}>
                                                                 <div
                                                                      className={`api-img-otr  ${(userProfile?.user?.roleId === 1
                                                                           ? editClub?.playingClubId
                                                                           : editClub?.coachingClubId) ===
                                                                           item.id
                                                                           ? " border-4 border-[#9FE870]"
                                                                           : ""
                                                                           }`}
                                                                 >
                                                                      <Image
                                                                           src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item?.image}`}
                                                                           alt=""
                                                                           width={47}
                                                                           height={47}
                                                                           className="img"
                                                                           onClick={() => selectPlayingClubsHandler(item.id)}
                                                                      />
                                                                 </div>
                                                            </div>
                                                       </div>
                                                  ))}
                                             </div>
                                             {checkValidation.club &&
                                                  userProfile &&
                                                  (userProfile?.user?.roleId === 1
                                                       ? editClub.playingClubId === null
                                                       : editClub.coachingClubId === null) && (
                                                       <p className="mb-2 alret-text text-[#FF453A]">
                                                            Please select 1 club
                                                       </p>
                                                  )}
                                             {/* <AuthButton
                                                  onClick={() => fetchPlayingClubsTeamData(playing_club_id)}
                                             /> */}
                                             <CustomButtton17
                                                  onClick={() => fetchPlayingClubsTeamData(playing_club_id)}
                                                  // isLoading={isLoading}
                                                  title={"Next"}
                                                  className={"cursor-pointer mt-2"
                                                  }
                                             />
                                        </>
                                   ) : (
                                        <>
                                             <div className="clubName-name">
                                                  {filteredData.map((item: responseType) => (
                                                       <div key={item.id}>
                                                            <div className="forchildborder cursor-pointer">
                                                                 <RadioInput
                                                                      label={item.name}
                                                                      value={item.id}
                                                                      checked={
                                                                           (userProfile?.user?.roleId === 1
                                                                                ? editClub?.playingClubId
                                                                                : editClub?.coachingClubId) ===
                                                                           item.id
                                                                      }
                                                                      onChange={() => selectPlayingClubsHandler(item.id)}
                                                                 />
                                                            </div>
                                                       </div>
                                                  ))}
                                             </div>
                                             {checkValidation.club &&
                                                  userProfile &&
                                                  (userProfile?.user?.roleId === 1
                                                       ? editClub.playingClubId === null
                                                       : editClub.coachingClubId === null) && (
                                                       <p className="mb-2 alret-text text-[#FF453A]">
                                                            Please select 1 club
                                                       </p>
                                                  )}
                                             <CustomButtton17
                                                  onClick={() => {
                                                       setSearchQuery("");
                                                       inputRef.current.value = "";
                                                       fetchPlayingClubsTeamData(playing_club_id);
                                                  }}
                                                  title={"Next"}
                                                  className={"cursor-pointer mt-2"
                                                  }
                                             />
                                        </>
                                   )}
                              </>
                         ) : (
                              <>
                                   <div className="club2">
                                        {filteredTeams.map((item: responseType) => (
                                             <div key={item.id}>
                                                  <div className="forchildborder cursor-pointer">
                                                       <RadioInput
                                                            label={item.name}
                                                            value={item.id}
                                                            checked={
                                                                 (userProfile?.user?.roleId === 1
                                                                      ? editClub?.playingClubTeamId
                                                                      : editClub?.coachingClubTeamId) ===
                                                                 item.id
                                                            }
                                                            onChange={() => selectPlayingClubsTeamHandler(item.id)}
                                                       />
                                                  </div>
                                             </div>
                                        ))}
                                   </div>
                              </>
                         )}
                    </>
               )}
               {checkValidation.team &&
                    editClub &&
                    (userProfile?.user?.roleId === 1
                         ? editClub.playingClubTeamId === null
                         : editClub.coachingClubTeamId === null) && (
                         <p className="mb-2 alret-text text-[#FF453A]">Please select 1 team</p>
                    )}
               {clubTeams &&
                    <CustomButtton17
                         onClick={Continue}
                         title={"Update"}
                         className={"cursor-pointer mt-2"
                         }
                    />
               }
          </div>
     );
};

export { EditClubName };
