import axios from "axios";

export async function getJournies() {
  try {
    const response: any = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/journies`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );
    return response?.data;
  } catch (error) {
    console.log(error);
  }
}
