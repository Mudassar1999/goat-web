"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SidebarLinkGroup from "./SidebarLinkGroup";
import Image from "next/image";
import PublicIcon from "@mui/icons-material/Public";
import SportsIcon from "@mui/icons-material/Sports";
import Groups3Icon from "@mui/icons-material/Groups3";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SportsHandballIcon from "@mui/icons-material/SportsHandball";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import ModeOfTravelIcon from "@mui/icons-material/ModeOfTravel";
import CasinoIcon from "@mui/icons-material/Casino";
import SettingsIcon from "@mui/icons-material/Settings";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import StormIcon from "@mui/icons-material/Storm";
import HomeIcon from "@mui/icons-material/Home";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";
import GridViewIcon from "@mui/icons-material/GridView";
import HandymanIcon from "@mui/icons-material/Handyman";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import PersonIcon from "@mui/icons-material/Person";
import BeenhereIcon from "@mui/icons-material/Beenhere";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import FeedbackIcon from "@mui/icons-material/Feedback";
import ApprovalIcon from "@mui/icons-material/Approval";
import InfoIcon from "@mui/icons-material/Info";
import DetailsIcon from "@mui/icons-material/Details";
import { Collections } from "@mui/icons-material";
interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}
const sfProDisplayStyle = {
  fontFamily: "SF Pro Display, Arial, sans-serif",
  // Add other inline styles as needed
};
const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);
  let storedSidebarExpanded = "true";
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });
  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);
  return (
    <aside
      ref={sidebar}
      className={`dark:bg-boxdark fixed left-0 top-0 z-30 flex h-screen w-80 flex-col overflow-y-hidden bg-black duration-300 ease-linear lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div
        style={sfProDisplayStyle}
        className="py-5.5 lg:py-6.5 flex items-center justify-between gap-2 px-6"
      >
        <Link href="/">
          <div
            style={{
              fontSize: 39,
              marginTop: 20,
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* First Image */}
            <Image src="/images/logo/1.png" alt="" width={60} height={60} />

            {/* Spacer */}
            <div style={{ width: 5 }} />

            {/* Second Image */}
            <Image src="/images/logo/2.png" alt="" width={100} height={100} />
          </div>
        </Link>
        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
          <div>
            <ul className="mb-6 flex flex-col gap-1.5">
              <SidebarLinkGroup
                activeCondition={
                  pathname === "/" || pathname.includes("dashboard")
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                        <Link
                          href="/admin/home"
                          style={sfProDisplayStyle}
                          className={`text-bodydark1 group relative flex items-center gap-2.5 rounded-sm px-4 py-3 duration-300 ease-in-out hover:bg-white hover:text-black 
                          ${
                            pathname.includes("/admin/home")
                              ? "bg-white text-black"
                              : ""
                          }`}
                        >
                          <HomeIcon />
                          Home
                        </Link>
                      <Link
                        href="#"
                        style={sfProDisplayStyle}
                        className={`text-bodydark1 group relative flex items-center gap-2.5 rounded-sm px-4 py-3 duration-300 ease-in-out hover:bg-white hover:text-black
                         ${
                           pathname.includes("#") ? "bg-white text-black" : ""
                         }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <SettingsIcon />
                        Configuration
                        <svg
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                            open && "rotate-180"
                          }`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                            fill=""
                          />
                        </svg>
                      </Link>
                      <div
                        className={`translate transform overflow-hidden ${
                          !open && "hidden"
                        }`}
                      >
                        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                          <li>
                            <Link
                              href="/admin/country"
                              style={sfProDisplayStyle}
                              className={`text-bodydark1 group relative flex items-center gap-2.5 rounded-sm px-4  py-1.5 duration-300 ease-in-out hover:bg-white hover:text-black 
                              ${
                                pathname.includes("/admin/country")
                                  ? "bg-white text-black"
                                  : ""
                              } `}
                            >
                              <PublicIcon />
                              Countries
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/admin/club"
                              style={sfProDisplayStyle}
                              className={`text-bodydark1 group relative flex items-center gap-2.5 rounded-sm px-4 py-1.5 duration-300 ease-in-out hover:bg-white hover:text-black 
                              ${
                                pathname === "/admin/club"
                                  ? "bg-white text-black"
                                  : ""
                              }
                            } `}
                            >
                              <CasinoIcon />
                              Clubs
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/admin/club_teams"
                              style={sfProDisplayStyle}
                              className={`text-bodydark1 group relative flex items-center gap-2.5 rounded-sm px-4 py-1.5 duration-300 ease-in-out hover:bg-white hover:text-black 
                              ${
                                pathname === "/admin/club_teams"
                                  ? "bg-white text-black"
                                  : ""
                              }
                            } `}
                            >
                              <Groups3Icon />
                              Club Teams
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/admin/leagues"
                              style={sfProDisplayStyle}
                              className={`text-bodydark1 group relative flex items-center gap-2.5 rounded-sm px-4 py-1.5 duration-300 ease-in-out hover:bg-white hover:text-black 
                              ${
                                pathname.includes("/admin/leagues")
                                  ? "bg-white text-black"
                                  : ""
                              }`}
                            >
                              <EmojiEventsIcon />
                              Leagues
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/admin/players/dominances"
                              style={sfProDisplayStyle}
                              className={`text-bodydark1 group relative flex items-center gap-2.5 rounded-sm px-4 py-1.5 duration-300 ease-in-out hover:bg-white hover:text-black 
                              ${
                                pathname.includes("/admin/players/dominances")
                                  ? "bg-white text-black"
                                  : ""
                              }`}
                            >
                              <StormIcon />
                              Player Dominances
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/admin/players/positions"
                              style={sfProDisplayStyle}
                              className={`text-bodydark1 group relative flex items-center gap-2.5 rounded-sm px-4 py-1.5 duration-300 ease-in-out hover:bg-white hover:text-black 
                              ${
                                pathname.includes("/admin/players/positions")
                                  ? "bg-white text-black"
                                  : ""
                              }`}
                            >
                              <LeaderboardIcon />
                              Player Positions
                            </Link>
                          </li>

                          <li>
                            <Link
                              href="/admin/sports"
                              style={sfProDisplayStyle}
                              className={`text-bodydark1 group relative flex items-center gap-2.5 rounded-sm px-4 py-1.5 duration-300 ease-in-out hover:bg-white hover:text-black 
                              ${
                                pathname.includes("/admin/sports")
                                  ? "bg-white text-black"
                                  : ""
                              } `}
                            >
                              <SportsIcon />
                              Sports
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/admin/user_roles"
                              style={sfProDisplayStyle}
                              className={`text-bodydark1 group relative flex items-center gap-2.5 rounded-sm px-4 py-1.5 duration-300 ease-in-out hover:bg-white hover:text-black 
                              ${
                                pathname === "/admin/user_roles"
                                  ? "bg-white text-black"
                                  : ""
                              }`}
                            >
                              <ManageAccountsIcon />
                              User Roles
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/admin/user"
                              style={sfProDisplayStyle}
                              className={`text-bodydark1 group relative flex items-center gap-2.5 rounded-sm px-4 py-1.5 duration-300 ease-in-out hover:bg-white hover:text-black 
                              ${
                                pathname === "/admin/user"
                                  ? "bg-white text-black"
                                  : ""
                              }`}
                            >
                              <PersonIcon />
                              User Management
                            </Link>
                          </li>
                        </ul>
                      </div>
                      <li>
                        <Link
                          href="/admin/contract"
                          style={sfProDisplayStyle}
                          className={`text-bodydark1 group relative flex items-center gap-2.5 rounded-sm px-4 py-3 duration-300 ease-in-out hover:bg-white hover:text-black 
                          ${
                            pathname.includes("/admin/contract")
                              ? "bg-white text-black"
                              : ""
                          }`}
                        >
                          <LocalOfferIcon />
                          Contract Duration
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/admin/gallery"
                          style={sfProDisplayStyle}
                          className={`text-bodydark1 group relative flex items-center gap-2.5 rounded-sm px-4 py-3 duration-300 ease-in-out hover:bg-white hover:text-black 
                          ${
                            pathname.includes("/admin/gallery")
                              ? "bg-white text-black"
                              : ""
                          }`}
                        >
                          <Collections />
                          Gallery
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/admin/pendingLogs"
                          style={sfProDisplayStyle}
                          className={`text-bodydark1 group relative flex items-center gap-2.5 rounded-sm px-4 py-3 duration-300 ease-in-out hover:bg-white hover:text-black 
                          ${
                            pathname.includes("/admin/pendingLogs")
                              ? "bg-white text-black"
                              : ""
                          }`}
                        >
                          <LocalOfferIcon />
                          Pending Logs
                        </Link>
                      </li>
                      <li>
                        <SidebarLinkGroup
                          activeCondition={
                            pathname === "/forms" || pathname.includes("forms")
                          }
                        >
                          {(handleClick, open) => {
                            return (
                              <React.Fragment>
                                <Link
                                  href="#"
                                  style={sfProDisplayStyle}
                                  className={`text-bodydark1 group relative flex items-center gap-2.5 rounded-sm px-4 py-3 duration-300 ease-in-out hover:bg-white hover:text-black 
                                  ${
                                    pathname.includes("#")
                                      ? "bg-white text-black"
                                      : ""
                                  }`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    sidebarExpanded
                                      ? handleClick()
                                      : setSidebarExpanded(true);
                                  }}
                                >
                                  <ModeOfTravelIcon />
                                  Journey
                                  <svg
                                    className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                                      open && "rotate-180"
                                    }`}
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                      fill=""
                                    />
                                  </svg>
                                </Link>
                                <div
                                  className={`translate transform overflow-hidden ${
                                    !open && "hidden"
                                  }`}
                                >
                                  <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                                    <li>
                                      <Link
                                        href="/admin/journey/badge"
                                        style={sfProDisplayStyle}
                                        className={`text-bodydark1 group relative flex items-center gap-2.5 rounded-sm px-4 py-1.5 duration-300 ease-in-out hover:bg-white hover:text-black 
                                        ${
                                          pathname.includes(
                                            "/admin/journey/badge"
                                          )
                                            ? "bg-white text-black"
                                            : ""
                                        }`}
                                      >
                                        <LocalPoliceIcon />
                                        Badge
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        href="/admin/journey/category"
                                        style={sfProDisplayStyle}
                                        className={`text-bodydark1 group relative flex items-center gap-2.5 rounded-sm px-4 py-1.5 duration-300 ease-in-out hover:bg-white hover:text-black 
                                        ${
                                          pathname.includes(
                                            "/admin/journey/category"
                                          )
                                            ? "bg-white text-black"
                                            : ""
                                        }`}
                                      >
                                        <GridViewIcon />
                                        Catagories
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        href="/admin/journey/drill"
                                        style={sfProDisplayStyle}
                                        className={`text-bodydark1 group relative flex items-center gap-2.5 rounded-sm px-4 py-1.5 duration-300 ease-in-out hover:bg-white hover:text-black 
                                        ${
                                          pathname.includes(
                                            "/admin/journey/drill"
                                          )
                                            ? "bg-white text-black"
                                            : ""
                                        }`}
                                      >
                                        <HandymanIcon />
                                        Drill
                                      </Link>
                                    </li>
                                    <li>
                                      <SidebarLinkGroup
                                        activeCondition={
                                          pathname ===
                                            "/admin/journey/pending_drills" ||
                                          pathname.includes(
                                            "/admin/journey/pending_drills"
                                          )
                                        }
                                      >
                                        {(handleClick, open) => (
                                          <React.Fragment>
                                            <Link
                                              href="#"
                                              style={sfProDisplayStyle}
                                              className={`text-bodydark1 group relative flex items-center gap-2.5 rounded-sm px-4 py-3 duration-300 ease-in-out hover:bg-white hover:text-black ${
                                                pathname.includes("#")
                                                  ? "bg-white text-black"
                                                  : ""
                                              }`}
                                              onClick={(e) => {
                                                e.preventDefault();
                                                sidebarExpanded
                                                  ? handleClick()
                                                  : setSidebarExpanded(true);
                                              }}
                                            >
                                              <PendingActionsIcon />
                                              Review Drills
                                              <svg
                                                className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                                                  open && "rotate-180"
                                                }`}
                                                width="20"
                                                height="20"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <path
                                                  fillRule="evenodd"
                                                  clipRule="evenodd"
                                                  d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                                  fill=""
                                                />
                                              </svg>
                                            </Link>
                                            <div
                                              className={`translate transform overflow-hidden ${
                                                !open && "hidden"
                                              }`}
                                            >
                                              <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                                                <li>
                                                  <Link
                                                    href="/admin/journey/approval_drills"
                                                    style={sfProDisplayStyle}
                                                    className={`text-bodydark1 group relative flex items-center gap-2.5 rounded-sm px-4 py-1.5 duration-300 ease-in-out hover:bg-white hover:text-black ${
                                                      pathname.includes(
                                                        "/admin/journey/pending_drills"
                                                      )
                                                        ? "bg-white text-black"
                                                        : ""
                                                    }`}
                                                  >
                                                    <ApprovalIcon />
                                                    For Approval
                                                  </Link>
                                                </li>
                                                <li>
                                                  <Link
                                                    href="/admin/journey/feedback_drills"
                                                    style={sfProDisplayStyle}
                                                    className={`text-bodydark1 group relative flex items-center gap-2.5 rounded-sm px-4 py-1.5 duration-300 ease-in-out hover:bg-white hover:text-black ${
                                                      pathname.includes(
                                                        "/admin/journey/pending_drills"
                                                      )
                                                        ? "bg-white text-black"
                                                        : ""
                                                    }`}
                                                  >
                                                    <FeedbackIcon />
                                                    For Feedback
                                                  </Link>
                                                </li>{" "}
                                              </ul>
                                            </div>
                                          </React.Fragment>
                                        )}
                                      </SidebarLinkGroup>
                                    </li>

                                    <li>
                                      <Link
                                        href="/admin/journey/featured_drills"
                                        style={sfProDisplayStyle}
                                        className={`text-bodydark1 group relative flex items-center gap-2.5 rounded-sm px-4 py-1.5 duration-300 ease-in-out hover:bg-white hover:text-black 
                                        ${
                                          pathname.includes(
                                            "/admin/journey/featured_drills"
                                          )
                                            ? "bg-white text-black"
                                            : ""
                                        }`}
                                      >
                                        <BeenhereIcon />
                                        Featured Drills
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        href="/admin/journey/stat"
                                        style={sfProDisplayStyle}
                                        className={`text-bodydark1 group relative flex items-center gap-2.5 rounded-sm px-4 py-1.5 duration-300 ease-in-out hover:bg-white hover:text-black 
                                        ${
                                          pathname.includes(
                                            "/admin/journey/stat"
                                          )
                                            ? "bg-white text-black"
                                            : ""
                                        }`}
                                      >
                                        <QueryStatsIcon />
                                        Stats
                                      </Link>
                                    </li>
                                  </ul>
                                </div>
                              </React.Fragment>
                            );
                          }}
                        </SidebarLinkGroup>
                      </li>

                      <li>
                        <SidebarLinkGroup
                          activeCondition={
                            pathname === "/admin/pendingApprovals" ||
                            pathname.includes("/admin/pendingApprovals")
                          }
                        >
                          {(handleClick, open) => (
                            <React.Fragment>
                              <Link
                                href="#"
                                style={sfProDisplayStyle}
                                className={`text-bodydark1 group relative flex items-center gap-2.5 rounded-sm px-4 py-3 duration-300 ease-in-out hover:bg-white hover:text-black 
          ${pathname.includes("#") ? "bg-white text-black" : ""}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  sidebarExpanded
                                    ? handleClick()
                                    : setSidebarExpanded(true);
                                }}
                              >
                                <PendingActionsIcon />
                                Pending Approvals
                                <svg
                                  className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                                    open && "rotate-180"
                                  }`}
                                  width="20"
                                  height="20"
                                  viewBox="0 0 20 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                    fill=""
                                  />
                                </svg>
                              </Link>
                              <div
                                className={`translate transform overflow-hidden ${
                                  !open && "hidden"
                                }`}
                              >
                                <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                                  <li>
                                    <Link
                                      href="/admin/pendingApprovals/additional_details"
                                      style={sfProDisplayStyle}
                                      className={`text-bodydark1 group relative flex items-center gap-2.5 rounded-sm px-4 py-1.5 duration-300 ease-in-out hover:bg-white hover:text-black 
                ${
                  pathname.includes("/admin/journey/pending_drills")
                    ? "bg-white text-black"
                    : ""
                }`}
                                    >
                                      <DetailsIcon />
                                      Additional Details Approvals
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href="/admin/pendingApprovals/entity_additions"
                                      style={sfProDisplayStyle}
                                      className={`text-bodydark1 group relative flex items-center gap-2.5 rounded-sm px-4 py-1.5 duration-300 ease-in-out hover:bg-white hover:text-black 
                ${
                  pathname.includes("/admin/journey/pending_drills")
                    ? "bg-white text-black"
                    : ""
                }`}
                                    >
                                      <InfoIcon />
                                      Entity Addition Requests{" "}
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </React.Fragment>
                          )}
                        </SidebarLinkGroup>
                      </li>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
