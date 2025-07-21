import axios from "axios";
import { toast } from "react-toastify";

export async function UpdateShowScout(payload: any, fetchProfile: any) {

     try {
          const response = await axios.put(
               `${process.env.NEXT_PUBLIC_API_URL}/users/profile/scouteBadge`,
               payload,
               {
                    headers: {
                         "Content-Type": "application/json",
                         Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
               }
          );

          toast.success(`Scouted Badge data updated`);
          fetchProfile()
          return response.status

     } catch (error: any) {
          console.error(error);
          toast.error(error.message);
     }
}
