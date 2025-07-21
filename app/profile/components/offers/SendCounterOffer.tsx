import CustomButton from "@/components/Button/CustomButton";
import OfferForm from "@/components/shared/OfferForm";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

function SendCounterOffer({ offerDetails, setCurrentStep }: any) {

  const [checkValidation, setCheckValidation] = useState(false);
  const [offerData, setOfferData] = useState<any>({
    contractDurationId: offerDetails?.contractDurationId,
    commissionPercentage: offerDetails?.commissionPercentage,
    terminationTerms: offerDetails?.terminationTerms,
    additionalTerms: offerDetails?.additionalTerms,
  });

  const sendCounterOffer = async () => {
    setCheckValidation(true);
    // Validate the form data
    if (
      offerData.contractDurationId === null ||
      offerData.commissionPercentage === null ||
      offerData.terminationTerms === "" ||
      offerData.additionalTerms === ""
    ) {
      toast.error("Validation failed. Please fill in all required fields.");
      return;
    }

    try {
      const offerId = offerDetails?.id
      const isCounter = offerDetails?.isCounterOffer
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/contracts/${offerId}/counterOffer`,
        offerData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          params: {
            isCounterOffer: isCounter,
          },
        }
      );

      toast.success(response.data.message);
      setCurrentStep(3);
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <>
      <div>
        <h2 className=" text-white text-4xl font-bold font-['SF Pro Display'] leading-10 tracking-tight mb-1">
          Send a counter offer
        </h2>
        <p className=" text-violet-100 text-opacity-60 text-base font-normal font-['SF Pro Text'] leading-snug">
          Edit the below fields to send a counter offer.
        </p>
        <OfferForm
          checkValidation={checkValidation}
          offerData={offerData}
          setOfferData={setOfferData}
          offerDetails={offerDetails}
        />
        <CustomButton
          title="Send counter offer"
          onClick={() => sendCounterOffer()}
        />
      </div>
    </>
  );
}
export default SendCounterOffer;
