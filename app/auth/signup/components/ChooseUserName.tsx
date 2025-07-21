import React, { useState, useEffect } from "react";
import { checkUserName } from "../actions";
import AuthButton from "@/components/Button/AuthButton";
import "./AllComponent.scss";
import { toast } from "react-toastify";

const ChooseUserName = ({
  setCurrentStep,
  signupFormState,
  setSignupFormState,
}: any) => {
  const [response, setResponse] = useState({ message: "", code: "" });
  const [checkValidation, setCheckValidation] = useState(false);

  let timeoutId: any;

  const changeHandler = (e: any) => {
    const { name, value } = e.target;

    // if (name === "userName" && value.length > 10) {
    //   toast.warning(
    //     "The username should not exceed 10 characters."
    //   );
    //   return;
    // }

    setSignupFormState((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(async () => {
      if (signupFormState.userName !== "") {
        if (signupFormState.userName.length === 20) {
          toast.warning("The username should not exceed 20 characters.");
          return;
        }
        checkUserName(signupFormState.userName, setResponse);
      }
    }, 1000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [signupFormState.userName]);

  const Continue = () => {
    setCheckValidation(true);
    if (signupFormState.userName !== "" && response.code === "200") {
      setCurrentStep(4);
    }
  };

  return (
    <div className="main-username">
      <h3 className="heading-bold heading-username">Choose a username</h3>
      <p className="desc desc-main-username">
        Add a username, you can change this at any time.
      </p>
      {/* <Input
        name="userName"
        value={signupFormState.userName}
        onChange={changeHandler}
        placeholder="Enter username"
        type="text"
        className={` 
        ${
           response.code === "200"
              ? "border-2 border-lime-300"
              : "border-2 border-[#FF453A]"
        }
        `}
      /> */}
      {/* <div className={`common-input-otr  w-full`}>
        <input 
        type="text"
        name="userName"
        value={signupFormState.userName}
        onChange={changeHandler} 
        placeholder="Enter username" 
        className={`common-input-inr 
        ${
           response.code === "200"
              ? "common-input-green"
              : "common-input-inrAlret"
        }
        `}
        />
      </div> */}
      <div className={`common-input-otr w-full`}>
        <input
          type="text"
          name="userName"
          value={signupFormState.userName}
          onChange={changeHandler}
          placeholder="Enter username"
          className={`common-input-inr 
          ${signupFormState.userName
              ? response.code === "200"
                ? "common-input-green"
                : "common-input-inrAlret"
              : ""
            }
          `}
          maxLength={20}
        />
      </div>
      {response?.message && (
        <p
          className={` mt-2 alret-text ${response.code === "200" ? "text-[#30D158]" : "text-[#FF453A]"
            }`}
        >
          {response?.message}
        </p>
      )}
      {checkValidation && signupFormState.userName === "" && (
        <p className="mb-2 alret-text text-[#FF453A]">Username is required</p>
      )}
      {/* <CustomButton onClick={Continue} className="btn-userName" /> */}
      <AuthButton onClick={Continue} />
    </div>
  );
};

export { ChooseUserName };
