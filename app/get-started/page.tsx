"use client";
import { useRouter } from "next/navigation";
import AuthFooter from "../auth/signup/components/footer";
import { Images } from "@/public/Images";
import Image from "next/image";
import "../ForStyles/main.scss";
function GetStarted() {
  const router = useRouter();
  return (
    <>
      <section className="Splash-screen">
        <div className="row row-splash">
          <div className="splash-content-otr">
            <div className="logo-otr">
              <Image className="logo" src={Images.logo} alt="logo" />
            </div>
            <div className="main-splash">
              <div className="container">
                <div className="splash-content">
                  <p className="heading-bold splash-heading">
                    Connect with sports professionals worldwide.
                  </p>
                  <p className="desc splash-desc">
                    Connect with scouts, managers, and fans to help kickstart
                    your professional career.
                  </p>
                  <div className="action-main">
                    <div className="Light-smallbtn-otr">
                      <div
                        className="Light-smallbtn-inr"
                        onClick={() => router.push("/auth/signup")}
                      >
                        Get Started
                      </div>
                    </div>
                    <div className="Dark-smallbtn-otr">
                      <div
                        className="Dark-smallbtn-inr"
                        onClick={() => router.push("/signin")}
                      >
                        Sign In
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <AuthFooter />
          </div>
          <div className="video-otr">
            <video autoPlay muted loop className="video">
              <source src="/video.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>
    </>
  );
}
export default GetStarted;
