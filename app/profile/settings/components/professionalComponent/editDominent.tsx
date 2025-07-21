import { useState, useEffect } from "react";
import axios from "axios";
import { ReactSVG } from "react-svg";
import Image from "next/image";
import "../../../../auth/signup/components/AllComponent.scss";
import DominentRadioInput from "@/components/ui/dominentRadioInput";
import { UpdateProfessionalDetail } from "@/api/profile/updateProfessionalDetail";
import CustomButtton17 from "@/components/Button/CustomButtton17";

const EditDominant = ({ userProfile, fetchProfile, editTitle, setEditProfessionalInfoPop }: any) => {
     const [dominentId, setDominentId] = useState<any>("");
     const [playerDominancesData, setPlayerDominancesData] = useState<any>([]);
     const [checkValidation, setCheckValidation] = useState(false);

     useEffect(() => {
          fetchPlayerplayerDominancesData();
          setDominentId(userProfile?.sportsData[0]?.dominantFootId)
     }, []);

     const fetchPlayerplayerDominancesData = async () => {
          try {
               const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/playerDominances/bySportId/${userProfile?.sportsData[0]?.sportId}`,
                    {
                         headers: {
                              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                         },
                    }
               );
               setPlayerDominancesData(response.data);
          } catch (error) {
               console.error(error);
          }
     };

     const handleSubmit = async () => {
          try {
               const payload = {
                    dominantFootId: dominentId
               }
               await UpdateProfessionalDetail(payload, fetchProfile);
               setEditProfessionalInfoPop(false)
               // Handle success
          } catch (error) {
               console.error(error);
               // Handle error
          }
     };

     const Continue = () => {
          setCheckValidation(true);
          if (dominentId) {
               handleSubmit();
          }
     };

     const selectRoleHandler = (dominanceId: number) => {
          setDominentId(dominanceId)
     };

     return (
          <div >
               <h3 className="heading-bold">
                    Select your dominant{" "}
                    {userProfile?.sportsData[0]?.sportId === 1 ? "foot" : "arm"}.
               </h3>
               <p className="desc pt-[5px] pb-[32px]">You can change this later.</p>
               <div className="">
                    {playerDominancesData.map((item: any) => (
                         <div className="forfootBorderOtr cursor-pointer">
                              <div className="flex items-center gap-[16px] py-[24px] px-[16px] forfootBorder">
                                   {item?.image &&
                                        (item?.image?.endsWith(".svg") ? (
                                             <ReactSVG
                                                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item?.image}`}
                                             />
                                        ) : (
                                             <Image
                                                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item?.image}`}
                                                  alt=""
                                                  className=""
                                                  width={36}
                                                  height={36}
                                             />
                                        ))}
                                   <DominentRadioInput
                                        key={item.id}
                                        image={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.image}`}
                                        label={item.name}
                                        value={item.id}
                                        checked={dominentId === item.id}
                                        onChange={() => selectRoleHandler(item.id)}
                                   />
                              </div>
                         </div>
                    ))}
               </div>
               {checkValidation && !dominentId && (
                    <p className="mb-2 alret-text text-[#FF453A]">Please Select 1 option</p>
               )}
               <CustomButtton17
                    onClick={Continue}
                    title={"Done"}
                    className={"cursor-pointer mt-2"
                    }
               />
          </div>
     );
};
export { EditDominant };
