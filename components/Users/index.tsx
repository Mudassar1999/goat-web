import React, { useState, useEffect, Fragment } from "react";
import { ToastContainer } from "react-toastify";
import Button from "@mui/material/Button";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";
import config from "@/config";
import LinearColor from "../Loader/LinearColor";
import AdminPopup from "../shared/AdminPopup";
interface props {
  user: any;
}
const sfProDisplayStyle = {
  fontFamily: 'SF Pro Display, Arial, sans-serif',
};
const UserProfileCard = ({ user }: props) => {
  return (
    <div className="user-details-card w-full">
      <div className="flex flex-col items-center mb-4"> {/* Center the content */}
        <div className={`rounded-full ${user.profileImage && 'overflow-hidden'} w-32 h-32 mb-2`}> {/* Adjust the margin here */}
          <Image
            src={user.profileImage
              ? user.profileImage.startsWith('https://')
                ? user.profileImage
                : `${config.baseUrl}${user.profileImage}`
              : ''}
            alt="User Profile"
            width={100}
            height={100}
            className="object-cover w-full h-full"
          />
        </div>
      </div>
      <div className="flex flex-col justify-between">
        <div className="user-details-left mt-0 font-sans bg-zinc-100 rounded-[14px] p-2">
          <h1 style={sfProDisplayStyle} className="text-xl text-gray-400 xsm:text-base">
            {user.firstName} {user.lastName}
          </h1>
          {user.gender && <div className="flex justify-between mb-1">
            <p>Gender</p>
            <p>{user.gender}</p>
          </div>}
          {user.height && <div className="flex justify-between mb-1">
            <p>Height</p>
            <p>{user.height}</p>
          </div>}
          {user.weight && <div className="flex justify-between mb-1">
            <p>Weight</p>
            <p>{user.weight}</p>
          </div>}
          {user.passportNumber && <div className="flex justify-between mb-1">
            <p>Passport No</p>
            <p>{user.passportNumber}</p>
          </div>}
          {user.fullLegalName && <div className="flex justify-between">
            <p>Legal Name</p>
            <p>{user.fullLegalName}</p>
          </div>}
        </div>
        {user.userSports.length > 0 && <div className="user-sports-card flex-1 bg-zinc-100 rounded-[14px] p-2 mt-2"> {/* Adjust the margin here */}
          {user.userSports.map((userSport: any, index: number) => (
            <div key={index}>
              <h1 className="text-xl text-gray-400 xsm:text-base"> 
                {"User Sports"}
              </h1>
              {userSport.sport && <div className="flex justify-between mb-1 font-sans">
                <p>Sport name</p>
                <p>{userSport.sport.name}</p>
              </div>}
              {userSport.playingClub && <div className="flex justify-between mb-1 font-sans">
                <p>Playing Club</p>
                <p>{userSport.playingClub.name}</p>
              </div>}
              {userSport.playingClubTeam && <div className="flex justify-between mb-1 font-sans">
                <p>Playing ClubTeam</p>
                <p>{userSport.playingClubTeam.name}</p>
              </div>}
              {userSport.coachingClub && <div className="flex justify-between mb-1 font-sans">
                <p>Coaching Club</p>
                <p>{userSport.coachingClub.name}</p>
              </div>}
              {userSport.coachingClubTeam && <div className="flex justify-between mb-1 font-sans">
                <p>Coaching ClubTeam</p>
                <p>{userSport.coachingClubTeam.name}</p>
              </div>}
              {userSport.dominantFoot && <div className="flex justify-between font-sans">
                <p>Dominant Foot</p>
                <p>{userSport.dominantFoot.name}</p>
              </div>}
            </div>
          ))}
        </div>}
      </div>
    </div>
  );
};
const Users = () => {
  const [brandData, setBrandData] = useState<any>([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState<any>(false);
  const [viewedUser, setViewedUser] = useState<any>(null);
  const [Token, setToken] = useState<any>(localStorage.getItem("accessToken"));
  const [loading, setLoading] = useState<Boolean>(false);
  const initialCountryData = {
    name: "",
  };
  useEffect(() => {
    fetchUsers();
  }, []); // Fetch data when the component mounts
  const handleView = (user: any) => {
    setViewedUser(user);
    setIsViewModalOpen(true);
  };
  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setViewedUser(null);
  };
  const fetchUsers = () => {
    setLoading(true);
    axios
      .get(`${config.URL}/users`, {
        headers: {
          Authorization: `Bearer ${Token}`, // Replace with your actual access token
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
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark-bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex flex-col max-h-[calc(100vh-200px)] overflow-y-auto">
        <div className="grid grid-cols-6 sm:grid-cols-6 bg-black text-white">
          <div className="p-1 xl:p-2">
            <h5 className="text-l xsm:text-base">Id</h5>
          </div>
          <div className="p-1 xl:p-2">
            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Phone No</h5>
          </div>
          <div className="p-1 xl:p-2">
            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Email</h5>
          </div>
          <div className="p-1 xl:p-2">
            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Username</h5>
          </div>
          <div className="p-1 xl:p-2">
            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Gender</h5>
          </div>
          <div className="p-1 text-center xl:p-2">
            <h5 style={sfProDisplayStyle} className="text-l xsm:text-base">Action</h5>
          </div>
        </div>
        {loading ? (<LinearColor />) : (<>
          {brandData.map((brand: any, index: any) => (
            <div key={index}
              className={`grid grid-cols-6 sm:grid-cols-6 ${index === brandData.length - 1
                ? ""
                : "border-b border-stroke dark:border-strokedark"
                }`}
            >
              <div className="flex items-center gap-3 p-1 xl:p-1">
                <p style={sfProDisplayStyle} className="text-sm text-black sm:block">{index + 1}</p>
              </div>
              <div className="flex items-center gap-3 p-1 xl:p-1">
                <p style={sfProDisplayStyle} className="text-sm text-black sm:block">{brand.phoneNumber}</p>
              </div>
              <div className="flex items-center gap-3 p-1 xl:p-1">
                <p style={sfProDisplayStyle} className="text-sm text-black sm:block">{brand.email}</p>
              </div>
              <div className="flex items-center ml-5 p-1 gap-2 xl:p-1">
                <p style={sfProDisplayStyle} className="text-sm text-black sm:block">{brand.userName}</p>
              </div>
              <div className="flex items-center ml-5 p-1 xl:p-1">
                <p style={sfProDisplayStyle} className="text-sm text-black sm:block">{brand.gender}</p>
              </div>
              <div className="p-1 text-center justify-center xl:p-1">
                <Button
                  variant="contained"
                  style={{ backgroundColor: 'black', color: 'white', font: 'serif' }}
                  onClick={() => handleView(brand)}
                >
                  View
                </Button>
              </div>
            </div>
          ))}
        </>)}
      </div>
      
      <AdminPopup isModalOpen={isViewModalOpen} closeViewModal={closeViewModal} title={"User Detail"}>
        <div className="text-black">
          {viewedUser && (
            <div>
              <div className="flex justify-center items-center">
                <UserProfileCard user={viewedUser} />
              </div>
            </div>
          )}
        </div>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            style={sfProDisplayStyle} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base text-gray-700 hover-bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm-text-sm"
            onClick={closeViewModal}
          >
            Close
          </button>
        </div>
      </AdminPopup>
      <ToastContainer />
    </div>
  );
};
export default Users;
