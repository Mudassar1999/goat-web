"use client";
import React, { useState, useEffect, useRef } from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Image from "next/image";
import axios from "axios";
import config from "@/config";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";
import LinearColor from "../Loader/LinearColor";
import AddIcon from "@mui/icons-material/Add";
import AdminPopup from "../shared/AdminPopup";
import {
  downloadSampleFileCommon,
  readUploadFileCommon,
} from "@/app/admin/actions";
import { CircularProgress, TablePagination } from "@mui/material";
import { FileUpload, GetApp } from "@mui/icons-material";

const Leagues = () => {
  const [brandData, setBrandData] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState<any>(false);
  const [editedLeague, setEditedLeague] = useState<any>(null);
  const [sportData, setSportData] = useState<any>([]);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState<any>(false);
  const [recordToDelete, setRecordToDelete] = useState<any>(null);
  const [loading, setLoading] = useState<Boolean>(false);
  const initialLeagueData = {
    name: "",
    image: null, // Initialize with null
    sportId: "",
  };
  const sfProDisplayStyle = {
    fontFamily: "SF Pro Display, Arial, sans-serif",
    // Add other inline styles as needed
  };
  const [newLeague, setNewLeague] = useState<any>({ ...initialLeagueData });
  const [imageUploading, setImageUploading] = useState<any>(false);
  const [Token, setToken] = useState<any>(localStorage.getItem("accessToken"));
  const [bulkUploadLoading, setBulkUploadLoading] = useState<boolean>(false);
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [counts, setCounts] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchLeagues();
    fetchSport();
  }, [page, rowsPerPage]); // Fetch data when the component mounts
  const openModal = () => {
    setIsModalOpen(true);
    setEditedLeague(null);
    setNewLeague({ ...initialLeagueData });
  };
  const handleEdit = (League: any) => {
    setIsModalOpen(true);
    setEditedLeague(League);
    setNewLeague({ ...League });
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditedLeague(null);
    setNewLeague({ ...initialLeagueData });
  };
  const fetchLeagues = () => {
    setLoading(true);
    axios
      .get(`${config.URL}/leagues/updated?limit=${rowsPerPage}&page=${page}`, {
        headers: {
          Authorization: `Bearer ${Token}`, // Replace with your actual access token
        },
      })
      .then(({ data }) => {
        setBrandData(data.results);
        setCounts(data.totalResults);
      })
      .catch((error) => {
        toast.error("Error Fetching Leagues Data");
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
        toast.error("Error Fetching Sports data");
      });
  };
  const uploadImage = async (img: any) => {
    // Set the loading state to true when image upload begins
    setImageUploading(true);
    let data = new FormData();
    data.append("image", img);
    try {
      const response = await axios.post(`${config.URL}/leagues/image`, data, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });
      // Set the image after a successful upload
      setNewLeague({
        ...newLeague,
        image: response.data.media,
      });
    } catch (error) {
      toast.error("Error uploading image");
    } finally {
      setImageUploading(false);
    }
  };
  const saveLeague = (e: any) => {
    e.preventDefault(); // Prevent the default form submission and page refresh
    let data = JSON.stringify({
      name: newLeague.name,
      image: newLeague.image,
      sportId: parseInt(newLeague.sportId),
    });
    axios
      .post(`${config.URL}/leagues`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`, // Replace with your actual access token
        },
      })
      .then((response) => {
        fetchLeagues(); // Fetch data after successfully updating the club
        closeModal();
        toast.success("League Added Successfully");
      })
      .catch((error) => {
        toast.error("Error Adding League");
      });
  };
  const editLeague = (e: any) => {
    e.preventDefault(); // Prevent the default form submission and page refresh
    let data = JSON.stringify({
      name: newLeague.name,
      image: newLeague.image,
      sportId: parseInt(newLeague.sportId),
    });
    axios
      .put(`${config.URL}/leagues/${editedLeague.id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`, // Replace with your actual access token
        },
      })
      .then((response) => {
        fetchLeagues(); // Fetch data after successfully adding a new country
        closeModal();
        toast.success("League Updated Successfully");
      })
      .catch((error) => {
        toast.error("Error Updating League");
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
        .delete(`${config.URL}/leagues/${id}`, {
          headers: {
            Authorization: `Bearer ${Token}`, // Replace with your actual access token
          },
        })
        .then(() => {
          // If the deletion is successful, you may want to update your data here by making a new API request or updating the state.
          fetchLeagues(); // Fetch data after successfully deleting a record
          closeDeleteConfirmation(); // Close the confirmation dialog
          toast.success("League Deleted Successfully");
        })
        .catch((error) => {
          toast.error("Error Deleting League");
        });
    } else {
      // If the confirmation dialog is not open or no record to delete is set, open the dialog
      openDeleteConfirmation({ id }); // Pass the record id to the dialog
    }
  };

  const readUploadFile = async (e: any) => {
    readUploadFileCommon(e, inputRef, "league", setBulkUploadLoading);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const downloadSampleFile = () => {
    downloadSampleFileCommon(
      "/goat/admin/Excel%20Templates/League%20GOAT%20APIs%20Payloads.xlsx"
    );
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(1);
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
        <AddIcon /> Add League
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

      <TablePagination
        component="div"
        rowsPerPageOptions={[25, 50, 100, 500, 1000]}
        count={counts}
        page={page - 1}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <div className="flex flex-col max-h-[calc(100vh-200px)] overflow-y-auto">
        <div className="grid grid-cols-5 sm:grid-cols-5 bg-black text-white">
          <div className="p-1 xl:p-2">
            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">
              Id
            </h5>
          </div>
          <div className="p-1 xl:p-2">
            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">
              League Name
            </h5>
          </div>
          <div className="p-1 text-center xl:p-2">
            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">
              Image
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
                className={`grid grid-cols-5 sm:grid-cols-5 ${
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
                <div className="flex items-center ml-3 gap-3 p-1 xl:p-0">
                  <p
                    style={sfProDisplayStyle}
                    className="text-sm text-black sm:block"
                  >
                    {brand.name}
                  </p>
                </div>
                <div className="flex items-center justify-center p-1 xl:p-0">
                  {brand.image ? (
                    <Image
                      src={`${config.baseUrl}${brand.image}`}
                      alt="Flag"
                      width={32}
                      height={24}
                    />
                  ) : (
                    <span></span>
                  )}
                </div>
                <div className="flex items-center ml-14 p-2.5 xl:p-5">
                  <p
                    style={sfProDisplayStyle}
                    className="text-sm text-black sm:block"
                  >
                    {brand.sport.name}
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
                    onClick={() => openDeleteConfirmation(brand)}
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
        title={editedLeague ? "Edit League" : "Add League"}
      >
        <form onSubmit={editedLeague ? editLeague : saveLeague}>
          <div className="mb-4">
            <label
              htmlFor="name"
              style={sfProDisplayStyle}
              className="block text-sm text-gray-700"
            >
              League Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={newLeague.name}
              onChange={(e) =>
                setNewLeague({ ...newLeague, name: e.target.value })
              }
              required
              className="mt-1 p-2 block w-full sm:text-sm text-black bg-transparent border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="sportId"
              style={sfProDisplayStyle}
              className="block text-sm text-gray-700"
            >
              Sport Name
            </label>
            <select
              id="sportId"
              name="sportId"
              value={newLeague.sportId}
              onChange={(e) =>
                setNewLeague({ ...newLeague, sportId: e.target.value })
              }
              disabled={editedLeague ? true : false}
              required
              className="mt-1 p-2 block w-full sm:text-sm text-black bg-transparent border border-gray-300 rounded-md"
            >
              <option value="">Select a Sport</option>
              {sportData.map((sport: any) => (
                <option key={sport.id} value={sport.id}>
                  {sport.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="flag"
              style={sfProDisplayStyle}
              className="block text-sm text-gray-700"
            >
              Image
            </label>
            <input
              type="file"
              id="flag"
              name="flag"
              onChange={(e: any) => {
                console.log();
                uploadImage(e.target.files[0]);
              }}
              accept="image/*"
              className="mt-1 p-2 block w-full sm:text-sm text-black bg-transparent border border-gray-300 rounded-md"
            />
            {imageUploading && (
              <div className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-white opacity-50">
                <Loader />
              </div>
            )}
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              style={sfProDisplayStyle}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base text-white hover-bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm-text-sm"
            >
              {editedLeague ? "Update" : "Save"}
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

export default Leagues;
