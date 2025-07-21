"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import ForwordIcon from "@/assests/svg/forwordIcon";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllLogs } from "@/api/Journey/getLogs";
import "../../auth/signup/components/AllComponent.scss"

function LogsList() {
  const [logs, setLogs] = useState<any>("");

  const router = useRouter();

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

  const handleLogPressed = (id: number) => {
    router.push(`/journey/log-detail?id=${id}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const logsData = await getAllLogs();
        setLogs(logsData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Header />
      {logs && (
        <div className="journeyContainer">
          <div className="p-2 rounded-full w-10 bg-[#7878805c] rounded">
            <ArrowLeftIcon
              className="cursor-pointer "
              onClick={() => router.back()}
            />
          </div>
          <div className="my-[24px]">
            <span className="heading-bold-22">
              {logs[0]?.Sport?.name}
            </span>
          </div>
          <div className="bg-zinc-500 bg-opacity-20 rounded-[14px]">
            {logs?.map((data: any, index: number) => (
              <div key={data.id} className="pl-[16px]" onClick={() => handleLogPressed(data.id)}>
                <div
                  className={`${index === logs.length - 1
                    ? ""
                    : "border-b border-zinc-600 border-opacity-60"
                    } w-full flex flex-wrap justify-between items-center py-[11px]`}
                >
                  <div className="text-17 font-weight-400">
                    {formatDate(data.date)}
                  </div>
                  <div
                    className="pr-[16px] pl-[8px] cursor-pointer"
                  >
                    <ForwordIcon />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

export default LogsList;
