"use client";
import { formatDate } from '@/utils/formatDate';
import React, { useEffect, useState } from 'react'
import AdminPopup from '../shared/AdminPopup';
import StatCard from './StatCard';
import { getPendingLogs } from '@/api/admin/getPendingLogs';


const PendingLogs = () => {
     const [isModalOpen, setModalOpen] = useState(false);
     const [pendingLogsData, setPendingLogsData] = useState<any>([]);
     const [selectedStat, setSelectedStat] = useState<any>([]);

     const sfProDisplayStyle = {
          fontFamily: 'SF Pro Display, Arial, sans-serif',
     };

     const openModal = (logData: any) => {
          setSelectedStat(logData)
          setModalOpen(true);
     };

     const closeModal = () => {
          setModalOpen(false);
     };

     useEffect(() => {
          const fetchData = async () => {
               const pendingLogsRes = await getPendingLogs()
               setPendingLogsData(pendingLogsRes)
          }

          fetchData()
     }, [])
    
     return (
          <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark-bg-boxdark sm:px-7.5 xl:pb-1">
               <div className="flex flex-col max-h-[calc(100vh-200px)] overflow-y-auto">
                    <div className="grid grid-cols-5 sm:grid-cols-5 bg-black text-white">
                         <div className="p-1 xl:p-2">
                              <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Sr#</h5>
                         </div>
                         <div className="p-1 xl:p-2">
                              <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">User Name</h5>
                         </div>
                         <div className="p-1 text-center xl:p-2">
                              <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Type</h5>
                         </div>
                         <div className="p-1 text-center xl:p-2">
                              <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Date</h5>
                         </div>
                         <div className="p-1 text-center xl:p-2">
                              <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Stats</h5>
                         </div>
                    </div>

                    {pendingLogsData.length > 0 ?
                         pendingLogsData.map((data: any, index: any) => (
                              <div key={index}
                                   className={`grid grid-cols-5 sm:grid-cols-5 ${index === data.length - 1
                                        ? ""
                                        : "border-b border-stroke dark:border-strokedark"
                                        }`}
                              >
                                   <div className="flex items-center gap-3 ml-2 p-1 xl:p-0">
                                        <p style={sfProDisplayStyle} className="text-sm text-black sm:block">{index + 1}</p>
                                   </div>
                                   <div className="flex items-center gap-3 ml-3 p-1 xl:p-0">
                                        <p style={sfProDisplayStyle} className="text-sm text-black sm:block">{data.User.firstName + ' ' + data.User.lastName}</p>
                                   </div>
                                   <div className="flex items-center ml-16 p-1 xl:p-5 gap-2">
                                        <p style={sfProDisplayStyle} className="text-sm text-black sm:block">{data.type}</p>
                                   </div>
                                   <div className="flex items-center justify-center p-1 xl:p-0">
                                        <p key={index} style={sfProDisplayStyle} className="text-sm text-black sm:block">{formatDate(data.date)}</p>
                                   </div>
                                   <div className="flex items-center ml-16 p-1 xl:p-5 gap-2">
                                        <p
                                             onClick={() => openModal(data.stats)}
                                             style={{ ...sfProDisplayStyle, cursor: 'pointer', textDecoration: 'underline' }}
                                             className="text-sm text-black sm:block"
                                        >
                                             View
                                        </p>
                                   </div>
                              </div>
                         )) :
                         <span className="text-black mt-4 text-center">No data</span>
                    }
               </div>

               <AdminPopup isModalOpen={isModalOpen} closeViewModal={closeModal} title={"Log Stats"}>
                    <div className="mb-4">
                         <StatCard statData={selectedStat} />
                    </div>
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                         <button
                              type="button"
                              style={sfProDisplayStyle}
                              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base text-gray-700 hover-bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm-text-sm"
                              onClick={closeModal}
                         >
                              Close
                         </button>
                    </div>
               </AdminPopup>

          </div>
     )
}

export default PendingLogs