import CustomButton from "@/components/Button/CustomButton";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import SendCounterOffer from "./SendCounterOffer";
import OfferStatus from "./OfferStatus";
import Popup from "@/components/shared/Popup";
import { useProfile } from "@/providers/ProfileProvider";
import { calculateAge } from "@/utils/calculateAge";
import "./offers.scss";

interface termsType {
  terminationTerms: boolean;
  additionalTerms: boolean;
}

function ViewOffer({ offerDetails, setOfferDetails }: any) {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentOffer, setCurrentOffer] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>("");
  const { profile } = useProfile();

  const router = useRouter();

  const offerLength = offerDetails?.counterContract?.length;

  const [terms, setTerms] = useState<termsType>({
    terminationTerms: false,
    additionalTerms: false,
  });
  const [offerStatus, setOfferStatus] = useState<any>({
    acceptOffer: false,
    rejectOffer: false,
    sendCounterOffer: false,
  });

  const getTitle = () => {
    let title;
    title =
      // offerDetails?.contractStatus === "accepted"
      //   ? "The offer has been accepted"
      //   : offerDetails?.contractStatus === "rejected"
      //     ? "The offer has been rejected"
      //     : offerDetails?.contractType === "contract" ?
      //       userInfo?.id === offerDetails?.scoutId ? "You have sent offer to " + offerDetails?.Player?.firstName : offerDetails?.Scout?.firstName + " has sent you an offer"
      //       : offerDetails?.contractType === "contract"


      title =
      offerDetails?.contractStatus === "accepted"
        ? "The offer has been accepted"
        : offerDetails?.contractStatus === "rejected"
          ? "The offer has been rejected"
          : !offerDetails?.isCounterOffer
            ? offerDetails?.Scout
              ? offerDetails?.Scout?.firstName + " has sent you an offer"
              : "You have sent offer to " + offerDetails?.Player?.firstName
            : offerDetails?.sendBy && userInfo?.id === offerDetails?.sendBy
              ? "You have sent counter offer to " +
              offerDetails?.SendToUser?.firstName
              : "Counter Offer received from " +
              offerDetails?.SendByUser?.firstName;
    return title;
  };

  function getDataFromAllOffers(offers: any, offerId: any) {
    for (let i = 0; i < offers.length; i++) {
      const offer = offers[i];
      if (offer.id === offerId) {
        if (offer.counterContract && offer.counterContract.length > 0) {
          return offer.counterContract[offer.counterContract.length - 1];
        } else {
          return offer;
        }
      }
    }
    return null;
  }

  useEffect(() => {
    const contractsToMap =
      profile?.user?.roleId === 1
        ? profile?.user?.contractsAsPlayer
        : profile?.user?.roleId === 3
          ? profile?.user?.contractsAsScout
          : [];
    const offerId = offerDetails?.originalContractId ?? offerDetails?.id;
    const foundContract = getDataFromAllOffers(contractsToMap, offerId);
    setCurrentOffer(foundContract);
  }, []);

  const showCounterButtons = () => {
    let isShown;
    if (
      userInfo.roleId === 1 &&
      calculateAge(profile?.user?.dateOfBirth) < 18
    ) {
      return false;
    }

    currentOffer?.sendBy
      ? userInfo?.id === currentOffer?.sendBy
        ? (isShown = false)
        : (isShown = true)
      : userInfo?.id === currentOffer?.scoutId
        ? (isShown = false)
        : (isShown = true);

    return isShown;
  };

  const acceptContract = async () => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/contracts/${offerDetails?.id}/accept-contract`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          params: {
            isCounterOffer: offerDetails?.isCounterOffer,
          },
        }
      );
      // console.log(JSON.stringify(response.data));
      setOfferStatus((prev: any) => ({ ...prev, acceptOffer: true }));
      setCurrentStep(3);
    } catch (error) {
      console.error(error);
    }
  };

  const rejectContract = async () => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/contracts/${offerDetails?.id}/reject-contract`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          params: {
            isCounterOffer: offerDetails?.isCounterOffer,
          },
        }
      );
      // console.log(JSON.stringify(response.data));
      setOfferStatus((prev: any) => ({ ...prev, rejectOffer: true }));
      setCurrentStep(3);
    } catch (error) {
      console.error(error);
    }
  };

  const counterOfferHandler = () => {
    setOfferStatus((prev: any) => ({
      ...prev,
      sendCounterOffer: true,
    }));
    setCurrentStep(currentStep + 1);
  };

  const goBack = () => {
    if (window.location.pathname === "/notification") {
      router.push("/profile");
    } else {
      currentStep === 2 ? setCurrentStep(currentStep - 1) : setOfferDetails();
    }
  };

  useEffect(() => {
    let userData: any = localStorage.getItem("user_info");
    userData = userData ? JSON.parse(userData) : null;
    setUserInfo(userData);
  }, []);

  useEffect(() => {
    const handleBodyOverflow = () => {
      document.body.style.overflow =
        terms.terminationTerms || terms.additionalTerms ? "hidden" : "auto";
    };

    // Set initial state when the component mounts
    handleBodyOverflow();

    // Clean up the effect when the component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [terms]);

  return (
    <div className="journeyContainer">
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
            </div>
          </div>
        )}

        <div className="sendOffer-inner">
          {currentStep === 1 ? (
            <div className="pt-[40px]">
              <h2 className="heading-bold text-white text-4xl font-bold font-['SF Pro Display'] leading-10 tracking-tight">
                {getTitle()}
              </h2>
              <p className="desc pt-[6px] pb-[24px] text-violet-100 text-opacity-60 text-base font-normal font-['SF Pro Text'] leading-snug">
                The details of the offer can be seen below.
              </p>
              <div className="">
                <div className="">
                  <div className=" bg-zinc-900 forofferBorder1">
                    <div className=" border-b border-zinc-600 border-opacity-60 ">
                      <div className=" flex justify-between items-center py-[11px] px-[16px] ">
                        <div className="">
                          <h5 className=" desc headingOfferScout text-white text-base font-normal font-['SF Pro Text'] leading-snug">
                            Contract duration
                          </h5>
                        </div>
                        <div className="">
                          <p className=" descOfferScout text-violet-100 text-opacity-60 text-base font-normal font-['SF Pro Text'] leading-snug">
                            {/* {currentOffer?.contractDuration?.contractDuration} */}
                            {offerDetails?.counterContract?.length > 0 &&
                              offerDetails?.counterContract[offerLength - 1]?.contractDuration
                              ? offerDetails?.counterContract[offerLength - 1]?.contractDuration
                                .contractDuration
                              : offerDetails?.contractDuration?.contractDuration}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-zinc-900">
                    <div className="border-b border-zinc-600 border-opacity-60">
                      <div className="flex justify-between items-center py-[11px] px-[16px]">
                        <div className="">
                          <h5 className="desc headingOfferScout text-white text-base font-normal font-['SF Pro Text'] leading-snug">
                            Commission percentage
                          </h5>
                        </div>
                        <div className="">
                          <p className=" descOfferScout text-violet-100 text-opacity-60 text-base font-normal font-['SF Pro Text'] leading-snug">
                            {/* {currentOffer?.commissionPercentage} */}
                            {offerDetails?.counterContract?.length > 0 &&
                              offerDetails?.counterContract[offerLength - 1]?.commissionPercentage
                              ? offerDetails?.counterContract[offerLength - 1]
                                ?.commissionPercentage
                              : offerDetails?.commissionPercentage}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-zinc-900 ">
                    <div className="border-b border-zinc-600 border-opacity-60">
                      <div className="flex justify-between items-center py-[11px] px-[16px]">
                        <div className="">
                          <h5 className="desc headingOfferScout text-white text-base font-normal font-['SF Pro Text'] leading-snug">
                            Termination terms
                          </h5>
                        </div>
                        <div className="">
                          <AiOutlineExclamationCircle
                            onClick={() =>
                              setTerms({
                                ...terms,
                                terminationTerms: !terms.terminationTerms,
                              })
                            }
                          />

                          {terms.terminationTerms && (
                            <Popup
                              onClose={() =>
                                setTerms({
                                  terminationTerms: false,
                                  additionalTerms: false,
                                })
                              }
                            >
                              <div className="min-h-[96px]">
                                <h2 className="heading-bold pb-5">
                                  Termination Terms
                                </h2>
                                <p className="descOfferScout">
                                  {offerDetails?.counterContract?.length > 0 &&
                                    offerDetails?.counterContract[offerLength - 1]
                                      ?.terminationTerms
                                    ? offerDetails?.counterContract[offerLength - 1]
                                      ?.terminationTerms
                                    : offerDetails?.terminationTerms}
                                  {/* {currentOffer?.terminationTerms} */}
                                </p>
                              </div>
                            </Popup>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=" bg-zinc-900 forofferBorder2">
                    <div className="py-[11px] px-[16px]">
                      <div className="flex justify-between items-center">
                        <div className="">
                          <h5 className=" desc headingOfferScout text-white text-base font-normal font-['SF Pro Text'] leading-snug">
                            Additional terms
                          </h5>
                        </div>
                        <div className="">
                          <AiOutlineExclamationCircle
                            onClick={() =>
                              setTerms({
                                ...terms,
                                additionalTerms: !terms.additionalTerms,
                              })
                            }
                          />
                          {terms.additionalTerms && (
                            <Popup
                              onClose={() =>
                                setTerms({
                                  terminationTerms: false,
                                  additionalTerms: false,
                                })
                              }
                            >
                              <div className="min-h-[96px]">
                                <h2 className="heading-bold pb-5">
                                  Additional Terms
                                </h2>
                                <p className="descOfferScout">
                                  {offerDetails?.counterContract?.length > 0 &&
                                    offerDetails?.counterContract[offerLength - 1]
                                      ?.additionalTerms
                                    ? offerDetails?.counterContract[offerLength - 1]
                                      ?.additionalTerms
                                    : offerDetails?.additionalTerms}
                                  {/* {currentOffer?.additionalTerms} */}
                                </p>
                              </div>
                            </Popup>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {offerDetails?.updated &&
                <p className="color-red text-13 mt-[4px]">This offer has been updated. Please see the latest offer.</p>
              }
              {(offerDetails?.contractStatus === "pending" && !offerDetails?.updated) &&
                showCounterButtons() && (
                  <div className="">
                    <div className="offersActions-otr py-2">
                      <div className="acceptbtn-otr">
                        <CustomButton
                          title="Accept Offer"
                          className="acceptbtn-inr"
                          onClick={() => acceptContract()}
                        />
                      </div>
                      <div className="rejectbtn-otr">
                        <CustomButton
                          title="Reject Offer"
                          className="rejectbtn-inr"
                          onClick={() => rejectContract()}
                        />
                      </div>
                    </div>
                    <CustomButton
                      title="Send counter offer"
                      darkButton={true}
                      className="!mt-0 !text-[#9FE870]"
                      onClick={() => counterOfferHandler()}
                    />
                  </div>
                )}

              {userInfo.roleId === 1 &&
                calculateAge(profile?.user?.dateOfBirth) < 18 && (
                  <div className="text-13 pt-[20px]">
                    As a minor, you can't accep offer; however, your parents
                    have received an email and SMS with the contract details.
                    Please make sure they check the offer on your behalf through
                    their email or phone number.
                  </div>
                )}
            </div>
          ) : currentStep === 2 ? (
            <SendCounterOffer
              offerDetails={offerDetails}
              setOfferDetails={setOfferDetails}
              setCurrentStep={setCurrentStep}
            />
          ) : (
            <OfferStatus offerStatus={offerStatus} />
          )}
        </div>
      </div>
    </div>
  );
}
export default ViewOffer;
