import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import AuthButton from "@/components/Button/AuthButton";
import { useForm } from "@/providers/FormProvider";
import "./AllComponent.scss";

const AddName = ({ setCurrentStep, setSignupFormState }: any) => {
  const { formState, setFormState } = useForm();
  const [response, setResponse] = useState({ message: "", code: "" });
  const [checkValidation, setCheckValidation] = useState(false);
  useEffect(() => {
    const user_info = localStorage.getItem("user_info");
    const userInfo = user_info ? JSON.parse(user_info) : null;

    if (userInfo && userInfo.roleId) {
      // If userInfo exists and has roleId property
      setSignupFormState((prevFormState: any) => ({
        ...prevFormState,
        roleId: userInfo.roleId,
      }));
    }
    if (userInfo && userInfo.roleId && formState.phoneNumber === "") {
      setFormState((prevFormState: any) => ({
        ...prevFormState,
        phoneNumber: userInfo.phoneNumber,
      }));
    }
  }, []);
  const Continue = () => {
    setCheckValidation(true);
    if (formState.firstName !== "" && formState.lastName !== "") {
      setCurrentStep(6);
    }
  };

  const changeHandler = (e: any) => {
    const { name, value } = e.target;
    setFormState((formState: any) => ({
      ...formState,
      [name]: value,
    }));
  };

  return (
    <div className="main-addName">
      <h3 className="heading-bold heading-addName">What should we call you?</h3>
      <p className="pt-[5px] pb-8 desc desc-addName">
        This is the name other players, coaches, scouts, and managers will see
        on your profile.
      </p>
      <div className="Allcommon-input-otr">
        <Input
          name="firstName"
          value={formState.firstName}
          onChange={changeHandler}
          placeholder="First Name"
          type="text"
          className={`Allcommon-input-inr
        ${
          checkValidation &&
          formState.firstName === "" &&
          "border-2 border-[#FF453A]"
        }
        ${
          response.code === ""
            ? ""
            : response.code === "200"
              ? "border-2 border-lime-300"
              : "border-2 border-[#FF453A]"
        }
        `}
        />
        {checkValidation && formState.firstName === "" && (
          <p className="mb-2 alret-text text-[#FF453A]">
            First name is required
          </p>
        )}
      </div>
      <div className="Allcommon-input-otr mt-2">
        <Input
          name="lastName"
          value={formState.lastName}
          onChange={changeHandler}
          placeholder="Last Name"
          type="text"
          className={` Allcommon-input-inr
        ${
          checkValidation &&
          formState.lastName === "" &&
          "border-2 border-[#FF453A]"
        }
        ${
          response.code === ""
            ? ""
            : response.code === "200"
              ? "border-2 border-lime-300"
              : "border-2 border-[#FF453A]"
        }
     
        `}
        />
        {checkValidation && formState.lastName === "" && (
          <p className="mb-2 alret-text text-[#FF453A]">
            Last name is required
          </p>
        )}
      </div>
      <AuthButton onClick={Continue} />
    </div>
  );
};

export { AddName };
