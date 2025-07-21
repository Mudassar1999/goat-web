import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "@/config";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import LinearColor from "../Loader/LinearColor";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, TextField, Tabs, Tab } from "@mui/material";
import { Check, Clear } from "@mui/icons-material";
const PendingApprovals = () => {
    const [data, setData] = useState<any>([]);
    const [Token, setToken] = useState<any>(localStorage.getItem('accessToken'));
    const [tabIndex, setTabIndex] = useState<any>(0);
    const [showRejectDialog, setShowRejectDialog] = useState<any>(false);
    const [reasonForRejection, setReasonForRejection] = useState<any>("");
    const [rejectDialogIndex, setRejectDialogIndex] = useState<any>(null);
    const [loading, setLoading] = useState<Boolean>(false);
    useEffect(() => {

        fetchP_drills();
    }, [tabIndex]); // Fetch data when the tab changes
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
                if (tabIndex === 0) setData(response.data.pendingApprovals);
                else {
                    setData(response.data.pendingAdditionRequests);
                }
            })
            .catch((error) => {
                toast.error("Error Fetching Data");
            }).finally(() => {
                setLoading(false);
            })
    };

    const handleTabChange = (event: any, newTabIndex: any) => {
        setTabIndex(newTabIndex);
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
        if (tabIndex === 0) {
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
        }
        else {
            axios
                .put(`${config.URL}/users/${item.id}/addition-request/verify`, {
                    isDetailsVerified: newStatus,
                    //reasonOfDetailsRejection: null,

                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${Token}`,
                    },
                })
                .then((response) => {
                    // Update the local data after a successful API call
                    const updatedData = [...data];
                    updatedData[index].approved = newStatus;
                    setData(updatedData);
                    toast.success("Verification status updated successfully");
                })
                .catch((error) => {
                    toast.error("Error updating verification status");
                });
        }

    };
    const handleRejectReasonSubmit = () => {
        if (rejectDialogIndex !== null) {
            // Make an API call to update the verification status with the rejection reason
            const item = data[rejectDialogIndex];
            if (tabIndex === 0) {
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
            else {
                axios
                    .put(`${config.URL}/users/${item.id}/addition-request/verify`, {
                        approved: "rejected",
                        reasonOfDetailsRejection: reasonForRejection,
                    }, {
                        headers: {
                            Authorization: `Bearer ${Token}`,
                        },
                    })
                    .then((response) => {
                        // Update the local data after a successful API call
                        const updatedData = [...data];
                        updatedData[rejectDialogIndex].approved = "rejected";
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
        }
    };
    // Function to close the reject reason dialog
    const closeRejectDialog = () => {
        setShowRejectDialog(false);
        setReasonForRejection(""); // Clear the reason for rejection
        setRejectDialogIndex(null); // Clear the stored index
    };

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark-bg-boxdark sm:px-7.5 xl:pb-1">
            <Tabs value={tabIndex} onChange={handleTabChange}>
                <Tab
                    style={{
                        ...sfProDisplayStyle,
                        backgroundColor: tabIndex === 0 ? 'black' : 'transparent',
                        color: tabIndex === 0 ? 'white' : 'black'
                    }}
                    label="Additional Detail Requests"
                />
                <Tab
                    style={{
                        ...sfProDisplayStyle,
                        backgroundColor: tabIndex === 1 ? 'black' : 'transparent',
                        color: tabIndex === 1 ? 'white' : 'black'

                    }}
                    label="Entity Addition Requests"
                />
            </Tabs>

            <div className="flex flex-col max-h-[calc(100vh-200px)] overflow-y-auto">
                {tabIndex === 0 ? (
                    <>
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
                            <div className="p-1 text-center xl:p-2">
                                <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Actions</h5>
                            </div>
                        </div>
                        {loading ? (<LinearColor />) : (<>
                            {data.map((data: any, index: any) => (
                                <div key={index} className={`grid grid-cols-8 sm:grid-cols-8 ${index === data.length - 1
                                    ? ""
                                    : "border-b border-stroke dark:border-strokedark"
                                    }`}
                                >
                                    <div className="flex items-center gap-3 ml-2 p-1 xl:p-0">
                                        <p style={sfProDisplayStyle} className="text-sm text-black sm:block">{data.id}</p>
                                    </div>
                                    <div className="flex items-center gap-3 p-1 xl:p-0">
                                        <p style={sfProDisplayStyle} className="text-sm text-black sm:block">{data.phoneNumber}</p>
                                    </div>
                                    <div className="flex items-center gap-3 ml-8 p-1 xl:p-0">
                                        <p style={sfProDisplayStyle} className=" text-sm text-black sm:block">{data.userName}</p>
                                    </div>
                                    <div className="flex items-center gap-3 ml-7 p-1 xl:p-0">
                                        <p style={sfProDisplayStyle} className="text-sm text-black sm:block">{data.fullLegalName}</p>
                                    </div>
                                    <div className="flex items-center gap-3 ml-7 p-1 xl:p-0">
                                        <p style={sfProDisplayStyle} className="text-sm text-black sm:block">{data.passportNumber}</p>
                                    </div>
                                    <div className="flex items-center gap-3 ml-7 p-1 xl:p-0">
                                        <p style={sfProDisplayStyle} className=" text-sm text-black sm:block">{data.scoutingLiscenseNumber}</p>
                                    </div>
                                    <div className="flex items-center gap-3 ml-10 p-1 xl:p-0">
                                        <p style={sfProDisplayStyle} className="text-sm text-black sm:block">{data.isDetailsVerified}</p>
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
                    </>
                ) : (
                    <>
                        <div className="grid grid-cols-10 sm:grid-cols-10 bg-black text-white">
                            <div className="p-1 xl:p-2">
                                <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Id</h5>
                            </div>

                            <div className="p-1 text-center xl:p-2">
                                <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Email</h5>
                            </div>
                            <div className="p-1 text-center xl:p-2">
                                <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">EntityType</h5>
                            </div>
                            <div className="p-1 text-center xl:p-2">
                                <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">EntityName</h5>
                            </div>
                            <div className="p-1 text-center xl:p-2">
                                <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">SportId</h5>
                            </div>
                            <div className="p-1 text-center xl:p-2">
                                <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">ClubId</h5>
                            </div>
                            <div className="p-1 text-center xl:p-2">
                                <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Info</h5>
                            </div>
                            <div className="p-1 text-center xl:p-2">
                                <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">RequestId</h5>
                            </div>
                            <div className="p-1 text-center xl:p-2">
                                <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Status</h5>
                            </div>
                            <div className="p-1 text-center xl:p-2">
                                <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Action</h5>
                            </div>
                        </div>
                        {loading ? (<LinearColor />) : (<>
                            {data.map((data: any, index: any) => (
                                <div
                                    key={index} className={`grid grid-cols-10 sm:grid-cols-10 ${index === data.length - 1
                                        ? ""
                                        : "border-b border-stroke dark:border-strokedark"
                                        }`}
                                >
                                    <div className="flex items-center p-1 ml-2 xl:p-0">
                                        <p style={sfProDisplayStyle} className="text-sm text-black sm:block">{data.id}</p>
                                    </div>
                                    <div style={sfProDisplayStyle}
                                        className="flex items-center gap-3 ml-6 p-1 xl:p-0">
                                        <p className="hidden text-sm text-black sm:block" style={{ wordBreak: 'break-all' }}>{data.email}</p>
                                    </div>
                                    <div className="flex items-center  ml-5 p-1 xl:p-0">
                                        <p style={sfProDisplayStyle} className="text-sm text-black sm:block">{data.entityType}</p>

                                    </div>

                                    <div className="flex items-center  ml-5 p-1 xl:p-0">
                                        <p style={sfProDisplayStyle} className="text-sm text-black sm:block">{data.entityName}</p>
                                    </div>
                                    <div className="flex items-center  ml-10 p-1 xl:p-0">
                                        <p style={sfProDisplayStyle} className="text-sm text-black sm:block">{data.sportId}</p>
                                    </div>

                                    <div className="flex items-center  ml-5 p-1 xl:p-0">
                                        <p style={sfProDisplayStyle} className="text-sm text-black sm:block">{data.clubId}</p>
                                    </div>
                                    <div className="flex items-center  ml-5 p-1 xl:p-0">
                                        <p style={sfProDisplayStyle} title={data.additionalInfo} className="text-ellipsis overflow-hidden hidden text-sm  text-black sm:block">{data.additionalInfo}</p>
                                    </div>
                                    <div className="flex items-center  ml-8 p-1 xl:p-0">
                                        <p style={sfProDisplayStyle} className="text-sm  text-black sm:block">{data.requestedById}</p>
                                    </div>
                                    <div className="flex items-center  ml-6 p-1 xl:p-0">
                                        <p style={sfProDisplayStyle} className="text-sm text-black sm:block">{data.approved}</p>
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
                    </>
                )

                }
            </div>
            <ToastContainer />
            <Dialog open={showRejectDialog} onClose={closeRejectDialog}>
                <DialogTitle>Reason for Rejection</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Reason for Rejection"
                        variant="outlined"
                        fullWidth
                        value={reasonForRejection}
                        onChange={(e: any) => setReasonForRejection(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeRejectDialog}>Cancel</Button>
                    <Button onClick={handleRejectReasonSubmit} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div >
    );
};

export default PendingApprovals;
