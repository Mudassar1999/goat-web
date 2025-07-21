import axios from "axios";

export async function getLikesOnPost(post_id: any, currentPage: number) {
     try {
          const response = await axios.get(
               `${process.env.NEXT_PUBLIC_API_URL}/posts/${post_id}/likes`,
               {
                    headers: {
                         Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                    params: {
                         limit: 20,
                         page: currentPage,
                    },
               },
          );

          return response.data;
     } catch (error) {
          console.log(error);
     }
}
