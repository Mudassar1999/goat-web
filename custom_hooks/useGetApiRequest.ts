import { useState } from "react";
import axios from "axios";

const useApiRequest = () => {
  const [responseData, setResponseData] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async (endpoint: any, sortFunction: any, params = {}) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          params: params,
        }
      );
      const sortedData = sortFunction
        ? response.data.sort(sortFunction)
        : response.data;
      setResponseData(sortedData);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  return { responseData, setResponseData, loading, setLoading, fetchData };
};

export default useApiRequest;
