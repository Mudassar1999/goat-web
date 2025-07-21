"use client";
import React, { useState, useEffect, useRef } from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Image from "next/image";
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
import { CircularProgress, TablePagination } from "@mui/material";
import { FileUpload, GetApp } from "@mui/icons-material";

const ClubTeams = () => {
  const [brandData, setBrandData] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState<any>(false);
  const [editedTeam, setEditedTeam] = useState<any>(null);
  const [clubData, setClubData] = useState<any>([]);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState<any>(false);
  const [recordToDelete, setRecordToDelete] = useState<any>(null);
  const [loading, setLoading] = useState<Boolean>(false);
  const [bulkUploadLoading, setBulkUploadLoading] = useState<boolean>(false);
  const initialTeamsData = {
    name: "",
    image: null, // Initialize with null
    clubId: "",
  };
  const sfProDisplayStyle = {
    fontFamily: "SF Pro Display, Arial, sans-serif",
    // Add other inline styles as needed
  };
  const [newTeam, setNewTeam] = useState<any>({ ...initialTeamsData });
  const [Token, setToken] = useState<any>(localStorage.getItem("accessToken"));
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [counts, setCounts] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchTeams();
    fetchClub();
  }, [page, rowsPerPage]); // Fetch data when the component mounts
  const openModal = () => {
    setIsModalOpen(true);
    setEditedTeam(null);
    setNewTeam({ ...initialTeamsData });
  };
  const handleEdit = (Club: any) => {
    setIsModalOpen(true);
    setEditedTeam(Club);
    setNewTeam({ ...Club });
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditedTeam(null);
    setNewTeam({ ...initialTeamsData });
  };
  const fetchTeams = () => {
    setLoading(true);
    axios
      .get(
        `${config.URL}/clubTeams/updated?limit=${rowsPerPage}&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      )
      .then(({ data }) => {
        setBrandData(data.results);
        setCounts(data.totalResults);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const fetchClub = () => {
    axios
      .get(`${config.URL}/clubs`, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((response) => {
        setClubData(response.data); // Store the sports data in a state variable
      })
      .catch((error) => {
        toast.error("Error fetching ClubTeams data");
      });
  };
  const saveTeam = (e: any) => {
    e.preventDefault(); // Prevent the default form submission and page refresh
    let data = JSON.stringify({
      name: newTeam.name,
      clubId: parseInt(newTeam.clubId),
    });
    axios
      .post(`${config.URL}/clubTeams`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((response) => {
        toast.success("ClubTeam Added Successfully");
        fetchTeams(); // Fetch data after successfully updating the club
        closeModal();
      })
      .catch((error) => {
        toast.error("Error Adding ClubTeam");
      });
  };
  const editTeam = (e: any) => {
    e.preventDefault(); // Prevent the default form submission and page refresh
    let data = JSON.stringify({
      name: newTeam.name,
      clubId: parseInt(newTeam.clubId),
    });
    axios
      .put(`${config.URL}/clubTeams/${editedTeam.id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((response) => {
        fetchTeams(); // Fetch data after successfully adding a new country
        closeModal();
        toast.success("ClubTeam Updated Successfully");
      })
      .catch((error) => {
        toast.error("Error Updating ClubTeam");
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
        .delete(`${config.URL}/clubTeams/${id}`, {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        })
        .then(() => {
          // If the deletion is successful, you may want to update your data here by making a new API request or updating the state.
          fetchTeams(); // Fetch data after successfully deleting a record
          closeDeleteConfirmation(); // Close the confirmation dialog
          toast.success("ClubTeam Deleted Successfully");
        })
        .catch((error) => {
          toast.error("Error Deleting ClubTeam");
        });
    } else {
      // If the confirmation dialog is not open or no record to delete is set, open the dialog
      openDeleteConfirmation({ id }); // Pass the record id to the dialog
    }
  };

  const readUploadFile = async (e: any) => {
    readUploadFileCommon(e, inputRef, "team", setBulkUploadLoading);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const downloadSampleFile = () => {
    downloadSampleFileCommon(
      "/goat/admin/Excel%20Templates/Club%20Team%20GOAT%20APIs%20Payloads.xlsx"
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
        <AddIcon /> Add Team
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
            <h5
              style={{
                ...sfProDisplayStyle,
                fontSize: window.innerWidth <= 350 ? "10px" : "auto",
              }}
              className="text-l xsm:text-base"
            >
              Id
            </h5>
          </div>
          <div className="p-1 xl:p-2">
            <h5
              style={{
                ...sfProDisplayStyle,
                fontSize: window.innerWidth <= 350 ? "10px" : "auto",
              }}
              className="text-l xsm:text-base"
            >
              Team Name
            </h5>
          </div>
          <div className="p-1 text-center xl:p-2">
            <h5
              style={{
                ...sfProDisplayStyle,
                fontSize: window.innerWidth <= 350 ? "10px" : "auto",
              }}
              className="text-l xsm:text-base"
            >
              Club Name
            </h5>
          </div>
          <div className="p-1 text-center xl:p-2">
            <h5
              style={{
                ...sfProDisplayStyle,
                fontSize: window.innerWidth <= 350 ? "10px" : "auto",
              }}
              className="text-l xsm:text-base"
            >
              Sport Name
            </h5>
          </div>
          <div className="p-1 text-center xl:p-2">
            <h5
              style={{
                ...sfProDisplayStyle,
                fontSize: window.innerWidth <= 350 ? "10px" : "auto",
              }}
              className="text-l xsm:text-base"
            >
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
                    style={{
                      ...sfProDisplayStyle,
                      fontSize: window.innerWidth <= 350 ? "10px" : "auto",
                    }}
                    className=" text-sm text-black  sm:block"
                  >
                    {index + 1}
                  </p>
                </div>
                <div className="flex items-center gap-3 p-1 xl:p-0">
                  <p
                    style={{
                      ...sfProDisplayStyle,
                      fontSize: window.innerWidth <= 350 ? "10px" : "auto",
                      marginLeft: window.innerWidth <= 350 ? "0" : "3",
                    }}
                    className="text-sm text-black sm:block"
                  >
                    {brand.name}
                  </p>
                </div>
                <div className="flex items-center  ml-16 p-1 xl:p-0">
                  <p
                    style={{
                      ...sfProDisplayStyle,
                      fontSize: window.innerWidth <= 350 ? "10px" : "auto",
                      marginLeft: window.innerWidth <= 350 ? "0" : "20",
                    }}
                    className="text-sm text-black sm:block"
                  >
                    {brand.club.name}
                  </p>
                </div>
                <div className="flex items-center ml-16 p-1 xl:p-0">
                  <p
                    style={{
                      ...sfProDisplayStyle,
                      fontSize: window.innerWidth <= 350 ? "10px" : "auto",
                      marginLeft: window.innerWidth <= 350 ? "0" : "20",
                    }}
                    className="text-sm text-black sm:block"
                  >
                    {brand.club.sport.name}
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
        title={editedTeam ? "Edit Team" : "Add Team"}
      >
        <form onSubmit={editedTeam ? editTeam : saveTeam}>
          <div className="mb-4">
            <label
              htmlFor="name"
              style={sfProDisplayStyle}
              className="block text-sm text-gray-700"
            >
              Team Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={newTeam.name}
              onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
              required
              className="mt-1 p-2 block w-full sm:text-sm text-black bg-transparent border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="clubId"
              style={sfProDisplayStyle}
              className="block text-sm text-gray-700"
            >
              Club Name
            </label>
            <select
              id="clubId"
              name="clubId"
              value={newTeam.clubId}
              onChange={(e) =>
                setNewTeam({ ...newTeam, clubId: e.target.value })
              }
              required
              disabled={editedTeam ? true : false}
              className="mt-1 p-2 block w-full sm:text-sm text-black bg-transparent border border-gray-300 rounded-md"
            >
              <option value="">Select a Club</option>
              {clubData.map((club: any) => (
                <option key={club.id} value={club.id}>
                  {club.name}
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
              {editedTeam ? "Update" : "Save"}
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
export default ClubTeams;
