import axios from "axios";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import CustomButton from "../Button/CustomButton";
import { toast } from "react-toastify";
interface ProfileCompletion {
  fullLegalName: string;
  passportNumber: any;
  scoutingLiscenseNumber: any;
}
function CompleteProfileForm({ onClose, user }: any) {
  const [checkValidation, setCheckValidation] = useState<boolean>(false);
  const [profileCompletionData, setProfileCompletionData] =
    useState<ProfileCompletion>({
      fullLegalName: user ? user?.user?.fullLegalName : "",
      passportNumber: user ? user?.user?.passportNumber : "",
      scoutingLiscenseNumber: user ? user?.user?.scoutingLiscenseNumber : "",
    });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setProfileCompletionData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const profileCompleted = async () => {
    setCheckValidation(true);
    if (
      profileCompletionData.fullLegalName === "" ||
      profileCompletionData.fullLegalName === null ||
      profileCompletionData.passportNumber === "" ||
      profileCompletionData.passportNumber === null ||
      profileCompletionData.scoutingLiscenseNumber === null ||
      profileCompletionData.scoutingLiscenseNumber === ""
    ) {
      toast.error("Validation failed. Please fill in all required fields.");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/submitVerification`,
        profileCompletionData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      onClose();
      toast.success(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="">
        <h2 className="heading-bold pb-[4px]">Complete your profile data.</h2>
        <p className="text-17 color-gray font-weight-400 pb-[20px]">
          You need to complete your profile before scouting players.
        </p>
        {/* <div className="flex justify-end text-13">
          <p>Status:{" "}</p>
          {user && <p> {user?.user?.isDetailsVerified}</p>}
        </div> */}
        <div className="flex flex-col gap-[24px]">
          <div className="Allcommon-input-otr">
            <p className="text-16 color-white pb-[6px]">Full legal name</p>
            <Input
              type="text"
              name="fullLegalName"
              value={profileCompletionData.fullLegalName}
              onChange={handleChange}
              placeholder="Full legal name"
              className={` 
              Allcommon-input-inr
      
           
            `}
            />
            {checkValidation && profileCompletionData.fullLegalName === "" && (
              <p className="alret-text text-[#FF453A]">
                Full legal name is required
              </p>
            )}
          </div>
          <div className="Allcommon-input-otr">
            <p className="text-16 color-white pb-[6px]">Passport number</p>
            <Input
              type="text"
              name="passportNumber"
              value={profileCompletionData.passportNumber}
              onChange={handleChange}
              placeholder="Passport number"
              className={`Allcommon-input-inr`}
            />
            {checkValidation &&
              profileCompletionData.passportNumber === "" && (
                <p className="alret-text text-[#FF453A]">
                  Passport number is required
                </p>
              )}
          </div>
          <div className="Allcommon-input-otr">
            <p className="text-16 color-white pb-[6px]">
              Scouting license number
            </p>
            <Input
              type="number"
              name="scoutingLiscenseNumber"
              value={profileCompletionData.scoutingLiscenseNumber}
              onChange={handleChange}
              placeholder="Scouting license number"
              className={` 
              Allcommon-input-inr
           
            `}
            />
            {checkValidation &&
              profileCompletionData.scoutingLiscenseNumber === "" && (
                <p className="alret-text text-[#FF453A]">
                  Scouting license number is required
                </p>
              )}
          </div>
        </div>
        <CustomButton
          title="Submit for verification"
          onClick={() => profileCompleted()}
          className={
            (user && user?.user?.isDetailsVerified === "pending")
              ? "cursor-not-allowed mt-8"
              : "cursor-pointer mt-8"
          }
          disabled={user && user?.user?.isDetailsVerified === "pending" ? true : false}
        />
        {/* <CustomButton13
          title="Submit for verification"
          onClick={() => profileCompleted()}
          className={
            (user && user?.user?.isDetailsVerified === "pending")
              ? "cursor-not-allowed mt-8"
              : "cursor-pointer mt-8"
          }
          disabled={user && user?.user?.isDetailsVerified === "pending" ? true : false}
        /> */}
      </div>
    </>
  );
}
export default CompleteProfileForm;
