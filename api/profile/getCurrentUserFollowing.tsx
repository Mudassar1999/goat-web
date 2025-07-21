import axios from "axios";

export async function currentUserFollowing(currentPage: number, pageType: string) {
     try {
          const queryParams: { [key: string]: any } = {};
          queryParams[pageType] = currentPage;
          const response: any = await axios.get(
               `${process.env.NEXT_PUBLIC_API_URL}/users/followersAndFollowings`,
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
