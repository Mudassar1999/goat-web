import removeFirebaseDocument from "@/utils/removeFirebaseDocu";
import axios from "axios";
import { toast } from "react-toastify";

const deleteAccount = async (userId: any, router: any, firebaseId: any) => {
     if (firebaseId) {
          try {
               const response = await axios.delete(
                    `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
                    {
                         headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                         },
                    }
               );

               if (response?.data?.status === "Success") {

                    await removeFirebaseDocument(firebaseId);
                    localStorage.clear();

                    toast.success(response.data.message);
                    router.push(`/signin`);
                    return response.data;
               } else {
                    toast.error(response.data.message);
               }
          } catch (error) {
               console.error("Error deleting account:", error);
               toast.error("Failed to delete account. Please try again.");
               throw error;
          }
     } else {
          toast.error("Something went wrong! Please try again!");
     }
};

export default deleteAccount;
