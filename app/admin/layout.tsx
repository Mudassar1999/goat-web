"use client";

import Footer from "@/components/Footer";
import Header from "@/components/AdminHeader";
import "../globals.css";
import "../../styles/index.css";
import { Providers } from "../providers";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../data-tables-css.css";
import "../satoshi.css";
import { useState, useEffect } from "react";
import Login from "../admin/Login";
import Sidebar from "@/components/Sidebar";
import { Loader } from "lucide-react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [Token, setToken] = useState<any>("");
  const router = useRouter();
  useEffect(() => {
    setLoading(true);
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      // router.push("/admin/home");
      setToken(storedToken);
    }
    setLoading(false);
  }, []);
  return (
    <div className="div">
      <div className="dark:bg-boxdark-2 dark:text-bodydark">
        {loading ? <div className="flex items-center justify-center h-screen"><Loader /></div> :
        Token ? (
          <div className="flex h-screen overflow-hidden">
            <Sidebar
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
            <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
              <Header
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
              <main>
                <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                  <Providers>{children}</Providers>
                </div>
              </main>
            </div>
          </div>
        ) : (
          <Login />
        )
        }
      </div>

      <ToastContainer />
    </div>
  );
}
