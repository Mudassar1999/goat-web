"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import "../../auth/signup/components/AllComponent.scss"
import CustomButton17 from "@/components/Button/CustomButtton17";
import { toast } from "react-toastify";
import "./ForPopUp.scss"
import { Combobox } from "@/components/ui/combobox";

function AddStats({
  changeStatHandler,
  changeHandler,
  formState,
  setFormState,
  setAddLogPopup,
  isEditLog,
}: any) {
  const [statIndex, setStatIndex] = useState<number>(-1);

  useEffect(() => {
    if (isEditLog) {
      const index = formState.stats.findIndex(
        (stat: any) => stat.statId === parseInt(formState.selectedStat)
      );
      setStatIndex(index);
    }
  }, []);

  const handleAddStat = () => {

    if (formState.selectedStat === "" || formState.counter === "") {
      toast.error("All fields are required!")
      return
    }
    const selectedStatId = formState.statOption.find(
      (statOption: any) => statOption?.stat?.name === formState.selectedStat
    )?.stat?.id;

    if (statIndex !== -1) {
      const updatedStats = [...formState.stats];
      updatedStats.splice(statIndex, 1);

      const selectedStat = formState.statOption.find(
        (option: any) =>
          String(option.stat.id) === String(formState.selectedStat)
      )?.stat;

      if (formState.selectedStat) {
        updatedStats.splice(statIndex, 0, {
          statId: parseInt(selectedStat?.id ?? selectedStatId),
          stat: {
            name: selectedStat?.name ?? formState.selectedStat,
          },
          counter: parseInt(formState.counter),
        });
        setAddLogPopup(false);
        setFormState((prevState: any) => ({
          ...prevState,
          stats: updatedStats,
        }));

        setFormState((prevState: any) => ({
          ...prevState,
          selectedStat: "",
          counter: "",
        }));

        return;
      }
    }

    if (formState.selectedStat) {
      setFormState((prevState: any) => ({
        ...prevState,
        stats: [
          ...prevState.stats,
          {
            statId: selectedStatId,
            stat: {
              name: formState.selectedStat,
            },
            counter: parseInt(formState.counter),
          },
        ],
      }));
    }

    setFormState((prevState: any) => ({
      ...prevState,
      selectedStat: "",
      counter: "",
    }));
    setAddLogPopup(false);
  };

  return (
    <>
      <div className="">
        <div className="pb-[4px]">
          <span className="heading-bold">
            {isEditLog ? "Edit Stat" : "Add Stat"}
          </span>
        </div>

        {formState.statOption && (
          <div>
            <div className="flex items-center mb-[20px]">
              <p className=" text-17 flex gap-2">
                <span className="color-red">*</span>
                <span className="color-gray font-weight-400">Indicates required fields</span>
              </p>
            </div>

            <div>
              <div className="flex items-center gap-1 text-16 pb-[6px]">
                <span className="text-white">Stat <span className="text-[#FF3B30]">*</span></span>
              </div>
              <Combobox
                onChange={changeStatHandler}
                placeholder={"Select Stat"}
                data={formState?.statOption ?? []}
                displayValue={(x: any) => x?.stat?.name}
                defaultSelectedValue={formState?.statOption?.find((statOption: any) => statOption?.stat?.id === formState?.selectedStat)?.stat.name}
              />

              <div className="flex items-center gap-1 text-16 pb-[6px] pt-6">
                <span className="text-white">Counter <span className="text-[#FF3B30]">*</span></span>
              </div>
              <Input
                type="number"
                name="counter"
                className="common-input-inr forNumber color-white"
                value={formState.counter}
                onChange={changeHandler}
                placeholder="Number"
              />

              <CustomButton17
                onClick={handleAddStat}
                title={`${isEditLog ? "Update Stat" : "Add Stat"}`}
                className="mt-[32px]"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AddStats;
