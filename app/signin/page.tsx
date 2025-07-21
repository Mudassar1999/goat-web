"use client";

import Footer from "../auth/signup/components/footer";
import Link from "next/link";
import Signin from "./components/Signin";
import "../auth/signup/components/AllComponent.scss";

const SigninPage = () => {
  return (
    <>
      <div className="All-Parent">

        <div className="All-content">
          <div className="logo-otr">
            <p className="heading">GOAT</p>
          </div>
          <Signin />
          <Footer />
        </div>

        <div className="video-otr">
          <video
            autoPlay
            muted
            loop
            className="video"
          >
            <source src="/video.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </>
  );
};

export default SigninPage;
