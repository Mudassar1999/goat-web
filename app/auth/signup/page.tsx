"use client";
import { useEffect, useState } from "react";
import MultiStepForm from "./components/MultiStepForm";
import Footer from "./components/footer";
import { Images } from "@/public/Images";
import Image from "next/image";
import "./components/AllComponent.scss";

const SignupPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [signupFormState, setSignupFormState] = useState({
    referredBy: "",
    userName: "",
    phone: null,
    firebaseUserId: "",
    roleId: null,
  });

  const isFindFriendsStep =
    (currentStep === 7 && signupFormState?.roleId === 4) ||
    (signupFormState?.roleId === 1 && currentStep === 12) ||
    ((signupFormState?.roleId === 2 || signupFormState?.roleId === 3) &&
      currentStep === 10);

  useEffect(() => {
    const user_info = localStorage.getItem("user_info");

    try {
      const userInfo = user_info ? JSON.parse(user_info) : null;
      if (userInfo && userInfo.firstName === null) {
        setCurrentStep(5);
      }
    } catch (error) {
      console.error("Error parsing user_info:", error);
      // Handle parsing error, if necessary
    }
  }, []);

  return (
    <>
      <div className="All-Parent">
        <div className="All-content">
          <div className="logo-otr">
            {currentStep === 1 || currentStep === 2 ? (
              <Image className="logo" src={Images.logo} alt="logo" />
            ) : (
              <p className="Header-SignUp ">GOAT</p>
            )}
          </div>
          <MultiStepForm
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            signupFormState={signupFormState}
            setSignupFormState={setSignupFormState}
          />
          <Footer />
        </div>
        <div className="video-otr">
          {isFindFriendsStep ? (
            <Image
              className="friendImg"
              src={Images.FindFriendImage}
              alt="FriendImg"
            />
          ) : (
            <video autoPlay muted loop className="video">
              <source src="/video.mp4" type="video/mp4" />
            </video>
          )}
        </div>
      </div>
    </>
  );
};

export default SignupPage;
