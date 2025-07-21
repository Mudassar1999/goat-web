import { formatDate } from "@/utils/formatDate";
import { useProfile } from "@/providers/ProfileProvider";

function Offers({ setOfferDetails }: any) {
  const { profile } = useProfile();
  const contractsToMap =
    profile?.user?.roleId === 1
      ? profile?.user?.contractsAsPlayer
      : profile?.user?.roleId === 3
        ? profile?.user?.contractsAsScout
        : [];

  return (
    <>
      {contractsToMap.length > 0 ?
        contractsToMap.map((item: any) => (
          <div
            className="p-4 bg-[#1C1C1E] flex-col justify-start items-start gap-1 flex rounded-[14px]"
            key={item.id}
            onClick={() => setOfferDetails(item?.counterContract?.length ? item?.counterContract[item?.counterContract?.length - 1] : item)}
          >
            <div className="justify-start items-start gap-2 inline-flex">
              <h2 className="text-white text-xl font-bold font-['SF Pro Display'] leading-7 tracking-tight">
                {item?.Scout?.firstName} {item?.Scout?.lastName}
              </h2>
            </div>
            <div className="w-full">
              <div className="w-full px-2 py-1.5 rounded justify-between items-start inline-flex">
                <h3 className="text-violet-100 text-opacity-60 text-base font-normal font-['SF Pro Text'] leading-tight">
                  Status
                </h3>
                <div className="px-2 py-0.5 bg-orange-50 rounded-2xl justify-start items-center flex">
                  {(item?.counterContract?.length > 0 ? item?.counterContract[item?.counterContract.length - 1]?.contractStatus : item?.contractStatus) === "accepted" && (
                    <p className="text-center color-green-dark text-12 font-weight-500">
                      Offer Accepted
                    </p>
                  )}

                  {(item?.counterContract?.length > 0 ? item?.counterContract[item?.counterContract.length - 1]?.contractStatus : item?.contractStatus) === "pending" && (
                    <p className="text-center color-orange text-12 font-weight-500">
                      Waiting for Response
                    </p>
                  )}
                  {(item?.counterContract?.length > 0 ? item?.counterContract[item?.counterContract.length - 1]?.contractStatus : item?.contractStatus) === "rejected" && (
                    <p className="text-center color-amber text-12 font-weight-500">
                      Offer Rejected
                    </p>
                  )}
                </div>
              </div>
              <div className="w-full px-2 py-1.5 bg-zinc-500 bg-opacity-20 rounded justify-between items-start inline-flex">
                <h3 className="text-violet-100 text-opacity-60 text-base font-normal font-['SF Pro Text'] leading-tight">
                  Date sent
                </h3>
                <p className="text-white text-base font-normal font-['SF Pro Text'] leading-tight">
                  {formatDate(item.createdAt)}
                </p>
              </div>
              <div className="w-full px-2 py-1.5 rounded justify-between items-start inline-flex">
                <h3 className="text-violet-100 text-opacity-60 text-base font-normal font-['SF Pro Text'] leading-tight">
                  Offer type
                </h3>
                <p className="text-white text-base font-normal font-['SF Pro Text'] leading-tight">
                  {item.contractType}
                </p>
              </div>
            </div>
          </div>
        ))
        :
        <div className="flex justify-center items-center flex-col h-[200px] overflow-y-auto">
          <p className="heading-bold-28">Offers</p>
          <p className="text-13">
            When you send or receive a offer, you'll see them here
          </p>
        </div>
      }
    </>
  );
}
export default Offers;
