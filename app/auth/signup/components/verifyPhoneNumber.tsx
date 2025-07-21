"use client";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import OtpVerification from "@/components/otpVerification/OtpVerification";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import "./AllComponent.scss";

const VerifyPhoneNumber = ({
  setCurrentStep,
  signupFormState,
  setSignupFormState,
}: any) => {
  const router = useRouter();
  const [responseData, setResponseData] = useState<[]>([]);
  const [showOTP, setShowOTP] = useState(false);

  useEffect(() => {
    if (signupFormState.phone !== "" && signupFormState.firebaseUserId !== "") {
      signUpUser();
      setCurrentStep(5);
    }
  }, [signupFormState]);

  const signUpUser = async () => {
    try {
      const formData = JSON.stringify(signupFormState);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      localStorage.setItem("refresh_token", response.data.refreshToken);
      localStorage.setItem("access_token", response.data.accessToken);
      // setResponseData(response.data);
    } catch (error: any) {
      console.error(error);
      // if (error.response.status === 409) {
      //   toast.error("Already Register User Please Sign in");
      //   router.push("/signin");
      // }
    }
  };
  // console.log("response is", responseData);
  return (
    <div className="main-verifyNumber">
      {showOTP ? (
        <h3 className="pb-[5px] heading-bold heading-main-verifyNumber">
          6-digit code
        </h3>
      ) : (
        <h3 className="heading-bold heading-main-verifyNumber">
          Verify your phone number
        </h3>
      )}
      {/* <p className="text-body-color mb-8  text-base text-slate-400">
        We'll send you a code to verify your phone number.
      </p> */}
      {!showOTP && (
        <p className="desc desc-main-verifyNumber">
          We’ll send you a code to verify your phone number.
        </p>
      )}
      <OtpVerification
        authFormState={signupFormState}
        setAuthFormState={setSignupFormState}
        showOTP={showOTP}
        setShowOTP={setShowOTP}
      />
    </div>
  );
};

export { VerifyPhoneNumber };
