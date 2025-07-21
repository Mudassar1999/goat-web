import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import SelectInput from "@/components/ui/selectInput";
import CustomButton from "@/components/Button/CustomButton";
import axios from "axios";
import { toast } from "react-toastify";
import { useProfile } from "@/providers/ProfileProvider";
import { useExperienceFormData } from "@/providers/ExperienceFormProvider";
import CustomSelectField from "@/components/ui/customSelectField";
import Popup from "@/components/shared/Popup";
import AdditionalRequest from "@/app/auth/signup/components/AdditionalRequest";
import "./Experience.scss";
import { Combobox } from "@/components/ui/combobox";
import { getTeams } from "@/api/Journey/getTeams";

const contractTypeData = [
  {
    id: 1,
    name: "Contract",
  },
  {
    id: 2,
    name: "Permanent",
  },
];

function ExperienceForm({
  editExperience,
  clubsAndPlayerPosition,
  experienceId,
  setOpenPopup,
}: any) {
  const { profile, setProfile } = useProfile();
  const { experienceFormData, setExperienceFormData } = useExperienceFormData();
  const [checkValidation, setCheckValidation] = useState(false);
  const [userInfo, setUserInfo] = useState<any>([]);
  const [teamsData, setTeamsData] = useState<any>([]);
  const [additionalRequest, setAdditionalRequest] = useState<boolean>(false);
  const startDateRef = useRef<any>(null);
  const endDateRef = useRef<any>(null);


  const userClub = editExperience ?
    experienceFormData?.clubId ? clubsAndPlayerPosition?.clubs?.find(
      (clubs: any) => parseInt(clubs?.id) === experienceFormData?.clubId)?.name : ""
    :
    (userInfo?.roleId === 2) ?
      profile?.sportsData[0]?.coachingClub?.name :
      profile?.sportsData[0]?.playingClub?.name

  const userTeam = editExperience ?
    experienceFormData?.teamId ? teamsData?.find(
      (teams: any) => teams?.id === experienceFormData?.teamId)?.name : ""
    : (userInfo?.roleId === 2) ?
      profile?.sportsData[0]?.coachingClubTeam?.name :
      profile?.sportsData[0]?.playingClubTeam?.name

  const AddExperience = async () => {
    setCheckValidation(true);

    if (
      experienceFormData?.clubId &&
      experienceFormData?.teamId &&
      experienceFormData?.playerPositionId &&
      experienceFormData?.employmentType &&
      experienceFormData?.startDate &&
      experienceFormData?.endDate &&
      experienceFormData?.startDate === experienceFormData?.endDate
    ) {
      toast.warning("Start date should be different from end date");
      return;
    }

    const updatedExperienceFormData = { ...experienceFormData };

    // Conditionally set endDate based on currentlyPlayingHere
    if (updatedExperienceFormData.currentlyPlayingHere) {
      updatedExperienceFormData.endDate = "";
    }
    if (
      !experienceFormData.clubId ||
      !experienceFormData.playerPositionId ||
      !experienceFormData.employmentType
    ) {
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/experiences`,
        updatedExperienceFormData,
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
          ...profile?.user,
          experiences: [response?.data?.data, ...profile?.user?.experiences],
        },
      });
      toast.success(response?.data?.message);
      setOpenPopup("");
    } catch (error) {
      console.error(error);
    }
  };

  const UpdateExperience = async () => {
    setCheckValidation(true);
    if (experienceFormData?.startDate === experienceFormData?.endDate) {
      toast.warning("Start date should be different from end date");
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/experiences/update/${experienceId}`,
        experienceFormData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      const updatedExperiences = profile?.user?.experiences?.map(
        (experience: any) => {
          if (experience.id === response?.data?.data?.id) {
            return response?.data?.data;
          } else {
            return experience;
          }
        }
      );

      setProfile({
        ...profile,
        user: {
          ...profile?.user,
          experiences: updatedExperiences,
        },
      });
      toast.success(response?.data?.message);
      setOpenPopup("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value, type } = e.target;
    let formattedValue = value;
    let isValidDate = true;

    if (type === "date") {
      formattedValue = new Date(value).toISOString();

      if (name === "startDate" && experienceFormData.endDate) {
        const startDate = new Date(formattedValue);
        const endDate = new Date(experienceFormData.endDate);
        if (startDate > endDate) {
          toast.warning("Start date should be before end date");
          isValidDate = false;
        }
      } else if (name === "endDate" && experienceFormData.startDate) {
        const startDate = new Date(experienceFormData.startDate);
        const endDate = new Date(formattedValue);
        if (startDate > endDate) {
          toast.warning("End date should be after start date");
          isValidDate = false;
        }
      }
    } else {
      if (type === "select-one" && name !== "employmentType") {
        formattedValue = parseInt(value, 10);
      } else if (type === "checkbox") {
        formattedValue = e.target.checked;
      }
    }

    // Update state only if the date is valid
    if (isValidDate) {
      setExperienceFormData({
        ...experienceFormData,
        [name]: formattedValue,
      });
    }
  };

  const changeClubHandler = (selectedClub: any) => {
    setExperienceFormData({
      ...experienceFormData,
      clubId: selectedClub?.id,
    });
  };

  const changeTeamHandler = (selectedTeam: any) => {
    setExperienceFormData({
      ...experienceFormData,
      teamId: selectedTeam?.id,
    });
  };

  const changePositionHandler = (selectedPosition: any) => {
    setExperienceFormData({
      ...experienceFormData,
      playerPositionId: selectedPosition?.id,
    });
  };

  const changeEmpTypeHandler = (empType: any) => {
    setExperienceFormData({
      ...experienceFormData,
      employmentType: empType.name,
    });
  };

  const openStartDatePicker = () => {
    const startDateElement: any = startDateRef.current;
    startDateElement.showPicker();
    startDateElement.focus();
  };

  const openEndDatePicker = () => {
    const endDateElement: any = endDateRef.current;
    endDateElement.showPicker();
    endDateElement.focus();
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
    setExperienceFormData((prevState: any) => ({
      ...prevState,
      startDate: getTodayDateString(),
      endDate: getTodayDateString(),
    }));
  }, []);

  useEffect(() => {
    let userData: any = localStorage.getItem("user_info");
    userData = userData ? JSON.parse(userData) : null;
    setUserInfo(userData);

    if (!editExperience) {
      const clubIdValue = userData?.roleId === 2 ?
        profile?.sportsData[0]?.coachingClubTeam?.id :
        profile?.sportsData[0]?.playingClubTeam?.id;

      const teamIdValue = userData?.roleId === 2 ?
        profile?.sportsData[0]?.coachingClubTeam?.id :
        profile?.sportsData[0]?.playingClubTeam?.id

      setExperienceFormData({
        ...experienceFormData,
        clubId: clubIdValue,
        teamId: teamIdValue
      });
    }
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
        {editExperience ? "Edit" : "Add"} Experience
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
          <p className="text-16 color-white pb-[6px]">
            Club name <span className="text-[#FF453A]">*</span>
          </p>
          <Combobox
            onChange={changeClubHandler}
            placeholder={"Official club name"}
            data={clubsAndPlayerPosition?.clubs}
            displayValue={(x: any) => x?.name}
            defaultSelectedValue={userClub}
          />
          <p className="text-17 color-gray font-weight-400 pt-[6px]">
            If your club is not on the list, please{" "}
            <span
              className="color-green cursor-pointer"
              onClick={() => setAdditionalRequest(true)}
            >
              send us a request.
            </span>
          </p>
          {checkValidation && !experienceFormData?.clubId && (
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
          {checkValidation && !experienceFormData?.teamId && (
            <p className="mb-2 alret-text text-[#FF453A]">
              Please select Valid team
            </p>
          )}
        </div>

        <div>
          <p className="text-16 color-white pb-[6px]">
            Position <span className="text-[#FF453A]">*</span>
          </p>
          <Combobox
            onChange={changePositionHandler}
            placeholder={"Choose position"}
            data={clubsAndPlayerPosition?.playerPositions}
            displayValue={(x: any) => x?.name}
            defaultSelectedValue={
              clubsAndPlayerPosition?.playerPositions?.find(
                (pos: any) => pos?.id === experienceFormData?.playerPositionId
              )?.name || ""
            }
          />
          {checkValidation && !experienceFormData?.playerPositionId && (
            <p className="mb-2 alret-text text-[#FF453A]">
              Please Select the player position
            </p>
          )}
        </div>

        <div className="Allcommon-input-otr">
          <p className="text-16 color-white pb-[6px]">
            Start date <span className="text-[#FF453A]">*</span>
          </p>
          <Input
            name="startDate"
            onChange={handleInputChange}
            type="date"
            max={getCurrentDate()}
            value={experienceFormData?.startDate?.split("T")[0]}
            className={` Allcommon-input-inr cursor-pointer`}
            onClick={() => openStartDatePicker()}
            ref={startDateRef}
          />
          {checkValidation &&
            experienceFormData.startDate === experienceFormData.endDate && (
              <p className="mb-2 alret-text text-[#FF453A]">
                Start date should be different from end date
              </p>
            )}
          {checkValidation && !experienceFormData?.startDate && (
            <p className="mb-2 alret-text text-[#FF453A]">
              Please select start date
            </p>
          )}
        </div>
        {!experienceFormData?.currentlyPlayingHere && (
          <div className="Allcommon-input-otr">
            <p className="text-16 color-white pb-[6px]">
              End date <span className="text-[#FF453A]">*</span>
            </p>
            <Input
              name="endDate"
              onChange={handleInputChange}
              type="date"
              max={getCurrentDate()}
              value={experienceFormData?.endDate?.split("T")[0]}
              className={` Allcommon-input-inr cursor-pointer`}
              onClick={() => openEndDatePicker()}
              ref={endDateRef}
            />
            {checkValidation &&
              experienceFormData.startDate === experienceFormData.endDate && (
                <p className="mb-2 alret-text text-[#FF453A]">
                  End date should be different from start date
                </p>
              )}
            {checkValidation &&
              !experienceFormData?.endDate &&
              !experienceFormData?.currentlyPlayingHere && (
                <p className="mb-2 alret-text text-[#FF453A]">
                  Please select end date
                </p>
              )}
          </div>
        )}

        <div className="ml-[5px]">
          <SelectInput
            name="currentlyPlayingHere"
            label="I currently play here"
            type="checkbox"
            checked={experienceFormData?.currentlyPlayingHere}
            onChange={handleInputChange}
            className="flex-row-reverse !justify-end gap-2"
          />
        </div>

        <div>
          <p className="text-16 color-white pb-[6px]">
            Employment type <span className="text-[#FF453A]">*</span>
          </p>
          <Combobox
            onChange={changeEmpTypeHandler}
            placeholder={"i.e. Contract"}
            data={contractTypeData}
            displayValue={(x: any) => x?.name}
            defaultSelectedValue={experienceFormData?.employmentType}
          />
          {checkValidation && !experienceFormData?.employmentType && (
            <p className="mb-2 alret-text text-[#FF453A]">
              Please select employment type
            </p>
          )}
        </div>

        <div>
          <p className="text-16 color-white pb-[6px]">Description</p>
          <div className="AllCommon-textArea-otr">
            <textarea
              name="description"
              className="Allcommon-textArea-inr resize-none"
              placeholder="Add your achievements during your time at the club"
              value={experienceFormData?.description}
              onChange={handleInputChange}
            ></textarea>
          </div>
        </div>

        <CustomButton
          title={editExperience ? "Update Experience" : "Add Experience"}
          onClick={editExperience ? UpdateExperience : AddExperience}
        />
      </div>

      {additionalRequest && (
        <Popup onClose={() => setAdditionalRequest(false)}>
          <AdditionalRequest onClose={() => setAdditionalRequest(false)} />
        </Popup>
      )}
    </>
  );
}

export default ExperienceForm;
