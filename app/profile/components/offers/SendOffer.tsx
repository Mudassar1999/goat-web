import CustomButton from "@/components/Button/CustomButton";
import OfferForm from "@/components/shared/OfferForm";
import { ArrowLeftIcon } from "lucide-react";
import { useState } from "react";
import ReviewOffer from "./ReviewOffer";
import { toast } from "react-toastify";
import axios from "axios";
import OfferStatus from "./OfferStatus";
import { useProfile } from "@/providers/ProfileProvider";
import "./offers.scss";

function SendOffer({ setScoutPlayer }: any) {
  const { profile } = useProfile();
  const [checkValidation, setCheckValidation] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [statusDetails, setStatusDetails] = useState({
    sentOffer: false,
  });
  const [offerData, setOfferData] = useState<any>({
    contractDurationId: null,
    commissionPercentage: "",
    terminationTerms: "",
    additionalTerms: "",
  });
  const goBack = () => {
    currentStep === 2 ? setCurrentStep(currentStep - 1) : setScoutPlayer(false);
  };
  const nextStep = () => {
    setCheckValidation(true);
    if (
      offerData.contractDurationId === null ||
      offerData.commissionPercentage === null ||
      offerData.terminationTerms === "" ||
      offerData.additionalTerms === ""
    ) {
      toast.error("Validation failed. Please fill in all required fields.");
      return;
    }
    setCurrentStep(currentStep + 1);
  };
  const sendOffer = async () => {
    setCurrentStep(currentStep + 1);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/contracts/send-contract/${profile?.otherUser?.id}`,
        offerData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      // setStatusDetails(true)
      setStatusDetails((prev: any) => ({ ...prev, sentOffer: true }));
      toast.success(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="journeyContainer ">
      <div className="sendOffer-otr">
        {currentStep < 3 && (
          <div className="aroww-offer">
            <div className="flex">
              <div className="">
                <div className="bg-[#7474802E] rounded-full h-10 w-10 flex justify-center items-center">
                  <ArrowLeftIcon
                    className="cursor-pointer hover:font-bold text-white"
                    onClick={goBack}
                  />
                </div>
              </div>
              {/* <div className="w-1/2">
              <h2 className="text-center text-white text-base font-semibold font-['SF Pro Text'] leading-snug">
                {currentStep} Step of {2}
              </h2>
            </div> */}
            </div>

            {/* <div className="w-full lg:w-1/3 mx-auto my-8">
            <div className="flex flex-wrap items-center justify-center">
              <div
                className={`h-[3px] bg-[#9FE870] ${currentStep === 1 ? "w-1/2" : "w-full"
                  }`}
              ></div>
              <div
                className={`stepline h-[3px] ${currentStep === 1 ? "w-1/2" : "w-0"
                  }`}
              ></div>
            </div>
          </div> */}
          </div>
        )}
        <div className="sendOffer-inner">
          {currentStep < 3 && (
            <div>
              <div className="">
                <h2 className=" text-center text-white text-base font-semibold font-['SF Pro Text'] leading-snug pb-[40px]">
                  {currentStep} Step of {2}
                </h2>
              </div>
              <div className="w-full  pb-[32px]">
                <div className="flex flex-wrap items-center justify-center">
                  <div
                    className={`h-[3px] bg-[#9FE870] ${
                      currentStep === 1 ? "w-1/2" : "w-full"
                    }`}
                  ></div>
                  <div
                    className={`stepline h-[3px] ${
                      currentStep === 1 ? "w-1/2" : "w-0"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
          )}
          {currentStep === 1 ? (
            <>
              <p className="heading-bold pb-[5px]">Fill in your contract.</p>

              <p className="desc text-17 font-weight-400 color-gray">
                We’ll send this contract to Jimmy Budd for review.
              </p>
              <OfferForm
                checkValidation={checkValidation}
                offerData={offerData}
                setOfferData={setOfferData}
              />
              <CustomButton title="Next" onClick={() => nextStep()} />
            </>
          ) : currentStep === 2 ? (
            <>
              <h2 className="heading-bold  text-white text-4xl font-bold leading-10 tracking-[0.374px]">
                Review your contract.
              </h2>

              <p className=" desc text-violet-100 text-opacity-60 text-base font-normal pt-[5px] pb-[32px] leading-snug tracking-[-0.408px]">
                We’ll send this contract to Jimmy Budd for review.
              </p>
              <ReviewOffer />
              <CustomButton title="Send Offer" onClick={sendOffer} />
            </>
          ) : (
            <OfferStatus offerStatus={statusDetails} />
          )}
        </div>
      </div>
    </div>
  );
}
export default SendOffer;
