import { Images } from "@/public/Images";
import DominentRadioInput from "../../../../components/ui/dominentRadioInput";
import AuthButton from "@/components/Button/AuthButton";
import { useState, useEffect } from "react";
import axios from "axios";
import useSportUpdate from "@/custom_hooks/useSportsStatus";
import userRegistration from "@/api/auth/userRegistration";
import { useForm } from "@/providers/FormProvider";
import { ReactSVG } from "react-svg";
import Image from "next/image";
import "./AllComponent.scss";

const DominantFoot = ({ setCurrentStep }: any) => {
  const { formState, setFormState } = useForm();
  const [playerDominancesData, setPlayerDominancesData] = useState<any>([]);
  const [checkValidation, setCheckValidation] = useState(false);

  useEffect(() => {
    fetchPlayerplayerDominancesData();
  }, []);
  const { updateSport } = useSportUpdate();
  const fetchPlayerplayerDominancesData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/playerDominances/bySportId/${formState.sports[0].sportId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setPlayerDominancesData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      const data = await userRegistration(formState);
      // Handle success
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };
  // const userRegistration = async () => {
  //   try {
  //     const response = await axios.put(
  //       `${process.env.NEXT_PUBLIC_API_URL}/users/register`,
  //       formState,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  //         },
  //       }
  //     );
  //     console.log(response.data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const Continue = () => {
    setCheckValidation(true);
    if (formState.sports && formState.sports[0]?.dominantFootId) {
      handleSubmit();
      setCurrentStep(12);
    }
    // if (currentSportIndex < formState.sports.length - 1) {
    //   setCurrentStep(8);
    //   setCurrentSportIndex(currentSportIndex + 1);
    // } else {
    //   userRegistration();
    //   setCurrentStep(12);
    // }
  };

  const selectRoleHandler = (dominanceId: number) => {
    updateSport(0, setFormState, (sport: any) => ({
      ...sport,
      dominantFootId: dominanceId,
    }));
    // setFormState((prevState: any) => {
    //   const updatedSports = [...prevState.sports];
    //   updatedSports[currentSportIndex] = {
    //     ...updatedSports[currentSportIndex],
    //     dominantFootId: dominanceId,
    //   };
    //   return {
    //     ...prevState,
    //     sports: updatedSports,
    //   };
    // });
  };

  return (
    <div className="dominanceFootWrapper">
      <h3 className="heading-bold">
        Select your dominant{" "}
        {formState?.sports[0]?.sportId === 1 ? "foot" : "arm"}.
      </h3>
      <p className="desc pt-[5px] pb-[32px]">You can change this later.</p>
      <div className="">
        {playerDominancesData.map((item: any) => (
          <div className="forfootBorderOtr">
            <div className="flex items-center gap-[16px] py-[24px] px-[16px] forfootBorder">
              {item?.image &&
                (item?.image?.endsWith(".svg") ? (
                  <ReactSVG
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item?.image}`}
                  />
                ) : (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item?.image}`}
                    alt=""
                    className=""
                    width={36}
                    height={36}
                  />
                ))}
              <DominentRadioInput
                key={item.id}
                image={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.image}`}
                label={item.name}
                value={item.id}
                checked={formState.sports[0]?.dominantFootId === item.id}
                onChange={() => selectRoleHandler(item.id)}
              />
            </div>
          </div>
        ))}
      </div>
      {checkValidation && !formState.sports[0]?.dominantFootId && (
        <p className="mb-2 alret-text text-[#FF453A]">Please Select 1 option</p>
      )}
      <AuthButton onClick={Continue} />
    </div>
  );
};
export { DominantFoot };
