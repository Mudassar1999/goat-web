"use client";

import React, { useState, useEffect, useRef, ChangeEvent } from "react";
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
import { GetApp, FileUpload, Folder, ArrowBack } from "@mui/icons-material";
import AdminPopup from "../shared/AdminPopup";
import {
  downloadSampleFileCommon,
  readUploadFileCommon,
} from "@/app/admin/actions";
import { CircularProgress } from "@mui/material";
import "./index.css";
import { folders } from "./constants";
import GalleryCard from "./card";
import { getMedia, saveMedia } from "./actions";
import SkeletonCard from "../SkeletonCard";
import Loading from "react-loading";
import ImagePreviewModal from "../ImageModal";

type formStateType = {
  type: string;
  image: any;
};

type deleteMediaState = {
  type: string;
  url: string;
};
const Gallery = () => {
  const [brandData, setBrandData] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState<any>(false);
  const [sportData, setSportData] = useState<any>([]);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState<any>(false);
  const [recordToDelete, setRecordToDelete] = useState<deleteMediaState | null>(
    null
  );
  const [Token, setToken] = useState<any>(localStorage.getItem("accessToken"));
  const [loading, setLoading] = useState<boolean>(false);
  const [bulkUploadLoading, setBulkUploadLoading] = useState<boolean>(false);

  const sfProDisplayStyle = {
    fontFamily: "SF Pro Display, Arial, sans-serif",
    // Add other inline styles as needed
  };
  const initialFormState = {
    type: "",
    image: null,
  };
  const [formState, setFormState] = useState<formStateType>({
    ...initialFormState,
  });
  const [imageUploading, setImageUploading] = useState<any>(false);
  const [media, setMedia] = useState<string[] | undefined>(undefined);
  const [mediaLoading, setMediaLoading] = useState<boolean>(false);
  const [seletedFolder, setSeletedFolder] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchClubs();
    fetchSport();
  }, []); // Fetch data when the component mounts
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormState({ ...initialFormState });
  };
  const fetchClubs = () => {
    setLoading(true);
    axios
      .get(`${config.URL}/clubs`, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((response) => {
        setBrandData(response.data);
      })
      .catch((error) => {
        toast.error("Error Fetching Clubs Data");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const fetchSport = () => {
    axios
      .get(`${config.URL}/sports/admin`, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((response) => {
        setSportData(response.data); // Store the sports data in a state variable
      })
      .catch((error) => {
        toast.error("Error Fetching Sports Data");
      });
  };

  const saveMediaHandler = async (e: any) => {
    e.preventDefault(); // Prevent the default form submission and page refresh
    const selectedFile = inputRef.current;
    if (selectedFile && selectedFile.files && selectedFile.files.length > 0) {
      const formData = new FormData();

      for (let i = 0; i < selectedFile.files.length; i++) {
        const image = selectedFile.files[i];
        formData.append("image", image);
      }
      saveMedia(formState.type, formData, closeModal, setMediaLoading);

      //   await axios
      //     .post(`${config.URL}/media/upload?type=${formState.type}`, formData, {
      //       headers: {
      //         Authorization: `Bearer ${Token}`,
      //       },
      //     })
      //     .then(({ data }) => {
      //       closeModal();
      //       toast.success(data.message);
      //     })
      //     .catch(({ response }) => {
      //       toast.error(response.message);
      //     });
    }
  };

  const openDeleteConfirmation = (record: deleteMediaState) => {
    setIsDeleteConfirmationOpen(true);
    setRecordToDelete(record);
  };
  const closeDeleteConfirmation = () => {
    setIsDeleteConfirmationOpen(false);
    setRecordToDelete(null);
  };
  const handleDelete = (url: any, type: string) => {
    // Check if the confirmation dialog is open and the recordToDelete is set
    if (isDeleteConfirmationOpen && recordToDelete) {
      axios
        .delete(`${config.URL}/media?mediaUrl=${url}&type=${type}`, {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        })
        .then(() => {
          // If the deletion is successful, you may want to update your data here by making a new API request or updating the state.
          fetchClubs(); // Fetch data after successfully deleting a record
          closeDeleteConfirmation(); // Close the confirmation dialog
          toast.success("ClubTeam Deleted Successfully");
        })
        .catch((error) => {
          toast.error("Error Deleting ClubTeam");
        });
    } else {
      // If the confirmation dialog is not open or no record to delete is set, open the dialog
      openDeleteConfirmation({ type: type, url: url }); // Pass the record id to the dialog
    }
  };

  const goBack = () => {
    setSeletedFolder("");
  };
  const onDelete = (url: any, type: any) => {
    // Check if the confirmation dialog is open and the recordToDelete is set
    if (isDeleteConfirmationOpen && recordToDelete) {
      axios
        .delete(`${config.URL}/media?mediaUrl=${url}&type=${type}`, {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        })
        .then(() => {
          // If the deletion is successful, you may want to update your data here by making a new API request or updating the state.
          getMedia(seletedFolder, setMedia, setMediaLoading);
          closeDeleteConfirmation(); // Close the confirmation dialog
          toast.success("Image Deleted Successfully");
        })
        .catch((error) => {
          toast.error("Error Deleting Image");
        });
    } else {
      // If the confirmation dialog is not open or no record to delete is set, open the dialog
      openDeleteConfirmation({ type: type, url: url }); // Pass the record id to the dialog
    }
  };
  const onView = (url: string) => {
    setImagePreview(url);
  };

  const getSelectedFolderMedia = (value: string) => {
    setSeletedFolder(value);
    getMedia(value, setMedia, setMediaLoading);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark-bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex justify-between">
        <div>
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
            <AddIcon /> Upload Media
          </button>
        </div>

        <div>
          {seletedFolder && (
            <button
              onClick={goBack}
              style={{
                ...sfProDisplayStyle,
                padding: "px-4 py-2",
                borderRadius: "rounded-full",
                transition: "border-color 0.3s, color 0.3s",
              }}
              className="mb-4 bg-black text-white border border-white hover:bg-transparent hover:border-black hover:text-black px-4 py-2 rounded-full"
            >
              <ArrowBack />
            </button>
          )}
        </div>
      </div>
      {/* Table */}

      <div className="flex flex-wrap">
        {seletedFolder
          ? !mediaLoading
            ? media?.map((image) => (
                <GalleryCard
                  imageUrl={`${config.baseUrl}${image}`}
                  onDelete={() => onDelete(image, seletedFolder)}
                  onView={() => onView(image)}
                  type={seletedFolder}
                />
              ))
            : [1, 2, 3].map((x) => <SkeletonCard />)
          : folders.map((x) => (
              <div className="flex justify-center relative">
                <Folder
                  color="disabled"
                  fontSize="large"
                  className="folder-size cursor-pointer"
                  onClick={() => getSelectedFolderMedia(x.value)}
                />
                <h6 className="absolute top-40 text-bold">{x.name}</h6>
              </div>
            ))}
      </div>

      <AdminPopup
        isModalOpen={isModalOpen}
        closeViewModal={closeModal}
        title={"Upload Media"}
      >
        <form onSubmit={saveMediaHandler}>
          <div className="mb-4">
            <label
              htmlFor="sportId"
              style={sfProDisplayStyle}
              className="block text-sm text-gray-700"
            >
              Folder
            </label>
            <select
              id="type"
              name="type"
              value={formState.type}
              onChange={(e) =>
                setFormState({ ...formState, type: e.target.value })
              }
              required
              disabled={false}
              className="mt-1 p-2 block w-full sm:text-sm text-black bg-transparent border border-gray-300 rounded-md"
            >
              <option value="">Select Folder</option>
              {folders.map((folder: any) => (
                <option key={folder.value} value={folder.value}>
                  {folder.name}
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
              multiple
              id="flag"
              name="flag"
              ref={inputRef}
              accept="image/*"
              className="mt-1 p-2 block w-full sm:text-sm text-black bg-transparent border border-gray-300 rounded-md"
            />
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              style={sfProDisplayStyle}
              disabled={mediaLoading}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base text-white hover-bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm-text-sm"
            >
              Save
            </button>
            {mediaLoading && (
              <div className="relative">
                <div className="absolute">
                  <Loading
                    type="spin"
                    width={25}
                    height={25}
                    color="#747474"
                    className="mt-2 ml-9"
                  />
                </div>
              </div>
            )}
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
            onClick={() => onDelete(recordToDelete?.url, recordToDelete?.url)}
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
      <ImagePreviewModal
        setIsOpen={setImagePreview}
        isOpen={imagePreview}
        imageUrl={imagePreview}
      />
      <ToastContainer />
    </div>
  );
};
export default Gallery;
