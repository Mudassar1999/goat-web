import axios from "axios";

export async function getAllLogs() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/journies/logs`,
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
