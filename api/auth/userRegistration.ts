import axios from "axios";
import { toast } from "react-toastify";

const fetchUser = async () => {
  try {
    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/users/profile`;

    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    return response?.data;
  } catch (error) {
    console.error(error);
  }
};

const userRegistration = async (formState: any) => {
  const parsedFormState = {
    ...formState,
    // Convert specific fields to numbers if they are currently strings
    height: formState.height ? parseFloat(formState.height) : null,
    weight: formState.weight ? parseFloat(formState.weight) : null,
    // Add or modify other properties as needed
  };
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/users/register`,
      parsedFormState,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );
    
    const userSport = await fetchUser();
    localStorage.setItem("user_sport", JSON.stringify(userSport.sportsData[0]));
    localStorage.setItem("user_info", JSON.stringify(response.data.user));
    toast.success(response.data.message);
    return response.data; // Return the data for further processing if needed
  } catch (error) {
    throw error; // Throw the error for the calling code to handle
  }
};

export default userRegistration;
