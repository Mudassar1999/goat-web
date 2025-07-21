"use client";
import React, { useEffect, useState } from 'react';
import { Metadata } from "next";
import Login from './Login';
import Home from './home/page';


export default function Page() {
  const [Token, setToken] = useState<any>("");

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setToken(storedToken);
    }
  },[])

  return (
    !Token ?
    <Login /> : 
    <Home />
  );
}
