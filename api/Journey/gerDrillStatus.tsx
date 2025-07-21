import axios from "axios";

export async function getDrillStatus(id: any) {
  try {
    const response: any = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/journies/userDrill/${id}/status`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );
    return response?.data?.userDrill[0];
  } catch (error) {
    console.log(error);
  }
}
