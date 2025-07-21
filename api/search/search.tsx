import axios from "axios";

export async function getSearchPosts(currentPage: number, searchPost: any, pageType: string, setSearchLoading?: any) {

  try {
    setSearchLoading(true)
    const queryParams: { [key: string]: any } = {};
    queryParams[pageType] = currentPage;
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/search/updated?query=${searchPost}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        params: {
          limit: 15,
          ...queryParams,
        },
      }
    );
    setSearchLoading(false)
    return response.data;
  } catch (error) {
    setSearchLoading(false)
    console.log(error);
  }
}
