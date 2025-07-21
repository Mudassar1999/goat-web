import { useEffect, useState } from "react";
import RadioInput from "../../../../components/ui/radioInput";
import AuthButton from "@/components/Button/AuthButton";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useApiRequest from "@/custom_hooks/useGetApiRequest";
import Loading from "react-loading";
import { searchDocument } from "@/utils/searchFirebaseDocu";

import "./AllComponent.scss";

interface responseType {
  id: number;
  name: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}
const SelectRole = ({
  setCurrentStep,
  signupFormState,
  setSignupFormState,
}: any) => {
  // const { responseData, loading, fetchData: fetchRoles } = useApiRequest();
  const [responseData, setResponseData] = useState<responseType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [checkValidation, setCheckValidation] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (signupFormState?.email) {
      searchDocument("email", signupFormState.email)
        .then((isRegistered: boolean) => {
          if (isRegistered) {
            toast.warning("Already registered!");
            router.push(`/signin`);
            return;
          }
        })
        .catch((error: any) => {
          console.error("Error during document search:", error);
        });
    }

    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/roles`
      );
      setResponseData(
        response.data.sort((a: responseType, b: responseType) => a.id - b.id)
      );
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const Continue = () => {
    setCheckValidation(true);
    if (signupFormState.roleId !== null) {
      setCurrentStep(3);
    }
  };

  const selectRoleHandler = (role: number) => {
    setSignupFormState((prevState: any) => ({
      ...prevState,
      roleId: role,
    }));
  };
  return (
    <div className="main-select-role">
      <h3 className="heading-bold heading-select-role">What's your role?</h3>
      <p className="desc desc-select-role">
        This helps us personalize your experience.
      </p>
      {loading ? (
        <div className="flex items-center justify-center">
          <Loading type="spin" color="#747474" />
        </div>
      ) : (
        <div className="">
          {responseData.map((item: responseType) => (
            <RadioInput
              key={item.id}
              label={item.name}
              value={item.id}
              checked={signupFormState.roleId === item.id}
              onChange={() => selectRoleHandler(item.id)}
            />
          ))}
        </div>
      )}
      {checkValidation && signupFormState.roleId === null && (
        <p className="mb-2 alret-text text-[#FF453A]">Please select role</p>
      )}
      <AuthButton onClick={Continue} />
    </div>
  );
};

export { SelectRole };
