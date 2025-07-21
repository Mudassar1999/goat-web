import axios from "axios";

export async function getLogsOptions() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/journies/log/stats`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
