"use client";
import { useState } from "react";
import Header from "@/components/Header";
import ProtectedRoutes from "../ProtectedRoutes";
import SearchTabs from "./components/SearchTab";


function SearchPosts() {
     const [videoPostStatus, setVideoPostStatus] = useState("");

     return (
          <>
               <Header setVideoPostStatus={setVideoPostStatus} />
               <SearchTabs />
          </>
     );
}
export default ProtectedRoutes(SearchPosts);
