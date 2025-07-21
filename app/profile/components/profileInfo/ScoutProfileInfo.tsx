import { useProfile } from "@/providers/ProfileProvider";
import { Images } from "@/public/Images";
import Image from "next/image";
import { useState } from "react";
import Loading from "react-loading";

function ScoutProfileInfo({ setProfilePicturePopup }: any) {
  const { profile, setProfile } = useProfile();
  const [loading, setLoading] = useState<boolean>(false);
  function formatDate(dateString: any) {
    const options: any = { day: "2-digit", month: "short", year: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  }
  
  const userImage = profile?.user?.profileImage;
  const otherUserImage = profile?.otherUser?.profileImage;
  const imageUrl = `${process.env.NEXT_PUBLIC_IMAGE_URL + (userImage || otherUserImage)
    }`;

  return (
    <>
      <div className="relative">
        {/* <Image src={Images.scoutGround} alt="" className="w-full" /> */}
        <div>
          <div className="rounded-full mx-auto relative">
            {loading ? (
              <div className="flex  items-center justify-center ">
                <Loading type="spokes" width={30} height={30} />
              </div>
            ) : (
              // <img src={imageUrl} alt="" className="h-24 w-24 rounded-full " />
              <div className="userProfileimgOtr">
                <img src={imageUrl} className="userProfileimg" alt="img" />
                <div className="forTry">
                  {profile?.user && (
                    <button
                      className="addIcon"
                      onClick={() => setProfilePicturePopup(true)}
                    >
                      <Image src={Images.edit} alt="edit" />
                    </button>
                  )}
                </div>
              </div>
            )}
            {/* {!profile?.otherUser && (
              <button
                onClick={() => setProfilePicturePopup(true)}
                className="absolute bottom-0 right-0"
              >
                <Image src={Images.edit} alt="edit" />
              </button>
            )} */}
          </div>
        </div>
        <div className="details text-center pt-[184px]">
          <p className="detailname heading-bold">
            {profile?.user?.firstName || profile?.otherUser?.firstName}
          </p>
          <p className="mail desc">
            @{profile?.user?.userName || profile?.otherUser?.userName}
          </p>
        </div>
        {/* <div>
          <h2 className="text-center text-white text-xl font-bold font-['SF Pro Display'] leading-7 tracking-tight">
            {profile?.user?.firstName || profile?.otherUser?.firstName}
          </h2>
          <p className="text-center text-violet-100 text-opacity-60 text-base font-normal font-['SF Pro Text'] leading-tight">
            @jimmybudd
          </p>
        </div> */}
      </div>
    </>
  );
}
export default ScoutProfileInfo;
