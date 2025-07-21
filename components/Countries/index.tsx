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
import LinearColor from "../Loader/LinearColor";
import Loader from "../Loader/Loader";
import AddIcon from "@mui/icons-material/Add";
import AdminPopup from "../shared/AdminPopup";
import { TablePagination } from "@mui/material";

const Country = () => {
  const [brandData, setBrandData] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState<any>(false);
  const [editedCountry, setEditedCountry] = useState<any>(null);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState<any>(false);
  const [recordToDelete, setRecordToDelete] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const initialCountryData = {
    name: "",
    flag: null, // Initialize with null
  };
  const sfProDisplayStyle = {
    fontFamily: "SF Pro Display, Arial, sans-serif",
    // Add other inline styles as needed
  };
  const [newCountry, setNewCountry] = useState<any>({ ...initialCountryData });
  const [imageUploading, setImageUploading] = useState<any>(false);
  const [Token, setToken] = useState<any>(localStorage.getItem("accessToken"));

  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [counts, setCounts] = useState(0);

  useEffect(() => {
    // const storedToken = localStorage.getItem('accessToken');
    // if (storedToken) {
    //   setToken(storedToken);
    // }
    // console.log("accesToken:", Token);
    fetchCountry();
  }, [page, rowsPerPage]); // Fetch data when the component mounts
  const openModal = () => {
    setIsModalOpen(true);
    setEditedCountry(null);
    setNewCountry({ ...initialCountryData });
  };
  const handleEdit = (country: any) => {
    setIsModalOpen(true);
    setEditedCountry(country);
    setNewCountry({ ...country });
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditedCountry(null);
    setNewCountry({ ...initialCountryData });
  };
  const fetchCountry = () => {
    setLoading(true);
    axios
      .get(
        `${config.URL}/countries/admin/updated?limit=${rowsPerPage}&page=${page}`,
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
        toast.error("Error Fetching Countries Data");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const uploadImage = async (img: any) => {
    // Set the loading state to true when image upload begins
    setImageUploading(true);
    let data = new FormData();
    data.append("image", img);
    try {
      const response = await axios.post(`${config.URL}/countries/flag`, data, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });
      // Set the image after a successful upload
      setNewCountry({
        ...newCountry,
        flag: response.data.media,
      });
    } catch (error) {
      toast.error("Error uploading image");
    } finally {
      setImageUploading(false);
    }
  };
  const saveCountry = (e: any) => {
    e.preventDefault(); // Prevent the default form submission and page refresh
    const requestData = new FormData();
    requestData.append("name", newCountry.name);
    if (newCountry.flag) {
      requestData.append("flag", newCountry.flag);
    }
    axios
      .post(`${config.URL}/countries`, requestData, {
        headers: {
          Authorization: `Bearer ${Token}`, // Replace with your actual access token
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        fetchCountry(); // Fetch data after successfully adding a new country
        closeModal();
        toast.success("Country Added Successfully");
      })
      .catch((error) => {
        toast.error("Error Adding Country");
      });
  };
  const editCountry = (e: any) => {
    e.preventDefault(); // Prevent the default form submission and page refresh
    let data = JSON.stringify({
      name: newCountry.name,
      flag: newCountry.flag,
    });
    axios
      .put(`${config.URL}/countries/${editedCountry.id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`, // Replace with your actual access token
        },
      })
      .then((response) => {
        fetchCountry(); // Fetch data after successfully updating the country
        closeModal();
        toast.success("Country Updated Successfully");
      })
      .catch((error) => {
        toast.error("Error Updating country");
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
        .delete(`${config.URL}/countries/${id}`, {
          headers: {
            Authorization: `Bearer ${Token}`, // Replace with your actual access token
          },
        })
        .then(() => {
          // If the deletion is successful, you may want to update your data here by making a new API request or updating the state.
          fetchCountry(); // Fetch data after successfully deleting a record
          closeDeleteConfirmation(); // Close the confirmation dialog
          toast.success("Country Deleted Successfully");
        })
        .catch((error) => {
          toast.error("Error Deleting Country");
        });
    } else {
      // If the confirmation dialog is not open or no record to delete is set, open the dialog
      openDeleteConfirmation({ id }); // Pass the record id to the dialog
    }
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
          fontSize: window.innerWidth <= 350 ? "12px" : "auto",
          maxWidth: window.innerWidth <= 350 ? "10" : "auto ",
          padding: "px-4 py-2",
          borderRadius: "rounded",
          transition: "border-color 0.3s, color 0.3s",
        }}
        className="mb-4 bg-black text-white border border-white hover:bg-transparent hover:border-black hover:text-black px-4 py-2 rounded"
      >
        <AddIcon /> Add Country
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
        <div className="grid grid-cols-4 sm:grid-cols-4 bg-black text-white">
          <div className="p-1 xl:p-2">
            <h5
              style={{
                ...sfProDisplayStyle,
                fontSize: window.innerWidth <= 350 ? "12px" : "auto",
              }}
              className="text-l xsm:text-base"
            >
              Id
            </h5>
          </div>
          <div className="p-1  xl:p-2">
            <h5
              style={{
                ...sfProDisplayStyle,
                fontSize: window.innerWidth <= 350 ? "12px" : "auto",
              }}
              className="text-l xsm:text-base"
            >
              Country Name
            </h5>
          </div>
          <div className="p-1 text-center xl:p-2">
            <h5
              style={{
                ...sfProDisplayStyle,
                fontSize: window.innerWidth <= 350 ? "12px" : "auto",
              }}
              className="text-l xsm:text-base"
            >
              Flag
            </h5>
          </div>
          <div className="p-1 text-center xl:p-2">
            <h5
              style={{
                ...sfProDisplayStyle,
                fontSize: window.innerWidth <= 350 ? "12px" : "auto",
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
                className={`grid grid-cols-4 sm:grid-cols-4 ${
                  index === brandData.length - 1
                    ? ""
                    : "border-b border-stroke dark:border-strokedark"
                }`}
              >
                <div className="flex items-center ml-2 p-1 xl:p-0">
                  <p
                    style={{
                      ...sfProDisplayStyle,
                      fontSize: window.innerWidth <= 350 ? "12px" : "auto",
                    }}
                    className="text-sm text-black sm:block"
                  >
                    {index + 1}
                  </p>
                </div>
                <div className="flex items-center ml-3 gap-3 p-1 xl:p-0">
                  <p
                    style={{
                      ...sfProDisplayStyle,
                      fontSize: window.innerWidth <= 350 ? "12px" : "auto",
                      marginLeft: window.innerWidth <= 350 ? "0" : "3",
                    }}
                    className="text-sm text-black sm:block"
                  >
                    {brand.name}
                  </p>
                </div>
                <div
                  style={{
                    fontSize: window.innerWidth <= 350 ? "12px" : "auto",
                    marginLeft: window.innerWidth <= 350 ? "10" : "0",
                  }}
                  className="flex items-center justify-center p-1 xl:p-0"
                >
                  {brand.flag ? (
                    <Image
                      src={`${config.baseUrl}${brand.flag.replace(
                        /^"(.*)"$/,
                        "$1"
                      )}`}
                      alt="Flag"
                      width={32}
                      height={24}
                    />
                  ) : (
                    <span></span>
                  )}
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
        title={editedCountry ? "Edit Country" : "Add Country"}
      >
        <form onSubmit={editedCountry ? editCountry : saveCountry}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-serif text-gray-700"
            >
              Country Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={newCountry.name}
              onChange={(e) =>
                setNewCountry({ ...newCountry, name: e.target.value })
              }
              required
              className="mt-1 p-2 block w-full sm:text-sm text-black bg-transparent border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="flag"
              style={sfProDisplayStyle}
              className="block text-sm text-gray-700"
            >
              Flag
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
              style={sfProDisplayStyle}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base text-white hover-bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm-text-sm"
            >
              {editedCountry ? "Update" : "Save"}
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
export default Country;
