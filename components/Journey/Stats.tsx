"use client";
import React, { useState, useEffect } from "react";
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
import Loader from "../Loader/Loader";
import AddIcon from '@mui/icons-material/Add';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import LinearColor from "../Loader/LinearColor";
import AdminPopup from "../shared/AdminPopup";
const Stats = () => {
  const [brandData, setBrandData] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState<any>(false);
  const [editedStat, setEditedStat] = useState<any>(null);
  const [sportData, setSportData] = useState<any>([]);
  const [positionData, setPositionData] = useState<any>([]);
  const [loading, setLoading] = useState<any>(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState<any>(false);
  const [recordToDelete, setRecordToDelete] = useState<any>(null);
  const initialStatsData = {
    name: "",
    image: null, // Initialize with null
    sportIds: [], // Initialize as an empty array for multiple selections
    playerPositionIds: []
  };
  const sfProDisplayStyle = {
    fontFamily: 'SF Pro Display, Arial, sans-serif',
    // Add other inline styles as needed
  };
  const [newStat, setNewStat] = useState<any>({ ...initialStatsData });
  const [Token, setToken] = useState<any>(localStorage.getItem('accessToken'));
  const [isSportSelected, setIsSportSelected] = useState(false);
  const [isSportModalOpen, setIsSportModalOpen] = useState(false);
  const [selectedSports, setSelectedSports] = useState([]);
  const openSportModal = (sports: any) => {
    setSelectedSports(sports);
    setIsSportModalOpen(true);
  };
  const closeSportModal = () => {
    setIsSportModalOpen(false);
    setSelectedSports([]);
  };
  useEffect(() => {
    fetchStats();
    fetchSport();
  }, []); // Fetch data when the component mounts
  const openModal = () => {
    setIsModalOpen(true);
    setEditedStat(null);
    setNewStat({ ...initialStatsData });
  };
  const handleEdit = (Stat: any) => {
    setIsModalOpen(true);
    setEditedStat(Stat);
    setNewStat({ ...Stat });
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditedStat(null);
    setNewStat({ ...initialStatsData });
  };
  const fetchStats = () => {
    setLoading(true);
    axios
      .get(`${config.URL}/journies/stat`, {
        headers: {
          'Authorization': `Bearer ${Token}`, // Replace with your actual access token
        },
      })
      .then((response) => {
        setBrandData(response.data);
      })
      .catch((error) => {
        toast.error("Error Fetching Stats Data");
      }).finally(() => {
        setLoading(false);
      })
  };
  const fetchSport = () => {
    axios
      .get(`${config.URL}/sports/admin`, {
        headers: {
          'Authorization': `Bearer ${Token}`, // Replace with your actual access token
        },
      })
      .then((response) => {
        setSportData(response.data); // Store the sports data in a state variable
      })
      .catch((error) => {
        toast.error("Error Fetching Sports Data");
      });
  };
  const saveStat = (e: any) => {
    e.preventDefault();
    const data = {
      name: newStat.name,
      sportId: parseInt(newStat.sportId),
      playerPositionIds: newStat.playerPositionIds
    };
    axios.post(`${config.URL}/journies/stat`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`, // Replace with your actual access token
      },
    })
      .then((response) => {
        fetchStats(); // Fetch data after successfully adding a new country
        closeModal();
        toast.success("Stat Added Successfully");
      })
      .catch((error) => {
        toast.error("Error Adding Stat");
      });
  };
  const editStat = (e: any) => {
    e.preventDefault();
    const selectedPositionIds = newStat.playerPositionIds.map((selectedPositionName: any) => {
      const foundPosition = positionData.find((pos: any) => pos.name === selectedPositionName);
      return foundPosition ? foundPosition.id : null;
    });
    const data = {
      name: newStat.name,
      sportId: parseInt(newStat.sportId),
      playerPositionIds: selectedPositionIds
    };
    axios.put(`${config.URL}/journies/stat/${editedStat.id}`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`, // Replace with your actual access token
      },
    })
      .then((response) => {
        fetchStats(); // Fetch data after successfully adding a new country
        closeModal();
        toast.success("Stat Updated Successfully");
      }).catch((error) => {
        toast.error("Error Updating Stat");

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
    if (isDeleteConfirmationOpen && recordToDelete) {
      axios.delete(`${config.URL}/journies/stat/${id}`, {
        headers: {
          'Authorization': `Bearer ${Token}`, // Replace with your actual access token
        },
      })
        .then((response) => {
          // If the deletion is successful, you may want to update your data here by making a new API request or updating the state.
          fetchStats(); // Fetch data after successfully deleting a record
          closeDeleteConfirmation(); // Close the confirmation dialog
          toast.success("Stat Deleted Successfully");
        })
        .catch((error) => {
          toast.error("Error Deleting Stat");
        });
    }
  };
  const handleSportChange = (selectedSportId: any) => {
    setIsSportSelected(!!selectedSportId); // Update the state based on whether a sport is selected
    // Make an API call to get player positions for the selected sport
    axios
      .get(`${config.URL}/playerPositions/bySportId/${selectedSportId}`, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((response) => {
        setPositionData(response.data);
      })
      .catch((error) => {
        toast.error("Error Fetching Player Positions Data");
      });
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
        <AddIcon />  Add Stat
      </button>
      {/* Table */}
      <div className="flex flex-col max-h-[calc(100vh-200px)] overflow-y-auto">
        <div className="grid grid-cols-5 sm:grid-cols-5 bg-black text-white">
          <div className="p-1 xl:p-2">
            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Id</h5>
          </div>
          <div className="p-1 xl:p-2">
            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Stat Name</h5>
          </div>
          <div className="p-1 text-center xl:p-2">
            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Player Position</h5>
          </div>
          <div className="p-1 text-center xl:p-2">
            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Sport Name</h5>
          </div>
          <div className="p-1 text-center xl:p-2">
            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Actions</h5>
          </div>
        </div>
        {loading ? (<LinearColor />) : (<>
          {brandData.map((brand: any, index: any) => (
            <div key={index}
              className={`grid grid-cols-5 sm:grid-cols-5 ${index === brandData.length - 1
                ? ""
                : "border-b border-stroke dark:border-strokedark"
                }`}
            >
              <div className="flex items-center gap-3 ml-2 p-1 xl:p-0">
                <p style={sfProDisplayStyle} className="text-sm text-black sm:block">{index + 1}</p>
              </div>
              <div className="flex items-center gap-3 ml-3 p-1 xl:p-0">
                <p style={sfProDisplayStyle} className="text-sm text-black sm:block">{brand.name}</p>
              </div>
              {brand.playerPositions.length > 1 ? (
                <div className="flex items-center ml-16 p-1 xl:p-5 gap-2">
                  <p
                    onClick={() => openSportModal(brand.playerPositions)}
                    style={{ ...sfProDisplayStyle, cursor: 'pointer', textDecoration: 'underline' }}
                    className="text-sm text-black sm:block"
                  >
                    View
                  </p>
                </div>
              ) : (
                <div className="flex items-center ml-16 p-1 xl:p-5 gap-2">
                  <p style={sfProDisplayStyle} className="text-sm text-black sm:block">
                    {brand.playerPositions.map((position: any, positionIndex: any) => (
                      <span key={positionIndex}>
                        {position.playerPosition.name}
                        {positionIndex < brand.playerPositions.length - 1 && ", "}
                      </span>
                    ))}
                  </p>
                </div>
              )}
              <div className="flex items-center justify-center p-1 xl:p-0">
                <p key={index} style={sfProDisplayStyle} className="text-sm text-black sm:block">{brand.sport.name}</p>
              </div>
              <div className="p-1 text-center xl:p-0">
                <IconButton title="Edit" onClick={() => handleEdit(brand)} color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton title="Delete" onClick={() => openDeleteConfirmation(brand)} color="error">
                  <DeleteIcon />
                </IconButton>
              </div>
            </div>
          ))}
        </>)}
      </div>
      
      <AdminPopup isModalOpen={isSportModalOpen} closeViewModal={closeSportModal} title={"Position Names"}>
        <div className="mb-4">
          {selectedSports.map((sport: any, index: any) => (
            <p key={index} style={sfProDisplayStyle} className="text-sm text-black sm:block">
              {sport.playerPosition.name}
            </p>
          ))}
        </div>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            style={sfProDisplayStyle}
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base text-gray-700 hover-bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm-text-sm"
            onClick={closeSportModal}
          >
            Close
          </button>
        </div>
      </AdminPopup>

      <AdminPopup isModalOpen={isModalOpen} closeViewModal={closeModal} title={editedStat ? "Edit Stat" : "Add Stat"}>
        <form onSubmit={editedStat ? editStat : saveStat}>
          <div className="mb-4">
            <label htmlFor="name" style={sfProDisplayStyle} className="text-sm text-gray-700">
              Stat Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={newStat.name}
              onChange={(e) => setNewStat({ ...newStat, name: e.target.value })}
              required
              className="mt-1 p-2 block w-full sm:text-sm text-black bg-transparent border border-gray-300 rounded-md"
            />
          </div>
          {!editedStat && <div className="mb-4">
            <label htmlFor="sportId" style={sfProDisplayStyle} className="block text-sm text-gray-700">
              Sport Name
            </label>
            <select
              id="sportId"
              name="sportId"
              value={newStat.sportId}
              onChange={(e) => {
                setNewStat({ ...newStat, sportId: e.target.value });
                handleSportChange(e.target.value); // Call API on sport change
              }}
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
          </div>}
          {!editedStat && <div className="mb-4">
            <>   <label htmlFor="positionId" style={sfProDisplayStyle} className="text-sm text-gray-700">
              Position Name
            </label>
              <FormControl fullWidth>
                <InputLabel id="positionId-label"></InputLabel>
                <Select
                  labelId="positionId-label"
                  id="positionId"
                  name="positionId"
                  value={newStat.playerPositionIds || []}
                  onChange={(e) =>
                    setNewStat({
                      ...newStat,
                      playerPositionIds: e.target.value,
                    })}
                  required
                  multiple
                  disabled={isSportSelected ? false : true}
                  renderValue={(selected) =>
                    selected
                      .map((positionId: any) => {
                        const selectedPosition = positionData.find(
                          (pos: any) => pos.id === positionId
                        );
                        return selectedPosition ? selectedPosition.name : "";
                      })
                      .join(", ")
                  }
                >
                  {positionData.map((pos: any) => (
                    <MenuItem key={pos.id} value={pos.id}>
                      {pos.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          </div>}
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              style={sfProDisplayStyle} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base text-white hover-bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm-text-sm"
            >
              {editedStat ? "Update" : "Save"}
            </button>
            <button
              type="button"
              style={sfProDisplayStyle} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base text-gray-700 hover-bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm-text-sm"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </form>
      </AdminPopup>

      <AdminPopup isModalOpen={isDeleteConfirmationOpen} closeViewModal={closeDeleteConfirmation} title={"Confirm Deletion"}>
        <p style={{ color: "black" }}>Are you sure you want to delete this record?</p>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            style={sfProDisplayStyle} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base text-white hover-bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm-text-sm"
            onClick={() => handleDelete(recordToDelete.id)}
          >
            Delete
          </button>
          <button
            type="button"
            style={sfProDisplayStyle} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base text-gray-700 hover-bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm-text-sm"
            onClick={closeDeleteConfirmation}
          >
            Cancel
          </button>
        </div>
      </AdminPopup>
      <ToastContainer />
    </div >
  );
};
export default Stats;
