import { useEffect, useState } from "react";
import useApiRequest from "@/custom_hooks/useGetApiRequest";
import RadioInput from "@/components/ui/radioInput";
import Loading from "react-loading";
import AuthButton from "@/components/Button/AuthButton";
import userRegistration from "@/api/auth/userRegistration";
import { useForm } from "@/providers/FormProvider";
import "./AllComponent.scss";

interface responseType {
  id: number;
  name: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}
const SportsType = ({
  setCurrentStep,
  signupFormState,
  setSportStaticId,
}: any) => {
  const {
    responseData,
    loading,
    fetchData: fetchSportsTypes,
  } = useApiRequest();
  // const [responseData, setResponseData] = useState<responseType[]>([]);
  const { formState, setFormState } = useForm();
  const [checkValidation, setCheckValidation] = useState(false);
  useEffect(() => {
    fetchSportsTypes(`sports`, (a: any, b: any) => a.id - b.id);
  }, []);
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
    if (formState.sports && formState.sports[0]?.sportId) {
      if (signupFormState.roleId === 4) {
        handleSubmit();
        setCurrentStep(7);
      } else {
        setCurrentStep(8);
      }
    }
  };

  const selectSportHandler = (selectedSport: any) => {
    setFormState((prevFormState: any) => ({
      ...prevFormState,
      sports: prevFormState.sports.map((sport: any) => {
        return {
          ...sport,
          sportId: selectedSport.id,
          // Update other properties as needed
        };
      }),
    }));
    setSportStaticId(selectedSport.staticId);
  };

  return (
    <div className="main-sports">
      <h3 className="heading-bold heading-sports">What sports do you play?</h3>
      <p className="pt-[5px] desc desc-sports">
        This helps us personalize your feed.
      </p>
      {loading ? (
        <div className="flex items-center justify-center">
          <Loading type="spin" color="#747474" />
        </div>
      ) : (
        <div className="">
          {responseData.map((item: responseType) => (
            <RadioInput
              key={item.id}
              image={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.image}`}
              label={item.name}
              value={item.id}
              checked={formState.sports[0]?.sportId === item.id}
              onChange={() => selectSportHandler(item)}
            />
          ))}
        </div>
      )}

      {checkValidation && formState.sports && !formState.sports[0]?.sportId && (
        <p className="mb-2 alret-text text-[#FF453A]">Please Select 1 sport</p>
      )}
      <AuthButton onClick={Continue} />
    </div>
  );
};

export { SportsType };
