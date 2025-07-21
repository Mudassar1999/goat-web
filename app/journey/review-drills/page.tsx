"use client";
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Header from '@/components/Header'
import ReviewDrillsList from '../components/reviewDrillsList'
import Footer from "@/components/Footer";

function ReviewPlayerDrills() {

  return (
    <>
      <Header />
      <div className="journeyContainer">
        <ReviewDrillsList />
      </div>
      <Footer />
    </>
  );
}

export default ReviewPlayerDrills;
