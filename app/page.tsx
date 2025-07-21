"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Reel from "@/components/shared/reel/Reel";
import Header from "@/components/Header";
import axios from "axios";
import { toast } from "react-toastify";
import Footer from "@/components/Footer";
import AuthFooter from "./auth/signup/components/footer";
import { Images } from "@/public/Images";
import Image from "next/image";
import { usePosts } from "@/providers/PostsProvider";
import "./ForStyles/main.scss";
import Loading from "react-loading";

// const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [homeScreen, setHomeScreen] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { setPosts } = usePosts();

  // const token = localStorage.getItem("access_token");
  // if (token) {
  //   // router.push("/auth/signup");
  //   setHomeScreen(true);
  // }
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setHomeScreen(true);
    } else {
      router.push("/get-started");
    }
    setLoading(false);
  }, []);
  // useEffect(() => {
  //   const user_info = localStorage.getItem("user_info");

  //   try {
  //     const userInfo = user_info ? JSON.parse(user_info) : null;
  //     if (!userInfo) {
  //       toast.error("Complete your profile first");
  //       router.push(`/auth/signup`);
  //     }
  //   } catch (error) {
  //     console.error("Error parsing user_info:", error);
  //     // Handle parsing error, if necessary
  //   }
  // }, []);
  useEffect(() => {
    getAllPosts();
  }, []);
  const getAllPosts = async () => {
    // setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/home/getHomeReelsNew`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setPosts(response.data);
      // setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    // <>
    //   {loading ? (
    //     // Show a loading indicator or splash screen while checking the token
    //     <div className="flex items-center justify-center h-screen">
    //       <Loading type="spokes" color="#747474" className="mx-auto" />
    //     </div>
    //   ) : (
    //     <>
    //       {homeScreen ? (
    //         <>
    //           <Header />
    //           <div className="">
    //             <div className="divide-zinc-600 divide-y divide-opacity-60">
    //               <Reel showDeleteIcon={false} />
    //             </div>
    //             <Footer />
    //           </div>
    //         </>
    //       ) : (
    //         <section className="Splash-screen">
    //           <div className="row row-splash">
    //             <div className="splash-content-otr">
    //               <div className="logo-otr">
    //                 <Image className="logo" src={Images.logo} alt="logo" />
    //               </div>
    //               <div className="main-splash">
    //                 <div className="container">
    //                   <div className="splash-content">
    //                     <p className="heading-bold splash-heading">
    //                       Connect with sports professionals worldwide.
    //                     </p>
    //                     <p className="desc splash-desc">
    //                       Connect with scouts, managers, and fans to help
    //                       kickstart your professional career.
    //                     </p>
    //                     <div className="action-main">
    //                       <div className="Light-smallbtn-otr">
    //                         <div
    //                           className="Light-smallbtn-inr"
    //                           onClick={() => router.push("/auth/signup")}
    //                         >
    //                           Get Started
    //                         </div>
    //                       </div>
    //                       <div className="Dark-smallbtn-otr">
    //                         <div
    //                           className="Dark-smallbtn-inr"
    //                           onClick={() => router.push("/signin")}
    //                         >
    //                           Sign In
    //                         </div>
    //                       </div>
    //                     </div>
    //                   </div>
    //                 </div>
    //               </div>
    //               <AuthFooter />
    //             </div>
    //             <div className="video-otr">
    //               <video autoPlay muted loop className="video">
    //                 <source src="/video.mp4" type="video/mp4" />
    //               </video>
    //             </div>
    //           </div>
    //         </section>
    //       )}
    //     </>
    //   )}
    // </>
    <>
      {homeScreen ? (
        <>
          <Header />
          <div className="">
            <div className="">
              <Reel showDeleteIcon={false} />
            </div>
            <Footer />
          </div>
        </>
      ) : (
        // <section className="Splash-screen">
        //   <div className="row row-splash">
        //     <div className="splash-content-otr">
        //       <div className="logo-otr">
        //         <Image className="logo" src={Images.logo} alt="logo" />
        //       </div>
        //       <div className="main-splash">
        //         <div className="container">
        //           <div className="splash-content">
        //             <p className="heading-bold splash-heading">
        //               Connect with sports professionals worldwide.
        //             </p>
        //             <p className="desc splash-desc">
        //               Connect with scouts, managers, and fans to help kickstart
        //               your professional career.
        //             </p>
        //             <div className="action-main">
        //               <div className="Light-smallbtn-otr">
        //                 <div
        //                   className="Light-smallbtn-inr"
        //                   onClick={() => router.push("/auth/signup")}
        //                 >
        //                   Get Started
        //                 </div>
        //               </div>
        //               <div className="Dark-smallbtn-otr">
        //                 <div
        //                   className="Dark-smallbtn-inr"
        //                   onClick={() => router.push("/signin")}
        //                 >
        //                   Sign In
        //                 </div>
        //               </div>
        //             </div>
        //           </div>
        //         </div>
        //       </div>
        //       <AuthFooter />
        //     </div>
        //     <div className="video-otr">
        //       <video autoPlay muted loop className="video">
        //         <source src="/video.mp4" type="video/mp4" />
        //       </video>
        //     </div>
        //   </div>
        // </section>
        <section>
          <div className="flex justify-center items-center h-screen">
            <div>
              <Image className="w-[200px]" src={Images.splashLogo} alt="logo" />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
