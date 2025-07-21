import axios from "axios";
import { toast } from "react-toastify";

export async function UpdateProfessionalDetail(payload: any, fetchProfile: any) {

     try {
          const response = await axios.put(
               `${process.env.NEXT_PUBLIC_API_URL}/users/update/professionalDetails`,
               payload,
               {
                    headers: {
                         "Content-Type": "application/json",
                         Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
               }
          );

          toast.success(`Professional detail updated successfully`);
          fetchProfile()
          return response.status

     } catch (error: any) {
          console.error(error);
          toast.error(error.message);
     }
}
