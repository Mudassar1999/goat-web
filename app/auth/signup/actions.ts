import { NEXT_API_URL } from "@/url";
import axios from "axios";
export const checkUserName = (userName: string, setResponse: Function) => {
  axios({
    method: "POST",
    url: NEXT_API_URL + "users/check-username",
    data: { userName: userName },
  })
    .then(({ data }) => {
      data.code = "200";
      setResponse(data);
    })
    .catch(({ response }) => {
      setResponse(response.data);
    });
};
