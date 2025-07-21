import CustomButton from "@/components/Button/CustomButton";
import { GrStatusGood } from "react-icons/gr";
import { useRouter } from "next/navigation";
import { Images } from "@/public/Images";
import Image from "next/image";

function OfferStatus({ offerStatus }: any) {
  const router = useRouter();
  const statusMessages: any = {
    acceptOffer: {
      title: "Offer accepted successfully",
      description: "Your offer was successfully accepted.",
    },
    rejectOffer: {
      title: "Offer rejected",
      description: "Your offer was rejected.",
    },
    sendCounterOffer: {
      title: "Counter offer sent",
      description: "Your counter offer was successfully sent.",
    },
    sentOffer: {
      title: "Offer sent",
      description: "Your offer was successfully sent to Jimmy Budd.",
    },
  };
  const activeStatus = Object.keys(offerStatus).find((key) => offerStatus[key]);

  if (!activeStatus) {
    // If none of the statuses are true, you can handle this case accordingly
    return null;
  }
  const { title, description } = statusMessages[activeStatus];


  return (
    <>
      <div>
        <div className="flex-col justify-start items-center gap-8 inline-flex">
          <div className="flex-col justify-start items-center gap-6 flex">
            {/* <div className="text-lime-300 text-6xl font-bold font-['SF Pro Display']">
              􀁣
            </div> */}
            {/* <GrStatusGood className="text-7xl rounded-full bg-[#9fe870]" /> */}
            <Image className="sendOfferImg w-[78px] h-[78px] object-cover" src={Images.sentOffer} alt="FriendImg" />
            <div className="h-24 flex-col justify-start items-center gap-1 flex">
              <h2 className="heading-bold offer-heading self-stretch text-center text-white text-4xl font-bold font-['SF Pro Display'] leading-10 tracking-tight">
                {title}
              </h2>
              <p className="offer-desc self-stretch text-center text-violet-100 text-opacity-60 text-base font-normal font-['SF Pro Text'] leading-snug">
                {description}
              </p>
            </div>
          </div>
          <div className="lastoffer-desc p-4 bg-[#1C1C1E] rounded-2xl flex-col justify-start items-start gap-4 flex">
            <div className="offer-box ">
              <div className="offerlast-desc self-stretch text-15-sent">
                What’s next?
              </div>
              <div className=" offlong-desc self-stretch text-violet-100 text-opacity-60 text-base font-normal font-['SF Pro Text'] leading-tight">
                We’ll send you a notification and an email if Jimmy Budd accepts or declines your offer.
              </div>
            </div>
            <div className="sendOfferbtn-otr">
              <div className="sendOfferbtn-inr cursor-pointer" onClick={() => router.push("/")}>
                Back to feed
              </div>
            </div>
            {/* <CustomButton
              title="Back to feed"
              onClick={() => router.push("/")}
            /> */}
          </div>
        </div>
      </div>
    </>
  );
}
export default OfferStatus;
