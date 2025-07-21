import axios from "axios";

interface profielProps {
     setLoading?: any
     id: any
}

export async function getOtherUserProfile({ setLoading, id }: profielProps) {
     setLoading(true)
     try {
          const response: any = await axios.get(
               `${process.env.NEXT_PUBLIC_API_URL}/users/profile/${id}`,
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
