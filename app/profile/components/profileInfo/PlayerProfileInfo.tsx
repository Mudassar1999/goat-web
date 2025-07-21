import QuestionMark from "@/assests/svg/QuestionMark";
import { useProfile } from "@/providers/ProfileProvider";
import { Images } from "@/public/Images";
import Image from "next/image";
import { useState } from "react";
import Loading from "react-loading";

function PlayerProfileInfo({ setProfilePicturePopup }: any) {
  const { profile } = useProfile();
  const [loading, setLoading] = useState<boolean>(false);

  function formatDate(dateString: any) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-us", { month: "short" });
    const year = date.getFullYear();

    return {
      day,
      month,
      year,
    };
  }

  const { user, otherUser } = profile || {};

  const userData = {
    userName: user?.userName || otherUser?.userName,
    clubImage: profile?.sportsData[0]?.playingClub?.image,
    dateOfBirth: formatDate(user?.dateOfBirth || otherUser?.dateOfBirth),
    isImperial: user?.isImperial || otherUser?.isImperial,
    weight: user?.weight || otherUser?.weight,
    height: user?.height || otherUser?.height,
  };

  return (
    <>
      <div className="profileContent-left-inr">
        {(profile?.user?.roleId === 1 || profile?.otherUser?.roleId === 1) && (
          <div className="profile-bg-otr">
            <Image
              className="profile-bg w-[220px]"
              src={Images.profileBg}
              alt="FriendImg"
            />

            <div className="clubs-images-otr">
              <ul className="clubs-images-ul">
                <li className="clubs-images-li">
                  {(userData?.clubImage && userData?.clubImage !== " ") && (
                    <img
                      className="club-image"
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${userData?.clubImage}`}
                      width={36}
                      height={36}
                      alt="club-img"
                    />
                  )}
                </li>
              </ul>
            </div>

            <div className="circle-img h-28 w-28 rounded-full">
              {loading ? (
                <div className="flex  items-center justify-center ">
                  <Loading type="spokes" width={30} height={30} />
                </div>
              ) : (
                <img
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${profile?.user?.profileImage ||
                    profile?.otherUser?.profileImage
                    }`}
                  alt=""
                  className="h-28 w-28 rounded-full "
                />
              )}
            </div>
            <h1
              className={`text-center uppercase namCenter 
            ${userData.userName.length < 10 ? "heading-bold-28" : "text-15-bold"}`}>
              {userData.userName}
            </h1>
            <p className="DateCenter">
              {formatDate(user?.dateOfBirth || otherUser?.dateOfBirth).day}{" "}
              {formatDate(user?.dateOfBirth || otherUser?.dateOfBirth).month}{" "}
              {formatDate(user?.dateOfBirth || otherUser?.dateOfBirth).year}
            </p>
            {userData.weight &&
              <p className="heightcenter">
                {`${userData.weight} ${userData.isImperial ? "Pounds" : "KG"
                  }`}
              </p>
            }
            {userData.height &&
              <p className="weightCenter">
                {`${userData.height} ${userData.isImperial ? "Inches" : "CM"}`}
              </p>
            }
            <p className="CnameCenter">
              {profile?.sportsData[0]?.playingClub?.name}
            </p>
            <p className="PCenter">
              {
                profile?.sportsData[0]?.playingPositions[0]?.PlayerPosition
                  ?.name
              }
            </p>
            <div className="imageCenterOtr">
              <Image src={Images.logo} alt="" className="imageCenterInr" />
            </div>
            {profile?.user && (
              <button
                className="addIcon"
                onClick={() => setProfilePicturePopup(true)}
              >
                <Image src={Images.edit} alt="edit" />
              </button>
            )}
          </div>
        )}

        {(profile?.user?.showScoutedBadge) && (
          <div className="scoutbtn-otr">
            <div className="scoutbtn-inr desc">
              Scouted
              <div className="scoutbtn-icon">
                <QuestionMark />
              </div>
            </div>
          </div>
        )}

        {/* {profile?.user.roleId !== 1 && <div className="details">
          <p className="detailname heading-bold">Jimmy Budd</p>
          <p className="mail desc">jimmybudd</p>
        </div>} */}
        {/* <div className="profileUserimages-otr">
          <div className="profileUserimages-inr">
            <div className="userImage1">
              <div className="userImage">i</div>
            </div>
            <div className="userImage2">
              <div className="userImage">i</div>
            </div>
            <div className="userImage3">
              <div className="userImage">i</div>
            </div>
            <div className="userImage4">
              <div className="userImage">i</div>
            </div>
            <div className="userImage5">
              <div className="userImage">i</div>
            </div>
          </div>
          <p className="desc-userImages">Dave Budd, James Reed, and 13 other mutual followers</p>
        </div> */}
      </div>
    </>
  );
}
export default PlayerProfileInfo;
