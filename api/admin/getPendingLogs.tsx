import axios from "axios";

export async function getPendingLogs() {
  try {
    const response: any = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/journies/log/pendings`,
      {
          headers: {
               'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Replace with your actual access token
             },
      }
    );
    return response?.data;
  } catch (error) {
    console.log(error);
  }
}
