import React, { useState, useEffect } from "react";
import AuthButton from "@/components/Button/AuthButton";
import axios from "axios";
import useApiRequest from "@/custom_hooks/useGetApiRequest";
import { useForm } from "@/providers/FormProvider";
import SelectInput from "@/components/ui/selectInput";
import { toast } from "react-toastify";

const PlayerPositions = ({ setCurrentStep, sportStaticId }: any) => {
  const {
    responseData,
    loading,
    fetchData: fetchPlayerPositionsData,
  } = useApiRequest();
  const { formState, setFormState } = useForm();
  const [playerPositionsData, setPlayerPositionsData] = useState<any>([]);
  const [checkValidation, setCheckValidation] = useState(false);
  useEffect(() => {
    fetchPlayerPositionsData(
      `playerPositions/bySportId/${formState.sports[0]?.sportId}`,
      null
    );
  }, []);
  const selectedPlayers: any =
    formState.sports[0]?.playerPositionId?.length > 0
      ? formState.sports[0]?.playerPositionId
      : [];
  // const fetchPlayerPositionsData = async () => {
  //   try {
  //     const response = await axios.get(
  //       ${process.env.NEXT_PUBLIC_API_URL}/playerPositions/bySportId/${formState.sports[currentSportIndex].sportId},
  //       {
  //         headers: {
  //           Authorization: Bearer ${localStorage.getItem("access_token")},
  //         },
  //       }
  //     );
  //     setPlayerPositionsData(response.data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  const Continue = () => {
    setCheckValidation(true);
    if (formState.sports && formState.sports[0]?.playerPositionId?.length > 0) {
      setCurrentStep(11);
    }
  };

  const selectPlayerPositionHandler = (positionId: any) => {
    const updatedSports = [...formState.sports];
    const currentSport = { ...updatedSports[0] };
    const playerPositionId = currentSport?.playerPositionId || [];
    if (playerPositionId.includes(positionId)) {
      currentSport.playerPositionId = playerPositionId.filter(
        (id: number) => id !== positionId
      );
    } else {
      currentSport.playerPositionId = [...playerPositionId, positionId];
    }

    updatedSports[0] = currentSport;
    if (updatedSports[0]?.playerPositionId.length > 3) {
      toast.warning("Cannot select more than 3 positions");
      return;
    }
    const updatedData = {
      ...formState,
      sports: updatedSports,
    };
    setFormState(updatedData);
  };

  return (
    <div className="main-playerposition">
      <h3 className="heading-bold">What position do you play?</h3>
      <p className="desc pt-[5px] pb-[32px]">
        You may select up to 3 positions.
      </p>
      {sportStaticId === 1 ? (
        <div className="football-ground relative">
          {responseData.map((item: any) => (
            <button
              key={item.id}
              className={`player-button rounded-full p-1 ${
                selectedPlayers.includes(item.id) ? "!bg-[#9FE870]" : ""
              }`}
              onClick={() => selectPlayerPositionHandler(item.id)}
            >
              {item.id !== 4 && item.id !== 6 && item.id !== 8 && item.id !== 9
                ? item.name.charAt(0) + item.name.charAt(1)
                : item.name.charAt(0) + item.name.charAt(2)}
            </button>
          ))}
        </div>
      ) : sportStaticId === 2 ? (
        <div className="basketball-ground relative mb-6 h-[26rem]">
          {responseData.map((item: any) => (
            <button
              className={`player-button rounded-full p-1 ${
                selectedPlayers.includes(item.id) ? "!bg-[#9FE870]" : ""
              }`}
              onClick={() => selectPlayerPositionHandler(item.id)}
            >
              {item.name}
            </button>
          ))}
        </div>
      ) : sportStaticId === 3 ? (
        <div className="handball-ground relative mb-6 h-[26rem]">
          {responseData.map((item: any) => (
            <button
              className={`player-button rounded-full p-1 ${
                selectedPlayers.includes(item.id) ? "!bg-[#9FE870]" : ""
              }`}
              onClick={() => selectPlayerPositionHandler(item.id)}
            >
              {item.name}
            </button>
          ))}
        </div>
      ) : sportStaticId === 4 ? (
        <div className="">
          {responseData.map((item: any) => (
            <SelectInput
              key={item.id}
              label={item.name}
              type="checkbox"
              onChange={() => selectPlayerPositionHandler(item.id)}
            />
          ))}
        </div>
      ) : (
        ""
      )}
      {checkValidation &&
        formState.sports &&
        formState.sports[0]?.playerPositionId?.length < 1 && (
          <p className="mb-2 alret-text text-[#FF453A]">
            Please Select at least 1 player position
          </p>
        )}
      <AuthButton onClick={Continue} />
    </div>
  );
};

export { PlayerPositions };
