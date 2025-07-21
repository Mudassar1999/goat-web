"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "@/config";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography"; // Add this line
import {
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { toast } from "react-toastify";
const FeaturedDrills = () => {
  const [brandData, setBrandData] = useState<any>([]);
  const [Token, setToken] = useState<any>(localStorage.getItem("accessToken"));
  const sfProDisplayStyle = {
    fontFamily: "SF Pro Display, Arial, sans-serif",
    // Add other inline styles as needed
  };
  useEffect(() => {
    fetchDrills();
  }, []);

  useEffect(() => {
  }, [brandData]);

  const fetchDrills = () => {
    axios
      .get(`${config.URL}/journies/drill`, {
        headers: {
          Authorization: `Bearer ${Token}`, // Replace with your actual access token
        },
      })
      .then((response) => {
        setBrandData(response.data);
      })
      .catch((error) => {
        toast.error(error);
      });
  };
  const toggleFeatured = (drillId: any) => {
    const isFeatured = brandData.find(
      (drill: any) => drill.id === drillId
    ).isFeatured;
    axios
      .put(`${config.URL}/journies/featuredDrill/${drillId}`, null, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((response) => {
        setBrandData((prevData: any) => {
          return prevData.map((drill: any) => {
            if (drill.id === drillId) {
              return {
                ...drill,
                isFeatured: !isFeatured,
              };
            }
            return drill;
          });
        });
        toast.success(
          `Drill ${isFeatured ? "Unfeatured" : "Featured"} successfully`
        );
      })
      .catch((error) => {
        toast.error(
          `Error ${isFeatured ? "Unfeatured" : "Featured"} the drill`
        );
      });
  };
  return (
    <div
      className="grid grid-cols-1 gap-4 overflow-y-auto md:grid-cols-2 lg:grid-cols-3 max-h-screen"
      style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
    >
      {brandData.map((brand: any, index: any) => (
        <>
          {brand.isFeatured === true ? (
            <Card key={index} className="mb-4">
              {/* <CardHeader title={brand.title} className="text-[12px]"/> */}
              <div className="flex items-center justify-center p-1 xl:p-0">
                {brand.drillUrl ? (
                  <video
                    style={{ width: "400px", height: "200px" }}
                    src={`${config.baseUrl}${brand.drillUrl}`}
                    controls
                    className="object-fit"
                  />
                ) : (
                  <span></span>
                )}
              </div>
              <CardContent>
                <span className="text-xl font-bold">{brand.title}</span> <br/>
                <span>{brand.description}</span>
                <p>
                  <b>Category Name: </b>
                  {brand.category.name}
                </p>
                <p className="mb-2">
                  <b>Drill Duration: </b>
                  {brand.drillDuration.toFixed(1)}s
                </p>
                <b>Objectives: </b>
                <div className="p-1 xl:p-0">
                  {brand.objectives && brand.objectives.length > 0 ? (
                    brand.objectives.map(
                      (objective: any, objectiveIndex: any) => (
                        <div key={objective.id}>
                          <p
                            style={sfProDisplayStyle}
                            className="hidden text-sm text-black sm:block"
                          >
                            {objectiveIndex + 1}.{` ${objective.description}`}
                          </p>
                          {objectiveIndex !== brand.objectives.length - 1}
                        </div>
                      )
                    )
                  ) : (
                    <span></span>
                  )}
                </div>
              </CardContent>
              <CardActions className="flex justify-end">
                <Typography
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  Feature Drill
                </Typography>

                <Switch
                  checked={brand.isFeatured}
                  onChange={() => toggleFeatured(brand.id)}
                  color="primary"
                  inputProps={{ "aria-label": "toggle featured" }}
                />
              </CardActions>
            </Card>
          ) : null}
        </>
      ))}
    </div>
  );
};
export default FeaturedDrills;
