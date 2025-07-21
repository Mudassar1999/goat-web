import React, { useState, useEffect, useRef } from "react";
import SelectField from "@/components/ui/selectField";
import { Input } from "@/components/ui/input";
import CustomButton from "@/components/Button/CustomButton";
import axios from "axios";
import { toast } from "react-toastify";
import { useProfile } from "@/providers/ProfileProvider";
import { useTrophyFormData } from "@/providers/TrophyFormProvider";
import CustomSelectField from "@/components/ui/customSelectField";
import { Combobox } from "@/components/ui/combobox";
import { getTeams } from "@/api/Journey/getTeams";

function TrophiesForm({
  editTrophy,
  playingClubData,
  leaguesData,
  trophyId,
  setOpenPopup,
}: any) {
  const [checkValidation, setCheckValidation] = useState(false);
  const [userInfo, setUserInfo] = useState<any>([]);
  const [teamsData, setTeamsData] = useState<any>([]);

  const { trophyFormData, setTrophyFormData } = useTrophyFormData();
  const { profile, setProfile } = useProfile();
  const dateRef = useRef<any>(null);

  const userClub = editTrophy ?
    trophyFormData?.clubId ? playingClubData?.find(
      (club: any) => parseInt(club?.id) === trophyFormData?.clubId)?.name : ""
    :
    (userInfo?.roleId === 2) ?
      profile?.sportsData[0]?.coachingClub?.name :
      profile?.sportsData[0]?.playingClub?.name

  const userTeam = editTrophy ?
    trophyFormData?.teamId ? teamsData?.find(
      (teams: any) => teams?.id === trophyFormData?.teamId)?.name : ""
    : (userInfo?.roleId === 2) ?
      profile?.sportsData[0]?.coachingClubTeam?.name :
      profile?.sportsData[0]?.playingClubTeam?.name

  const AddTrophies = async () => {
    setCheckValidation(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/trophies`,
        trophyFormData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setProfile({
        ...profile,
        user: {
          ...profile.user,
          Trophy: [response.data.data, ...profile.user.Trophy],
        },
      });
      toast.success(response.data.message);
      setOpenPopup("");
    } catch (error) {
      console.error(error);
    }
  };

  const UpdateTrophies = async () => {
    setCheckValidation(true);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/trophies/update/${trophyId}`,
        trophyFormData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      const updatedTrophy = profile.user.Trophy.map((trophy: any) => {
        if (trophy.id === response.data.data.id) {
          return response.data.data;
        } else {
          return trophy;
        }
      });

      setProfile({
        ...profile,
        user: {
          ...profile.user,
          Trophy: updatedTrophy,
        },
      });
      toast.success(response.data.message);
      setOpenPopup("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value, type } = e.target;
    let formattedValue = value;

    if (type === "select-one") {
      formattedValue = parseInt(value, 10);
      setTrophyFormData({
        ...trophyFormData,
        [name]: formattedValue,
      });
    } else if (type === "checkbox") {
      formattedValue = e.target.checked;
      setTrophyFormData({
        ...trophyFormData,
        [name]: formattedValue,
      });
    } else if (type === "date") {
      formattedValue = new Date(value).toISOString();
      setTrophyFormData({
        ...trophyFormData,
        [name]: formattedValue,
      });
    } else {
      setTrophyFormData({
        ...trophyFormData,
        [name]: value,
      });
    }
  };

  const changeClubHandler = (selectedClub: any) => {
    setTrophyFormData({
      ...trophyFormData,
      clubId: selectedClub?.id,
    });
  };

  const changeTeamHandler = (selectedTeam: any) => {
    setTrophyFormData({
      ...trophyFormData,
      teamId: selectedTeam?.id,
    });
  };

  const changeLeagueHandler = (selectedLeague: any) => {
    setTrophyFormData({
      ...trophyFormData,
      leagueId: selectedLeague?.id,
    });
  };

  const openDatePicker = () => {
    const startDateElement: any = dateRef.current;
    startDateElement.showPicker();
  };

  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month: any = today.getMonth() + 1;
    let day: any = today.getDate();

    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    setTrophyFormData((prevState: any) => ({
      ...prevState,
      winningDate: getTodayDateString(),
    }));
  }, []);

  useEffect(() => {
    let userData: any = localStorage.getItem("user_info");
    userData = userData ? JSON.parse(userData) : null;
    setUserInfo(userData);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let userSport: any = localStorage.getItem("user_sport");
        userSport = userSport ? JSON.parse(userSport) : null;

        const SPORT_ID = userSport?.sport?.id ?? null;
        const teamsData = await getTeams(SPORT_ID);
        const filterTeams = teamsData?.filter(
          (team: any) => team?.name !== userSport?.playingClubTeam?.name
        );

        setTeamsData(filterTeams);

      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <h2 className="heading-bold pb-[4px]">
        {editTrophy ? "Edit" : "Add"} Trophy
      </h2>
      <p className="text-17 color-gray font-weight-400 pb-[20px]">
        <span className="mr-2 text-[#FF453A]">*</span>
        Indicates required fields
      </p>
      <div className="flex flex-col gap-[24px]">
        {userInfo?.userSports && (
          <div className="">
            <p className="text-16 color-white pb-[6px]">
              Sport <span className="text-[#FF3B30]">*</span>
            </p>
            <CustomSelectField
              name="sportId"
              options={userInfo?.userSports[0]?.sport?.name}
              onChange={handleInputChange}
              value={""}
            />
          </div>
        )}
        <div>
          <p className=" text-16 color-white pb-[6px]">
            League name
            <span className="text-[#FF453A]">*</span>
          </p>
          <Combobox
            onChange={changeLeagueHandler}
            placeholder={"Official league name"}
            data={leaguesData}
            displayValue={(x: any) => x?.name}
            defaultSelectedValue={
              leaguesData?.find(
                (club: any) => club?.id === trophyFormData?.leagueId
              )?.name || ""
            }
          />
          {checkValidation && !trophyFormData?.leagueId && (
            <p className="mb-2 alret-text text-[#FF453A]">
              Please Select the league
            </p>
          )}
        </div>
        <div>
          <p className="text-16 color-white pb-[6px]">
            Club name <span className="text-[#FF453A]">*</span>
          </p>
          <Combobox
            onChange={changeClubHandler}
            placeholder={"Official club name"}
            data={playingClubData}
            displayValue={(x: any) => x?.name}
            defaultSelectedValue={userClub}
          />
          {checkValidation && !trophyFormData?.clubId && (
            <p className="mb-2 alret-text text-[#FF453A]">
              Please Select the club name
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center font-sans text-[16px] font-normal gap-1 leading-[21px] tracking-[-0.32px] mb-[6px]">
            Team <span className="text-[#FF3B30]">*</span>
          </div>
          <Combobox
            onChange={changeTeamHandler}
            placeholder={"Choose team"}
            data={teamsData}
            displayValue={(x: any) => x?.name}
            defaultSelectedValue={userTeam}
          />
          {checkValidation && !trophyFormData?.teamId && (
            <p className="mb-2 alret-text text-[#FF453A]">
              Please select Valid team
            </p>
          )}
        </div>

        <div className="Allcommon-input-otr">
          <p className="text-16 color-white pb-[6px]">
            Date <span className="text-[#FF453A]">*</span>
          </p>
          <Input
            name="winningDate"
            onChange={handleInputChange}
            type="date"
            max={getCurrentDate()}
            className="Allcommon-input-inr cursor-pointer"
            value={trophyFormData?.winningDate?.split("T")[0]}
            onClick={() => openDatePicker()}
            ref={dateRef}
          />
          {checkValidation && !trophyFormData?.winningDate && (
            <p className="mb-2 alret-text text-[#FF453A]">
              Please select winning date
            </p>
          )}
        </div>
        <CustomButton
          title={editTrophy ? "Update Trophy" : "Add Trophy"}
          onClick={editTrophy ? UpdateTrophies : AddTrophies}
        />
      </div>
    </>
  );
}

export default TrophiesForm;
