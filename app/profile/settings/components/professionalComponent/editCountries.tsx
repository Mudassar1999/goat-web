import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import CustomButton from "@/components/Button/CustomButton";
import { FaSearch } from "react-icons/fa";
import Image from "next/image";
import useApiRequest from "@/custom_hooks/useGetApiRequest";
import { UpdateProfessionalDetail } from "@/api/profile/updateProfessionalDetail";

const EditCounties = ({ userProfile, fetchProfile, editTitle, setEditProfessionalInfoPop }: any) => {
     const { responseData, loading, fetchData } = useApiRequest();
     const [checkValidation, setCheckValidation] = useState(false);
     const [flagsList, setFlagsList] = useState<any>([]);
     const [searchWord, setSearchWord] = useState('');

     const [countriesData, setCountriesData] = useState<number[]>([]);

     useEffect(() => {
          fetchData("countries", null);

          const extractedData = userProfile?.sportsData[0]?.countries.map((item: any) => ({
               id: item.Country.id,
               name: item.Country.name
          }));

          setCountriesData(extractedData);
     }, []);

     useEffect(() => {
          setFlagsList(responseData);
     }, [responseData]);

     const Continue = async () => {
          const payload = {
               countries: countriesData.map((item: any) => item.id)
          }

          setCheckValidation(true);
          await UpdateProfessionalDetail(payload, fetchProfile);
          setEditProfessionalInfoPop(false)

     };

     const selectCountriesHandler = (data: any) => {
          if (countriesData.some((country: any) => country.id === data.id)) {
               const updatedCountries = countriesData.filter((country: any) => country.id !== data.id)
               setCountriesData(updatedCountries)
          } else {
               const newCountry = {
                    name: data?.name,
                    id: data?.id
               }
               setCountriesData((prev: any) => [...prev, newCountry])
          }

     };

     const handleSearch = (e: any) => {
          const input = e.target.value.toLowerCase();
          setSearchWord(input);

          const filteredFlags = responseData.filter(
               (item: any) => item.flag !== "" && item.name.toLowerCase().includes(input)
          );

          setFlagsList(filteredFlags);
     };

     return (
          <div>
               <h3 className="heading-bold heading-club">
                    What countries are you interested in scouting in?
               </h3>
               <p className="mb-8 text-violet-100 text-[17px] font-normal leading-[22px] tracking-[-0.408px]">
                    You can change this later.
               </p>
               <div className="relative">
                    <FaSearch className="absolute search-icon" />
                    <Input type="search" className="search-input" placeholder="Search" onChange={handleSearch} />
               </div>
               <div className="images-main">
                    {flagsList?.filter((item: any) => item?.flag !== "")?.map((item: any) => (
                         <div className="" key={item.id}>
                              {item?.flag !== "" && (
                                   <div
                                        onClick={() => selectCountriesHandler(item)}
                                        className={`api-img-otr ${countriesData.some((country: any) => country?.id === item.id)
                                             ? " border-4 border-[#9FE870]"
                                             : ""
                                             }`}
                                   >
                                        <Image
                                             src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item?.flag}`}
                                             alt=""
                                             width={96}
                                             height={96}
                                             className="imgCountry"
                                        />
                                   </div>
                              )}
                         </div>
                    ))}
               </div>
               {checkValidation &&
                    countriesData?.length < 1 && (
                         <p className="mb-2 alret-text text-[#FF453A]">
                              Please Select at least 1 Country
                         </p>
                    )}
               <CustomButton onClick={Continue} className={`${userProfile?.user?.roleId !== 3 && "!mt-6"}`} />
          </div>
     );
};

export { EditCounties };
