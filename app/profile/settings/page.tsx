"use client";
import React, { useState } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import ForwordIcon from "@/assests/svg/forwordIcon";
import ForwordRedIcon from "@/assests/svg/forwardRed";
import "./settings.scss"
import "../../auth/signup/components/AllComponent.scss"
import Popup from '@/components/shared/authPopup';
import ConfirmLogout from "@/app/profile/personalInformation/logout";
import ConfirmDeleteAccoutn from "@/app/profile/personalInformation/deleteAccount";
import ProtectedRoutes from "@/app/ProtectedRoutes";
import { useProfile } from "@/providers/ProfileProvider";

const Settings = () => {
  const [logoutPopup, setLogoutPopup] = useState<boolean>(false);
  const [deleteAccountPopup, setDeleteAccountPopup] = useState<boolean>(false);

  const router = useRouter();
  const { profile } = useProfile();

  const goBack = () => {
    router.back();
  };

  return (
    <>
      <Header />
      <div className="journeyContainer settings-otr">
        <div className="p-2 rounded-full w-10 bg-[#7878805c] ">
          <ArrowLeftIcon
            className="cursor-pointer hover:font-bold"
            onClick={goBack}
          />
        </div>

        <div className="settings-inner">
          <div className="pb-[5px]">
            <span className="text-17">Settings</span>
          </div>

          <p className="text-13">GENERAL</p>
          <div className="general-container">
            <div
              className="card-container border-below"
              onClick={() => router.push("/profile/settings/personal-information")}
            >
              <p className="text-17 font-weight-400">Personal Information</p>
              <div className=" cursor-pointer">
                <ForwordIcon />
              </div>
            </div>
            {profile?.user?.roleId !== 4 &&
              <div
                className="card-container border-below"
                onClick={() => router.push("/profile/settings/professional-information")}
              >
                <p className="text-17 font-weight-400">Professional Details</p>
                <div className=" cursor-pointer">
                  <ForwordIcon />
                </div>
              </div>}
            <div className="card-container" onClick={() => router.push("/profile/settings/privacy")}>
              <p className="text-17 font-weight-400">Privacy</p>
              <div className=" cursor-pointer">
                <ForwordIcon />
              </div>
            </div>
          </div>

          <p className="text-13 pt-[24px]">SUBSCRIPTION</p>
          <div
            className="general-container card-container"
            onClick={() => router.push("/profile/personalInformation")}
          >
            <p className="text-17 font-weight-400">GOAT Pro</p>
            <div className=" cursor-pointer">
              <ForwordIcon />
            </div>
          </div>

          <div className="mt-[80px]">
            <div
              className="general-container card-container"
              onClick={() => setLogoutPopup(true)}
            >
              <p className="text-17 font-weight-400">Sign out</p>
              <div className=" cursor-pointer">
                <ForwordIcon />
              </div>
            </div>
            <div
              className="general-container card-container"
              onClick={() => setDeleteAccountPopup(true)}
            >
              <p className="text-17 font-weight-400 color-red">Delete Account</p>
              <div className=" cursor-pointer">
                <ForwordRedIcon />
              </div>
            </div>
          </div>
        </div>
      </div>

      {logoutPopup && (
        <Popup onClose={() => setLogoutPopup(false)}>
          <ConfirmLogout onClose={() => setLogoutPopup(false)} />
        </Popup>
      )}

      {deleteAccountPopup && (
        <Popup onClose={() => setDeleteAccountPopup(false)}>
          <ConfirmDeleteAccoutn setDeleteAccountPopup={setDeleteAccountPopup} />
        </Popup>
      )}
    </>
  );
};

export default ProtectedRoutes(Settings);
