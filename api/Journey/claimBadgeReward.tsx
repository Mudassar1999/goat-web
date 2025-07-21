import axios from "axios";
import { toast } from "react-toastify";

export const calimBadgeReward = async (drill_id: any) => {
     try {
          const response = await axios.put(
               `${process.env.NEXT_PUBLIC_API_URL}/journies/badge/${drill_id}/claimReward`,
               {},
               {
                    headers: {
                         "Content-Type": "application/json",
                         Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
               }
          );
          toast.success(response?.data?.message);
          return response?.status;

     } catch (error) {
          console.log(error);
     }
};