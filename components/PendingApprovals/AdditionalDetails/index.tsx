import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Check, Clear } from "@mui/icons-material";
import { IconButton, TextField } from "@mui/material";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import config from "@/config";
import AdminPopup from "@/components/shared/AdminPopup";
import LinearColor from "@/components/Loader/LinearColor";

const AdditionalDetails = () => {
    const [data, setData] = useState<any>([])
    const [acceptedData, setAcceptedData] = useState<any>([]);
    const [rejectedData, setRejectedData] = useState<any>([]);
    const [pendingData, setPendingData] = useState<any>([]);
    const [selectedTab, setSelectedTab] = useState<any>("Pending");
    const [showRejectDialog, setShowRejectDialog] = useState<any>(false);
    const [reasonForRejection, setReasonForRejection] = useState<any>("");
    const [rejectDialogIndex, setRejectDialogIndex] = useState<any>(null);
    const [loading, setLoading] = useState<Boolean>(false);
    const [Token, setToken] = useState<any>(localStorage.getItem('accessToken'));

    useEffect(() => {
        fetchP_drills();
    }, []); // Fetch data when the tab changes
    const sfProDisplayStyle = {
        fontFamily: 'SF Pro Display, Arial, sans-serif',
        // Add other inline styles as needed
    };
    const fetchP_drills = () => {
        setLoading(true);
        axios
            .get(`${config.URL}/users/pendingApprovals`, {
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
            })
            .then((response) => {
                setData(response.data.pendingApprovals)
                const accepted = response.data.pendingApprovals.filter((item: any) => item.isDetailsVerified === "accepted");
                const rejected = response.data.pendingApprovals.filter((item: any) => item.isDetailsVerified === "rejected");
                const pending = response.data.pendingApprovals.filter((item: any) => item.isDetailsVerified === "pending");

                setAcceptedData(accepted);
                setRejectedData(rejected);
                setPendingData(pending);
            })
            .catch((error) => {
                toast.error("Error Fetching Data");
            }).finally(() => {
                setLoading(false);
            })
    };

    // Filter data based on the active tab
    const handleVerificationChange = (event: any, index: any, newStatus: any) => {
        if (newStatus === "rejected") {
            // Show the reject reason dialog when "Rejected" is selected
            setShowRejectDialog(true);
            setRejectDialogIndex(index); // Store the current index for later use
        } else {
            // Make an API call to update the verification status when "Accepted" is selected
            updateVerificationStatus(index, newStatus);
        }
    };
    // Function to update verification status via API
    const updateVerificationStatus = (index: any, newStatus: any) => {
        const item = data[index];
        axios
            .put(`${config.URL}/users/pendingApprovals/${item.id}/verify`, {
                isDetailsVerified: newStatus,
                reasonOfDetailsRejection: null,
            }, {
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
            })
            .then((response) => {
                // Update the local data after a successful API call
                const updatedData = [...data];
                updatedData[index].isDetailsVerified = newStatus;
                setData(updatedData);
                toast.success("Verification status updated successfully");
            })
            .catch((error) => {
                toast.error("Error updating verification status");
            });



    };
    const handleRejectReasonSubmit = () => {
        if (rejectDialogIndex !== null) {
            // Make an API call to update the verification status with the rejection reason
            const item = data[rejectDialogIndex];
            axios
                .put(`${config.URL}/users/pendingApprovals/${item.id}/verify`, {
                    isDetailsVerified: "rejected",
                    reasonOfDetailsRejection: reasonForRejection,
                }, {
                    headers: {
                        Authorization: `Bearer ${Token}`,
                    },
                })
                .then((response) => {
                    // Update the local data after a successful API call
                    const updatedData = [...data];
                    updatedData[rejectDialogIndex].isDetailsVerified = "rejected";
                    setData(updatedData);
                    toast.success("Verification status updated successfully");
                    // Close the reject reason dialog
                    setShowRejectDialog(false);
                    setReasonForRejection(""); // Clear the reason for rejection
                    setRejectDialogIndex(null); // Clear the stored index
                })
                .catch((error) => {
                    toast.error("Error updating verification status");
                });

        }
    };
    // Function to close the reject reason dialog
    const closeRejectDialog = () => {
        setShowRejectDialog(false);
        setReasonForRejection(""); // Clear the reason for rejection
        setRejectDialogIndex(null); // Clear the stored index
    };
    return (
        <div >

            <Tabs>
                <TabList>
                    <Tab style={sfProDisplayStyle} onClick={() => setSelectedTab("Pending")}>Pending</Tab>
                    <Tab style={sfProDisplayStyle} onClick={() => setSelectedTab("Accepted")}>Accepted</Tab>
                    <Tab style={sfProDisplayStyle} onClick={() => setSelectedTab("Rejected")}>Rejected</Tab>
                </TabList>

                <div className="flex flex-col max-h-[calc(100vh-200px)] overflow-y-auto">
                    <div className="grid grid-cols-8 sm:grid-cols-8  bg-black text-white">
                        <div className="p-1 xl:p-2">
                            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Id</h5>
                        </div>
                        <div className="p-1 xl:p-2">
                            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Phone No</h5>
                        </div>
                        <div className="p-1 text-center xl:p-2">
                            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">UserName</h5>
                        </div>
                        <div className="p-1 text-center xl:p-2">
                            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">LegalName</h5>
                        </div>
                        <div className="p-1 text-center xl:p-2">
                            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Passport No</h5>
                        </div>
                        <div className="p-1 text-center xl:p-2">
                            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">License No</h5>
                        </div>
                        <div className="p-1 text-center xl:p-2">
                            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Status</h5>
                        </div>
                        {selectedTab === "Pending" && <div className="p-1 text-center xl:p-2">
                            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Actions</h5>
                        </div>}
                    </div>
                </div>

                <TabPanel className="flex flex-col max-h-[calc(100vh-200px)] overflow-y-auto">
                    <div>
                        {loading ? (<LinearColor />) : (<>
                            {pendingData.map((data: any, index: any) => (
                                <div key={index} className="flex items-center grid grid-cols-8 sm:grid-cols-8 gap-3 text-white ml-2 p-1 xl:p-0">
                                    <div className="flex items-center gap-3 ml-2 p-1 xl:p-0">
                                        <p style={sfProDisplayStyle} className="text-sm  sm:block">{data.id}</p>
                                    </div>
                                    <div className="flex items-center gap-3 p-1 xl:p-0">
                                        <p style={sfProDisplayStyle} className="text-sm  sm:block">{data.phoneNumber}</p>
                                    </div>
                                    <div className="flex items-center gap-3 ml-8 p-1 xl:p-0">
                                        <p style={sfProDisplayStyle} className=" text-sm  sm:block">{data.userName}</p>
                                    </div>
                                    <div className="flex items-center gap-3 ml-7 p-1 xl:p-0">
                                        <p style={sfProDisplayStyle} className="text-sm  sm:block">{data.fullLegalName}</p>
                                    </div>
                                    <div className="flex items-center gap-3 ml-7 p-1 xl:p-0">
                                        <p style={sfProDisplayStyle} className="text-sm  sm:block">{data.passportNumber}</p>
                                    </div>
                                    <div className="flex items-center gap-3 ml-7 p-1 xl:p-0">
                                        <p style={sfProDisplayStyle} className=" text-sm  sm:block">{data.scoutingLiscenseNumber}</p>
                                    </div>
                                    <div className="flex items-center gap-3 ml-10 p-1 xl:p-0">
                                        <p style={sfProDisplayStyle} className="text-sm  sm:block">{data.isDetailsVerified}</p>
                                    </div>
                                    <div className="flex items-center justify-center p-1 xl:p-0">

                                        <IconButton color="error" onClick={(event) => handleVerificationChange(event, index, "rejected")}>
                                            <Clear />
                                        </IconButton>
                                        <IconButton color="success" onClick={(event) => handleVerificationChange(event, index, "accepted")}>
                                            <Check />
                                        </IconButton>


                                    </div>
                                </div>
                            ))}
                        </>)}
                    </div>
                </TabPanel>

                <TabPanel className="flex flex-col max-h-[calc(100vh-200px)] overflow-y-auto">
                <div>
                {loading ? (<LinearColor />) : (<>
                        {acceptedData.map((data: any, index: any) => (
                            <div key={index} className="flex items-center grid grid-cols-8 sm:grid-cols-8 gap-3 text-white ml-2 p-1 xl:p-0">
                                <div className="flex items-center gap-3 ml-2 p-1 xl:p-0">
                                    <p style={sfProDisplayStyle} className="text-sm sm:block">{data.id}</p>
                                </div>
                                <div className="flex items-center gap-3 p-1 xl:p-0">
                                    <p style={sfProDisplayStyle} className="text-sm  sm:block">{data.phoneNumber}</p>
                                </div>
                                <div className="flex items-center gap-3 ml-8 p-1 xl:p-0">
                                    <p style={sfProDisplayStyle} className=" text-sm  sm:block">{data.userName}</p>
                                </div>
                                <div className="flex items-center gap-3 ml-7 p-1 xl:p-0">
                                    <p style={sfProDisplayStyle} className="text-sm  sm:block">{data.fullLegalName}</p>
                                </div>
                                <div className="flex items-center gap-3 ml-7 p-1 xl:p-0">
                                    <p style={sfProDisplayStyle} className="text-sm  sm:block">{data.passportNumber}</p>
                                </div>
                                <div className="flex items-center gap-3 ml-7 p-1 xl:p-0">
                                    <p style={sfProDisplayStyle} className=" text-sm  sm:block">{data.scoutingLiscenseNumber}</p>
                                </div>
                                <div className="flex items-center gap-3 ml-10 p-1 xl:p-0">
                                    <p style={sfProDisplayStyle} className="text-sm  sm:block">{data.isDetailsVerified}</p>
                                </div>
                            </div>
                        ))}
                    </>)}
                </div>
                </TabPanel>

                <TabPanel className="flex flex-col max-h-[calc(100vh-200px)] overflow-y-auto">
                    <div>
                        {loading ? (<LinearColor />) : (<>
                            {rejectedData.map((data: any, index: any) => (
                                <div key={index} className="flex items-center grid grid-cols-8 sm:grid-cols-8 gap-3 text-white ml-2 p-1 xl:p-0">
                                    <div className="flex items-center gap-3 ml-2 p-1 xl:p-0">
                                        <p style={sfProDisplayStyle} className="text-sm  sm:block">{data.id}</p>
                                    </div>
                                    <div className="flex items-center gap-3 p-1 xl:p-0">
                                        <p style={sfProDisplayStyle} className="text-sm  sm:block">{data.phoneNumber}</p>
                                    </div>
                                    <div className="flex items-center gap-3 ml-8 p-1 xl:p-0">
                                        <p style={sfProDisplayStyle} className=" text-sm  sm:block">{data.userName}</p>
                                    </div>
                                    <div className="flex items-center gap-3 ml-7 p-1 xl:p-0">
                                        <p style={sfProDisplayStyle} className="text-sm  sm:block">{data.fullLegalName}</p>
                                    </div>
                                    <div className="flex items-center gap-3 ml-7 p-1 xl:p-0">
                                        <p style={sfProDisplayStyle} className="text-sm  sm:block">{data.passportNumber}</p>
                                    </div>
                                    <div className="flex items-center gap-3 ml-7 p-1 xl:p-0">
                                        <p style={sfProDisplayStyle} className=" text-sm  sm:block">{data.scoutingLiscenseNumber}</p>
                                    </div>
                                    <div className="flex items-center gap-3 ml-10 p-1 xl:p-0">
                                        <p style={sfProDisplayStyle} className="text-sm  sm:block">{data.isDetailsVerified}</p>
                                    </div>
                                </div>
                            ))}
                        </>)}
                    </div>
                </TabPanel>
            </Tabs>

            <ToastContainer />

            <AdminPopup isModalOpen={showRejectDialog} closeViewModal={closeRejectDialog} title={"Reason for Rejection"}>
                <TextField
                    label="Reason for Rejection"
                    variant="outlined"
                    fullWidth
                    value={reasonForRejection}
                    onChange={(e: any) => setReasonForRejection(e.target.value)}
                />
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-2">
                    <button
                        type="submit"
                        style={sfProDisplayStyle} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base text-white hover-bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm-text-sm"
                        onClick={handleRejectReasonSubmit} >
                        Submit
                    </button>
                    <button type="button"
                        style={sfProDisplayStyle}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base text-gray-700 hover-bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm-text-sm"
                        onClick={closeRejectDialog}>
                        Cancel
                    </button>
                </div>
            </AdminPopup>
        </div >
    );
};
export default AdditionalDetails;
