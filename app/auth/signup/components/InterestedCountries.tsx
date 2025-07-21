import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import CustomButton from "@/components/Button/CustomButton";
import { FaSearch } from "react-icons/fa";
import Image from "next/image";
import { Images } from "@/public/Images";
import useApiRequest from "@/custom_hooks/useGetApiRequest";
import { useForm } from "@/providers/FormProvider";

const InterestedCounties = ({ setCurrentStep, signupFormState }: any) => {
  const { formState, setFormState } = useForm();
  const { responseData, loading, fetchData } = useApiRequest();
  const [selectedItemId, setSelectedItemId] = useState<number[]>();
  const [checkValidation, setCheckValidation] = useState(false);
  const [flagsList, setFlagsList] = useState<any>([]);
  const [searchWord, setSearchWord] = useState('');

  useEffect(() => {
    fetchData("countries", null);
  }, []);

  useEffect(() => {
    setFlagsList(responseData);
  }, [responseData]);

  const Continue = () => {
    setCheckValidation(true);
    if (formState.sports && formState.sports[0]?.countries?.length > 0) {
      setCurrentStep(9);
    }
  };
  const selectedCountries: any =
    formState.sports[0].countries?.length > 0
      ? formState.sports[0].countries
      : [];
  const selectCountriesHandler = (countryId: number) => {
    const updatedSports = [...formState.sports];
    const currentSport = { ...updatedSports[0] };
    const countries = currentSport?.countries || [];
    if (countries.includes(countryId)) {
      currentSport.countries = countries.filter(
        (id: number) => id !== countryId
      );
    } else {
      currentSport.countries = [...countries, countryId];
    }

    updatedSports[0] = currentSport;

    const updatedData = {
      ...formState,
      sports: updatedSports,
    };

    setFormState(updatedData);
    // setFormState((prevState: any) => {
    //   const updatedSports = [...prevState.sports];
    //   const currentSport = updatedSports[currentSportIndex];
    //   const countries = currentSport.countries || [];
    //   if (countries.includes(countryId)) {
    //     currentSport.countries = countries.filter(
    //       (id: number) => id !== countryId
    //     );
    //   } else {
    //     currentSport.countries = [...countries, countryId];
    //   }
    //   return {
    //     ...prevState,
    //     sports: updatedSports,
    //   };
    // });
  };

  // const handleSearch = (e: any) => {
  //   const searchWord = e.target.value.toLowerCase();
  //   if (searchWord === "") {
  //     // If the search input is empty, display all flags
  //     setflagsList(responseData);
  //   } else {
  //     // Filter flags based on both non-empty flag and matching name
  //     const filteredFlags = responseData
  //       .filter((item: any) => item.flag !== "" && item.name.toLowerCase().includes(searchWord));

  //     setflagsList(filteredFlags);
  //   }
  //   // const filteredFlags = flagsList
  //   //   .filter((item: any) => item.flag !== "" && item.name.toLowerCase().includes(searchWord.toLowerCase()));
  //   // setflagsList(filteredFlags)
  // }
  const handleSearch = (e: any) => {
    const input = e.target.value.toLowerCase();
    setSearchWord(input);

    // Filter flags based on both non-empty flag and matching name
    const filteredFlags = responseData.filter(
      (item: any) => item.flag !== "" && item.name.toLowerCase().includes(input)
    );

    setFlagsList(filteredFlags);
  };

  return (
    <div className="main-club">
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
                onClick={() => selectCountriesHandler(item.id)}
                className={`api-img-otr ${selectedCountries.includes(item.id)
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
        formState.sports &&
        formState.sports[0]?.countries?.length < 1 && (
          <p className="mb-2 alret-text text-[#FF453A]">
            Please Select at least 1 Country
          </p>
        )}
      <CustomButton onClick={Continue} className={`${signupFormState.roleId !== 3 && "!mt-6"}`} />
    </div>
  );
};

export { InterestedCounties };
