import React, { useRef, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import CustomButton13 from "@/components/Button/CustomButton13";
import { Combobox } from "@/components/ui/combobox";
import { UpdatePersonalDetail } from "@/api/profile/updatePersonalDetail";
import { checkUserName } from "@/app/auth/signup/actions";
import { toast } from "react-toastify";

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
];

interface EditProps {
  editName: string;
  userProfile: any;
  fetchProfile: any;
  setEditPersonalInfoPop: any;
}

interface formValues {
  firstName: string;
  lastName: string;
  userName: string;
  passportNumber: string;
  scoutingLiscenseNumber: number;
  dateOfBirth: any;
  gender: any;
  height: any;
  weight: any;
  isImperial: boolean;
}

const EditPersonalInfo = ({
  editName,
  userProfile,
  fetchProfile,
  setEditPersonalInfoPop,
}: EditProps) => {
  const defaultDate = new Date(userProfile?.user?.dateOfBirth);
  const formattedDefaultDate = `${(defaultDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${defaultDate
      .getDate()
      .toString()
      .padStart(2, "0")}/${defaultDate.getFullYear()}`;

  const [personalData, setPersonalData] = useState<formValues>({
    firstName: userProfile?.user?.firstName,
    lastName: userProfile?.user?.lastName,
    userName: userProfile?.user?.userName,
    passportNumber: userProfile?.user?.passportNumber,
    scoutingLiscenseNumber: userProfile?.user?.scoutingLiscenseNumber,
    dateOfBirth: formattedDefaultDate,
    gender: userProfile?.user?.gender,
    height: userProfile?.user?.height,
    weight: userProfile?.user?.weight,
    isImperial: userProfile?.user?.isImperial,
  });
  const [response, setResponse] = useState({ message: "", code: "" });
  const [checkValidation, setCheckValidation] = useState(false);
  const [usernameEdited, setUsernameEdited] = useState(false);
  const [inputType, setInputType] = useState("text");
  const [defaultGender, setDefaultGender] = useState<string | undefined>(
    undefined
  );

  const dateRef = useRef<any>(null);
  let timeoutId: any;

  const changeHandler = (e: any) => {
    const { name, value } = e.target;

    if (name === "userName" && value.length === 20) {
      toast.warning("The username should not exceed 20 characters.");
      return;
    }

    setPersonalData((personalData: any) => ({
      ...personalData,
      [name]: value,
    }));

    if (name === "userName") {
      setUsernameEdited(true);
    }
  };

  const changeGenderHandler = (selectedGender: any) => {
    setPersonalData({
      ...personalData,
      gender: selectedGender.value,
    });
  };

  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const openDatePicker = () => {
    const dateElement: any = dateRef.current;
    dateElement.showPicker();
  };

  const parseHeightOrWeight = (value: any) => {
    const parsedValue: any = parseFloat(value);

    if (!isNaN(parsedValue)) {
      return Number.isInteger(parsedValue)
        ? parseInt(parsedValue)
        : parsedValue;
    }

    return null;
  };

  const handleButtonClick = async () => {
    setCheckValidation(true);

    const updatNamePayload = {
      firstName: personalData?.firstName,
      lastName: personalData?.lastName,
    };

    const updatUserNamePayload = {
      userName: personalData?.userName,
    };

    const updatPassportPayload = {
      passportNumber: personalData?.passportNumber,
    };

    const updatLicensePayload = {
      scoutingLiscenseNumber: personalData?.scoutingLiscenseNumber,
    };

    const updatDOBPayload = {
      dateOfBirth: personalData?.dateOfBirth,
    };

    const updatGenderPayload = {
      gender: personalData?.gender,
    };

    const updatHeightPayload = {
      height: parseHeightOrWeight(personalData?.height),
    };
    const updatWeightPayload = {
      weight: parseHeightOrWeight(personalData?.weight),
    };

    const payload =
      editName === "Name"
        ? updatNamePayload
        : editName === "Username"
          ? updatUserNamePayload
          : editName === "Date Of Birth"
            ? updatDOBPayload
            : editName === "Sex"
              ? updatGenderPayload
              : editName === "Height"
                ? updatHeightPayload
                : editName === "Passport number"
                  ? updatPassportPayload
                  : editName === "Scouting license number"
                    ? updatLicensePayload
                    : updatWeightPayload;

    await UpdatePersonalDetail(payload, fetchProfile);
    setEditPersonalInfoPop(false);
  };

  useEffect(() => {
    const dateElement: any = dateRef.current;
    dateElement?.showPicker();
  }, [inputType]);

  useEffect(() => {
    setDefaultGender(
      genderOptionsData?.find(
        (item: any) => item?.value === personalData?.gender
      )?.name
    );
  }, [genderOptionsData, personalData.gender]);

  useEffect(() => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(async () => {
      if (personalData.userName !== "" && usernameEdited) {
        checkUserName(personalData.userName, setResponse);
      }
    }, 1500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [usernameEdited]);

  return (
    <>
      {/* First name */}
      {editName === "Name" &&
        <div>
          <p className="heading-bold heading-club">Edit name</p>
          <div className="Allcommon-input-otr">
            <Input
              name="firstName"
              value={personalData.firstName}
              onChange={changeHandler}
              placeholder="First Name"
              type="text"
              className={`Allcommon-input-inr
        ${checkValidation &&
                personalData.firstName === "" &&
                "border-2 border-[#FF453A]"
                }
        ${checkValidation && personalData.firstName === ""
                  ? "border-2 border-lime-300"
                  : "border-2 border-[#FF453A]"
                }
        `}
            />
            {checkValidation && personalData.firstName === "" && (
              <p className="mb-2 alret-text text-[#FF453A]">
                First name is required
              </p>
            )}
          </div>
        </div>
      }

      {/* Last name */}
      {editName === "Name" && (
        <div className="Allcommon-input-otr mt-2">
          <Input
            name="lastName"
            value={personalData.lastName}
            onChange={changeHandler}
            placeholder="Last Name"
            type="text"
            className={`Allcommon-input-inr
        ${checkValidation &&
              personalData.lastName === "" &&
              "border-2 border-[#FF453A]"
              }
        ${checkValidation && personalData.lastName === ""
                ? "border-2 border-lime-300"
                : "border-2 border-[#FF453A]"
              }
        `}
          />
          {checkValidation && personalData.lastName === "" && (
            <p className="mb-2 alret-text text-[#FF453A]">
              Last name is required
            </p>
          )}
        </div>
      )}

      {/* User name */}
      {editName === "Username" &&
        <>
          <p className="heading-bold heading-club">Edit username</p>
          <div className={`common-input-otr w-full`}>
            <input
              type="text"
              name="userName"
              value={personalData.userName}
              onChange={changeHandler}
              placeholder="Enter username"
              className={`common-input-inr 
${personalData.userName
                  ? (response.code === "200")
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
          {checkValidation && personalData.userName === "" && (
            <p className="mb-2 alret-text text-[#FF453A]">
              Username is required
            </p>
          )}
        </>
      }

      {/* passport number */}
      {editName === "Passport number" && (
        <div>
          <p className="heading-bold heading-club">Edit passport number</p>
          <div className="Allcommon-input-otr">
            <Input
              name="passportNumber"
              value={personalData.passportNumber}
              onChange={changeHandler}
              placeholder="Passport Number"
              type="text"
              className={`Allcommon-input-inr
      ${checkValidation &&
                personalData.passportNumber === "" &&
                "border-2 border-[#FF453A]"
                }
      ${checkValidation && personalData.passportNumber === ""
                  ? "border-2 border-lime-300"
                  : "border-2 border-[#FF453A]"
                }
      `}
            />
            {checkValidation && personalData.passportNumber === "" && (
              <p className="mb-2 alret-text text-[#FF453A]">
                Passport number is required
              </p>
            )}
          </div>
        </div>
      )}

      {/* license number */}
      {editName === "Scouting license number" && (
        <div>
          <p className="heading-bold heading-club">Edit license number</p>
          <div className="Allcommon-input-otr">
            <input
              type="number"
              name="scoutingLiscenseNumber"
              value={personalData.scoutingLiscenseNumber}
              onChange={changeHandler}
              placeholder="Enter username"
              className={`common-input-inr 
${personalData.scoutingLiscenseNumber
                  ? (response.code === "200")
                    ? "common-input-green"
                    : "common-input-inrAlret"
                  : ""
                }
`}
              maxLength={20}
            />
            {checkValidation && personalData.scoutingLiscenseNumber.toString() === "" && (
              <p className="mb-2 alret-text text-[#FF453A]">
                Passport number is required
              </p>
            )}
          </div>
        </div>
      )}

      {/* Date of birth */}
      {editName === "Date Of Birth" &&
        <div>
          <p className="heading-bold heading-club">Edit Date of Birth</p>
          <div className="Allcommon-input-otr">
            <Input
              name="dateOfBirth"
              onChange={changeHandler}
              type={inputType}
              onFocus={() => setInputType("date")}
              onBlur={() => {
                if (!personalData.dateOfBirth) {
                  setInputType("text");
                }
              }}
              max={getTodayDateString()}
              placeholder="Date of Birth"
              value={personalData.dateOfBirth}
              onClick={() => openDatePicker()}
              ref={dateRef}
              // value={formState?.dateOfBirth?.split("T")[0]}
              className={` Allcommon-input-inr
               ${checkValidation &&
                personalData.dateOfBirth === "" &&
                "border-2 border-[#FF453A]"
                }
                   ${checkValidation && personalData.dateOfBirth === ""
                  ? "border-2 border-lime-300"
                  : "border-2 border-[#FF453A]"
                }
                   `}
            />
            {checkValidation && personalData.dateOfBirth === "" && (
              <p className="mb-2 alret-text text-[#FF453A]">
                Date of birth is required
              </p>
            )}
          </div>
        </div>
      }

      {/* Gender */}
      {editName === "Sex" &&
        <div>
          <p className="heading-bold heading-club">Select Sex</p>
          <Combobox
            onChange={changeGenderHandler}
            placeholder={"Sex"}
            data={genderOptionsData}
            displayValue={(x: any) => x?.name}
            defaultSelectedValue={defaultGender}
          />
        </div>
      }

      {/* Height */}
      {editName === "Height" &&
        <div>
          <p className="heading-bold heading-club">Edit Height</p>
          <div className="Allcommon-input-otr">
            <div className="relative">
              <Input
                type="number"
                name="height"
                value={personalData?.height}
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
                  personalData.height === null &&
                  "border-2 border-[#FF453A]"
                  }
            ${checkValidation && personalData.height === ""
                    ? "border-2 border-lime-300"
                    : "border-2 border-[#FF453A]"
                  }
            `}
              />
              {personalData.isImperial ? (
                <span className="absolute top-1/2 -translate-y-1/2 right-[26px] text-13-bold color-gray">
                  Inches
                </span>
              ) : (
                <span className="absolute top-1/2 -translate-y-1/2 right-[26px] text-13-bold color-gray">
                  cm
                </span>
              )}
            </div>
            {checkValidation && personalData.height === "" && (
              <p className="mb-2 alret-text text-[#FF453A]">
                Height is required
              </p>
            )}
          </div>
        </div>
      }

      {editName === "Weight" &&
        <div>
          <p className="heading-bold heading-club">Edit Weight</p>
          <div className="Allcommon-input-otr">
            <div className="relative">
              <Input
                type="number"
                name="weight"
                value={personalData?.weight}
                min={0}
                onKeyDown={(event) => {
                  if (event.key === "-") {
                    event.preventDefault();
                  }
                }}
                onChange={changeHandler}
                placeholder="Weight"
                className={`Allcommon-input-inr
            ${checkValidation &&
                  personalData.weight === null &&
                  "border-2 border-[#FF453A]"
                  }
            ${checkValidation && personalData.weight === ""
                    ? "border-2 border-lime-300"
                    : "border-2 border-[#FF453A]"
                  }
            `}
              />
              {personalData.isImperial ? (
                <span className="absolute top-1/2 -translate-y-1/2 right-[26px] text-13-bold color-gray">
                  Pounds
                </span>
              ) : (
                <span className="absolute top-1/2 -translate-y-1/2 right-[26px] text-13-bold color-gray">
                  kg
                </span>
              )}
            </div>
            {checkValidation && personalData.weight === "" && (
              <p className="mb-2 alret-text text-[#FF453A]">
                Weight is required
              </p>
            )}
          </div>
        </div>
      }

      <CustomButton13
        onClick={handleButtonClick}
        title={"Update"}
        className={"cursor-pointer mt-2"}
      />
    </>
  );
};

export default EditPersonalInfo;
