import axios from "axios";

interface profielProps {
     setLoading: any
}

export async function getUserProfile({ setLoading }: profielProps) {
     setLoading(true)
     try {
          const response: any = await axios.get(
               `${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
               {
                    headers: {
                         Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
               }
          );
          setLoading(false)
          return response?.data;
     } catch (error) {
          setLoading(false)
          console.log(error);
     }
}
