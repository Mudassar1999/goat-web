import { useState } from "react";

const useSportUpdate = () => {
  const updateSport = (
    currentSportIndex: number,
    setFormState: any,
    updateCallback: any
  ) => {
    setFormState((prevFormState: any) => {
      const updatedSports = [...prevFormState.sports];
      updatedSports[currentSportIndex] = updateCallback(
        updatedSports[currentSportIndex]
      );
      return { ...prevFormState, sports: updatedSports };
    });
  };

  return { updateSport };
};

export default useSportUpdate;
