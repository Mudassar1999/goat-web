import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "@/config";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import LinearColor from '../../../components/Loader/LinearColor';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TextField,
} from "@mui/material";
import { Check, Clear } from "@mui/icons-material";
import AdminPopup from "@/components/shared/AdminPopup";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

const AdditionalDetails = () => {
  const [data, setData] = useState<any>([]);
  const [Token, setToken] = useState<any>(localStorage.getItem("accessToken"));
  const [acceptedData, setAcceptedData] = useState<any>([]);
  const [rejectedData, setRejectedData] = useState<any>([]);
  const [pendingData, setPendingData] = useState<any>([]);
  const [selectedTab, setSelectedTab] = useState<any>("Pending");
  const [showRejectDialog, setShowRejectDialog] = useState<any>(false);
  const [reasonForRejection, setReasonForRejection] = useState<any>("");
  const [rejectDialogIndex, setRejectDialogIndex] = useState<any>(null);
  const [loading, setLoading] = useState<Boolean>(false);
  useEffect(() => {
    fetchP_drills();
  }, []); // Fetch data when the tab changes
  const sfProDisplayStyle = {
    fontFamily: "SF Pro Display, Arial, sans-serif",
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
        setData(response.data.pendingAdditionRequests);

        const accepted = response.data.pendingAdditionRequests.filter((item: any) => item.approved === "accepted");
        const rejected = response.data.pendingAdditionRequests.filter((item: any) => item.approved === "rejected");
        const pending = response.data.pendingAdditionRequests.filter((item: any) => item.approved === "pending");

        setAcceptedData(accepted);
        setRejectedData(rejected);
        setPendingData(pending);

      })
      .catch((error) => {
        toast.error("Error Fetching Data");
      })
      .finally(() => {
        setLoading(false);
      });
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
      .put(
        `${config.URL}/users/${item.id}/addition-request/verify`,
        {
          isDetailsVerified: newStatus,
          //reasonOfDetailsRejection: null,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token}`,
          },
        }
      )
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
  };
  const handleRejectReasonSubmit = () => {
    if (rejectDialogIndex !== null) {
      // Make an API call to update the verification status with the rejection reason
      const item = data[rejectDialogIndex];

      axios
        .put(
          `${config.URL}/users/${item.id}/addition-request/verify`,
          {
            approved: "rejected",
            reasonOfDetailsRejection: reasonForRejection,
          },
          {
            headers: {
              Authorization: `Bearer ${Token}`,
            },
          }
        )
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
          <div className="grid grid-cols-10 sm:grid-cols-10  bg-black text-white">
            <div className="p-1 xl:p-2">
              <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Id</h5>
            </div>
            <div className="p-1 xl:p-2">
              <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Email</h5>
            </div>
            <div className="p-1 text-center xl:p-2">
              <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">EntityType</h5>
            </div>
            <div className="p-1 text-center xl:p-2">
              <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">EntityName</h5>
            </div>
            <div className="p-1 text-center xl:p-2">
              <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Sport</h5>
            </div>
            <div className="p-1 text-center xl:p-2">
              <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Club</h5>
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
            {selectedTab === "Pending" && <div className="p-1 text-center xl:p-2">
              <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Action</h5>
            </div>}
          </div>
        </div>

        <TabPanel className="flex flex-col max-h-[calc(100vh-200px)] overflow-y-auto">
          <div>
            {loading ? (<LinearColor />) : (<>
              {pendingData.map((data: any, index: any) => (
                <div
                key={index}
                className={`grid grid-cols-10 sm:grid-cols-10 text-white ${index === data.length - 1
                  ? ""
                  : "border-stroke dark:border-strokedark border-b"
                  }`}
              >
                <div className="ml-2 flex items-center p-1 xl:p-0">
                  <p
                    style={sfProDisplayStyle}
                    className="text-sm sm:block"
                  >
                    {data.id}
                  </p>
                </div>
                <div
                  style={sfProDisplayStyle}
                  className="ml-6 flex items-center gap-3 p-1 xl:p-0"
                >
                  <p
                    className="hidden text-sm sm:block"
                    style={{ wordBreak: "break-all" }}
                  >
                    {data.email}
                  </p>
                </div>
                <div className="ml-5 flex  items-center p-1 xl:p-0">
                  <p
                    style={sfProDisplayStyle}
                    className="text-sm sm:block"
                  >
                    {data.entityType}
                  </p>
                </div>

                <div className="ml-5 flex  items-center p-1 xl:p-0">
                  <p
                    style={sfProDisplayStyle}
                    className="text-sm sm:block"
                  >
                    {data.entityName}
                  </p>
                </div>
                <div className="ml-6 flex  items-center p-1 xl:p-0">
                  <p
                    style={sfProDisplayStyle}
                    className="text-sm sm:block"
                  >
                    {data.sport?.name || ""}
                  </p>
                </div>

                <div className="ml-5 flex  items-center p-1 xl:p-0">
                  <p
                    style={sfProDisplayStyle}
                    className="text-sm sm:block"
                  >
                    {data.club?.name || ""}
                  </p>
                </div>
                <div className="ml-5 flex  items-center p-1 xl:p-0">
                  <p
                    style={sfProDisplayStyle}
                    title={data.additionalInfo}
                    className="hidden overflow-hidden text-ellipsis text-sm sm:block"
                  >
                    {data.additionalInfo}
                  </p>
                </div>
                <div className="ml-8 flex  items-center p-1 xl:p-0">
                  <p
                    style={sfProDisplayStyle}
                    className="text-sm  sm:block"
                  >
                    {data.requestedById}
                  </p>
                </div>
                <div className="ml-6 flex  items-center p-1 xl:p-0">
                  <p
                    style={sfProDisplayStyle}
                    className="text-sm sm:block"
                  >
                    {data.approved}
                  </p>
                </div>
                <div className="flex items-center justify-center p-1 xl:p-0">
                  <IconButton
                    color="error"
                    onClick={(event) =>
                      handleVerificationChange(event, index, "rejected")
                    }
                  >
                    <Clear />
                  </IconButton>
                  <IconButton
                    color="success"
                    onClick={(event) =>
                      handleVerificationChange(event, index, "accepted")
                    }
                  >
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
                <div
                key={index}
                className={`grid grid-cols-10 sm:grid-cols-10 text-white ${index === data.length - 1
                  ? ""
                  : "border-stroke dark:border-strokedark border-b"
                  }`}
              >
                <div className="ml-2 flex items-center p-1 xl:p-0">
                  <p
                    style={sfProDisplayStyle}
                    className="text-sm sm:block"
                  >
                    {data.id}
                  </p>
                </div>
                <div
                  style={sfProDisplayStyle}
                  className="ml-6 flex items-center gap-3 p-1 xl:p-0"
                >
                  <p
                    className="hidden text-sm sm:block"
                    style={{ wordBreak: "break-all" }}
                  >
                    {data.email}
                  </p>
                </div>
                <div className="ml-5 flex  items-center p-1 xl:p-0">
                  <p
                    style={sfProDisplayStyle}
                    className="text-sm sm:block"
                  >
                    {data.entityType}
                  </p>
                </div>

                <div className="ml-5 flex  items-center p-1 xl:p-0">
                  <p
                    style={sfProDisplayStyle}
                    className="text-sm sm:block"
                  >
                    {data.entityName}
                  </p>
                </div>
                <div className="ml-6 flex  items-center p-1 xl:p-0">
                  <p
                    style={sfProDisplayStyle}
                    className="text-sm sm:block"
                  >
                    {data.sport?.name || ""}
                  </p>
                </div>

                <div className="ml-5 flex  items-center p-1 xl:p-0">
                  <p
                    style={sfProDisplayStyle}
                    className="text-sm sm:block"
                  >
                    {data.club?.name || ""}
                  </p>
                </div>
                <div className="ml-5 flex  items-center p-1 xl:p-0">
                  <p
                    style={sfProDisplayStyle}
                    title={data.additionalInfo}
                    className="hidden overflow-hidden text-ellipsis text-sm sm:block"
                  >
                    {data.additionalInfo}
                  </p>
                </div>
                <div className="ml-8 flex  items-center p-1 xl:p-0">
                  <p
                    style={sfProDisplayStyle}
                    className="text-sm  sm:block"
                  >
                    {data.requestedById}
                  </p>
                </div>
                <div className="ml-6 flex  items-center p-1 xl:p-0">
                  <p
                    style={sfProDisplayStyle}
                    className="text-sm sm:block"
                  >
                    {data.approved}
                  </p>
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
                <div
                key={index}
                className={`grid grid-cols-10 sm:grid-cols-10 text-white ${index === data.length - 1
                  ? ""
                  : "border-stroke dark:border-strokedark border-b"
                  }`}
              >
                <div className="ml-2 flex items-center p-1 xl:p-0">
                  <p
                    style={sfProDisplayStyle}
                    className="text-sm sm:block"
                  >
                    {data.id}
                  </p>
                </div>
                <div
                  style={sfProDisplayStyle}
                  className="ml-6 flex items-center gap-3 p-1 xl:p-0"
                >
                  <p
                    className="hidden text-sm sm:block"
                    style={{ wordBreak: "break-all" }}
                  >
                    {data.email}
                  </p>
                </div>
                <div className="ml-5 flex  items-center p-1 xl:p-0">
                  <p
                    style={sfProDisplayStyle}
                    className="text-sm sm:block"
                  >
                    {data.entityType}
                  </p>
                </div>

                <div className="ml-5 flex  items-center p-1 xl:p-0">
                  <p
                    style={sfProDisplayStyle}
                    className="text-sm sm:block"
                  >
                    {data.entityName}
                  </p>
                </div>
                <div className="ml-6 flex  items-center p-1 xl:p-0">
                  <p
                    style={sfProDisplayStyle}
                    className="text-sm sm:block"
                  >
                    {data.sport?.name || ""}
                  </p>
                </div>

                <div className="ml-5 flex  items-center p-1 xl:p-0">
                  <p
                    style={sfProDisplayStyle}
                    className="text-sm sm:block"
                  >
                    {data.club?.name || ""}
                  </p>
                </div>
                <div className="ml-5 flex  items-center p-1 xl:p-0">
                  <p
                    style={sfProDisplayStyle}
                    title={data.additionalInfo}
                    className="hidden overflow-hidden text-ellipsis text-sm sm:block"
                  >
                    {data.additionalInfo}
                  </p>
                </div>
                <div className="ml-8 flex  items-center p-1 xl:p-0">
                  <p
                    style={sfProDisplayStyle}
                    className="text-sm  sm:block"
                  >
                    {data.requestedById}
                  </p>
                </div>
                <div className="ml-6 flex  items-center p-1 xl:p-0">
                  <p
                    style={sfProDisplayStyle}
                    className="text-sm sm:block"
                  >
                    {data.approved}
                  </p>
                </div>
              </div>
              ))}
            </>)}
          </div>
        </TabPanel>

      </Tabs>
    </div>
  );
};
export default AdditionalDetails;
