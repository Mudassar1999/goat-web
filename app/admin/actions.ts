import axios from "axios";
import config from "@/config";
import * as XLSX from "xlsx";
import { ClubBulkUploadItem } from "@/gen/locate2u/models/ClubBulkUploadItem";
import { toast } from "react-toastify";

const validateClubBulkUpload = (worksheet: any) => {
  let { A1, B1, C1 } = worksheet;
  if (A1 && B1 && C1) {
    A1.v = "name";
    A1.w = "name";
    B1.v = "image";
    B1.w = "image";
    C1.v = "sport";
    C1.w = "sport";
  }
  const json: any = XLSX.utils.sheet_to_json(worksheet);

  let temp = [];
  let errorList = [];
  let wrongFile = false;
  for (let i = 0; i < json.length; i++) {
    const item: ClubBulkUploadItem = json[i];

    // Invoice amount check
    if (!item?.name) {
      // wrongFile = true;
      const err = `Name at row ${i + 2} is missing`;
      errorList.push(err);
    }

    // invoice Description check
    if (!item?.image) {
      // wrongFile = true;
      const err = `Image path at row ${i + 2} is missing`;
      errorList.push(err);
    }

    if (!item?.sport) {
      // wrongFile = true;
      const err = `Sport at row ${i + 2} is missing`;
      errorList.push(err);
    }

    temp.push(item);
  }
  return errorList;
};

const validateClubTeamBulkUpload = (worksheet: any) => {
  let { A1, B1, C1 } = worksheet;
  if (A1 && B1 && C1) {
    A1.v = "name";
    A1.w = "name";
    B1.v = "club";
    B1.w = "club";
  }
  const json: any = XLSX.utils.sheet_to_json(worksheet);

  let temp = [];
  let errorList = [];
  let wrongFile = false;
  for (let i = 0; i < json.length; i++) {
    const item: ClubBulkUploadItem = json[i];

    // Invoice amount check
    if (!item?.name) {
      // wrongFile = true;
      const err = `Name at row ${i + 2} is missing`;
      errorList.push(err);
    }

    // invoice Description check
    if (!item?.club) {
      // wrongFile = true;
      const err = `Club path at row ${i + 2} is missing`;
      errorList.push(err);
    }

    temp.push(item);
  }
  return errorList;
};
const validatePlayerPositionBulkUpload = (worksheet: any) => {
  let { A1, B1, C1, D1 } = worksheet;
  if (A1 && B1 && C1 && D1) {
    A1.v = "name";
    A1.w = "name";
    B1.v = "details";
    B1.w = "details";
    C1.v = "sport";
    C1.w = "sport";
    D1.v = "positionId";
    D1.w = "positionId";
  }
  const json: any = XLSX.utils.sheet_to_json(worksheet);

  let temp = [];
  let errorList = [];
  let wrongFile = false;
  for (let i = 0; i < json.length; i++) {
    const item: ClubBulkUploadItem = json[i];

    // Invoice amount check
    if (!item?.name) {
      // wrongFile = true;
      const err = `Name at row ${i + 2} is missing`;
      errorList.push(err);
    }

    // invoice Description check
    if (!item?.details) {
      // wrongFile = true;
      const err = `Details path at row ${i + 2} is missing`;
      errorList.push(err);
    }
    if (!item?.sport) {
      // wrongFile = true;
      const err = `Sport path at row ${i + 2} is missing`;
      errorList.push(err);
    }
    if (!item?.positionId) {
      // wrongFile = true;
      const err = `PositionId path at row ${i + 2} is missing`;
      errorList.push(err);
    }

    temp.push(item);
  }
  return errorList;
};

const buldUpload = async (
  type: string,
  formData: any,
  setBulkUploadLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setBulkUploadLoading(true);
  await axios
    .post(`${config.URL}/media/bulkUpload?type=${type}`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    .then(({ data }: any) => {
      setBulkUploadLoading(false);
      toast.success(data.message);
    })
    .catch(({ response }: any) => {
      toast.error(response.data.message);
      setBulkUploadLoading(false);
    });
};

export const readUploadFileCommon = async (
  e: any,
  inputRef: any,
  type: string,
  setBulkUploadLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  e.preventDefault();
  const selectedFile = inputRef.current;
  if (selectedFile && selectedFile.files && selectedFile.files.length > 0) {
    const formData = new FormData();
    formData.append("image", selectedFile.files[0]);
    console.log("formData", formData);

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      let worksheet = workbook.Sheets[sheetName];
      const stringified = JSON.stringify(worksheet);
      let parse = JSON.parse(stringified);
      let validationError: string[] = [];

      if (type === "club" || type === "league") {
        validationError = validateClubBulkUpload(parse);
      } else if (type === "team") {
        validationError = validateClubTeamBulkUpload(parse);
      } else if (type === "playerPosition") {
        validationError = validatePlayerPositionBulkUpload(parse);
      }

      if (validationError.length > 0) {
        for (let i = 0; i < validationError.length; i++) {
          const item = validationError[i];
          toast.error(item);
        }
      } else {
        buldUpload(type, formData, setBulkUploadLoading);
      }
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    };
    reader.readAsArrayBuffer(e.target.files[0]);
  }
};

export const downloadSampleFileCommon = (url: string) => {
  window.open(`${config.baseUrl}${url}`, "_blank");
};
