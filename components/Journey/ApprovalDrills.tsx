"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import config from "@/config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';
import AdminPopup from "../shared/AdminPopup";

const ApprovalDrills = () => {
    const [selectedTab, setSelectedTab] = useState<any>("For Approval");
    const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState<any>(false);
    const [confirmationAction, setConfirmationAction] = useState<any>("");
    const [confirmationDrillId, setConfirmationDrillId] = useState<any>(null);
    const sfProDisplayStyle = {
        fontFamily: 'SF Pro Display, Arial, sans-serif',
        // Add other inline styles as needed
    };
    const [Token, setToken] = useState<any>(localStorage.getItem('accessToken'));
    const [acceptedData, setAcceptedData] = useState<any>([]);
    const [rejectedData, setRejectedData] = useState<any>([]);
    const [pendingData, setPendingData] = useState<any>([]);
    const [selectedDrillData, setSelectedDrillData] = useState<any>(null);
    const [isDrillDetailsDialogOpen, setIsDrillDetailsDialogOpen] = useState<any>(false);
    useEffect(() => {
        fetchP_drills();
    }, []);
    const fetchP_drills = () => {
        axios
            .get(`${config.URL}/journies/userDrill/pendings`, {
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
            })
            .then((response: any) => {
                const accepted = response.data.filter((item: any) => item.isApproved === "accepted");
                const rejected = response.data.filter((item: any) => item.isApproved === "rejected");
                const pending = response.data.filter((item: any) => item.isApproved === "pending");

                setAcceptedData(accepted);
                setRejectedData(rejected);
                setPendingData(pending);
            })
            .catch((error) => {
                toast.error("Error Fetching Pending Drills for Approval");
            });
    };
    const openConfirmationDialog = (action: any, drillId: any) => {
        setIsConfirmationDialogOpen(true);
        setConfirmationAction(action);
        setConfirmationDrillId(drillId);
    };
    const closeConfirmationDialog = () => {
        setIsConfirmationDialogOpen(false);
        setConfirmationAction("");
        setConfirmationDrillId(null);
    };
    // Function to open pop-up and set selected drill data
    const openDrillDetailsPopup = (data: any) => {
        setSelectedDrillData(data);
        setIsDrillDetailsDialogOpen(true);
    };
    // Function to close drill details dialog
    const closeDrillDetailsDialog = () => {
        setSelectedDrillData(null);
        setIsDrillDetailsDialogOpen(false);
    };
    const handleAction = (action: any, id: any) => {
        openConfirmationDialog(action, id);
    };
    const handleConfirmation = () => {
        axios.put(`${config.URL}/journies/userDrill/${confirmationDrillId}?action=${confirmationAction}`, null, {
            headers: {
                'Authorization': `Bearer ${Token}`,
            },
        })
            .then((response: any) => {
                toast.success("Approval Status Updated Successfully");
                fetchP_drills();
            })
            .catch((error: any) => {
                console.log(error);
                toast.error("Error updating Approval Status");
            });
        closeConfirmationDialog();
    };
    return (
        <div className="fixed">
            <Tabs>
                <TabList>
                    <Tab style={sfProDisplayStyle} onClick={() => setSelectedTab("Pending")}>Pending</Tab>
                    <Tab style={sfProDisplayStyle} onClick={() => setSelectedTab("Accepted")}>Accepted</Tab>
                    <Tab style={sfProDisplayStyle} onClick={() => setSelectedTab("Rejected")}>Rejected</Tab>
                </TabList>
                <TabPanel>
                    <div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-screen" 
                    style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
                    >
                        {pendingData.map((brand: any, index: any) => (
                            <Card key={index} className="mb-4">

                                <div className="p-2 text-center">
                                    {brand.drillUrl ? (
                                        <video style={{ width: '400px', height: '200px' }}
                                            src={`${config.baseUrl}${brand.drillUrl}`}
                                            controls
                                            className="w-full"
                                        />
                                    ) : (
                                        <span></span>
                                    )}
                                </div>
                                <span style={{ marginLeft: '20px', color: 'gray', fontSize: 'large' }}>Submitted By:
                                    <b style={{ color: 'black', fontSize: 'medium' }}>{`  ${brand.User.firstName} ${brand.User.lastName}`}</b>
                                    <label style={{ fontSize: "small" }}>{` (${brand.User.userName})`}</label>
                                </span>
                                <p style={{ marginLeft: '20px', color: 'gray', fontSize: 'large' }}>
                                    Submitted Against:
                                    <b style={{ color: 'black', fontSize: 'medium' }}>
                                        <span
                                            onClick={() => openDrillDetailsPopup(brand.Drill)}
                                            style={{ cursor: 'pointer' }} // Add this line to set the cursor style
                                        >
                                            {` ${brand.Drill.title}`}
                                        </span>
                                    </b>
                                </p>
                                <CardActions>
                                    <Button
                                        style={{ backgroundColor: '#9FE870', color: '#3a3b3a' }}
                                        variant="contained"
                                        startIcon={<CheckCircleIcon />}
                                        onClick={() => handleAction('accept', brand.id)}
                                    >
                                        Accept
                                    </Button>
                                    <Button
                                        style={{ backgroundColor: '#FF453A', color: 'white', marginLeft: '8px' }}
                                        variant="contained"
                                        startIcon={<CancelIcon />}
                                        onClick={() => handleAction('reject', brand.id)}
                                    >
                                        Reject
                                    </Button>
                                </CardActions>
                            </Card>
                        ))}
                    </div>
                </TabPanel>
                <TabPanel>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto" style={{ maxHeight: '500px' }}>
                        {acceptedData.map((brand: any, index: any) => (
                            <Card key={index} className="mb-4">

                                <div className="p-2 text-center">
                                    {brand.drillUrl ? (
                                        <video style={{ width: '400px', height: '200px' }}
                                            src={`${config.baseUrl}${brand.drillUrl}`}
                                            controls
                                            className="w-full"
                                        />
                                    ) : (
                                        <span></span>
                                    )}
                                </div>
                                <span style={{ marginLeft: '20px', color: 'gray', fontSize: 'large' }}>Submitted By:
                                    <b style={{ color: 'black', fontSize: 'medium' }}>{`  ${brand.User.firstName} ${brand.User.lastName}`}</b>
                                    <label style={{ fontSize: "small" }}>{` (${brand.User.userName})`}</label>
                                </span>
                                <p style={{ marginLeft: '20px', color: 'gray', fontSize: 'large' }}>Submitted Against:
                                    <b style={{ color: 'black', fontSize: 'medium' }}>
                                        <span
                                            onClick={() => openDrillDetailsPopup(brand.Drill)}
                                            style={{ cursor: 'pointer' }} // Add this line to set the cursor style
                                        >
                                            {` ${brand.Drill.title}`}
                                        </span>                                    </b>
                                </p>

                            </Card>
                        ))}
                    </div>
                </TabPanel>
                <TabPanel>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto" style={{ maxHeight: '500px' }}>
                        {rejectedData.map((brand: any, index: any) => (
                            <Card key={index} className="mb-4">
                                <div className="p-2 text-center">
                                    {brand.drillUrl ? (
                                        <video style={{ width: '400px', height: '200px' }}
                                            src={`${config.baseUrl}${brand.drillUrl}`}
                                            controls
                                            className="w-full"
                                        />
                                    ) : (
                                        <span></span>
                                    )}
                                </div>
                                <span style={{ marginLeft: '20px', color: 'gray', fontSize: 'large' }}>Submitted By:
                                    <b style={{ color: 'black', fontSize: 'medium' }}>{`  ${brand.User.firstName} ${brand.User.lastName}`}</b>
                                    <label style={{ fontSize: "small" }}>{` (${brand.User.userName})`}</label>
                                </span>
                                <p style={{ marginLeft: '20px', color: 'gray', fontSize: 'large' }}>Submitted Against:
                                    <b style={{ color: 'black', fontSize: 'medium' }}>
                                        <span
                                            onClick={() => openDrillDetailsPopup(brand.Drill)}
                                            style={{ cursor: 'pointer' }} // Add this line to set the cursor style
                                        >
                                            {` ${brand.Drill.title}`}
                                        </span>                                    </b>
                                </p>
                            </Card>
                        ))}
                    </div>
                </TabPanel>
            </Tabs>

            <AdminPopup isModalOpen={isConfirmationDialogOpen} closeViewModal={closeConfirmationDialog} title={"Confirmation"}>
                <p style={{ color: "black" }}>Are you sure you want to {confirmationAction} this drill?</p>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-2">
                    <button
                        type="submit"
                        style={sfProDisplayStyle} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base text-white hover-bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm-text-sm"
                        onClick={handleConfirmation} >
                        Confirm
                    </button>
                    <button type="button"
                        style={sfProDisplayStyle}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base text-gray-700 hover-bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm-text-sm"
                        onClick={closeConfirmationDialog}>
                        Cancel
                    </button>
                </div>
            </AdminPopup>

            <AdminPopup isModalOpen={isDrillDetailsDialogOpen} closeViewModal={closeDrillDetailsDialog} title={"Drill Details"}>
                {selectedDrillData && (
                    <>
                        <b style={{ color: "black" }}>{selectedDrillData.title}</b>
                        <video style={{ width: '400px', height: '200px' }}
                            src={`${config.baseUrl}${selectedDrillData.drillUrl}`}
                            controls
                            className="w-full"
                        />
                        <p style={{ color: "black" }}> {selectedDrillData.description}</p>
                        <b style={{ color: "black" }}>Objectives: </b>
                        <div className="p-1 xl:p-0">
                            {selectedDrillData.objectives && selectedDrillData.objectives.length > 0 ? (
                                selectedDrillData.objectives.map((objective: any, objectiveIndex: any) => (
                                    <div key={objective.id}>
                                        <p style={sfProDisplayStyle} className="hidden text-sm text-black sm:block">
                                            {objectiveIndex + 1}. {objective.description}
                                        </p>
                                        {objectiveIndex !== selectedDrillData.objectives.length - 1 && <span></span>}
                                    </div>
                                ))
                            ) : (
                                <span></span>
                            )}
                        </div>
                    </>
                )}
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-2">
                    <button type="button"
                        style={sfProDisplayStyle}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base text-gray-700 hover-bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm-text-sm"
                        onClick={closeDrillDetailsDialog}>
                        Close
                    </button>
                </div>
            </AdminPopup>

            <ToastContainer />
        </div >
    );
};
export default ApprovalDrills;
