import useSportUpdate from "@/custom_hooks/useSportsStatus";
import RadioInput from "../../../../components/ui/radioInput";
import AuthButton from "@/components/Button/AuthButton";
import { useState } from "react";
import userRegistration from "@/api/auth/userRegistration";
import { useForm } from "@/providers/FormProvider";
import "./AllComponent.scss";

const CurrentlyPlaying = ({ setCurrentStep, signupFormState }: any) => {
  const { formState, setFormState } = useForm();
  const [checkValidation, setCheckValidation] = useState(false);
  const handleSubmit = async () => {
    try {
      const data = await userRegistration(formState);
      // Handle success
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  const Continue = () => {
    setCheckValidation(true);
    if (
      signupFormState.roleId === 1
        ? formState.sports[0]?.currentlyPlaying === true
        : formState.sports[0]?.coaching === true
    ) {
      setCurrentStep(9);
    } else if (
      signupFormState.roleId === 1
        ? formState.sports[0]?.currentlyPlaying === false
        : formState.sports[0]?.coaching === false
    ) {
      // call api if roleId is 2
      if (signupFormState.roleId === 2) {
        handleSubmit();
      }
      setCurrentStep(10);
    }
  };

  const selectStatusHandler = (status: boolean) => {
    const { updateSport } = useSportUpdate();
    signupFormState.roleId === 1
      ? updateSport(0, setFormState, (sport: any) => ({
          ...sport,
          currentlyPlaying: status,
        }))
      : updateSport(0, setFormState, (sport: any) => ({
          ...sport,
          coaching: status,
        }));
  };

  return (
    <div className="main-currentplay">
      <h3 className="heading-bold heading-currentPlay">
        Do you currently {signupFormState.roleId === 1 ? "play" : "coach"} in a
        club?
      </h3>
      <p className="desc desc-currentPlay">You can change this later.</p>
      <div className=" ">
        <RadioInput
          label="Yes"
          value={true}
          checked={
            signupFormState.roleId === 1
              ? formState.sports[0]?.currentlyPlaying === true
              : formState.sports[0]?.coaching === true
          }
          onChange={() => selectStatusHandler(true)}
        />
        <RadioInput
          label="No"
          value={false}
          checked={
            signupFormState.roleId === 1
              ? formState.sports[0]?.currentlyPlaying === false
              : formState.sports[0]?.coaching === false
          }
          onChange={() => selectStatusHandler(false)}
        />
      </div>
      {checkValidation &&
        (signupFormState.roleId === 1
          ? formState.sports[0]?.currentlyPlaying === undefined
          : formState.sports[0]?.coaching === undefined) && (
          <p className="mb-2 text-base text-[#FF453A]">
            Please Select 1 option
          </p>
        )}
      <AuthButton onClick={Continue} />
    </div>
  );
};

export { CurrentlyPlaying };
