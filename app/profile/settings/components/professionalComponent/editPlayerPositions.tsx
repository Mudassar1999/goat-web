import React, { useState, useEffect } from "react";
import useApiRequest from "@/custom_hooks/useGetApiRequest";
import SelectInput from "@/components/ui/selectInput";
import { toast } from "react-toastify";
import { UpdateProfessionalDetail } from "@/api/profile/updateProfessionalDetail";
import "./professional.scss"
import CustomButtton17 from "@/components/Button/CustomButtton17";

const EditPlayerPositions = ({ userProfile, fetchProfile, editTitle, setEditProfessionalInfoPop }: any) => {
     const {
          responseData,
          loading,
          fetchData: fetchPlayerPositionsData,
     } = useApiRequest();
     const [playerPositionsData, setPlayerPositionsData] = useState<any>([]);
     const [checkValidation, setCheckValidation] = useState(false);

     useEffect(() => {
          fetchPlayerPositionsData(
               `playerPositions/bySportId/${userProfile?.sportsData[0]?.sportId}`,
               null
          );
          const idsMap = new Map<number, string>();

          const updatedData = userProfile?.sportsData[0]?.playingPositions.map((item: any) => {
               const { id, name } = item.PlayerPosition;
               idsMap.set(id, name);
               return { id, name };
          });

          setPlayerPositionsData(updatedData);
     }, []);

     const Continue = async () => {
          setCheckValidation(true);
          const payload = {
               playerPositionId: playerPositionsData.map((item: any) => item.id)
          }
          await UpdateProfessionalDetail(payload, fetchProfile);
          setEditProfessionalInfoPop(false)
     };

     const selectPlayerPositionHandler = (data: any) => {
          if (playerPositionsData?.some((position: any) => position.id === data?.positionId)) {
               const updatedPlayerPositions = playerPositionsData.filter((position: any) => position.id !== data?.positionId);
               setPlayerPositionsData(updatedPlayerPositions);
          } else {
               if (playerPositionsData.length >= 3) {
                    toast.warning("Cannot select more than 3 positions");
                    return;
               }
               const newPosition = {
                    name: data?.name,
                    id: data?.id
               }
               setPlayerPositionsData((prev: any) => [...prev, newPosition]);
          }
     };

     return (
          <div >
               <h3 className="heading-bold">What position do you play?</h3>
               <p className="desc pt-[5px] pb-[32px]">
                    You may select up to 3 positions.
               </p>
               {userProfile?.sportsData[0]?.sportId === 1 ? (
                    <div className="football-ground relative edit-ground">
                         {responseData.map((item: any) => (
                              <button
                                   key={item.id}
                                   className={`player-button rounded-full p-1 ${playerPositionsData?.some((position: any) => position.id === item.id) ? "!bg-[#9FE870]" : ""
                                        }`}
                                   onClick={() => selectPlayerPositionHandler(item)}
                              >
                                   {item.id !== 4 && item.id !== 6 && item.id !== 8 && item.id !== 9
                                        ? item.name.charAt(0) + item.name.charAt(1)
                                        : item.name.charAt(0) + item.name.charAt(2)}
                              </button>
                         ))}
                    </div>
               ) : userProfile?.sportsData[0]?.sportId === 2 ? (
                    <div className="basketball-ground relative mb-6 h-[26rem]">
                         {responseData.map((item: any) => (
                              <button
                                   className={`player-button rounded-full p-1 ${playerPositionsData?.some((position: any) => position.id === item.id) ? "!bg-[#9FE870]" : ""
                                        }`}
                                   onClick={() => selectPlayerPositionHandler(item.id)}
                              >
                                   {item.name}
                              </button>
                         ))}
                    </div>
               ) : userProfile?.sportsData[0]?.sportId === 3 ? (
                    <div className="handball-ground relative mb-6 h-[26rem]">
                         {responseData.map((item: any) => (
                              <button
                                   className={`player-button rounded-full p-1 ${playerPositionsData?.some((position: any) => position.id === item.id) ? "!bg-[#9FE870]" : ""
                                        }`}
                                   onClick={() => selectPlayerPositionHandler(item.id)}
                              >
                                   {item.name}
                              </button>
                         ))}
                    </div>
               ) : userProfile?.sportsData[0]?.sportId === 4 ? (
                    <div className="">
                         {responseData.map((item: any) => (
                              <SelectInput
                                   key={item.id}
                                   label={item.name}
                                   type="checkbox"
                                   onChange={() => selectPlayerPositionHandler(item.id)}
                              />
                         ))}
                    </div>
               ) : (
                    ""
               )}
               {checkValidation &&
                    playerPositionsData.sportsData &&
                    playerPositionsData.sportsData[0]?.playerPositionId?.length < 1 && (
                         <p className="mb-2 alret-text text-[#FF453A]">
                              Please Select at least 1 player position
                         </p>
                    )}
               <CustomButtton17
                    onClick={Continue}
                    title={"Update"}
                    className={"cursor-pointer mt-2"
                    }
               />
          </div>
     );
};

export { EditPlayerPositions };
