import CustomButton from "@/components/Button/CustomButton";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import deleteAccount from "@/api/auth/deleteAccount";
import "./LogOut.scss"

const ConfirmDeleteAccount = ({ setDeleteAccountPopup }: any) => {
     const [loading, setLoading] = useState(false);
     const router = useRouter();

     const deleteUser = () => {
          let userData: any = localStorage.getItem("user_info");
          userData = userData ? JSON.parse(userData) : null;
          const firebaseId: any = localStorage.getItem("firebaseDocuId");
          const userId = userData?.id
          deleteAccount(userId, router, firebaseId)
          setDeleteAccountPopup(false)
     };

     const handleCanclePress = () => {
          setDeleteAccountPopup(false);
     };

     return (
          <>
               {loading ? (
                    <></>
               ) : (
                    <div className="">
                         {/* <AiOutlineExclamationCircle className="text-5xl mx-auto mb-3" /> */}
                         <h2 className="headingLogout">
                              Are you sure you want to delete your account?
                         </h2>
                         <p className="desc desc-LogOut">By deleting your account, all data related to your account will be removed.</p>
                         {/* <div className="flex gap-3 justify-center">
                              <CustomButton
                                   title="Confirm"
                                   redButton={true}
                                   onClick={deleteUser}
                              />
                              <CustomButton title="cancel" onClick={handleCanclePress} />
                         </div> */}
                         <div className="PopUpLogActions">
                              <div className="delbtnotr cursor-pointer" onClick={deleteUser}>
                                   <div className="delbtn">Yes, delete account.</div>
                              </div>
                              <div className="cancelbtnotr cursor-pointer" onClick={handleCanclePress}>
                                   <div className="cancelbtn">Cancel</div>
                              </div>
                         </div>
                    </div>
               )}
          </>
     );
};

export default ConfirmDeleteAccount;
