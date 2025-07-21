import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from 'axios';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import config from "@/config";
import { ToastContainer, toast } from "react-toastify";
import { Loader } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // New state for loading status
  const router = useRouter();
  const sfProDisplayStyle = {
    fontFamily: 'SF Pro Display, Arial, sans-serif',
    // Add other inline styles as needed
  };

  const reloadPage = (pageUrl: any) => {
    window.location.href = pageUrl
    window.location.reload()
  }

  const handleSignIn = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${config.URL}/admin/login`, {
        email,
        password,
      });
      if (response.data && response.data.accessToken) {
        const accessToken = response.data.accessToken;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("email", email);
        setLoading(false);
      } else {
        setLoading(false);
        toast.error(response.data.message);
      }
    } catch (error: any) {
      setLoading(false);
      toast.error("Invalid Credentials !");
    } finally {
      reloadPage('/admin/home')
      // Reset the form fields after the API call is complete
      setEmail("");
      setPassword("");
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="rounded-sm border border-white shadow-lg dark:bg-boxlight p-6 w-100">
        <h1 style={sfProDisplayStyle} className="text-2xl text-white mb-6 text-center">
          Sign In
        </h1>
        <h6 style={sfProDisplayStyle} className="text text-white mb-2 text-center">
          Please Login to your account
        </h6>
        <form>
          <div className="mb-4">
            <label style={sfProDisplayStyle} className="mb-2.5 block text-white">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                style={sfProDisplayStyle} className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 outline-gray-500 focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-gray-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-6">
            <label style={sfProDisplayStyle} className="mb-2.5 block text-white">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="6+ Characters, 1 Capital letter"
                style={sfProDisplayStyle} className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 outline-gray-500 focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-gray-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="absolute right-4 top-2.5 cursor-pointer" onClick={togglePasswordVisibility}>
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </span>
            </div>
          </div>
          <div className="mb-5">
            <button
              type="button"
              onClick={handleSignIn}
              style={sfProDisplayStyle} className="w-full h-10 cursor-pointer rounded-lg border border-primary text-white transition hover:bg-opacity-90 flex items-center justify-center"
              disabled={loading} // Disable the button when loading is true
            >
              {loading ? <Loader /> : "Sign In"}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};
export default Login;
