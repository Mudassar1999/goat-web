"use client";
import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Image from "next/image";
import axios from "axios";
import config from "@/config";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";
import LinearColor from "../Loader/LinearColor";
import AddIcon from '@mui/icons-material/Add';
import AdminPopup from "../shared/AdminPopup";

const Calendar = () => {
  const [brandData, setBrandData] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState<any>(false);
  const [editedSport, setEditedSport] = useState<any>(null);
  const initialSportsData = {
    name: "",
    image: null, // Initialize with null
    staticId: null
  };
  const sfProDisplayStyle = {
    fontFamily: 'SF Pro Display, Arial, sans-serif',
    // Add other inline styles as needed
  };
  const [newSport, setNewSport] = useState<any>({ ...initialSportsData });
  const [imageUploading, setImageUploading] = useState<any>(false);
  const [Token, setToken] = useState<any>(localStorage.getItem('accessToken'));
  const [loading, setLoading] = useState<Boolean>(false);
  useEffect(() => {
    fetchSport();
  }, []); // Fetch data when the component mounts
  const openModal = () => {
    setIsModalOpen(true);
    setEditedSport(null);
    setNewSport({ ...initialSportsData });
  };
  const handleEdit = (Sport: any) => {
    setIsModalOpen(true);
    setEditedSport(Sport);
    setNewSport({ ...Sport });
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditedSport(null);
    setNewSport({ ...initialSportsData });
  };
  const fetchSport = () => {
    setLoading(true);
    axios
      .get(`${config.URL}/sports/admin`, {
        headers: {
          'Authorization': `Bearer ${Token}`,
        },
      })
      .then((response) => {
        setBrandData(response.data);
      })
      .catch((error) => {
        toast.error("Error Fetching Sports Data");
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
      const response = await axios.post(`${config.URL}/sports/image`, data, {
        headers: {
          'Authorization': `Bearer ${Token}`,
        },
      });
      // Set the image after a successful upload
      setNewSport({
        ...newSport,
        image: response.data.media,
      });
    } catch (error) {
      toast.error('Error uploading image');
    } finally {
      setImageUploading(false);
    }
  };
  const saveSport = (e: any) => {
    e.preventDefault(); // Prevent the default form submission and page refresh
    let data = JSON.stringify({
      name: newSport.name,
      image: newSport.image,
      staticId: parseInt(newSport.staticId)
    });
    axios
      .post(`${config.URL}/sports`, data, {
        headers: {
          'Authorization': `Bearer ${Token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        fetchSport(); // Fetch data after successfully adding a new country
        closeModal();
        toast.success("Sport Added Successfully");
      })
      .catch((error) => {
        toast.error("Error Adding Sport");
      });
  };
  const editSport = (e: any) => {
    e.preventDefault(); // Prevent the default form submission and page refresh
    let data = JSON.stringify({
      name: newSport.name,
      image: newSport.image,
      staticId: parseInt(newSport.staticId)
    });
    axios
      .put(`${config.URL}/sports/${editedSport.id}`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Token}`,
        }
      })
      .then((response) => {
        fetchSport(); // Fetch data after successfully adding a new country
        closeModal();
        toast.success("Sport Updated Successfully");
      })
      .catch((error) => {
        toast.error("Error Updating Sport");
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
        <AddIcon />  Add Sport
      </button>
      {/* Table */}
      <div className="flex flex-col max-h-[calc(100vh-200px)] overflow-y-auto">
        <div className="grid grid-cols-5 sm:grid-cols-5 bg-black text-white">
          <div className="p-1 xl:p-2">
            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Id</h5>
          </div>
          <div className="p-1 xl:p-2">
            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Sport Name</h5>
          </div>
          <div className="p-1 xl:p-2">
            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Static Id</h5>
          </div>
          <div className="p-1 text-center xl:p-2">
            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Image</h5>
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
              <div className="flex items-center gap-3 ml-4 p-1 xl:p-0">
                <p style={sfProDisplayStyle} className="text-sm text-black sm:block">{brand.name}</p>
              </div>
              <div className="flex items-center ml-6 gap-3 p-1 xl:p-0">
                <p style={sfProDisplayStyle} className="text-sm text-black sm:block">{brand.staticId}</p>
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


              <div className="p-1 text-center xl:p-0">
                <IconButton title="Edit" onClick={() => handleEdit(brand)} color="primary">
                  <EditIcon />
                </IconButton>
              </div>
            </div>
          ))}
        </>)}
      </div>

      <AdminPopup isModalOpen={isModalOpen} closeViewModal={closeModal} title={editedSport ? "Edit Sport" : "Add Sport"}>
        <form onSubmit={editedSport ? editSport : saveSport}>
          <div className="mb-4">
            <label htmlFor="name" style={sfProDisplayStyle} className="block text-sm text-gray-700">
              Sport Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={newSport.name}
              onChange={(e) => setNewSport({ ...newSport, name: e.target.value })}
              disabled={editedSport ? true : false}
              required
              className="mt-1 p-2 block w-full sm:text-sm text-black bg-transparent border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="name" style={sfProDisplayStyle} className=" text-sm text-gray-700">
              Static Id
            </label>
            <input
              type=""
              id="staticId"
              name="staticId"
              value={newSport.staticId}
              onChange={(e) => setNewSport({ ...newSport, staticId: e.target.value })}
              disabled={editedSport ? true : false}
              required
              className="mt-1 p-2 w-full sm:text-sm text-black bg-transparent border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="flag" style={sfProDisplayStyle} className="block text-sm text-gray-700">
              Image
            </label>
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
              {editedSport ? "Update" : "Save"}
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

      <ToastContainer />
    </div>
  );
};
export default Calendar;
