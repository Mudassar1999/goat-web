import axios from "axios";

export async function otherUserFollowing(userId: number, currentPage: any, pageType: string) {
     try {
          const queryParams: { [key: string]: any } = {};
          queryParams[pageType] = currentPage;
          const response: any = await axios.get(
               `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/followersAndFollowings`,
               {
                    headers: {
                         Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                    params: {
                         limit: 20,
                         ...queryParams,
                    },
               }
          );
          return response?.data;
     } catch (error) {
          console.log(error);
     }
}
