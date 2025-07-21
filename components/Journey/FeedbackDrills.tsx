"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import config from "@/config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.min.css";
import AddCommentIcon from '@mui/icons-material/AddComment';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
const FeedbackDrills = () => {
    const [brandData1, setBrandData1] = useState<any>([]);
    const [isDialogOpen, setIsDialogOpen] = useState<any>(false);
    const [editedCategory, setEditedCategory] = useState<any>(null);
    const [selectedTab, setSelectedTab] = useState<any>("For Approval");
    const [newFeedback, setNewFeedback] = useState<any>("");
    const initialFeedbacksData = {
        content: ""
    };
    const sfProDisplayStyle = {
        fontFamily: 'SF Pro Display, Arial, sans-serif',
        // Add other inline styles as needed
    };
    const [newCategory, setNewCategory] = useState<any>({ ...initialFeedbacksData });
    const [Token, setToken] = useState<any>(localStorage.getItem('accessToken'));
    const [selectedDrillId, setSelectedDrillId] = useState<any>(null);
    const [selectedDrillData, setSelectedDrillData] = useState<any>(null);
    const [isDrillDetailsDialogOpen, setIsDrillDetailsDialogOpen] = useState<any>(false);
    useEffect(() => {
        fetchFeedbacks();
    }, []);
    const openDialog = (brand: any) => {
        setSelectedDrillId(brand.id); // Set the selected drill id
        setIsDialogOpen(true);
        setEditedCategory(null);
        setNewCategory({ ...initialFeedbacksData });
    };
    const closeDialog = () => {
        setIsDialogOpen(false);
        setEditedCategory(null);
        setNewCategory({ ...initialFeedbacksData });
    };
    const openDrillDetailsPopup = (data: any) => {
        setSelectedDrillData(data);
        setIsDrillDetailsDialogOpen(true);
    };
    // Function to close drill details dialog
    const closeDrillDetailsDialog = () => {
        setSelectedDrillData(null);
        setIsDrillDetailsDialogOpen(false);
    };
    const fetchFeedbacks = () => {
        axios
            .get(`${config.URL}/journies/userDrill/feedback`, {
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
            })
            .then((response) => {
                setBrandData1(response.data);
            })
            .catch((error) => {
                toast.error("Error Fetching Pending Drills for Feedback");
            });
    };
    const saveFeedback = (e: any) => {
        e.preventDefault();
        let data = JSON.stringify({
            content: newFeedback,
        });
        axios
            .post(`${config.URL}/journies/userDrill/${selectedDrillId}/feedback/admin`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Token}`,
                },
            })
            .then((response: any) => {
                fetchFeedbacks();
                closeDialog();
                toast.success("Feedback Added Successfully");
            })
            .catch((error) => {
                toast.error("Error Adding Feedback");
            });
    };
    return (
        <div className="fixed">
            <Tabs>
                {selectedTab === "Feedback" && (
                    <TabPanel>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto" style={{ maxHeight: '500px' }}>
                            {brandData1.map((brand: any, index: any) => (
                                <Card key={index} className="mb-4">
                                    <div className="p-2 text-center ">
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
                                    <span style={{ marginLeft: '20px', color: 'gray', fontSize: 'large' }}>Submitted By
                                        <b style={{ color: 'black', fontSize: 'medium' }}>{`  ${brand.User.firstName} ${brand.User.lastName}`}</b>
                                        <label style={{ fontSize: "small" }}>{` (${brand.User.userName})`}</label>
                                    </span>
                                    <p style={{ marginLeft: '20px', color: 'gray', fontSize: 'large' }}>Submitted Against
                                        <b style={{ color: 'black', fontSize: 'medium' }}>
                                            <span
                                                onClick={() => openDrillDetailsPopup(brand.Drill)}
                                                style={{ cursor: 'pointer' }} // Add this line to set the cursor style
                                            >
                                                {brand.Drill.title}
                                            </span>
                                        </b>
                                    </p>
                                    <CardActions>
                                        <Button
                                            style={{ color: 'black', backgroundColor: 'none' }}
                                            variant="contained"
                                            endIcon={<AddCommentIcon />}
                                            onClick={() => openDialog(brand)}
                                        >
                                            Feedback
                                        </Button>
                                    </CardActions>
                                </Card>
                            ))}
                        </div>
                    </TabPanel>
                )}
            </Tabs>
            <Dialog open={isDialogOpen} onClose={closeDialog}>
                <DialogTitle>Feedback</DialogTitle>
                <DialogContent>
                    <form onSubmit={saveFeedback}>
                        <TextField
                            label="Feedback"
                            variant="outlined"
                            multiline
                            rows={4}
                            fullWidth
                            value={newFeedback}
                            onChange={(e) => setNewFeedback(e.target.value)}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button style={{ color: 'black', backgroundColor: 'none' }} onClick={closeDialog} variant="contained">
                        Cancel
                    </Button>
                    <Button style={{ backgroundColor: 'black' }} onClick={saveFeedback} variant="contained" color="primary">
                        Submit
                    </Button>
                </DialogActions>
                <Dialog open={isDrillDetailsDialogOpen} onClose={closeDrillDetailsDialog}>
                    <DialogTitle>Drill Details</DialogTitle>
                    <DialogContent>
                        {selectedDrillData && (
                            <>
                                <b>{selectedDrillData.title}</b>
                                <video style={{ width: '400px', height: '200px' }}
                                    src={`${config.baseUrl}${selectedDrillData.drillUrl}`}
                                    controls
                                    className="w-full"
                                />
                                <p> {selectedDrillData.description}</p>
                                <b>Objectives: </b>
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
                                {/* Add more details based on your data structure */}
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button style={{ backgroundColor: 'transparent', color: 'black' }} onClick={closeDrillDetailsDialog} variant="contained">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Dialog>
            <ToastContainer />
        </div >
    );
};
export default FeedbackDrills;
