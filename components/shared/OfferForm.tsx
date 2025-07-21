import axios from "axios";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { IoIosArrowDown } from "react-icons/io";
import { toast } from "react-toastify";

interface propsType {
  checkValidation: any;
  offerData: any;
  setOfferData: any;
  offerDetails?: any;
}

function OfferForm({
  checkValidation,
  offerData,
  setOfferData,
  offerDetails,
}: propsType) {
  const [contractDurations, setContractDurations] = useState<any>();
  const offerLength = offerDetails?.counterContract?.length;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData: any = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/contracts/contractDurations`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      setContractDurations(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "commissionPercentage" && (value < 0 || value > 100)) {
      toast.warning(
        "Percentage value should be grater then 0 and less then 100!"
      );
      return;
    }

    setOfferData((prevData: any) => ({
      ...prevData,
      [name]:
        name === "contractDurationId" || name === "commissionPercentage"
          ? Number(value)
          : value,
    }));
  };

  const handleKeyDown = (event: any) => {
    // Allow numeric keys (0-9), backspace, delete, arrow keys, and decimal point
    if (
      !(
        (event.key >= "0" && event.key <= "9") ||
        event.key === "Backspace" ||
        event.key === "Delete" ||
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight" ||
        event.key === "."
      )
    ) {
      event.preventDefault(); // Prevent the default action for non-numeric keys
    }
  };
  
  return (
    <>
      <div className="flex flex-col gap-[24px]">
        <div className="flex-col justify-start items-start gap-1.5 flex pt-[32px]">
          <label className="desc text-white text-base font-normal  leading-tight">
            Contract duration
          </label>
          <div className="relative w-full">
            <select
              name="contractDurationId"
              onChange={handleChange}
              className={`desc !mb-2 flex w-full !basis-0 rounded-[8px] border-input bg-background bg-zinc-800 
              px-6 py-4 !text-base !font-normal !leading-tight !placeholder-[#8E8E93] ring-offset-background 
              file:border-0 file:bg-transparent file:text-base file:font-medium placeholder:text-muted-foreground 
              focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#9FE870] disabled:cursor-not-allowed 
              disabled:opacity-50 dark:bg-[#29292C] appearance-none 
              ${(offerDetails || offerData?.contractDurationId) ? "!text-[#fff]" : ""} 
              ${checkValidation &&
                offerData.contractDurationId === null &&
                "!border-2 !border-[#FF453A]"
                }`}
            >
              <option value="" selected disabled hidden>
                {offerDetails?.counterContract?.length
                  ? offerDetails?.counterContract[offerLength - 1]
                    ?.contractDuration?.contractDuration
                  : offerDetails?.contractDuration?.contractDuration
                    ? offerDetails?.contractDuration?.contractDuration
                    : "Contract duration"}
              </option>
              {contractDurations?.map((item: any) => (
                <option
                  value={item.id}
                  key={item.id}
                  className="bg-black text-white"
                >
                  {item.contractDuration}
                </option>
              ))}
            </select>
            <IoIosArrowDown className="absolute right-[26px] top-[45%] -translate-y-1/2 text-[#8E8E93]" />
          </div>
          {offerDetails && (
            <>
              <p className="text-12">
                Contract Duration was{" "}
                <span className="text-[white]">
                  {offerDetails?.counterContract?.length
                    ? offerDetails?.counterContract[offerLength - 1]
                      ?.contractDuration?.contractDuration
                    : offerDetails?.contractDuration?.contractDuration}
                </span>
                .
              </p>
            </>
          )}
          {checkValidation && offerData.contractDurationId === null && (
            <p className="text-base text-[#FF453A]">
              Contract Duration is required
            </p>
          )}
          {/* <div className="self-stretch">
            <span className="text-[#8E8E93] text-opacity-60 text-xs font-normal font-['SF Pro Text'] leading-none">
              Contract duration was{" "}
            </span>
            <span className="text-white text-xs font-normal font-['SF Pro Text'] leading-none">
              2 years
            </span>
            <span className="text-[#8E8E93] text-opacity-60 text-xs font-normal font-['SF Pro Text'] leading-none">
              .
            </span>
          </div> */}
        </div>
        <div className="flex-col justify-start items-start gap-1.5 flex ">
          <label className="desc text-white text-base font-normal  leading-tight">
            Commission percentage{" "}
          </label>
          <div className="relative w-full">
            <Input
              type="number"
              name="commissionPercentage"
              value={offerData.commissionPercentage}
              onKeyDown={handleKeyDown}
              onChange={handleChange}
              placeholder="Commission percentage"
              className={` 
              px-[24px] py-[14px] rounded-[8px] w-full desc
              !text-[#FFFF] !placeholder-[#8E8E93] !mb-0 !bg-[#29292C] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#9FE870]
            ${checkValidation &&
                offerData.commissionPercentage === "" &&
                "border-2 border-[#FF453A]"
                }
           
            `}
            />
            <span className="text-[#8E8E93] text-base font-normal leading-tight absolute right-0 top-0 px-4 border-l border-[#8E8E93] border-opacity-60 h-full bg-[#1C1C1F] flex items-center rounded-tr-lg rounded-br-lg">
              %
            </span>
          </div>
          {offerDetails && (
            <>
              <p className="text-12">
                Commission percentage was{" "}
                <span className="text-[white]">
                  {offerDetails?.counterContract?.length
                    ? offerDetails?.counterContract[offerLength - 1]
                      ?.commissionPercentage
                    : offerDetails?.commissionPercentage}
                  %
                </span>
                .
              </p>
            </>
          )}
          {checkValidation && offerData.commissionPercentage === "" && (
            <p className="text-base text-[#FF453A]">
              Termination terms is required
            </p>
          )}
          {/* <div className="self-stretch">
            <span className="text-[#8E8E93] text-opacity-60 text-xs font-normal font-['SF Pro Text'] leading-none">
              Contract duration was{" "}
            </span>
            <span className="text-white text-xs font-normal font-['SF Pro Text'] leading-none">
              20%.
            </span>
          </div> */}
        </div>
        <div className="flex-col justify-start items-start gap-1.5 flex">
          <label className="desc text-white text-base font-normal font-['SF Pro Text'] leading-tight">
            Termination terms
          </label>
          <Input
            type="text"
            name="terminationTerms"
            value={offerData.terminationTerms}
            onChange={handleChange}
            placeholder="Termination terms"
            className={` 
            px-[24px] py-[14px] rounded-[8px] w-full desc
            !text-[#FFFF] !placeholder-[#8E8E93] !mb-0 !bg-[#29292C] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#9FE870]
            ${checkValidation &&
              offerData.terminationTerms === "" &&
              "border-2 border-[#FF453A]"
              }
           
            `}
          />
          {checkValidation && offerData.commissionPercentage === "" && (
            <p className="text-base text-[#FF453A]">
              Commission Percentage is required
            </p>
          )}
        </div>
        <div className="flex-col justify-start items-start gap-1.5 flex pb-[24px]">
          <label className=" desc text-white text-base font-normal font-['SF Pro Text'] leading-tight">
            Additional terms
          </label>
          <textarea
            name="additionalTerms"
            value={offerData.additionalTerms}
            onChange={handleChange}
            placeholder="Add any additional terms"
            className={` resize-none h-[130px] px-[24px] py-[14px] rounded-[8px] w-full desc pb-1 bg-[#29292C] dark:bg-[#29292C] justify-start items-start gap-2 inline-flex !text-[#FFFF] placeholder:[#8E8E93] text-base font-normal leading-tight focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#9FE870]`}
          ></textarea>
          {/* {checkValidation && offerData.additionalTerms === "" && (
            <p className="text-base text-[#FF453A]">
              Additional terms is required
            </p>
          )}
          <p className="self-stretch text-[#8E8E93] text-opacity-60 text-xs font-normal font-['SF Pro Text'] leading-none">
            The first 6 months are considered a probation period and no salary
            will be paid.
          </p> */}
        </div>
      </div>
    </>
  );
}
export default OfferForm;
