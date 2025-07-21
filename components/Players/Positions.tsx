"use client";
import React, { useState, useEffect, useRef } from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import config from "@/config";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import LinearColor from "../Loader/LinearColor";
import AddIcon from "@mui/icons-material/Add";
import AdminPopup from "../shared/AdminPopup";
import {
  downloadSampleFileCommon,
  readUploadFileCommon,
} from "@/app/admin/actions";
import { CircularProgress } from "@mui/material";
import { FileUpload, GetApp } from "@mui/icons-material";

const Positions = () => {
  const [brandData, setBrandData] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState<any>(false);
  const [editedPositions, setEditedPositions] = useState<any>(null);
  const [sportData, setSportData] = useState<any>([]);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState<any>(false);
  const [recordToDelete, setRecordToDelete] = useState<any>(null);
  const [loading, setLoading] = useState<Boolean>(false);
  const initialPositionsData = {
    name: "",
    image: null, // Initialize with null
    positionId: null,
    sportId: null,
    deatils: "",
  };
  const sfProDisplayStyle = {
    fontFamily: "SF Pro Display, Arial, sans-serif",
    // Add other inline styles as needed
  };
  const [newPosition, setNewPosition] = useState<any>({
    ...initialPositionsData,
  });
  const [Token, setToken] = useState<any>(localStorage.getItem("accessToken"));
  const [bulkUploadLoading, setBulkUploadLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPositions();
    fetchSport();
  }, []); // Fetch data when the component mounts
  const openModal = () => {
    setIsModalOpen(true);
    setEditedPositions(null);
    setNewPosition({ ...initialPositionsData });
  };
  const handleEdit = (Position: any) => {
    setIsModalOpen(true);
    setEditedPositions(Position);
    setNewPosition({ ...Position });
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditedPositions(null);
    setNewPosition({ ...initialPositionsData });
  };
  const fetchPositions = () => {
    setLoading(true);
    axios
      .get(`${config.URL}/playerPositions`, {
        headers: {
          Authorization: `Bearer ${Token}`, // Replace with your actual access token
        },
      })
      .then((response) => {
        setBrandData(response.data);
      })
      .catch((error) => {
        toast.error("Error Fetching Dominances Data");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const fetchSport = () => {
    axios
      .get(`${config.URL}/sports/admin`, {
        headers: {
          Authorization: `Bearer ${Token}`, // Replace with your actual access token
        },
      })
      .then((response) => {
        setSportData(response.data); // Store the sports data in a state variable
      })
      .catch((error) => {
        toast.error("Error Fetching Sports Data");
      });
  };
  const savePosition = (e: any) => {
    e.preventDefault(); // Prevent the default form submission and page refresh
    let data = JSON.stringify({
      name: newPosition.name,
      sportId: parseInt(newPosition.sportId),
      positionId: parseInt(newPosition.positionId),
      details: newPosition.details,
    });
    axios
      .post(`${config.URL}/playerPositions`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`, // Replace with your actual access token
        },
      })
      .then((response) => {
        fetchPositions(); // Fetch data after successfully updating the club
        closeModal();
        toast.success("Dominance Added Successfully");
      })
      .catch((error) => {
        toast.error("Error Adding Dominance");
      });
  };
  const editPosition = (e: any) => {
    e.preventDefault(); // Prevent the default form submission and page refresh
    let data = JSON.stringify({
      name: newPosition.name,
      sportId: parseInt(newPosition.sportId),
      positionId: parseInt(newPosition.positionId),
      details: newPosition.details,
    });
    axios
      .put(`${config.URL}/playerPositions/${editedPositions.id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`, // Replace with your actual access token
        },
      })
      .then((response) => {
        fetchPositions(); // Fetch data after successfully adding a new country
        closeModal();
        toast.success("Position Updated Successfully");
      })
      .catch((error) => {
        toast.error("Error Updating Position");
      });
  };
  const openDeleteConfirmation = (record: any) => {
    setIsDeleteConfirmationOpen(true);
    setRecordToDelete(record);
  };
  const closeDeleteConfirmation = () => {
    setIsDeleteConfirmationOpen(false);
    setRecordToDelete(null);
  };
  const handleDelete = (id: any) => {
    // Check if the confirmation dialog is open and the recordToDelete is set
    if (isDeleteConfirmationOpen && recordToDelete) {
      axios
        .delete(`${config.URL}/playerPositions/${id}`, {
          headers: {
            Authorization: `Bearer ${Token}`, // Replace with your actual access token
          },
        })
        .then(() => {
          // If the deletion is successful, you may want to update your data here by making a new API request or updating the state.
          fetchPositions(); // Fetch data after successfully deleting a record
          closeDeleteConfirmation(); // Close the confirmation dialog
          toast.success("Position Deleted Successfully");
        })
        .catch((error) => {
          toast.error("Error Deleting Position");
        });
    } else {
      // If the confirmation dialog is not open or no record to delete is set, open the dialog
      openDeleteConfirmation({ id }); // Pass the record id to the dialog
    }
  };

  const readUploadFile = async (e: any) => {
    readUploadFileCommon(e, inputRef, "playerPosition", setBulkUploadLoading);
  };

  const downloadSampleFile = () => {
    downloadSampleFileCommon(
      "/goat/admin/Excel%20Templates/Player%20Positions%20GOAT%20APIs%20Payloads.xlsx"
    );
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark-bg-boxdark sm:px-7.5 xl:pb-1">
      {/* Add Country Button */}
      <button
        onClick={openModal}
        style={{
          ...sfProDisplayStyle,
          padding: "px-4 py-2",
          borderRadius: "rounded",
          transition: "border-color 0.3s, color 0.3s",
        }}
        className="mb-4 bg-black text-white border border-white hover:bg-transparent hover:border-black hover:text-black px-4 py-2 rounded"
      >
        <AddIcon /> Add Position
      </button>
      <button
        onClick={handleClick}
        style={{
          ...sfProDisplayStyle,
          padding: "px-4 py-2",
          borderRadius: "rounded",
          transition: "border-color 0.3s, color 0.3s",
        }}
        className="mb-4 bg-black text-white border border-white hover:bg-transparent hover:border-black hover:text-black px-4 py-2 rounded"
        disabled={bulkUploadLoading}
      >
        <input
          id="raised-button-file"
          type="file"
          name="upload"
          ref={inputRef}
          accept=".xlsx, .xls"
          style={{ display: "none" }}
          onChange={readUploadFile}
        />
        {bulkUploadLoading ? (
          <CircularProgress color="inherit" size={18} />
        ) : (
          <FileUpload />
        )}
        Bulk Upload
      </button>
      <button
        onClick={downloadSampleFile}
        style={{
          ...sfProDisplayStyle,
          padding: "px-4 py-2",
          borderRadius: "rounded",
          transition: "border-color 0.3s, color 0.3s",
        }}
        className="mb-4 bg-black text-white border border-white hover:bg-transparent hover:border-black hover:text-black px-4 py-2 rounded"
      >
        <GetApp /> Sample File
      </button>
      {/* Table */}
      <div className="flex flex-col max-h-[calc(100vh-200px)] overflow-y-auto">
        <div className="grid grid-cols-6 sm:grid-cols-6 bg-black text-white">
          <div className="p-1 xl:p-2">
            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">
              Id
            </h5>
          </div>
          <div className="p-1 xl:p-2">
            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">
              Position Name
            </h5>
          </div>
          <div className="p-1 text-center xl:p-2">
            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">
              Position Id
            </h5>
          </div>
          <div className="p-1 text-center xl:p-2">
            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">
              Details
            </h5>
          </div>
          <div className="p-1 text-center xl:p-2">
            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">
              Sport Name
            </h5>
          </div>
          <div className="p-1 text-center xl:p-2">
            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">
              Actions
            </h5>
          </div>
        </div>
        {loading ? (
          <LinearColor />
        ) : (
          <>
            {brandData.map((brand: any, index: any) => (
              <div
                key={index}
                className={`grid grid-cols-6 sm:grid-cols-6 ${
                  index === brandData.length - 1
                    ? ""
                    : "border-b border-stroke dark:border-strokedark"
                }`}
              >
                <div className="flex items-center gap-3 ml-2 p-1 xl:p-0">
                  <p
                    style={sfProDisplayStyle}
                    className="text-sm text-black sm:block"
                  >
                    {index + 1}
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-7 p-1 xl:p-0">
                  <p
                    style={sfProDisplayStyle}
                    className="text-sm text-black sm:block"
                  >
                    {brand.name}
                  </p>
                </div>
                <div className="flex items-center justify-center p-1 xl:p-0">
                  <p
                    style={sfProDisplayStyle}
                    className=" text-sm text-black sm:block"
                  >
                    {brand.positionId}
                  </p>
                </div>
                <div className="flex items-center justify-center p-1 xl:p-0">
                  <p
                    style={sfProDisplayStyle}
                    className="text-sm text-black sm:block"
                  >
                    {brand.details}
                  </p>
                </div>
                <div className="flex items-center justify-center p-1 xl:p-0">
                  <p
                    style={sfProDisplayStyle}
                    className="text-sm text-black sm:block"
                  >
                    {brand.sports.name}
                  </p>
                </div>
                <div className="p-1 text-center xl:p-0">
                  <IconButton
                    title="Edit"
                    onClick={() => handleEdit(brand)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    title="Delete"
                    onClick={() => handleDelete(brand.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <AdminPopup
        isModalOpen={isModalOpen}
        closeViewModal={closeModal}
        title={editedPositions ? "Edit Position" : "Add Position"}
      >
        <form onSubmit={editedPositions ? editPosition : savePosition}>
          <div className="mb-4">
            <label
              htmlFor="name"
              style={sfProDisplayStyle}
              className=" text-sm text-gray-700"
            >
              Position Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={newPosition.name}
              onChange={(e) =>
                setNewPosition({ ...newPosition, name: e.target.value })
              }
              required
              className="mt-1  p-2 w-full sm:text-sm text-black bg-transparent border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="name"
              style={sfProDisplayStyle}
              className=" text-sm text-gray-700"
            >
              Position Id
            </label>
            <input
              type=""
              id="positionId"
              name="positionId"
              value={newPosition.positionId}
              onChange={(e) =>
                setNewPosition({ ...newPosition, positionId: e.target.value })
              }
              disabled={editedPositions ? true : false}
              required
              className="mt-1 p-2 w-full sm:text-sm text-black bg-transparent border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="name"
              style={sfProDisplayStyle}
              className=" text-sm text-gray-700"
            >
              Details
            </label>
            <input
              type=""
              id="details"
              name="details"
              value={newPosition.details}
              onChange={(e) =>
                setNewPosition({ ...newPosition, details: e.target.value })
              }
              required
              className="mt-1 p-2  w-full sm:text-sm text-black bg-transparent border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="sportId"
              style={sfProDisplayStyle}
              className="text-sm text-gray-700"
            >
              Sport Name
            </label>
            <select
              id="sportId"
              name="sportId"
              value={newPosition.sportId}
              onChange={(e) =>
                setNewPosition({ ...newPosition, sportId: e.target.value })
              }
              disabled={editedPositions ? true : false}
              required
              className="mt-1 p-2 w-full sm:text-sm text-black bg-transparent border border-gray-300 rounded-md"
            >
              <option value="">Select a Sport</option>
              {sportData.map((sport: any) => (
                <option key={sport.id} value={sport.id}>
                  {sport.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              style={sfProDisplayStyle}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base text-white hover-bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm-text-sm"
            >
              {editedPositions ? "Update" : "Save"}
            </button>
            <button
              type="button"
              style={sfProDisplayStyle}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base text-gray-700 hover-bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm-text-sm"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </form>
      </AdminPopup>

      <AdminPopup
        isModalOpen={isDeleteConfirmationOpen}
        closeViewModal={closeDeleteConfirmation}
        title={"Confirm Deletion"}
      >
        <p style={{ color: "black" }}>
          Are you sure you want to delete this record?
        </p>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            style={sfProDisplayStyle}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#FF453A] text-base text-white hover-bg-[#FF453A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm-text-sm"
            onClick={() => handleDelete(recordToDelete.id)}
          >
            Delete
          </button>
          <button
            type="button"
            style={sfProDisplayStyle}
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base text-gray-700 hover-bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm-text-sm"
            onClick={closeDeleteConfirmation}
          >
            Cancel
          </button>
        </div>
      </AdminPopup>

      <ToastContainer />
    </div>
  );
};

export default Positions;
