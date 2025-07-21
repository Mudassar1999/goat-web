import CustomButton from "@/components/Button/CustomButton";
import { GrStatusGood } from "react-icons/gr";
import { useRouter } from "next/navigation";

function AcceptOffer() {
  const router = useRouter();
  return (
    <>
      <div className="w-full lg:w-1/3 mx-auto">
        <div className="flex-col justify-start items-center gap-8 inline-flex">
          <div className="flex-col justify-start items-center gap-6 flex">
            {/* <div className="text-lime-300 text-6xl font-bold font-['SF Pro Display']">
              􀁣
            </div> */}
            <GrStatusGood className="text-7xl rounded-full bg-[#9fe870]" />
            <div className="h-24 flex-col justify-start items-center gap-1 flex">
              <h2 className="self-stretch text-center text-white text-4xl font-bold font-['SF Pro Display'] leading-10 tracking-tight">
                Offer accepted
              </h2>
              <p className="self-stretch text-center text-violet-100 text-opacity-60 text-base font-normal font-['SF Pro Text'] leading-snug">
                You have successfully accepted Ahmed Ehab’s offer.
              </p>
            </div>
          </div>
          <div className="h-44 p-4 bg-zinc-900 rounded-2xl flex-col justify-start items-start gap-4 flex">
            <div className="self-stretch h-20 flex-col justify-start items-start gap-1 flex">
              <div className="self-stretch text-white text-base font-semibold font-['SF Pro Text'] leading-tight">
                What’s next?
              </div>
              <div className="self-stretch text-violet-100 text-opacity-60 text-base font-normal font-['SF Pro Text'] leading-tight">
                We’ll send Ahmed Ehab an email and a notification so that they
                get in touch with you. Expect an email or a phone call back.
              </div>
            </div>
            <CustomButton
              title="Back to feed"
              onClick={() => router.push("/")}
            />
          </div>
        </div>
      </div>
    </>
  );
}
export default AcceptOffer;
