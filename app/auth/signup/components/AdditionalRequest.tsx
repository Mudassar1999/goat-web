import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import CustomButton from "@/components/Button/CustomButton";
import axios from "axios";
import { toast } from "react-toastify";
import { useForm } from "@/providers/FormProvider";
import { CgSpinner } from "react-icons/cg";

function AdditionalRequest({ onClose }: any) {
  const [checkValidation, setCheckValidation] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requestFormData, setRequestFormData] = useState<any>({
    email: "",
    entityType: "Club",
    entityName: "",
    sportId: null,
    additionalInfo: "",
  });
  const { formState } = useForm();
  const changeHandler = (e: any) => {
    const { name, value } = e.target;
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValidEmail = emailRegex.test(value);
      setValidEmail(isValidEmail);
    }
    setRequestFormData((requestFormData: any) => ({
      ...requestFormData,
      [name]: value,
    }));
  };

  const sendRequest = async () => {
    setCheckValidation(true);
    if (!validEmail || requestFormData.entityName === "") {
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/additionRequest`,
        requestFormData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      toast.success(response?.data?.message);
      setLoading(false);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setRequestFormData((requestFormData: any) => ({
      ...requestFormData,
      sportId: formState?.sports[0]?.sportId,
    }));
  }, []);

  return (
    <>
      <div className="">
        <h2 className="heading-bold pb-5">Enter Your club Details</h2>
        <div className="flex flex-col gap-[24px]">
          <div className="Allcommon-input-otr">
            <Input
              name="email"
              value={requestFormData.email}
              onChange={changeHandler}
              placeholder="Enter your Email"
              type="email"
              className={`Allcommon-input-inr
        ${
          checkValidation &&
          requestFormData.email === "" &&
          "border-2 border-[#FF453A]"
        }
     
        `}
            />
            {checkValidation && !validEmail && (
              <p className="alret-text text-[#FF453A]">Email is required</p>
            )}
          </div>
          <div className="Allcommon-input-otr">
            <Input
              name="entityName"
              value={requestFormData.entityName}
              onChange={changeHandler}
              placeholder="Enter your Club"
              type="text"
              className={` Allcommon-input-inr
        ${
          checkValidation &&
          requestFormData.entityName === "" &&
          "border-2 border-[#FF453A]"
        }
     
        `}
            />
            {checkValidation && requestFormData.entityName === "" && (
              <p className="alret-text text-[#FF453A]">Club name is required</p>
            )}
          </div>
          <div>
            <div className="AllCommon-textArea-otr">
              <textarea
                name="additionalInfo"
                className="Allcommon-textArea-inr"
                placeholder="Additional Details"
                value={requestFormData?.additionalInfo}
                onChange={changeHandler}
              ></textarea>
            </div>
            {/* {checkValidation && !requestFormData?.additionalInfo && (
              <p className="alret-text text-[#FF453A]">
                Please add additional details
              </p>
            )} */}
          </div>
        </div>
        <button
          className="mt-8 dark:hover:bg-lime-450 flex w-full items-center justify-center rounded-xl bg-lime-300 py-[14px] px-[20px] text-[17px] font-semibold dark:bg-lime-300 dark:text-[#163300] leading-[22px] tracking-[-0.408px]"
          onClick={sendRequest}
        >
          {loading && (
            <CgSpinner size={20} className="mr-[10px] animate-spin" />
          )}
          Submit Your Request
        </button>
      </div>
    </>
  );
}
export default AdditionalRequest;
