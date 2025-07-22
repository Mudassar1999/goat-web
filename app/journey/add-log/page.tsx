"use client";
import Header from "@/components/Header";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import RadioInput from "@/components/ui/radioInput-no-padding";
import AddStats from "../components/addStats";
import axios from "axios";
import Popup from "@/components/shared/Popup";
import { toast } from "react-toastify";
import { useLogs } from "@/providers/LogsProvider";
import { getLogsOptions } from "@/api/Journey/getLogsOptions";
import { getTeams } from "@/api/Journey/getTeams";
import "../../auth/signup/components/AllComponent.scss";
import CustomButton17 from "@/components/Button/CustomButtton17";
import { Images } from "@/public/Images";
import Image from "next/image";
import "./ForAddLog.scss";
import Footer from "@/components/Footer";
import { Combobox } from "@/components/ui/combobox";
import SelectInput from "@/components/ui/selectInput";
import Loading from "react-loading";
import { Suspense } from "react";

function AddLogs() {
  const [checkValidation, setCheckValidation] = useState(false);
  const [isAddLogPopup, setAddLogPopup] = useState<boolean>(false);
  const [isEditLog, setEditLog] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<any>([]);
  const [sportsInfo, setSportsInfo] = useState<any>([]);
  const [teamsData, setTeamsData] = useState<any>([]);
  const [formState, setFormState] = useState<any>({
    date: "",
    role: "",
    team: "",
    selectedStat: "",
    statOption: "",
    counter: "",
    loggedStat: {},
    stats: [],
  });

  const searchParams = useSearchParams();
  const logId = searchParams.get("id");
  const { logs } = useLogs();
  const dateRef = useRef<any>(null);

  const radioOption = [
    {
      id: 1,
      name: "Training",
    },
    {
      id: 2,
      name: "Match",
    },
  ];

  const router = useRouter();

  const changeTeamHandler = (selectedTeam: any) => {
    setFormState((formState: any) => ({
      ...formState,
      team: selectedTeam?.id,
    }));
  };

  const changeStatHandler = (selectedStat: any) => {
    if (formState.stats.length > 0) {
      const hasDuplicateStat = formState.stats.some(
        (stat: any) => stat.statId === parseInt(selectedStat?.stat.id)
      );

      if (hasDuplicateStat) {
        toast.error("Already added this stat");
        setAddLogPopup(false);
        return;
      }
    }

    setFormState((formState: any) => ({
      ...formState,
      selectedStat: selectedStat?.stat?.name,
    }));
  };

  const changeHandler = (e: any) => {
    const { name, value } = e.target;

    if (name === "role") {
      if (value === "Training") {
        setFormState((formState: any) => ({
          ...formState,
          team: "",
        }));
      }
    }

    if (name === "date") {
      const formattedDate = new Date(value).toISOString();
      setFormState((formState: any) => ({
        ...formState,
        [name]: formattedDate,
      }));
    } else {
      setFormState((formState: any) => ({
        ...formState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      setCheckValidation(true);
      if (
        (formState?.role === "Match" && formState.team === "") ||
        formState.date === "" ||
        formState.role === ""
      ) {
        return;
      } else if (formState.stats.length <= 0) {
        toast.warning("Please add stats to submit the log!");
        return;
      }
      const data = {
        // teamId: formState.team
        //   ? formState.team
        //   : sportsInfo?.playingClubTeam?.id,
        teamId: formState.team
          ? parseInt(formState.team, 10)
          : parseInt(sportsInfo?.playingClubTeam?.id, 10),
        // userInfo?.userSports[0]?.playingClubTeam?.id,
        sportId: sportsInfo?.sport?.id ?? null,
        date: formState.date,
        type: formState.role,
        stats: formState.stats,
      };

      const endpoint = isEditLog ? `/journies/log/${logId}` : "/journies/log";
      const method = isEditLog ? "PUT" : "POST";

      const res = await axios({
        method: method,
        url: `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
        data: data,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      toast.success(res.data.status);
      router.back();
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleStatPressed = (id: string, counter: any) => {
    const selectedStat = formState.statOption.find(
      (option: any) => String(option.stat.id) === String(id)
    )?.stat;

    if (selectedStat) {
      const updatedStats = formState.stats.map((stat: any) => {
        if (stat.statId === parseInt(id)) {
          return {
            statId: parseInt(id),
            stat: selectedStat,
            counter: parseInt(counter),
          };
        }
        return stat;
      });

      setFormState((prevState: any) => ({
        ...prevState,
        selectedStat: id,
        counter: counter,
        stats: updatedStats,
      }));

      setEditLog(true);
      setAddLogPopup(true);
    }
  };

  const openDatePicker = () => {
    const startDateElement: any = dateRef.current;
    startDateElement.showPicker();
    startDateElement.focus();
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
    const fetchData = async () => {
      try {
        let userData: any = localStorage.getItem("user_info");
        userData = userData ? JSON.parse(userData) : null;
        setUserInfo(userData);

        let userSport: any = localStorage.getItem("user_sport");
        userSport = userSport ? JSON.parse(userSport) : null;
        setSportsInfo(userSport);

        const SPORT_ID = userSport?.sport?.id ?? null;
        const logsOptions = await getLogsOptions();
        const teamsData = await getTeams(SPORT_ID);
        const filterTeams = teamsData?.filter(
          (team: any) => team?.name !== userSport?.playingClubTeam?.name
        );
        setTeamsData(filterTeams);

        setFormState((prevState: any) => ({
          ...prevState,
          statOption: logsOptions,
        }));
        const individualLog = logs?.find((data: any) => data?.id == logId);
        if (individualLog) {
          setFormState((formState: any) => ({
            ...formState,
            date: individualLog?.date,
            team: individualLog?.Team?.id,
            role: individualLog?.type,
            stats: individualLog?.stats,
          }));
          setEditLog(true);
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center h-screen">
        <Loading type="spokes" color="#747474" className="mx-auto" />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="journeyContainer add-log-otr">
        <div className="p-2 rounded-full w-10 bg-[#7878805c] ">
          <ArrowLeftIcon
            className="cursor-pointer hover:font-bold"
            onClick={() => router.back()}
          />
        </div>
        {/* w-full md:w-1/2 lg:[390px] m-auto pt-[32px] */}
        <div className="add-log-inner">
          <div className="pb-[5px]">
            <span className="heading-bold">
              {isEditLog ? "Edit" : "Add"} Log
            </span>
          </div>
          <div className="flex items-center text-17 gap-1 pb-[32px]">
            <span className="text-[#FF3B30]">*</span>
            <p className="text-[#ebebf599] font-normal">
              {" "}
              Indicates required fields
            </p>
          </div>

          {/* form */}
          {sportsInfo && (
            <div className="mb-[24px]">
              <div className="flex items-center gap-1 text-16 pb-[6px]">
                <span className="text-white">
                  Sport <span className="text-[#FF3B30]">*</span>
                </span>
              </div>
              <div className="relative">
                <select
                  name="team"
                  onChange={changeHandler}
                  value={formState.team}
                  disabled={true}
                  className="flex w-full selectPopUp cursor-not-allowed"
                >
                  <option value={sportsInfo?.sport?.name} hidden>
                    {sportsInfo?.sport?.name}
                  </option>
                </select>
                <div className="absolute right-[24px] top-[22px] cursor-not-allowed">
                  <Image src={Images.dropDown} alt="" className="social-icon" />
                </div>
              </div>
            </div>
          )}

          <div className="h-[1px] bg-[#545458a8]" />

          <div className="pt-[24px]">
            <div className="Allcommon-input-otr">
              <div className="flex items-center gap-1 text-16 pb-[6px]">
                <span className="text-white">
                  Date <span className="text-[#FF3B30]">*</span>
                </span>
              </div>
              <div className="relative">
                <Input
                  ref={dateRef}
                  name="date"
                  onChange={changeHandler}
                  type="date"
                  max={getCurrentDate()}
                  onClick={() => openDatePicker()}
                  value={formState.date?.split("T")[0]}
                  className={` selectPopUp w-full cursor-pointer ${
                    formState.date !== "" ? "AddThis" : ""
                  }
        ${
          checkValidation &&
          formState.date === "" &&
          "border-2 border-[#FF453A]"
        }
            `}
                />
                <div className="absolute right-[24px] top-[22px] cursor-pointer">
                  <Image
                    src={Images.dropDown}
                    alt=""
                    className="social-icon"
                    onClick={() => openDatePicker()}
                  />
                </div>
              </div>
              {checkValidation && formState.date === "" && (
                <p className="mb-2 text-base text-[#FF453A]">
                  Please select valid date
                </p>
              )}
            </div>
            <div className="flex items-center font-sans text-[16px] font-normal gap-2 leading-[21px] tracking-[-0.32px] mt-[24px]  mb-[8px]">
              Type <span className="text-[#FF3B30]">*</span>
            </div>
            <div className="flex gap-[20px]">
              {radioOption.map((item: any) => (
                <div key={item.id}>
                  <SelectInput
                    name="role"
                    label={item.name}
                    type="checkbox"
                    value={item.name}
                    checked={formState?.role == item.name}
                    onChange={changeHandler}
                    className="flex-row-reverse !justify-end gap-2"
                  />
                </div>
              ))}
            </div>
            {checkValidation && formState.role === "" && (
              <p className="mb-2 text-base text-[#FF453A]">
                Please select any role
              </p>
            )}
            {sportsInfo &&
              formState?.role === "Match" &&
              teamsData?.length > 0 && (
                <div className="my-[24px]">
                  <div className="flex items-center font-sans text-[16px] font-normal gap-1 leading-[21px] tracking-[-0.32px] mb-[6px]">
                    Team <span className="text-[#FF3B30]">*</span>
                  </div>
                  <Combobox
                    onChange={changeTeamHandler}
                    placeholder={"Choose team"}
                    data={
                      formState?.role === "Training" || !formState?.role
                        ? []
                        : teamsData
                    }
                    displayValue={(x: any) => x?.name}
                    defaultSelectedValue={
                      teamsData?.find(
                        (teams: any) => teams?.id === formState?.team
                      )?.name
                    }
                  />
                  {checkValidation &&
                    formState?.role === "Match" &&
                    formState.team === "" && (
                      <p className="mb-2 text-base text-[#FF453A]">
                        Please select Valid team
                      </p>
                    )}
                </div>
              )}
          </div>

          <div
            className={`h-[1px] bg-[#545458a8] mb-[24px] ${(formState?.role === "Training" || formState?.role === "") && "mt-[24px]"}`}
          />

          <div className="px-[16px] py-[24px] bg-[#1C1C1E] rounded-[14px] flex-col justify-start items-start inline-flex w-full min-h-[200px] mb-[24px]">
            <div className="flex justify-between item-center w-full">
              <h2 className="heading-bold-22">Logged Stats</h2>
              <div
                className="flex gap-1 items-center text-17 cursor-pointer"
                onClick={() => setAddLogPopup(true)}
              >
                <p className="text-[#9FE870] font-normal">+ Add Stat</p>
              </div>
            </div>

            {formState?.stats.length > 0 ? (
              <div
                className={`w-full ${
                  formState.stats && "rounded-[14px] border border-[#545458a6]"
                } flex-col justify-start items-start flex mt-[16px]`}
              >
                {formState?.stats.map((data: any, index: number) => {
                  return (
                    <div
                      className={`w-full px-[8px] py-[6px] ${
                        index % 2 === 0 && "bg-[#7676803d]"
                      }
                   ${
                     index === formState?.stats.length - 1 && "rounded-b-[13px]"
                   } 
                   ${index === 0 && "rounded-t-[13px]"} ${
                     index !== formState?.stats.length - 1 &&
                     "border-b border-b-[#545458a6]"
                   } 
                   justify-between items-start inline-flex text-16`}
                      onClick={() =>
                        handleStatPressed(data.statId, data.counter)
                      }
                    >
                      <div className="text-[#ebebf599]">{data?.stat?.name}</div>
                      <div className="text-white">{data?.counter}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-violet-100 text-opacity-60 font-sans text-subheadline font-regular font-feature-case text-15 leading-20 tracking-tight flex items-center justify-center w-full h-[100px]">
                Please add a stat
              </div>
            )}
          </div>

          <CustomButton17
            onClick={handleSubmit}
            title={`${isEditLog ? "Update Log" : "Submit Log"}`}
          />
        </div>
      </div>

      {isAddLogPopup && (
        <Popup onClose={() => setAddLogPopup(false)}>
          <AddStats
            changeStatHandler={changeStatHandler}
            changeHandler={changeHandler}
            formState={formState}
            setFormState={setFormState}
            setAddLogPopup={setAddLogPopup}
            isEditLog={isEditLog}
          />
        </Popup>
      )}
      <Footer />
    </>
  );
}

function AddLog() {
  return (
    // You could have a loading skeleton as the `fallback` too
    <Suspense>
      <AddLogs />
    </Suspense>
  );
}

export default AddLog;
