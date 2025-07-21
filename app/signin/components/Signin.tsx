"use client";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import OtpVerification from "@/components/otpVerification/OtpVerification";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "@/providers/FormProvider";
import { Images } from "@/public/Images";
import Image from "next/image";

const Signin = () => {
  const [showOTP, setShowOTP] = useState(false);
  const [signinFormState, setSigninFormState] = useState<any>({
    phone: "",
    firebaseUserId: "",
  });
  const [responseData, setResponseData] = useState<[]>([]);
  const router = useRouter();
  const { formState } = useForm();
  useEffect(() => {
    if (signinFormState.phone !== "" && signinFormState.firebaseUserId !== "") {
      signInUser();
    }
  }, [signinFormState]);
  // useEffect(() => {
  //   const token = localStorage.getItem("access_token");
  //   if (token) {
  //     try {
  //       router.push("/profile");
  //     } catch (error) {
  //       console.log("error>>>", error);
  //     }
  //   }
  // }, []);
  useEffect(() => {
    if (formState.phoneNumber !== "") {
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        router.push("/");
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      refreshToken(); // Refresh the token if not available
    }
  }, [responseData]);

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
          { refreshToken },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        localStorage.setItem("access_token", response.data.accessToken);
      }
    } catch (error) {
      console.error("Token refresh error:", error);
    }
  };

  const fetchUser = async () => {
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/users/profile`;

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  };

  const signInUser = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-login-otp`,
        signinFormState,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setResponseData(response.data);
      localStorage.setItem("access_token", response.data.accessToken);
      localStorage.setItem("refresh_token", response.data.refreshToken);
      const userSport = await fetchUser();
      localStorage.setItem("user_sport", JSON.stringify(userSport.sportsData[0]));
      localStorage.setItem("user_info", JSON.stringify(response.data.user));
    } catch (error) {
      console.error(error);
    }
  };

  const goBack = () => {
    if (showOTP) {
      window.location.reload()
      setShowOTP(false)
    } else {
      router.push("/get-started")
    }
  };

  return (
    <>
      <div className="forSteps">
        <div className="again">
          <div className="Arrow-otr">
            <div className="ourArrowLeft-Icon">
              <div className="ArrowLeft-inr" onClick={goBack}>
                <div className="">
                  <div className="Arrow-icon bg-[#7474802E] rounded-full h-10 w-10 flex justify-center items-center cursor-pointer">
                    <Image src={Images.arrowLeft} alt="img" />
                  </div>
                </div>
              </div> </div>
          </div>
          <div className="container">
            <h3 className="heading-bold dark:text-white">
              Login
            </h3>
            {!showOTP && (
              <p className="text-body-color desc pt-[4px] pb-[32px] ">
                We’ll send you a 6-digit code to your phone to login.
              </p>
            )}
            <OtpVerification
              authFormState={signinFormState}
              setAuthFormState={setSigninFormState}
              showOTP={showOTP}
              setShowOTP={setShowOTP}
            />
            <p className="already-account text-17-bold color-gray">
              Don&apos;t You have account?
              <span className="pl-[5px] color-green">
                <Link
                  href={{
                    pathname: "/auth/signup",
                  }}
                  style={{
                    textDecoration: "none",
                  }}
                >
                  Create account
                </Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signin
