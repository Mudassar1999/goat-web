"use client";
import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Image from "next/image";
import axios from "axios";
import config from "@/config";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import { ReactSVG } from 'react-svg';
import Loader from "../Loader/Loader";
import LinearColor from "../Loader/LinearColor";
import AddIcon from '@mui/icons-material/Add';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import AdminPopup from "../shared/AdminPopup";

const Dominances = () => {
  const [brandData, setBrandData] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState<any>(false);
  const [editedDominance, setEditedDominance] = useState<any>(null);
  const [sportData, setSportData] = useState<any>([]);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState<any>(false);
  const [recordToDelete, setRecordToDelete] = useState<any>(null);
  const [loading, setLoading] = useState<Boolean>(false);
  const initialDominancesData = {
    name: "",
    image: null, // Initialize with null
    sportIds: [], // Initialize as an empty array for multiple selections
  };
  const sfProDisplayStyle = {
    fontFamily: 'SF Pro Display, Arial, sans-serif',
  };
  const [newDominance, setNewDominance] = useState<any>({ ...initialDominancesData });
  const [imageUploading, setImageUploading] = useState<any>(false);
  const [Token, setToken] = useState<any>(localStorage.getItem('accessToken'));
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
    fetchDominances();
    fetchSport();
  }, []); // Fetch data when the component mounts
  const openModal = () => {
    setIsModalOpen(true);
    setEditedDominance(null);
    setNewDominance({ ...initialDominancesData });
  };
  const handleEdit = (Dominance: any) => {
    console.log(Dominance, "Dominance")
    setIsModalOpen(true);
    setEditedDominance(Dominance);
    setNewDominance({ ...Dominance });
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditedDominance(null);
    setNewDominance({ ...initialDominancesData });
  };
  const fetchDominances = () => {
    setLoading(true);
    axios
      .get(`${config.URL}/playerDominances`, {
        headers: {
          'Authorization': `Bearer ${Token}`, // Replace with your actual access token
        },
      })
      .then((response) => {
        setBrandData(response.data);
      })
      .catch((error) => {
        toast.error("Error Fetching Dominances Data");
      }).finally(() => {
        setLoading(false);
      });

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
  const uploadImage = async (img: any) => {
    // Set the loading state to true when image upload begins
    setImageUploading(true);
    let data = new FormData();
    data.append('image', img);
    try {
      const response = await axios.post(`${config.URL}/playerDominances/image`, data, {
        headers: {
          'Authorization': `Bearer ${Token}`,
        },
      });
      // Set the image after a successful upload
      setNewDominance({
        ...newDominance,
        image: response.data.media,
      });
    } catch (error) {
      toast.error('Error uploading image');
    } finally {
      setImageUploading(false);
    }
  };
  const saveDominance = (e: any) => {
    e.preventDefault();
    const selectedSportIds = newDominance.sportIds.map((selectedSportName: any) => {
      const foundSport = sportData.find((sport: any) => sport.name === selectedSportName);
      return foundSport ? foundSport.id : null;
    });
    const data = {
      name: newDominance.name,
      sportId: selectedSportIds, // Ensure it's an array
      image: newDominance.image,
    };
    axios.post(`${config.URL}/playerDominances`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`,
      },
    })
      .then((response) => {
        fetchDominances();
        closeModal();
        toast.success("Dominance Added Successfully");
      })
      .catch((error) => {
        toast.error("Error Adding Dominance");
      });
  };
  const editDominance = (e: any) => {
    e.preventDefault();
    const selectedSportIds = newDominance.sportIds.map((selectedSportName: any) => {
      const foundSport = sportData.find((sport: any) => sport.name === selectedSportName);
      return foundSport ? foundSport.id : null;
    });
    const data = {
      name: newDominance.name,
      sportId: selectedSportIds, // Ensure it's an array
      image: newDominance.image,
    };
    axios.put(`${config.URL}/playerDominances/${editedDominance.id}`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`,
      },
    })
      .then((response) => {
        fetchDominances();
        closeModal();
        toast.success("Dominance Updated Successfully");
      })
      .catch((error) => {
        toast.error("Error Updating Dominance");
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
      axios.delete(`${config.URL}/playerDominances/${id}`, {
        headers: {
          'Authorization': `Bearer ${Token}`, // Replace with your actual access token
        },
      })
        .then((response) => {
          // If the deletion is successful, you may want to update your data here by making a new API request or updating the state.
          fetchDominances(); // Fetch data after successfully deleting a record
          closeDeleteConfirmation(); // Close the confirmation dialog
          toast.success("Dominance Deleted Successfully");
        })
        .catch((error) => {
          toast.error("Error Deleting Dominance");
        });
    }

  };

  const handleSVGInjection = (svg: any) => {
    const modifiedSvg = svg.replace(/fill="[^"]*"/g, 'fill="red"');
    return modifiedSvg;
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
        <AddIcon /> Add Dominance
      </button>
      {/* Table */}
      <div className="flex flex-col max-h-[calc(100vh-200px)] overflow-y-auto">
        <div className="grid grid-cols-5 sm:grid-cols-5 bg-black text-white">
          <div className="p-1 xl:p-2">
            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Id</h5>
          </div>
          <div className="p-1 xl:p-2">
            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Dominance Name</h5>
          </div>
          <div className="p-1 text-center xl:p-2">
            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Image</h5>
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
            <div key={index} className={`grid grid-cols-5 sm:grid-cols-5 ${index === brandData.length - 1 ? "" : "border-b border-stroke dark:border-strokedark"}`}>

              <div className="flex items-center gap-3 p-1 ml-2 xl:p-0">
                <p style={sfProDisplayStyle} className="text-sm text-black sm:block">{index + 1}</p>
              </div>
              <div className="flex items-center ml-3 gap-3 p-1 xl:p-0">
                <p style={sfProDisplayStyle} className=" text-sm text-black sm:block">{brand.name}</p>
              </div>
              <div className="flex items-center justify-center p-1 xl:p-0">
                {brand.image && (
                  brand.image.endsWith('.svg') ? (
                    <ReactSVG
                      src={`${config.baseUrl}${brand.image}`}
                      // afterInjection={handleSVGInjection}
                    />
                  ) : (
                    <Image
                      src={`${config.baseUrl}${brand.image}`}
                      alt="Flag"
                      width={32}
                      height={24}
                      layout="fixed"
                    />
                  )
                )
                }
              </div>
              {brand.sports.length > 1 ? (
                <div className="flex items-center ml-16 p-1 xl:p-5 gap-2">
                  <p
                    onClick={() => openSportModal(brand.sports)}
                    style={{ ...sfProDisplayStyle, cursor: 'pointer', textDecoration: 'underline' }}
                    className="text-sm text-black sm:block"
                  >
                    View
                  </p>
                </div>
              ) : (
                <div className="flex items-center ml-16 p-1 xl:p-5 gap-2">
                  <p style={sfProDisplayStyle} className="text-sm text-black sm:block">
                    {brand.sports.map((position: any, positionIndex: any) => (
                      <span key={positionIndex}>
                        {position.Sport.name}
                        {positionIndex < brand.sports.length - 1 && ", "}
                      </span>
                    ))}
                  </p>
                </div>
              )}

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

      <AdminPopup isModalOpen={isSportModalOpen} closeViewModal={closeSportModal} title={"Sports Names"}>
        <div className="mb-4">
          {selectedSports.map((sport: any, index: any) => (
            <p key={index} style={sfProDisplayStyle} className="text-sm text-black sm:block">
              {sport.Sport.name}
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

      <AdminPopup isModalOpen={isModalOpen} closeViewModal={closeModal} title={editedDominance ? "Edit Dominance" : "Add Dominance"}>
        <form onSubmit={editedDominance ? editDominance : saveDominance}>
          <div className="mb-4">
            <label htmlFor="name" style={sfProDisplayStyle} className="text-sm text-gray-700">
              Dominance Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={newDominance.name}
              onChange={(e) => setNewDominance({ ...newDominance, name: e.target.value })}
              required
              className="mt-1 p-2 block w-full sm:text-sm text-black bg-transparent border border-gray-300 rounded-md"
            />
          </div>
          {!editedDominance && <div className="mb-4">
            <label htmlFor="sportId" style={sfProDisplayStyle} className="text-sm text-gray-700">
              Sport Name
            </label>
            <FormControl fullWidth>
              <InputLabel id="sportId-label"></InputLabel>
              <Select
                labelId="sportId-label"
                id="sportId"
                name="sportId"
                value={newDominance.sportIds || []}
                onChange={(e) =>
                  setNewDominance({
                    ...newDominance,
                    sportIds: e.target.value,
                  })
                }
                multiple
                renderValue={(selected) => selected.join(", ")}
              >
                {sportData.map((sport: any) => (
                  <MenuItem key={sport.id} value={sport.name}>
                    {sport.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>}
          <div className="mb-4">
            <label htmlFor="image" style={sfProDisplayStyle} className="block text-sm text-gray-700">
              Image
            </label>
            <input
              type="hidden"
              id="image"
              name="image"
            />
            <input
              type="file"
              id="flag"
              name="flag"
              onChange={(e: any) => {
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
              style={sfProDisplayStyle} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base text-white hover-bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm-text-sm"
            >
              {editedDominance ? "Update" : "Save"}
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
            style={sfProDisplayStyle} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#FF453A] text-base text-white hover-bg-[#FF453A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm-text-sm"
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
    </div>
  );
};
export default Dominances;
