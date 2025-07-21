"use client";
import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Image from "next/image";
import axios from "axios";
import config from "@/config";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../Loader/Loader";
import AddIcon from '@mui/icons-material/Add';
import LinearColor from "../Loader/LinearColor";
import AdminPopup from "../shared/AdminPopup";

const Badge = () => {
  const [brandData, setBrandData] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState<any>(false);
  const [editedBadge, setEditedBadge] = useState<any>(null);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState<any>(false);
  const [recordToDelete, setRecordToDelete] = useState<any>(null);
  const initialBadgesData = {
    name: "",
    imageUrl: null, // Initialize with null
    threshold: null, // Initialize as an empty array for multiple selections
    thresholdForScout: null,
    thresholdForCoach: null
  };
  const sfProDisplayStyle = {
    fontFamily: 'SF Pro Display, Arial, sans-serif',
    // Add other inline styles as needed
  };
  const [newBadge, setNewBadge] = useState<any>({ ...initialBadgesData });
  const [imageUploading, setImageUploading] = useState<any>(false);
  const [Token, setToken] = useState<any>(localStorage.getItem('accessToken'));
  const [loading, setLoading] = useState<any>(false);
  useEffect(() => {
    fetchBadges();
  }, []); // Fetch data when the component mounts
  const openModal = () => {
    setIsModalOpen(true);
    setEditedBadge(null);
    setNewBadge({ ...initialBadgesData });
  };
  const handleEdit = (Badge: any) => {
    setIsModalOpen(true);
    setEditedBadge(Badge);
    setNewBadge({ ...Badge });
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditedBadge(null);
    setNewBadge({ ...initialBadgesData });
  };
  const fetchBadges = () => {
    setLoading(true);
    const axios = require('axios');
    let config1: any = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${config.URL}/journies/badge`,
      headers: {
        'Authorization': `Bearer ${Token}`,
      }
    };
    axios.request(config1)
      .then((response: any) => {
        setBrandData(response.data);
      })
      .catch((error: any) => {
        toast.error('Error Fetching Badges Data');
      }).finally(() => {
        setLoading(false);
      })
  };
  const uploadImage = async (img: any) => {
    // Set the loading state to true when image upload begins
    setImageUploading(true);
    let data = new FormData();
    data.append('image', img);
    try {
      const response = await axios.post(`${config.URL}/journies/badgeImage`, data, {
        headers: {
          'Authorization': `Bearer ${Token}`,
        },
      });
      // Set the image after a successful upload
      setNewBadge({
        ...newBadge,
        imageUrl: response.data.media,
      });
    } catch (error) {
      toast.error('Error uploading image');
    } finally {
      setImageUploading(false);
    }
  };
  const saveBadge = (e: any) => {
    e.preventDefault();
    const data = {
      name: newBadge.name,
      imageUrl: newBadge.imageUrl,
      threshold: parseInt(newBadge.threshold),
      thresholdForCoach: parseInt(newBadge.thresholdForCoach),
      thresholdForScout: parseInt(newBadge.thresholdForScout),
    };

    axios.post(`${config.URL}/journies/badge`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`,
      },
    })
      .then((response) => {
        fetchBadges(); // Fetch data after successfully adding a new country
        closeModal();
        toast.success("Badge Added Successfully");
      })
      .catch((error) => {
        toast.error("Error Adding Badge");
      });
  };
  const editBadge = (e: any) => {
    e.preventDefault();
    const data = {
      name: newBadge.name,
      imageUrl: newBadge.imageUrl,
      threshold: parseInt(newBadge.threshold),
      thresholdForCoach: parseInt(newBadge.thresholdForCoach),
      thresholdForScout: parseInt(newBadge.thresholdForScout),
    };

    axios.put(`${config.URL}/journies/badge/${editedBadge.id}`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`,
      },
    })
      .then((response) => {
        fetchBadges(); // Fetch data after successfully adding a new country
        closeModal();
        toast.success("Badge Updated Successfully");
      }).catch((error) => {
        toast.error("Error Updating Badge");
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
      axios.delete(`${config.URL}/journies/badge/${id}`, {
        headers: {
          'Authorization': `Bearer ${Token}`,
        },
      })
        .then((response) => {
          // If the deletion is successful, you may want to update your data here by making a new API request or updating the state.
          fetchBadges(); // Fetch data after successfully deleting a record
          closeDeleteConfirmation(); // Close the confirmation dialog
          toast.success("Badge Deleted Successfully");
        })
        .catch((error) => {
          toast.error("Error Deleting Badge");
        });
    }
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
        <AddIcon /> Add Badge
      </button>
      {/* Table */}
      <div className="flex flex-col max-h-[calc(100vh-200px)] overflow-y-auto">
        <div className="grid grid-cols-7 sm:grid-cols-7 bg-black text-white">
          <div className="p-1 xl:p-2">
            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Id</h5>
          </div>
          <div className="p-1 xl:p-2">
            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Badge Name</h5>
          </div>
          <div className="p-1 text-center xl:p-2">
            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Image</h5>
          </div>
          <div className="p-1 text-center xl:p-2">
            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Threshold for Player</h5>
          </div>
          <div className="p-1 text-center xl:p-2">
            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Threshold for Scout</h5>
          </div>
          <div className="p-1 text-center xl:p-2">
            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Threshold for Coach</h5>
          </div>
          <div className="p-1 text-center xl:p-2">
            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Actions</h5>
          </div>
        </div>
        {loading ? (<LinearColor />) : (<>
          {brandData.map((brand: any, index: any) => (
            <div key={index} className={`grid grid-cols-7 sm:grid-cols-7 ${index === brandData.length - 1
              ? ""
              : "border-b border-stroke dark:border-strokedark"
              }`}
            >
              <div className="flex items-center gap-3 ml-2 p-1 xl:p-0">
                <p style={sfProDisplayStyle} className="text-sm text-black sm:block">{index + 1}</p>
              </div>
              <div className="flex ml-2  items-center p-1 xl:p-0">
                <p style={sfProDisplayStyle} className="text-sm text-black sm:block">{brand.name}</p>
              </div>
              <div className="flex items-center justify-center p-1 xl:p-0">
                {brand.imageUrl ? (
                  <Image
                    src={`${config.baseUrl}${brand.imageUrl}`}
                    alt="Flag"
                    width={32}
                    height={24}
                  />
                ) : (
                  <span></span>
                )}
              </div>
              <div className="flex ml-6  items-center p-1 xl:p-0">
                <p style={sfProDisplayStyle} className="text-sm text-black sm:block">{brand.threshold}</p>
              </div>
              <div className="flex ml-6  items-center p-1 xl:p-0">
                <p style={sfProDisplayStyle} className="text-sm text-black sm:block">{brand.thresholdForScout}</p>
              </div>
              <div className="flex ml-6  items-center p-1 xl:p-0">
                <p style={sfProDisplayStyle} className="text-sm text-black sm:block">{brand.thresholdForCoach}</p>
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

      <AdminPopup isModalOpen={isModalOpen} closeViewModal={closeModal} title={editedBadge ? "Edit Badge" : "Add Badge"}>
        <form onSubmit={editedBadge ? editBadge : saveBadge}>
          <div className="mb-4">
            <label htmlFor="name" style={sfProDisplayStyle} className="text-sm text-gray-700">
              Badge Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={newBadge.name}
              onChange={(e) => setNewBadge({ ...newBadge, name: e.target.value })}
              required
              className="mt-1 p-2 block w-full sm:text-sm text-black bg-transparent border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="name" style={sfProDisplayStyle} className="text-sm text-gray-700">
              Threshold
            </label>
            <input
              type="number"
              id="threshold"
              name="threshold"
              value={newBadge.threshold}
              onChange={(e) => setNewBadge({ ...newBadge, threshold: e.target.value })}
              required
              className="mt-1 p-2 block w-full sm:text-sm text-black bg-transparent border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="name" style={sfProDisplayStyle} className="text-sm text-gray-700">
              Threshold For Coach
            </label>
            <input
              type="number"
              id="thresholdForCoach"
              name="thresholdForCoach"
              value={newBadge.thresholdForCoach}
              onChange={(e) => setNewBadge({ ...newBadge, thresholdForCoach: e.target.value })}
              required
              className="mt-1 p-2 block w-full sm:text-sm text-black bg-transparent border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="name" style={sfProDisplayStyle} className="text-sm text-gray-700">
              Threshold For Scout
            </label>
            <input
              type="number"
              id="thresholdForScout"
              name="thresholdForScout"
              value={newBadge.thresholdForScout}
              onChange={(e) => setNewBadge({ ...newBadge, thresholdForScout: e.target.value })}
              required
              className="mt-1 p-2 block w-full sm:text-sm text-black bg-transparent border border-gray-300 rounded-md"
            />
          </div>
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
              required
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
              {editedBadge ? "Update" : "Save"}
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
        <p style={{ color: "black" }}>Are you sure you want to delete this badge?</p>
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
export default Badge;
