import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ProtectedRoutes = (WrappedComponent: any) => {
  const Wrapper = (props: any) => {
    const router = useRouter();
    const isAuthenticated =
      typeof window !== "undefined" && localStorage.getItem("access_token");

    useEffect(() => {
      if (!isAuthenticated) {
        router.push("/signin");
      }
    }, []);
    // if (!isAuthenticated) {
    //   return null;
    // }

    return <WrappedComponent {...props} />;
  };
  return Wrapper;
};

export default ProtectedRoutes;
