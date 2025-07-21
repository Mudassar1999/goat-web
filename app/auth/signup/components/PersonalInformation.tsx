import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import AuthButton from "@/components/Button/AuthButton";
import { useForm } from "@/providers/FormProvider";
import { toast } from "react-toastify";
import "./AllComponent.scss";
import { AuthCombobox } from "@/components/ui/authCombobox";

const genderOptionsData = [
  {
    id: 1,
    name: "Male",
    value: "male",
  },
  {
    id: 2,
    name: "Female",
    value: "female",
  },
  {
    id: 3,
    name: "Other",
    value: "other",
  },
]

const PersonalInformation = ({ setCurrentStep, signupFormState }: any) => {
  const { formState, setFormState } = useForm();
  const [inputType, setInputType] = useState("text");
  const [response, setResponse] = useState({ message: "", code: "" });
  const [checkValidation, setCheckValidation] = useState(false);
  const [defaultGender, setDefaultGender] = useState<string | undefined>(undefined);

  const dateRef = useRef<any>(null);

  const Continue = () => {
    if (formState.height < 0 || formState.weight < 0) {
      toast.error("Please enter the valid height and weight!");
      return;
    }
    setCheckValidation(true);
    if (
      formState.dateOfBirth !== "" &&
      formState.gender !== "" &&
      formState.height !== "" &&
      formState.weight !== ""
    ) {
      setCurrentStep(7);
    }
  };

  const changeHandler = (e: any) => {
    const { name, value } = e.target;

    if (name === "dateOfBirth") {
      // const options: any = { year: "numeric", month: "short", day: "numeric" };
      // const formattedDate = new Date(value).toLocaleDateString(
      //   undefined,
      //   options
      // );
      const formattedDate = new Date(value).toISOString().split("T")[0];
      setFormState((formState: any) => ({
        ...formState,
        [name]: formattedDate,
      }));
    } else {
      setFormState((formState: any) => ({
        ...formState,
        [name]: value,
      }));
    }
  };

  const changeGenderHandler = (selectedGender: any) => {
    setFormState({
      ...formState,
      gender: selectedGender.value,
    });
  };

  const openDatePicker = () => {
    const startDateElement: any = dateRef.current;
    startDateElement.showPicker();
  };

  const convertHeight = (height: any, isImperial: boolean) => {
    let convertedHeight;
    if (isImperial) {
      // Convert height from Imperial to Metric
      convertedHeight = height * 2.54; // Example: inches to centimeters
    } else {
      // Convert height from Metric to Imperial
      convertedHeight = height / 2.54; // Example: centimeters to inches
    }
    const decimalPart = convertedHeight.toFixed(2).split(".")[1];
    console.log("decimalPart", decimalPart);
    return decimalPart === "00" || decimalPart === "99" || decimalPart <= "09"
      ? Math.round(convertedHeight).toString()
      : convertedHeight.toFixed(2);
  };

  // Function to convert weight based on units
  const convertWeight = (weight: any, isImperial: boolean) => {
    let convertedWeight;
    if (isImperial) {
      // Convert weight from Imperial to Metric
      convertedWeight = weight * 0.453592; // Example: pounds to kilograms
    } else {
      // Convert weight from Metric to Imperial
      convertedWeight = weight / 0.453592; // Example: kilograms to pounds
    }
    const decimalPart = convertedWeight.toFixed(2).split(".")[1];

    return decimalPart === "00" || decimalPart === "99" || decimalPart <= "09"
      ? Math.round(convertedWeight).toString()
      : convertedWeight.toFixed(2);
  };

  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  useEffect(() => {
    const startDateElement: any = dateRef.current;
    startDateElement?.showPicker();
  }, [inputType]);

  useEffect(() => {
    setDefaultGender(genderOptionsData?.find((item: any) => item?.value === formState?.gender)?.name);
  }, [genderOptionsData, formState.gender]);

  // useEffect(() => {
  //   if (!formState.dateOfBirth) {
  //     setFormState((formState: any) => ({
  //       ...formState,
  //       dateOfBirth: getTodayDateString(),
  //     }));
  //   }
  // }, []);

  return (
    <div className="main-infoWrapper">
      <h3 className="heading-bold heading-info">
        Nice to meet you, {formState.firstName}!
      </h3>
      <p className="desc desc-info pt-[5px] pb-8">
        Your personal information helps other members find and scout you more
        easily.
      </p>
      <div className="Allcommon-input-otr">
        <Input
          name="dateOfBirth"
          onChange={changeHandler}
          type={inputType}
          onFocus={() => setInputType("date")}
          onBlur={() => {
            if (!formState.dateOfBirth) {
              setInputType("text");
            }
          }}
          max={getTodayDateString()}
          placeholder="Date of Birth"
          value={formState.dateOfBirth}
          onClick={() => openDatePicker()}
          ref={dateRef}
          // value={formState?.dateOfBirth?.split("T")[0]}
          className={` Allcommon-input-inr
        ${checkValidation &&
            formState.dateOfBirth === "" &&
            "border-2 border-[#FF453A]"
            }
            ${response.code === ""
              ? ""
              : response.code === "200"
                ? "border-2 border-lime-300"
                : "border-2 border-[#FF453A]"
            }
            `}
        />
        {checkValidation && formState.dateOfBirth === "" && (
          <p className="mb-2 alret-text text-[#FF453A]">
            Date of birth is required
          </p>
        )}
      </div>
      {/* <div className="relative selectGender-otr mt-2">
        <div className="custom-select">
          <select
            name="gender"
            onChange={changeHandler}
            value={formState.gender}
            // className="selectGender mt-2"
            className={`${formState.gender === ""
              ? "selectGender text-[#545456] mt-2"
              : "selectGender color-white mt-2"
              }`}
          >
            <option value={""} hidden>
              Sex
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div> */}
      <div className="mt-2">
        <AuthCombobox
          onChange={changeGenderHandler}
          placeholder={"Sex"}
          data={genderOptionsData}
          displayValue={(x: any) => x?.name}
          defaultSelectedValue={defaultGender}
        />
      </div>
      {checkValidation && formState?.gender === "" && (
        <p className="mb-2 alret-text text-[#FF453A]">Gender is required</p>
      )}
      {signupFormState.roleId === 1 && (
        <>
          <div className="Allcommon-input-otr mt-2">
            <div className="relative">
              <Input
                type="number"
                name="height"
                value={formState?.height}
                min={0}
                onKeyDown={(event) => {
                  if (event.key === "-") {
                    event.preventDefault();
                  }
                }}
                onChange={changeHandler}
                placeholder="Height"
                className={`Allcommon-input-inr
            ${checkValidation &&
                  formState.height === null &&
                  "border-2 border-[#FF453A]"
                  }
            ${response.code === ""
                    ? ""
                    : response.code === "200"
                      ? "border-2 border-lime-300"
                      : "border-2 border-[#FF453A]"
                  }
            `}
              />
              {formState.isImperial ? (
                <span className="absolute top-1/2 -translate-y-1/2 right-[26px] text-13-bold color-gray">
                  Inches
                </span>
              ) : (
                <span className="absolute top-1/2 -translate-y-1/2 right-[26px] text-13-bold color-gray">
                  cm
                </span>
              )}
            </div>
            {checkValidation && formState.height === null && (
              <p className="mb-2 alret-text text-[#FF453A]">
                Height is required
              </p>
            )}
          </div>
          <div className="Allcommon-input-otr mt-2">
            <div className="relative">
              <Input
                type="number"
                name="weight"
                value={formState.weight}
                min={0}
                onKeyDown={(event) => {
                  if (event.key === "-") {
                    event.preventDefault();
                  }
                }}
                onChange={changeHandler}
                placeholder="Weight"
                className={` Allcommon-input-inr
            ${checkValidation &&
                  formState.weight === null &&
                  "border-2 border-[#FF453A]"
                  }
            ${response.code === ""
                    ? ""
                    : response.code === "200"
                      ? "border-2 border-lime-300"
                      : "border-2 border-[#FF453A]"
                  }
            `}
              />
              {formState.isImperial ? (
                <span className="absolute top-1/2 -translate-y-1/2 right-[26px] text-13-bold color-gray">
                  Pounds
                </span>
              ) : (
                <span className="absolute top-1/2 -translate-y-1/2 right-[26px] text-13-bold color-gray">
                  kg
                </span>
              )}
            </div>
            {checkValidation && formState.weight === null && (
              <p className="mb-2 alret-text text-[#FF453A]">
                Weight is required
              </p>
            )}
          </div>
          <h3
            className="text-17-bold color-green text-center mt-3 cursor-pointer"
            onClick={() =>
              setFormState((prevState) => ({
                ...prevState,
                isImperial: !prevState.isImperial,
                height: convertHeight(prevState.height, prevState.isImperial),
                weight: convertWeight(prevState.weight, prevState.isImperial),
              }))
            }
          >
            {formState.isImperial ? "Switch to Metric" : "Switch to Imperial"}
          </h3>
          {/* <h3
            className="text-17-bold color-green text-center mt-3"
            onClick={() =>
              setFormState((prevState) => ({
                ...prevState,
                isImperial: !prevState.isImperial,
              }))
            }
          >
            {formState.isImperial ? "Switch to Metric" : "Switch to Imperial"}
          </h3> */}
        </>
      )}

      <AuthButton onClick={Continue} />
    </div>
  );
};

export { PersonalInformation };
