import CustomButton from "@/components/Button/CustomButton";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AiOutlineExclamationCircle } from "react-icons/ai";

const ConfirmLogout = ({ onClose }: any) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const logoutUser = async () => {
    // setLoading(true);
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
          data: {
            refreshToken: refreshToken,
          },
        }
      );
      localStorage.clear();
      onClose();
      toast.success(response?.data?.message);
      // setLoading(false);
      router.push(`/signin`);
    } catch (error: any) {
      setLoading(false);
      console.log(error);
    }
    // onClose();
  };

  // const handleCanclePress = () => {
  //   setLogoutPopup(false);
  // };

  return (
    <>
      {loading ? (
        <></>
      ) : (
        <div className="">
          <h2 className="headingLogout">
            Sign Out
          </h2>
          <p className="desc desc-LogOut">Are you sure you want to sign out from account?</p>
          <div className="PopUpLogActions">
            <div className="delbtnotr cursor-pointer" onClick={logoutUser}>
              <div className="delbtn">Yes, sign out.</div>
            </div>
            <div className="cancelbtnotr cursor-pointer" onClick={() => onClose()}>
              <div className="cancelbtn">Cancel</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmLogout;
