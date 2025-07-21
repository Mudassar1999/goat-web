"use client";
import React, { useEffect, useRef, useState } from "react";
import { ArrowRightIcon } from "lucide-react";
import { CgSpinner } from "react-icons/cg";
import "react-phone-input-2/lib/style.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import PhoneInput from "react-phone-input-2";
// import OtpInput from "otp-input-react";
import OtpInput from "react-otp-input";
import { PhoneInput } from "@/components/ui/phone-input-field";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "../../app/firbase";
import { useForm } from "@/providers/FormProvider";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../app/firbase";
import { searchDocument } from "@/utils/searchFirebaseDocu";
import { useRouter } from "next/navigation";
import "./otp.scss";
import Image from "next/image";
import { Images } from "@/public/Images";
import "../../app/auth/signup/components/AllComponent.scss";

const OtpVerification = ({
  authFormState,
  setAuthFormState,
  showOTP,
  setShowOTP,
}: any) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({ message: "", code: "" });
  const [formatPhoneNumber, setFormatPhoneNumber] = useState<any>();
  const [resendCountdown, setResendCountdown] = useState(59);

  const { formState, setFormState } = useForm();
  const router = useRouter();
  const registrationInitiatedRef = useRef(false);

  useEffect(() => {
    if (showOTP && resendCountdown > 0) {
      const countdownInterval = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
      return () => {
        clearInterval(countdownInterval);
      };
    }
  }, [showOTP, resendCountdown]);

  const handleResendOTP = () => {
    initiateSignInProcess();
    setOtp("");
    setResendCountdown(59);
  };

  function onCaptchVerify() {
    if (!window?.recaptchaVerifier) {
      window.recaptchaVerifier = createRecaptchaVerifier();
    }
  }

  // Define a function to create the reCAPTCHA verifier.
  const createRecaptchaVerifier = () => {
    return new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: initiateSignInProcess,
      "expired-callback": () => {},
    });
  };

  async function initiateSignInProcess(): Promise<void> {
    setLoading(true);
    onCaptchVerify();
    const appVerifier = await window.recaptchaVerifier;
    const formatPh = formState?.phoneCode + formState?.phoneNumber;
    setFormatPhoneNumber(formatPh);
    const newUserDetails = {
      email: authFormState?.email ? authFormState?.email : "",
      fcmToken: "",
      firebaseUserId: authFormState?.firebaseUserId,
      phone: formatPh,
      refferedBy: authFormState?.referredBy,
      roleId: authFormState?.roleId,
      signupVia: "Phone Number",
      socialUId: "",
      userName: authFormState?.userName,
    };

    const usersCollection = collection(db, "users");

    if (!authFormState?.firebaseUserId) {
      try {
        const isRegistered = await searchDocument("phone", formatPh);
        if (window.location.pathname === "/auth/signup") {
          if (isRegistered && !registrationInitiatedRef.current) {
            toast.warning("Phone number already registered!");
            router.push(`/signin`);
            return;
          } else if (!registrationInitiatedRef.current) {
            registrationInitiatedRef.current = true;

            addDoc(usersCollection, newUserDetails)
              .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
                localStorage.setItem("firebaseDocuId", docRef.id);
              })
              .catch((error) => {
                console.error("Error adding document: ", error);
              });
          }
        } else if (window.location.pathname === "/signin") {
          if (!isRegistered) {
            toast.error("User not registered, Please create your account");
            // router.push(`/auth/signup`);
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error("Error during document search:", error);
        return;
      }
    }
    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then(handleSignInSuccess)
      .catch(handleSignInError);
  }

  // Define a function to handle successful sign-in.
  const handleSignInSuccess = (confirmationResult: any) => {
    setLoading(false);
    setShowOTP(true);
    // console.log("toast called");
    // toast.success("OTP sent successfully!");
    window.confirmationResult = confirmationResult;
  };

  // Define a function to handle sign-in error.
  const handleSignInError = (error: any) => {
    setLoading(false);
  };

  function onOTPVerify(enteredOTP: any) {
    setLoading(true);
    window.confirmationResult
      .confirm(enteredOTP)
      .then(handleOTPConfirmation)
      .catch(handleOTPError);
  }

  // Define a function to handle OTP confirmation.
  const handleOTPConfirmation = (res: any) => {
    setAuthFormState({
      ...authFormState,
      phone: res.user.phoneNumber,
      firebaseUserId: res.user.uid,
    });
    setFormState({
      ...formState,
      phoneNumber: res.user.phoneNumber,
    });
    setLoading(false);
  };

  // Define a function to handle OTP confirmation error.
  const handleOTPError = (err: any) => {
    toast.error("Please enter the valid OTP");
    setLoading(false);
  };

  const handleOTPChange = (otp: any) => {
    setOtp(otp);
    if (otp.length === 6) {
      onOTPVerify(otp);
    }
  };
  const changeHandler = (e: any) => {
    const { name, value } = e.target;
    setFormState((formState: any) => ({
      ...formState,
      [name]: value,
    }));
  };
  const phoneNumberHandler = (countryCode: any, phoneCode: any) => {
    setFormState((formState: any) => ({
      ...formState,
      phoneCode: phoneCode,
      countryCode: countryCode,
    }));
  };

  return (
    <div>
      <div id="recaptcha-container"></div>
      <div className="flex flex-col rounded-lg">
        {showOTP ? (
          <>
            <p className="mb-8 text-violet-100 text-[17px] font-normal leading-[22px] tracking-[-0.408px]">
              Please enter the code we’ve sent to {formatPhoneNumber}
            </p>
            <div className="flex justify-center">
              <OtpInput
                value={otp}
                onChange={handleOTPChange}
                numInputs={6}
                renderSeparator={(index) =>
                  index === 2 ? (
                    <span className="text-[#EBEBF54D]">-</span>
                  ) : null
                }
                renderInput={(props) => (
                  <input {...props} className="otpInput" />
                )}
                inputType="tel"
                shouldAutoFocus
                containerStyle={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
                inputStyle={{
                  width: "14%",
                  height: "40px",
                  borderRadius: "8px",
                  border: "none",
                  outline: "none",
                  textAlign: "center",
                  // fontFamily: 'SFProDisplay-Bold',
                  fontFamily: "var(--font-sf-pro-display)",
                  fontSize: "22px",
                  fontStyle: "normal",
                  fontWeight: "700",
                  lineHeight: "28px",
                  letterSpacing: "0.35px",
                  color: "white",
                  backgroundColor: "rgba(118, 118, 128, 0.24)",
                }}
              />
            </div>
            {/* {resendCountdown === 0
                  ? "Resend Code"
                  : `Resend Code in ${Math.floor(
                      resendCountdown / 60
                    )}:${String(resendCountdown % 60).padStart(2, "0")}`} */}
            <div
              className="otpbtn-otr mt-6"
              onClick={resendCountdown === 0 ? handleResendOTP : undefined}
            >
              <div className="otpbtn-inr flex justify-center">
                {resendCountdown === 0 ? (
                  <Image
                    className="resend-otp"
                    src={Images.resendArrow}
                    alt="resend"
                  />
                ) : (
                  <div>
                    Resend code in {Math.floor(resendCountdown / 60)}:
                    {String(resendCountdown % 60).padStart(2, "0")}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <PhoneInput
              placeholder="Mobile number"
              // className="mt-[6px] bg-white"
              className={`
        ${
          response.code === ""
            ? "border-transparent"
            : response.code === "200"
              ? "border-2 border-lime-300"
              : "border-2 border-[#FF453A]"
        }
        `}
              name="phoneNumber"
              type="number"
              required
              phoneNumberHandler={phoneNumberHandler}
              onChange={changeHandler}
              countryCode={formState?.countryCode}
              value={formState?.phoneNumber}
            />
            {/* 
            <div className="input-otr w-full">
              <input type="text"  className="input-inr" placeholder="+20 123 456 789"/>
            </div> */}
            <button
              className="mt-8 dark:hover:bg-lime-450 flex w-full items-center justify-center rounded-xl bg-lime-300 py-[14px] px-[20px] text-[17px] font-semibold dark:bg-lime-300 dark:text-[#163300] leading-[22px] tracking-[-0.408px]"
              onClick={initiateSignInProcess}
              id="sign-in-button"
            >
              {loading && (
                <CgSpinner size={20} className="mr-[10px] animate-spin" />
              )}
              Continue
              <ArrowRightIcon className="ml-[10px]" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default OtpVerification;
