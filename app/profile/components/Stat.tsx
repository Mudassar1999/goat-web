import { useProfile } from "@/providers/ProfileProvider";

function Stat() {
  const { profile } = useProfile();
  return (
    <>
      {profile?.stats?.length > 0 ? (
        <div className="py-6 flex-col justify-start items-start gap-4 inline-flex">
          <div className="self-stretch justify-start items-center gap-4 inline-flex">
            <h2 className="text-white text-xl font-bold font-['SF Pro Display'] leading-7 tracking-tight">
              Stats
            </h2>
          </div>
          <div className="self-stretch flex-col justify-start items-start gap-2 flex">
            <div className="rounded-2xl border border-zinc-600 border-opacity-60 flex-col justify-start items-start flex w-full">
              {profile?.stats?.map((item: any, index: any) => (
                <div
                  key={index}
                  className={`w-full px-2 py-1.5 ${index % 2 === 0
                    ? "px-2 py-1.5 bg-zinc-500 bg-opacity-25 border-b border-zinc-600 border-opacity-60 "
                    : "border-b border-zinc-600 border-opacity-60"
                    } ${index === 0 ? "rounded-tl-2xl rounded-tr-2xl" : ""} ${index === profile?.stats?.length - 1
                      ? "rounded-bl-2xl rounded-br-2xl"
                      : ""
                    } border justify-between items-start inline-flex`}
                >
                  <h5 className="text-[#ebebf599] text-16">
                    {item.name}
                  </h5>
                  <p className="text-16 color-white">
                    {item.counter}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) :
        <div className="flex justify-center items-center flex-col h-[200px] overflow-y-auto">
          <p className="heading-bold-28">Stat</p>
          <p className="text-13">
            When you submit any stat, you'll see them here
          </p>
        </div>
      }
    </>
  );
}
export default Stat;
