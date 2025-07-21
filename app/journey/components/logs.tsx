import React from "react";
import { useRouter } from "next/navigation";
import ForwordIcon from "@/assests/svg/forwordIcon";
import PlusCircleIcon from "@/assests/svg/plusCircle";
import { useLogs } from "@/providers/LogsProvider";
import { Images } from "@/public/Images";
import Image from "next/image";

function DrillsLogs() {
  const router = useRouter();

  const sportsLogs: { [key: string]: any[] } = {};

  const { logs } = useLogs();

  logs?.forEach((data: any) => {
    const sportsName = data.Sport.name;
    if (!sportsLogs[sportsName]) {
      sportsLogs[sportsName] = [];
    }
    sportsLogs[sportsName].push(data);
  });

  const formatDate = (dateString: any) => {
    const options: any = {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    };

    const formattedDate = new Date(dateString).toLocaleDateString(
      "en-US",
      options
    );

    return formattedDate;
  };

  const handleViewLogs = (sportstype: any) => {
    router.push("/journey/logs-list");
    localStorage.setItem("logsData", JSON.stringify(sportstype));
  };

  const handleLogPressed = (id: number) => {
    router.push(`/journey/log-detail?id=${id}`);
  };

  const handleAddLogPressed = () => {
    router.push("/journey/add-log");
  };

  return (
    <div className="relative">
      {Object.keys(sportsLogs).length > 0 ?
        Object.keys(sportsLogs).map((sportsTitle: any, index: any) => (
          <div key={sportsTitle} className={`${index === 0 ? "pt-[24px]" : "pt-[32px]"}`}>
            {/* heading */}
            <div className="justify-between items-center inline-flex w-full pb-[16px]">
              <span className="heading-bold-22">
                {sportsTitle + " "} Logs
              </span>
              <div
                onClick={() => handleViewLogs(sportsLogs[sportsTitle])}
                className="text-17 color-green cursor-pointer font-weight-400"
              >
                View All
              </div>
            </div>
            {/* logs table */}
            <div className="bg-zinc-500 bg-opacity-20 rounded-[14px]">
              {sportsLogs[sportsTitle]
                .slice(0, 4)
                .map((data: any, index: number) => (
                  <div key={data.id} className="pl-[16px] cursor-pointer" onClick={() => handleLogPressed(data.id)}>
                    <div
                      className={`${sportsLogs[sportsTitle].length < 3
                        ? index === sportsLogs[sportsTitle].length - 1
                          ? ""
                          : "border-b border-zinc-600 border-opacity-60"
                        : index === 3
                          ? ""
                          : "border-b border-zinc-600 border-opacity-60 "
                        } w-full flex flex-wrap justify-between items-center py-[11px]`}
                    >
                      <div className="text-17 font-weight-400">
                        {formatDate(data.date)}
                      </div>
                      <div
                        className="pr-[16px] pl-[8px]"
                      >
                        <ForwordIcon />
                      </div>
                      {/* <ForwordIcon /> */}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))
        :
        <div className="desc flex items-center justify-center w-full h-[100px]">
          There are no logs available for display. Please press the Plus Icon to include a log entry.
        </div>
      }

      <div
        className="absolute bottom-[-29px] right-[1px] w-[44px]  h-[44px] rounded-full flex justify-center text-center bg-[#9FE870] shadow-lg md:shadow-xl cursor-pointer"
        onClick={handleAddLogPressed}
      >
        <Image src={Images.AddIcon} alt="" className="social-icon" />
      </div>
    </div >
  );
}

export default DrillsLogs;
