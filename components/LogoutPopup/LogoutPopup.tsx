import axios from "axios";
import {
  useEffect,
  useState,
  useRef,
  MouseEvent,
  Dispatch,
  SetStateAction,
} from "react";
import { useRouter } from "next/navigation";
import { MdLogout } from "react-icons/md";
import { toast } from "react-toastify";

function LogoutPopup({ onClose }: any) {
  const [userInformation, setUserInformation] = useState<any>({});
  const logoutRef = useRef<any>(null);
  const router = useRouter();

  const logoutUser = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      console.log("refreshToken", refreshToken);
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
      toast.success(response?.data?.message);
      router.push(`/signin`);
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Attach click event listener to the body
    const handleBodyClick: any = (event: MouseEvent<HTMLBodyElement>) => {
      // Check if the click is outside the notification popup
      if (
        logoutRef.current &&
        !logoutRef.current.contains(event.target as Node)
      ) {
        // Close the notification popup or perform any other action
        onClose();
      }
    };

    // Add the event listener when the component mounts
    document.body.addEventListener("click", handleBodyClick);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.body.removeEventListener("click", handleBodyClick);
    };
  }, [onClose]);

  useEffect(() => {
    const user_info = localStorage.getItem("user_info");
    const userInfo = user_info ? JSON.parse(user_info) : null;
    setUserInformation(userInfo);
  }, []);

  return (
    <>
      <div
        className="fixed right-0 top-24 z-50 bg-black w-full lg:w-96 rounded-[16px] overflow-y-auto p-4"
        ref={logoutRef}
      >
        <div className="flex items-center gap-3 mb-5">
          <img
            className="w-12 h-12 rounded-full cursor-pointer"
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${userInformation?.profileImage}`}
            alt="avatar"
          />
          <h3 className="text-2xl font-bold">
            {userInformation?.firstName}&nbsp;
            {userInformation?.lastName}
          </h3>
        </div>
        <div className="flex items-center gap-3" onClick={() => logoutUser()}>
          <MdLogout />
          <p>Logout</p>
        </div>
      </div>
    </>
  );
}
export default LogoutPopup;
