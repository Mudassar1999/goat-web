function ReviewOffer() {
  return (
    <>
      <div className="">
        <div className="self-stretch justify-start items-start gap-3 inline-flex">
          <div className="self-stretch pb-1 flex-col justify-start items-center gap-1 inline-flex">
            <div className="w-6 h-6 relative bg-[#9FE870] rounded-xl justify-center items-center flex">
              <span className="w-2 h-2 bg-white rounded-full" />
            </div>
            <div className="w-0.5 grow shrink basis-0 bg-gray-200 rounded-sm" />
          </div>
          <div className="grow shrink basis-0 pt-0.5 pb-6 flex-col justify-start items-start inline-flex">
            <h3 className="desc2 text-[#9FE870] text-base font-semibold leading-tight">
              You send the offer
            </h3>
            <p className="desc text-[#9FE870] text-xs font-normal leading-none">
            Today, we’ll send an email to Jimmy Budd at jimmybudd@gmail.com with a link to their offer.
            </p>
          </div>
        </div>
        <div className="self-stretch justify-start items-start gap-3 inline-flex">
          <div className="self-stretch pb-1 flex-col justify-start items-center gap-1 inline-flex">
            <div className="w-6 h-6 relative bg-[#F2F4F7] rounded-xl flex-col justify-center items-center flex">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
            <div className="w-0.5 grow shrink basis-0 bg-gray-200 rounded-sm" />
          </div>
          <div className="grow shrink basis-0 pt-0.5 pb-6 flex-col justify-start items-start inline-flex">
            <h3 className="desc2 text-white text-base font-semibold leading-tight">
              Jimmy signs the offer
            </h3>
            <p className="desc text-violet-100 text-opacity-60 text-xs font-normal leading-none">
              By October 31, 2023 — once signed, we will email you both a copy
              of the final contract.
            </p>
          </div>
        </div>
        <div className="self-stretch justify-start items-start gap-3 inline-flex">
          <div className="self-stretch pb-1 flex-col justify-start items-center gap-1 inline-flex">
            <div className="w-6 h-6 relative bg-[#F2F4F7] rounded-xl flex-col justify-center items-center flex">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          </div>
          <div className="grow shrink basis-0 pt-0.5 pb-6 flex-col justify-start items-start inline-flex">
            <h3 className=" desc2 text-white text-base font-semibold font-['SF Pro Text'] leading-tight">
              Jimmy’s start date
            </h3>
            <p className=" desc text-violet-100 text-opacity-60 text-xs font-normal  leading-none">
              October 31, 2023 — if signed.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
export default ReviewOffer;
