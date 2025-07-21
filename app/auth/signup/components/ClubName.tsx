import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import AuthButton from "@/components/Button/AuthButton";
import { FaSearch } from "react-icons/fa";
import Image from "next/image";
import { Images } from "@/public/Images";
import RadioInput from "@/components/ui/radioInput";
import axios from "axios";
import useSportUpdate from "@/custom_hooks/useSportsStatus";
import useApiRequest from "@/custom_hooks/useGetApiRequest";
import Loading from "react-loading";
import userRegistration from "@/api/auth/userRegistration";
import { useForm } from "@/providers/FormProvider";
import "./AllComponent.scss";
import Popup from "@/components/shared/Popup";
import AdditionalRequest from "./AdditionalRequest";

interface responseType {
  id: number;
  name: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}
const ClubName = ({ setCurrentStep, signupFormState }: any) => {
  const { formState, setFormState } = useForm();
  const { responseData, loading, setLoading, fetchData } = useApiRequest();
  const { updateSport } = useSportUpdate();
  const [clubTeams, setClubTeams] = useState(false);
  const [checkValidation, setCheckValidation] = useState({
    club: false,
    team: false,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [additionalRequest, setAdditionalRequest] = useState<boolean>(false);

  useEffect(() => {
    fetchPlayingClubs(formState?.sports[0]?.sportId);
  }, []);
  const fetchPlayingClubs = async (sportId: number) => {
    try {
      await fetchData(`clubs/bySportId/${sportId}`, null);
    } catch (error) {
      console.error(error);
    }
  };

  console.log(signupFormState, "signupFormState")
  const fetchPlayingClubsTeamData = (clubId: number) => {
    setCheckValidation({ ...checkValidation, club: true });
    if (
      formState.sports[0] &&
      (signupFormState?.roleId === 1
        ? formState?.sports[0]?.playingClubId !== null
        : formState?.sports[0]?.coachingClubId !== null)
    ) {
      setClubTeams(true);
      setLoading(true);
      fetchData(`clubTeams/byClubId/${clubId}`, null);
    }
  };
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
    setCheckValidation({ ...checkValidation, team: true });
    if (
      formState.sports[0] &&
      (signupFormState?.roleId === 1
        ? formState?.sports[0]?.playingClubTeamId !== null
        : formState?.sports[0]?.coachingClubTeamId !== null)
    ) {
      if (signupFormState?.roleId === 2) {
        handleSubmit();
      }

      setCurrentStep(10);
    }
  };

  const selectPlayingClubsHandler = (clubId: number) => {
    signupFormState?.roleId === 1
      ? updateSport(0, setFormState, (sport: any) => ({
        ...sport,
        playingClubId: clubId,
      }))
      : updateSport(0, setFormState, (sport: any) => ({
        ...sport,
        coachingClubId: clubId,
      }));
  };

  const selectPlayingClubsTeamHandler = (clubTeamId: number) => {
    signupFormState?.roleId === 1
      ? updateSport(0, setFormState, (sport: any) => ({
        ...sport,
        playingClubTeamId: clubTeamId,
      }))
      : updateSport(0, setFormState, (sport: any) => ({
        ...sport,
        coachingClubTeamId: clubTeamId,
      }));
  };
  const handleSearch = (e: any) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = responseData.filter((item: any) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const playing_club_id =
    signupFormState?.roleId === 1
      ? formState.sports[0].playingClubId
      : formState.sports[0].coachingClubId;

  return (
    <div className="main-club">
      {!clubTeams ? (
        <h3 className="heading-bold heading-club">What’s the club’s name?</h3>
      ) : (
        <h3 className="heading-bold heading-club">What’s your club’s team?</h3>
      )}
      <p className="mb-8 text-violet-100 text-[17px] font-normal leading-[22px] tracking-[-0.408px]">
        If your {!clubTeams ? "club" : "team"} is not on the list, please{" "}
        <span
          className="text-[#9FE870] cursor-pointer"
          onClick={() => setAdditionalRequest(true)}
        >
          send us a request.
        </span>
      </p>
      <div className="relative">
        <FaSearch className="absolute search-icon" />
        <Input
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
                  <div className="images-main">
                    {responseData?.map((item: responseType) => (
                      <div className="" key={item.id}>
                        <div className={``}>
                          <div
                            className={`api-img-otr  ${(signupFormState.roleId === 1
                              ? formState.sports[0]?.playingClubId
                              : formState.sports[0]?.coachingClubId) ===
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
                    formState.sports[0] &&
                    (signupFormState.roleId === 1
                      ? formState.sports[0].playingClubId === null
                      : formState.sports[0].coachingClubId === null) && (
                      <p className="mb-2 alret-text text-[#FF453A]">
                        Please select 1 club
                      </p>
                    )}
                  <AuthButton
                    onClick={() => fetchPlayingClubsTeamData(playing_club_id)}
                  />
                </>
              ) : (
                <>
                  <div className="clubName-name">
                    {filteredData.map((item: responseType) => (
                      <div key={item.id}>
                        <div className="forchildborder">
                          <RadioInput
                            label={item.name}
                            value={item.id}
                            checked={
                              (signupFormState.roleId === 1
                                ? formState.sports[0]?.playingClubId
                                : formState.sports[0]?.coachingClubId) ===
                              item.id
                              // formState.sports[0]?.playingClubId === item.id
                            }
                            onChange={() => selectPlayingClubsHandler(item.id)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  {checkValidation.club &&
                    formState.sports[0] &&
                    // formState.sports[0].playingClubId === null
                    (signupFormState.roleId === 1
                      ? formState.sports[0].playingClubId === null
                      : formState.sports[0].coachingClubId === null) && (
                      <p className="mb-2 alret-text text-[#FF453A]">
                        Please select 1 club
                      </p>
                    )}
                  <AuthButton
                    onClick={() =>
                      fetchPlayingClubsTeamData(
                        // formState.sports[0].playingClubId
                        playing_club_id
                      )
                    }
                  />
                </>
              )}
            </>
          ) : (
            <>
              <div className="club2">
                {responseData.map((item: responseType) => (
                  <div key={item.id}>
                    <div className="forchildborder">
                      <RadioInput
                        label={item.name}
                        value={item.id}
                        checked={
                          // formState.sports[0]?.playingClubTeamId === item.id
                          (signupFormState.roleId === 1
                            ? formState.sports[0]?.playingClubTeamId
                            : formState.sports[0]?.coachingClubTeamId) ===
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
        formState.sports[0] &&
        // formState.sports[0].playingClubTeamId === null
        (signupFormState.roleId === 1
          ? formState.sports[0].playingClubTeamId === null
          : formState.sports[0].coachingClubTeamId === null) && (
          <p className="mb-2 alret-text text-[#FF453A]">Please select 1 team</p>
        )}
      {clubTeams && <AuthButton onClick={Continue} />}
      {additionalRequest && (
        <Popup onClose={() => setAdditionalRequest(false)}>
          <AdditionalRequest onClose={() => setAdditionalRequest(false)} />
        </Popup>
      )}
    </div>
  );
};

export { ClubName };
