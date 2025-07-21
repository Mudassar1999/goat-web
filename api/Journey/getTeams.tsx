import axios from "axios";

export async function getTeams(SPORT_ID: any) {
  try {
    const response: any = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/clubTeams/bySportId/${SPORT_ID}`,
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
