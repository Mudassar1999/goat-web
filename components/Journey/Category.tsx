"use client";
import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Image from "next/image";
import axios from "axios";
import config from "@/config";
import { ToastContainer, toast } from "react-toastify";
import { ReactSVG } from 'react-svg';
import Loader from "../Loader/Loader";
import AddIcon from '@mui/icons-material/Add';
import LinearColor from "../Loader/LinearColor";
import AdminPopup from "../shared/AdminPopup";

const Category = () => {
  const [brandData, setBrandData] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState<any>(false);
  const [editedCategory, setEditedCaategory] = useState<any>(null);
  const [sportData, setSportData] = useState([]);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState<any>(false);
  const [recordToDelete, setRecordToDelete] = useState<any>(null);
  const [loading, setLoading] = useState<any>(false);
  const initialCategoriesData = {
    name: "",
    imageUrl: null, // Initialize with null
    sportId: '',
  };
  const sfProDisplayStyle = {
    fontFamily: 'SF Pro Display, Arial, sans-serif',
    // Add other inline styles as needed
  };
  const [newCategory, setNewCategory] = useState<any>({ ...initialCategoriesData });
  const [imageUploading, setImageUploading] = useState<any>(false);
  const [Token, setToken] = useState<any>(localStorage.getItem('accessToken'));
  useEffect(() => {
    fetchCategories();
    fetchSport();
  }, []); // Fetch data when the component mounts
  const openModal = () => {
    setIsModalOpen(true);
    setEditedCaategory(null);
    setNewCategory({ ...initialCategoriesData });
  };
  const handleEdit = (Club: any) => {
    setIsModalOpen(true);
    setEditedCaategory(Club);
    setNewCategory({ ...Club });
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditedCaategory(null);
    setNewCategory({ ...initialCategoriesData });
  };
  const fetchCategories = () => {
    setLoading(true);
    axios
      .get(`${config.URL}/journies/category`, {
        headers: {
          'Authorization': `Bearer ${Token}`,
        },
      })
      .then((response) => {
        setBrandData(response.data);
      })
      .catch((error) => {
        toast.error("Error Fetching Categories Data");
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
  const uploadImage = async (img: any) => {
    // Set the loading state to true when image upload begins
    setImageUploading(true);
    let data = new FormData();
    data.append('image', img);
    try {
      const response = await axios.post(`${config.URL}/journies/categoryImage`, data, {
        headers: {
          'Authorization': `Bearer ${Token}`,
        },
      });
      // Set the image after a successful upload
      setNewCategory({
        ...newCategory,
        imageUrl: response.data.media,
      });
    } catch (error) {
      toast.error('Error uploading image');
    } finally {
      setImageUploading(false);
    }
  };
  const saveCategory = (e: any) => {
    e.preventDefault(); // Prevent the default form submission and page refresh
    let data = JSON.stringify({
      name: newCategory.name,
      imageUrl: newCategory.imageUrl,
      sportId: parseInt(newCategory.sportId)
    });
    axios
      .post(`${config.URL}/journies/category`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Token}`,
        },
      })
      .then((response) => {
        fetchCategories(); // Fetch data after successfully updating the club
        closeModal();
        toast.success("Category Added Successfully");
      })
      .catch((error) => {
        toast.error("Error Adding Category");
      });
  };
  const editCategory = (e: any) => {
    e.preventDefault(); // Prevent the default form submission and page refresh
    let data = JSON.stringify({
      name: newCategory.name,
      imageUrl: newCategory.imageUrl,
      sportId: parseInt(newCategory.sportId)
    });
    axios
      .put(`${config.URL}/journies/category/${editedCategory.id}`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Token}`,
        }
      })
      .then((response) => {
        fetchCategories(); // Fetch data after successfully adding a new country
        closeModal();
        toast.success("Category Updated Successfully");
      })
      .catch((error) => {
        toast.error("Error Updating Category");
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
        .delete(`${config.URL}/journies/category/${id}`, {
          headers: {
            'Authorization': `Bearer ${Token}`,
          },
        })
        .then(() => {
          // If the deletion is successful, you may want to update your data here by making a new API request or updating the state.
          fetchCategories(); // Fetch data after successfully deleting a record
          closeDeleteConfirmation(); // Close the confirmation dialog
          toast.success("Category Deleted Successfully");
        })
        .catch((error) => {
          toast.error("Error Deleting Category");
        });
    } else {
      // If the confirmation dialog is not open or no record to delete is set, open the dialog
      openDeleteConfirmation({ id }); // Pass the record id to the dialog
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark-bg-boxdark sm:px-7.5 xl:pb-1">
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
        <AddIcon /> Category
      </button>
      {/* Table */}
      <div className="flex flex-col max-h-[calc(100vh-200px)] overflow-y-auto">
        <div className="grid grid-cols-5 sm:grid-cols-5 bg-black text-white">
          <div className="p-1 xl:p-2">
            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Id</h5>
          </div>
          <div className="p-1 xl:p-2">
            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Category Name</h5>
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
            <div
              key={index}
              className={`grid grid-cols-5 sm:grid-cols-5 ${index === brandData.length - 1
                ? ""
                : "border-b border-stroke dark:border-strokedark"
                }`}
            >
              <div className="flex items-center gap-3 ml-2 p-1 xl:p-0">
                <p style={sfProDisplayStyle} className="text-sm text-black sm:block">{index + 1}</p>
              </div>
              <div className="flex items-center gap-3 ml-3  p-1 xl:p-0">
                <p style={sfProDisplayStyle} className="text-sm text-black sm:block">{brand.name}</p>
              </div>
              <div className="flex items-center justify-center p-2 xl:p-0">
                {brand.imageUrl ? (
                  brand.imageUrl.endsWith('.svg') ? (
                    <ReactSVG
                      src={`${config.baseUrl}${brand.imageUrl}`}
                    />
                  ) : (
                    <Image
                      src={`${config.baseUrl}${brand.imageUrl}`}
                      alt="Flag"
                      width={32}
                      height={24}
                      layout="fixed"
                    />
                  )
                ) : (
                  <span></span>
                )}
              </div>
              <div className="flex items-center justify-center p-2 xl:p-0">
                <p style={sfProDisplayStyle} className="text-sm text-black sm:block">{brand.sport.name}</p>
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

      <AdminPopup isModalOpen={isModalOpen} closeViewModal={closeModal} title={editedCategory ? "Edit Category" : "Add Category"}>
        <form onSubmit={editedCategory ? editCategory : saveCategory}>
          <div className="mb-4">
            <label htmlFor="name" style={sfProDisplayStyle} className="block text-sm text-gray-700">
              Category Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              required
              className="mt-1 p-2 block w-full sm:text-sm text-black bg-transparent border border-gray-300 rounded-md"
            />
          </div>
          {!editedCategory && <div className="mb-4">
            <label htmlFor="categoryId" style={sfProDisplayStyle} className="block text-sm text-gray-700">
              Sport Name
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={newCategory.sportId}
              onChange={(e) => setNewCategory({ ...newCategory, sportId: e.target.value })}
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
              {editedCategory ? "Update" : "Save"}
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
export default Category;
