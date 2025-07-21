"use client";
import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import config from "@/config";
import { ToastContainer } from "react-toastify";
import AddIcon from '@mui/icons-material/Add';
import { toast } from "react-toastify";
import LinearColor from "../Loader/LinearColor";
import AdminPopup from "../shared/AdminPopup";

const UserRoles = () => {
  const [brandData, setBrandData] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState<any>(false);
  const [editedRole, setEditedRole] = useState<any>(null);
  const [Token, setToken] = useState<any>(localStorage.getItem('accessToken'));
  const [loading, setLoading] = useState<Boolean>(false);
  const initialRolesData = {
    name: "",
    staticId: null
  };
  const sfProDisplayStyle = {
    fontFamily: 'SF Pro Display, Arial, sans-serif',
    // Add other inline styles as needed
  };
  const [newRole, setNewRole] = useState<any>({ ...initialRolesData });
  useEffect(() => {
    fetchRoles();
  }, []); // Fetch data when the component mounts
  const openModal = () => {
    setIsModalOpen(true);
    setEditedRole(null);
    setNewRole({ ...initialRolesData });
  };
  const handleEdit = (role: any) => {
    setIsModalOpen(true);
    setEditedRole(role);
    setNewRole({ ...role });
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditedRole(null);
    setNewRole({ ...initialRolesData });
  };
  const fetchRoles = () => {
    setLoading(true);
    axios
      .get(`${config.URL}/roles/admin`, {
        headers: {
          'Authorization': `Bearer ${Token}`, // Replace with your actual access token
        },
      })
      .then((response) => {
        setBrandData(response.data);
      })
      .catch((error) => {
        toast.error(error);
      }).finally(() => {
        setLoading(false);
      })
  };
  const saveRole = (e: any) => {
    e.preventDefault(); // Prevent the default form submission and page refresh
    let data = JSON.stringify({
      name: newRole.name,
      staticId: parseInt(newRole.staticId)
    });
    const accessToken = "{{ACCESS_TOKEN}}"; // Replace with your actual access token
    axios
      .post(`${config.URL}/roles`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Token}`,
        },
      })
      .then((response) => {
        fetchRoles(); // Fetch data after successfully updating the club
        closeModal();
        toast.success("Role Added successfully");
      })
      .catch((error) => {
        toast.error("Error Adding Role");
      });
  };
  const editRole = (e: any) => {
    e.preventDefault(); // Prevent the default form submission and page refresh
    let data = JSON.stringify({
      name: newRole.name
    });
    axios
      .put(`${config.URL}/roles/${editedRole.id}`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Token}`
        }
      })
      .then((response) => {
        fetchRoles(); // Fetch data after successfully adding a new country
        closeModal();
        toast.success("Role Updated successfully");
      })
      .catch((error) => {
        toast.error("Error Updating Role");
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
        <AddIcon /> Add Role
      </button>
      {/* Table */}
      <div className="flex flex-col max-h-[calc(100vh-200px)] overflow-y-auto">
        <div className="grid grid-cols-4 sm:grid-cols-4 bg-black text-white">
          <div className="p-1 xl:p-2">
            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Id</h5>
          </div>
          <div className="p-1 xl:p-2">
            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Role Name</h5>
          </div>
          <div className="p-1 xl:p-2">
            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Static Id</h5>
          </div>
          <div className="p-1 text-center xl:p-2">
            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Actions</h5>
          </div>
        </div>
        {loading ? (<LinearColor />) : (<>
          {brandData.map((brand: any, index: any) => (
            <div key={index}
              className={`grid grid-cols-4 sm:grid-cols-4 ${index === brandData.length - 1
                ? ""
                : "border-b border-stroke dark:border-strokedark"
                }`}
            >
              <div className="flex items-center gap-3 ml-2 p-1 xl:p-0">
                <p style={sfProDisplayStyle} className="text-sm font-serif text-black sm:block">{index + 1}</p>
              </div>
              <div className="flex items-center gap-3 ml-3 p-1 xl:p-0">
                <p style={sfProDisplayStyle} className="text-sm text-black sm:block">{brand.name}</p>
              </div>
              <div className="flex items-center gap-3 ml-8 p-1 xl:p-0">
                <p style={sfProDisplayStyle} className="text-sm text-black sm:block">{brand.staticId}</p>
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

      <AdminPopup isModalOpen={isModalOpen} closeViewModal={closeModal} title={editedRole ? "Edit Role" : "Add Role"}>
        <form onSubmit={editedRole ? editRole : saveRole}>
          <div className="mb-4">
            <label htmlFor="name" style={sfProDisplayStyle} className="block text-sm text-gray-700">
              Role Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={newRole.name}
              onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
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
              value={newRole.staticId}
              onChange={(e) => setNewRole({ ...newRole, staticId: e.target.value })}
              disabled={editedRole ? true : false}
              required
              className="mt-1 p-2 w-full sm:text-sm text-black bg-transparent border border-gray-300 rounded-md"
            />
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              style={sfProDisplayStyle} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base text-white hover-bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm-text-sm"
            >
              {editedRole ? "Update" : "Save"}
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
export default UserRoles;
