import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import CustomButton from "@/components/Button/CustomButton";
import { FaSearch } from "react-icons/fa";
import Image from "next/image";
import RadioInput from "@/components/ui/radioInput";
import axios from "axios";
import useApiRequest from "@/custom_hooks/useGetApiRequest";
import userRegistration from "@/api/auth/userRegistration";
import { useForm } from "@/providers/FormProvider";
import "./AllComponent.scss";
import Popup from "@/components/shared/Popup";
import AdditionalRequest from "./AdditionalRequest";

const InterestedLeagues = ({ setCurrentStep, signupFormState }: any) => {
  const { formState, setFormState } = useForm();
  const [leaguesRequest, setLeaguesRequest] = useState(false);
  const { responseData, loading, fetchData } = useApiRequest();
  const [searchQuery, setSearchQuery] = useState("");
  const [leaguesData, setLeaguesData] = useState<any>([]);
  const [checkValidation, setCheckValidation] = useState(false);
  const [additionalRequest, setAdditionalRequest] = useState<boolean>(false);

  useEffect(() => {
    fetchData(`leagues/bySportId/${formState.sports[0].sportId}`, null);
  }, []);

  // const fetchPlayerPositionsData = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${process.env.NEXT_PUBLIC_API_URL}/leagues/bySportId/${formState.sports[currentSportIndex].sportId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  //         },
  //       }
  //     );
  //     setLeaguesData(response.data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  const handleSubmit = async () => {
    try {
      const data = await userRegistration(formState);
      // Handle success
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };
  const Continue = () => {
    setCheckValidation(true);
    if (formState.sports && formState.sports[0]?.leagues?.length > 0) {
      handleSubmit();
      setCurrentStep(10);
    }
  };
  const selectedLeagues: any =
    formState.sports[0].leagues?.length > 0 ? formState.sports[0].leagues : [];

  const selectLeaguesHandler = (leagueId: number) => {
    const updatedSports = [...formState.sports];
    const currentSport = { ...updatedSports[0] };
    const leagues = currentSport?.leagues || [];
    if (leagues.includes(leagueId)) {
      currentSport.leagues = leagues.filter((id: number) => id !== leagueId);
    } else {
      currentSport.leagues = [leagueId];

      // below line for multiple league select if we have to choose multiple leagues then remove currentSport.leagues = [leagueId];

      // currentSport.leagues = [...leagues, leagueId];
    }

    updatedSports[0] = currentSport;

    const updatedData = {
      ...formState,
      sports: updatedSports,
    };

    setFormState(updatedData);
  };

  const handleSearch = (e: any) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = responseData.filter((item: any) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="main-club">
      <h3 className="heading-bold heading-club">
        What leagues are you interested in scouting in?
      </h3>
      <p className="mb-8 text-violet-100 text-[17px] font-normal leading-[22px] tracking-[-0.408px]">
        If your league is not on the list,{" "}
        <span
          className="text-[#9FE870]"
          onClick={() => setAdditionalRequest(true)}
        >
          please send us a request.
        </span>
      </p>
      <div className="relative ">
        <FaSearch className="absolute search-icon" />
        <Input
          type="search"
          className="search-input"
          placeholder="Search"
          onChange={handleSearch}
        />
      </div>

      {searchQuery === "" ? (
        <div className="images-main">
          {responseData.map((item: any) => (
            <div className="" key={item.id}>
              {item.image && (
                <div
                  onClick={() => selectLeaguesHandler(item.id)}
                  className={`api-img-otr ${selectedLeagues.includes(item.id)
                    ? " border-4 border-[#9FE870]"
                    : ""
                    }`}
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.image}`}
                    alt=""
                    width={47}
                    height={47}
                    className="img"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="clubName-name">
          {filteredData.map((item: any) => (
            <div key={item.id}>
              <div className="forborderC" >
                <RadioInput
                  key={item.id}
                  label={item.name}
                  value={item.id}
                  checked={
                    formState.sports[0]?.leagues?.length > 0 &&
                    formState.sports[0]?.leagues.includes(item.id)
                  }
                  onChange={() => selectLeaguesHandler(item.id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      {checkValidation &&
        formState.sports &&
        formState.sports[0]?.leagues?.length < 1 && (
          <p className="mb-2 alret-text text-[#FF453A]">
            Please Select at least 1 league
          </p>
        )}
      <CustomButton onClick={Continue} className={`${signupFormState.roleId !== 3 && "!mt-6"}`} />
      {additionalRequest && (
        <Popup onClose={() => setAdditionalRequest(false)}>
          <AdditionalRequest onClose={() => setAdditionalRequest(false)} />
        </Popup>
      )}
    </div>
  );
};

export { InterestedLeagues };
