import axios from "axios";
import { postDrill } from "./postDrill";

export async function uploadDrill(payload: any, drill_Id: any, setSubmitDrill: any, setLoading: any) {
  setLoading(true)
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/journies/userDrill/video`,
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );
    if (response) {
      const payload = {
        drillUrl: response.data.videoPath,
        thumbnailUrl: response.data.thumbnailPath,
        gifUrl: response.data.gifPath,
        drillId: drill_Id ? parseInt(drill_Id) : null,
      };
      postDrill(payload, setSubmitDrill, setLoading);
    }
  } catch (error) {
    setLoading(false)
    console.log(error);
  }
}
