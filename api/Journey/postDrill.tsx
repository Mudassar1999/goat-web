import axios from "axios";
import { toast } from "react-toastify";

export async function postDrill(payload: any, setSubmitDrill: any, setLoading: any) {
  try {
    const drillresponse = axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/journies/userDrill`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );
    toast.success("Drill submit successfully");
    setLoading(false)
    setSubmitDrill(true)
  } catch (error) {
    setLoading(false)
    toast.error("Something went wrong");
    console.log(error);
  }
}
