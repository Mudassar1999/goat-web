import axios from "axios";
import config from "@/config";
import { toast } from "react-toastify";

export const getMedia = async (
  type: string,
  setMedia: React.Dispatch<React.SetStateAction<string[] | undefined>>,
  setMediaLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setMediaLoading(true);
  setMedia([]);
  await axios({
    method: "get",
    url: `${config.URL}/media?type=${type}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  })
    .then(({ data }) => {
      setMediaLoading(false);
      setMedia(data);
    })
    .catch(({ response }) => {
      setMediaLoading(false);
    });
};

export const saveMedia = async (
  type: string,
  formData: any,
  closeModal: () => void,
  setMediaUploadLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setMediaUploadLoading(true);

  await axios
    .post(`${config.URL}/media/upload?type=${type}`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    .then(({ data }) => {
      closeModal();
      setMediaUploadLoading(false);

      toast.success(data.message);
    })
    .catch(({ response }) => {
      setMediaUploadLoading(false);
      toast.error(response.message);
    });
};
