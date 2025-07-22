"use client";
import Header from "@/components/Header";
import { ArrowLeftIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { getAllLogs } from "@/api/Journey/getLogs";
import { Suspense } from "react";

function LogDetails() {
  const [individualLog, setIndividualLog] = useState<any>([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

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

  const handleEditPressed = () => {
    router.push(`/journey/add-log?id=${id}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const logsData = await getAllLogs();
        const individualLog = logsData.find((data: any) => data.id == id);
        setIndividualLog(individualLog);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Header />
      {individualLog && (
        <div className="journeyContainer">
          <div className="p-2 rounded-full w-10 bg-[#7878805c] rounded">
            <ArrowLeftIcon
              className="cursor-pointer hover:font-bold"
              onClick={() => router.back()}
            />
          </div>
          {individualLog?.date && (
            <div className="flex justify-between items-center py-[24px]">
              <span className="heading-bold-22">
                {formatDate(individualLog?.date)}
              </span>
              <div
                onClick={handleEditPressed}
                className="text-17 color-green cursor-pointer font-weight-400"
              >
                Edit
              </div>
            </div>
          )}

          <div
            className={`w-full ${
              individualLog &&
              individualLog?.stats &&
              "rounded-[14px] border border-zinc-600 border-opacity-60"
            } flex-col justify-start items-start flex`}
          >
            {individualLog?.stats?.map((data: any, index: number) => {
              return (
                <div
                  className={`w-full px-2 py-1.5 ${
                    index % 2 === 0 && "bg-zinc-500 bg-opacity-25"
                  } 
                                        ${
                                          index ===
                                            individualLog?.stats.length - 1 &&
                                          "rounded-b-[12.5px]"
                                        } 
                                        ${
                                          index === 0 && "rounded-t-[12.5px]"
                                        } border border-zinc-600 border-opacity-60 
                                        justify-between items-start inline-flex`}
                >
                  <div className="text-[#ebebf599] text-16">
                    {data.stat.name}
                  </div>
                  <div className="text-16 color-white">{data.counter}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
function LogDetail() {
  return (
    // You could have a loading skeleton as the `fallback` too
    <Suspense>
      <LogDetails />
    </Suspense>
  );
}

export default LogDetail;
