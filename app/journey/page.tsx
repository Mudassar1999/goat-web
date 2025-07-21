"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import FeaturedDrill from "./components/featuredDrills";
import DrillsLogs from "./components/logs";
import BadgeComponent from "./components/badge";
import DrillsList from "./components/drillsList";
import Footer from "@/components/Footer";
import ScoutObjective from "./components/scoutObjective";
import CoachObjective from "./components/coachObjective";
import { useLogs } from "@/providers/LogsProvider";
import { getAllLogs } from "@/api/Journey/getLogs";
import { getJournies } from "@/api/Journey/getJournies";
import { useJourney } from "@/providers/JourneyProvider";
import ProtectedRoutes from "../ProtectedRoutes";
import { useGoatDrill } from "@/providers/GoatDrillsProvider";

function Journey() {
  const [userInfo, setUserInfo] = useState<any>("");
  const [currentTab, setCurrentTab] = useState("experiences");
  // const [isGoatDrill, setGoatDrill] = useState<string>("goatDrill");
  const [isClaimDrillPopup, setClaimDrillPopup] = useState<boolean>(false);
  const [isClaimBadgePopup, setClaimBadgePopup] = useState<boolean>(false);

  const { setLogs } = useLogs();
  const { setJourney } = useJourney();
  const { isGoatDrill, setGoatDrill } = useGoatDrill();

  const drillComponent = () => {
    setGoatDrill(true)
  };

  const logsComponent = () => {
    setGoatDrill(false)
  };

  useEffect(() => {
    let userData: any = localStorage.getItem("user_info");
    userData = userData ? JSON.parse(userData) : null;
    setUserInfo(userData);

    const fetchData = async () => {
      try {
        const logsData = await getAllLogs();
        setLogs(logsData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const journeyData = await getJournies();
        const badgeClaimedType = typeof journeyData?.isBadgeClaimed;
        if (badgeClaimedType === "object") {
          setClaimBadgePopup(true)
        }
        setClaimDrillPopup(journeyData?.pendingClaimDrills?.length > 0)
        setJourney(journeyData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [isClaimDrillPopup, isClaimBadgePopup]);

  return (
    <>
      <Header setCurrentTab={setCurrentTab} />
      {/* className="w-full lg:w-[80%] m-auto px-[32px] pt-[24px]" */}
      <div className="journeyContainer">
        {/* Tab section */}
        {userInfo?.roleId === 1 && (
          <div className="bg-[#7676803d] h-[32px] w-full flex justify-center items-center rounded-[8px] cursor-pointer mb-[24px]">
            <div
              className={`${isGoatDrill
                ? "bg-[#636366] w-[49.7%] h-[28px] border-[#0000000a] border-[0.5px] rounded-[7px] py-[6px] px-[8px] flex justify-center items-center"
                : "flex justify-center items-center w-[50%]"
                } text-center`}
              onClick={drillComponent}
            >
              <p
                className={`${isGoatDrill
                  ? "text-13-selected-tab"
                  : "text-13-unselected-tab"
                  }`}
              >
                GOAT Drills
              </p>
            </div>
            <div
              className={`${!isGoatDrill
                ? "bg-[#636366] w-[49.7%] h-[28px] border-[#0000000a] border-[0.5px] rounded-[7px] py-[6px] px-[8px] flex justify-center items-center"
                : "flex justify-center items-center w-[50%]"
                } text-center`}
              onClick={logsComponent}
            >
              <p
                className={`${!isGoatDrill
                  ? "text-13-selected-tab"
                  : "text-13-unselected-tab"
                  }`}
              >
                Logs
              </p>
            </div>
          </div>
        )}

        {/* Carousel */}
        {isGoatDrill && userInfo?.roleId === 1 && (
          <FeaturedDrill />
        )}

        {/* Badge section */}
        {isGoatDrill && <BadgeComponent />}

        {userInfo?.roleId === 1 && isGoatDrill && (
          <DrillsList
            isClaimDrillPopup={isClaimDrillPopup}
            setClaimDrillPopup={setClaimDrillPopup}
            isClaimBadgePopup={isClaimBadgePopup}
            setClaimBadgePopup={setClaimBadgePopup}
          />
        )}
        {userInfo?.roleId === 1 && !isGoatDrill && <DrillsLogs />}

        {userInfo?.roleId === 3 && <ScoutObjective />}

        {userInfo?.roleId === 2 && <CoachObjective />}
      </div>
      <Footer />
    </>
  );
}

export default ProtectedRoutes(Journey);
