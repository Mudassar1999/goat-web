import CustomButton from "@/components/Button/CustomButton";
import Popup from "@/components/shared/Popup";
import { useProfile } from "@/providers/ProfileProvider";
import axios from "axios";
import React, { useRef, useState } from "react";
import Loading from "react-loading";
import { toast } from "react-toastify";

function ProfilePicturePopup({ onClose }: any) {
  const fileInputRef = useRef<any>(null);
  const { profile, setProfile } = useProfile();
  const [loading, setLoading] = useState<boolean>(false);
  const uploadProfileImage = async (selectedImage: any) => {
    setLoading(true);
    const form = new FormData();
    form.append("avatar", selectedImage);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/upload/profileImage`,
        form,
        {
          headers: {
            "Content-Type": `multipart/form-data`,
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (response.data && response.data.profileImage) {
        const user_info = localStorage.getItem("user_info");
        const userInfo = user_info ? JSON.parse(user_info) : null;

        if (userInfo) {
          userInfo.profileImage = response.data.profileImage;

          // Update localStorage with the modified user information
          localStorage.setItem("user_info", JSON.stringify(userInfo));
        }
      }

      setProfile((prevProfile: any) => ({
        ...prevProfile,
        user: {
          ...prevProfile.user,
          profileImage: response.data.profileImage,
        },
      }));
      onClose();
      toast.success(response.data.message);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageChange = (e: any) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      uploadProfileImage(selectedImage);
    }
  };
  const handleButtonClick = () => {
    // Trigger the hidden file input
    fileInputRef.current.click();
  };
  const deleteUserProfileImage = async () => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/users/delete/profileImage`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (response.data) {
        const user_info = localStorage.getItem("user_info");
        const userInfo = user_info ? JSON.parse(user_info) : null;

        if (userInfo) {
          userInfo.profileImage = "/goat/Profile%20Picture.jpeg";
          // Update localStorage with the modified user information
          localStorage.setItem("user_info", JSON.stringify(userInfo));
        }
      }
      setProfile((prevProfile: any) => ({
        ...prevProfile,
        user: {
          ...prevProfile.user,
          profileImage: "/goat/Profile%20Picture.jpeg",
        },
      }));
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };
  console.log("profileImage", profile?.user?.profileImage);
  return (
    <>
      <Popup onClose={() => onClose()}>
        <div className="px-6 py-6 lg:px-8">
          <div className="my-12">
            <div className="h-72 w-72 rounded-full mx-auto bg-black">
              {loading ? (
                <div className="flex items-center justify-center h-72">
                  <Loading type="spokes" width={30} height={30} />
                </div>
              ) : (
                <img
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${profile?.user?.profileImage}`}
                  alt=""
                  className="h-72 w-72 rounded-full "
                />
              )}
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
            ref={fileInputRef}
          />
          <div className="flex flex-col gap-2">
            <CustomButton
              title="Upload a photo"
              onClick={() => handleButtonClick()}
            />
            {profile?.user?.profileImage &&
              profile?.user?.profileImage !==
                "/goat/Profile%20Picture.jpeg" && (
                <CustomButton
                  title="Delete photo"
                  className="rounded-2xl border border-lime-300 !bg-transparent enter !text-lime-300 !text-base !font-semibold"
                  onClick={() => deleteUserProfileImage()}
                />
              )}
          </div>
        </div>
      </Popup>
    </>
  );
}
export default ProfilePicturePopup;
