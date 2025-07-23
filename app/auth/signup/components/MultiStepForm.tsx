"use client";
import React, { useEffect, useState } from "react";
import {
  CreateAccount,
  SelectRole,
  ChooseUserName,
  VerifyPhoneNumber,
  AddName,
  PersonalInformation,
  SportsType,
  CurrentlyPlaying,
  ClubName,
  PlayerPositions,
  DominantFoot,
  InterestedCounties,
  InterestedLeagues,
  FindFriends,
} from "./index";
import CustomButton from "@/components/Button/CustomButton";
import { useForm } from "@/providers/FormProvider";
import { Images } from "@/public/Images";
import Image from "next/image";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AllComponent.scss";

const MultiStepForm = ({
  currentStep,
  setCurrentStep,
  signupFormState,
  setSignupFormState,
}: any) => {
  const { formState, setFormState } = useForm();
  // const [formState, setFormState] = useState<any>({
  //   phoneNumber: "",
  //   firstName: "",
  //   lastName: "",
  //   dateOfBirth: "",
  //   gender: "male",
  //   height: null,
  //   weight: null,
  //   isImperial: true,
  //   sports: [],
  // });

  //  Phone,  Google Facebook, Apple.
  const [currentSportIndex, setCurrentSportIndex] = useState(0);
  const [sportStaticId, setSportStaticId] = useState();

  const isFindFriendsStep =
    (currentStep === 7 && signupFormState.roleId === 4) ||
    (signupFormState.roleId === 1 && currentStep === 12) ||
    ((signupFormState.roleId === 2 || signupFormState.roleId === 3) &&
      currentStep === 10);

  const stepMapping = [
    {
      condition: currentStep === 1,
      component: <CreateAccount />,
    },
    {
      condition: currentStep === 2,
      component: () => <SelectRole />,
    },
    {
      condition: currentStep === 3,
      component: <ChooseUserName />,
    },
    {
      condition: currentStep === 4,
      component: <VerifyPhoneNumber />,
    },
    {
      condition: currentStep === 5,
      component: <AddName />,
    },
    {
      condition: signupFormState.roleId !== 4 && currentStep === 6,
      component: <PersonalInformation />,
    },
    {
      condition:
        (currentStep === 6 && signupFormState.roleId === 4) ||
        (currentStep === 7 && signupFormState.roleId !== 4),
      component: <SportsType />,
    },
    {
      condition: signupFormState.roleId !== 3 && currentStep === 8,
      component: <CurrentlyPlaying />,
    },
    {
      condition: signupFormState.roleId !== 3 && currentStep === 9,
      component: <ClubName />,
    },
    {
      condition: signupFormState.roleId === 1 && currentStep === 10,
      component: <PlayerPositions />,
    },
    {
      condition: currentStep === 11,
      component: <DominantFoot />,
    },
    {
      condition: signupFormState.roleId === 3 && currentStep === 8,
      component: <InterestedCounties />,
    },
    {
      condition: signupFormState.roleId === 3 && currentStep === 9,
      component: <InterestedLeagues />,
    },
    {
      condition: isFindFriendsStep,
      component: <FindFriends />,
    },
  ];

  // Find the component that matches the current step condition
  const componentToRender = stepMapping.find((step) => step.condition)
    ?.component;

  const goBack = () => {
    if (currentStep === 4) {
      if (formState?.phoneNumber) {
        toast.warning(
          "Your account has already been created with the provided phone number and username"
        );
        return;
      } else {
        setSignupFormState((formState: any) => ({
          ...formState,
          userName: "",
        }));
        setCurrentStep(currentStep - 1);
      }
    } else if (currentStep === 5) {
      toast.warning(
        "Your account has already been created with the provided phone number and username"
      );
      return;
    }
    if (formState.sports[0]?.currentlyPlaying === false && currentStep > 8) {
      setCurrentStep(currentStep - 2);
    } else {
      setCurrentStep(currentStep - 1);
    }
    // if (formState.sports[0]?.currentlyPlaying === false ) {
    //   setCurrentStep(currentStep - 2);
    // }
  };
  const calculateWidth = (currentStep: number, roleId: any) => {
    const denominator = roleId === 1 ? 8 : roleId === 4 ? 3 : 6;
    return ((currentStep - 3) / denominator) * 100;
  };

  const completeBarWidth = calculateWidth(currentStep, signupFormState.roleId);
  const unCompleteBarWidth = 100 - completeBarWidth;

  return (
    <>
      <div className="forSteps">
        <div className="again">
          <div className="Arrow-otr">
            {!isFindFriendsStep && (
              <div className="ourArrowLeft-Icon">
                {currentStep > 2 && (
                  <div className="ArrowLeft-inr" onClick={goBack}>
                    <div className="">
                      <div className="our-steps">
                        {/* && currentStep < 9 */}
                        {currentStep > 3 && (
                          <h2 className="">
                            Step {currentStep - 3} of{" "}
                            {signupFormState.roleId === 1
                              ? 8
                              : signupFormState.roleId === 4
                                ? 3
                                : 6}
                          </h2>
                        )}
                      </div>
                      <div className="Arrow-icon bg-[#7474802E] rounded-full h-10 w-10 flex justify-center items-center cursor-pointer">
                        <Image src={Images.arrowLeft} alt="img" />
                      </div>
                    </div>
                  </div>
                )}
                {currentStep > 3 && (
                  <div className="line-otr">
                    <div
                      style={{ width: `${completeBarWidth}%` }}
                      className={` color-line h-[3px] bg-[#9FE870]`}
                    ></div>
                    <div
                      // style={{ width: `${unCompleteBarWidth}%` }}
                      className="stepline fade-line h-[4px]"
                    ></div>
                  </div>
                )}
              </div>
            )}{" "}
          </div>
          <div className="container">
            {/* {currentStep > 3 && (
              <div className="line-otr">
                <div
                  style={{ width: `${completeBarWidth}%` }}
                  className={` color-line h-[3px] bg-[#9FE870]`}
                ></div>
                <div
                  style={{ width: `${unCompleteBarWidth}%` }}
                  className="stepline fade-line h-[3px]"
                ></div>
              </div>
            )} */}
            {componentToRender &&
              React.cloneElement(componentToRender, {
                setCurrentStep,
                signupFormState,
                setSignupFormState,
                sportStaticId,
                setSportStaticId,
              })}
            {/* {((signupFormState.roleId !== 4 && currentStep === 7) ||
              (signupFormState.roleId === 4 && currentStep === 6)) && (
              <CustomButton onClick={nextStep} />
            )} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default MultiStepForm;
