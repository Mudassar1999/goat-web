"use client";
import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import config from "@/config";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../Loader/Loader";
import AddIcon from "@mui/icons-material/Add";
import Switch from "@mui/material/Switch";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TablePagination,
} from "@mui/material";
import Typography from "@mui/material/Typography"; // Add this line
import { Card, CardContent, CardActions, CardHeader } from "@mui/material";
import { Plus, Trash2Icon } from "lucide-react";
import AdminPopup from "../shared/AdminPopup";

const Drills = () => {
  const [brandData, setBrandData] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState<any>(false);
  const [editedDrill, setEditedDrill] = useState<any>(null);
  const [categoryData, setCategoryData] = useState<any>([]);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState<any>(false);
  const [recordToDelete, setRecordToDelete] = useState<any>(null);
  const initialDrillsData = {
    title: "",
    description: "",
    drillUrl: null,
    drillDuration: null,
    thumbnailPath: null,
    gifPath: null,
    categoryId: null,
    drillBannerForMobile: null,
    drillBannerForWeb: null,
    sportIds: [],
    playerPositionsIds: [],
    minAge: null,
    maxAge: null,
    objectives: [{ description: "" }], // Initialize with an empty objective
  };
  const sfProDisplayStyle = {
    fontFamily: "SF Pro Display, Arial, sans-serif",
    // Add other inline styles as needed
  };
  const [newDrill, setNewDrill] = useState<any>({ ...initialDrillsData });
  const [isSportSelected, setIsSportSelected] = useState(false);
  const [positionData, setPositionData] = useState<any>([]);
  const [initiallySelectedPositions, setInitiallySelectedPositions] =
    useState<any>([]);
  const [sportData, setSportData] = useState<any>([]);
  const [videoData, setVideoData] = useState<any>(null);
  const [imageUploading, setImageUploading] = useState<any>(false);
  const [imageUploading2, setImageUploading2] = useState<any>(false);
  const [Token, setToken] = useState<any>(localStorage.getItem("accessToken"));
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [counts, setCounts] = useState(0);

  const fetchSport = () => {
    axios
      .get(`${config.URL}/sports/admin`, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((response) => {
        setSportData(response.data);
      })
      .catch((error) => {
        toast.error("Error Fetching Sports Data");
      });
  };

  const openModal = () => {
    setIsModalOpen(true);
    setEditedDrill(null);
    setNewDrill({ ...initialDrillsData });
  };

  const handleEdit = (Dominance: any) => {
    setIsModalOpen(true);
    setEditedDrill(Dominance);
    const playerPositionsIds = Dominance.playerPositions.map(
      (position: any) => position.playerPosition.id
    );

    setInitiallySelectedPositions(playerPositionsIds || []);

    setNewDrill({
      id: Dominance.id,
      title: Dominance.title,
      description: Dominance.description,
      drillUrl: Dominance.drillUrl,
      drillDuration: Dominance.drillDuration,
      thumbnailUrl: Dominance.thumbnailUrl,
      gifPath: Dominance.gifUrl,
      categoryId: Dominance.categoryId,
      isFeatured: Dominance.isFeatured,
      sportId: Dominance.sportId,
      createdAt: Dominance.createdAt,
      updatedAt: Dominance.updatedAt,
      category: Dominance.category,
      sport: Dominance.sport,
      sportIds: [Dominance.sportId],
      playerPositionsIds: playerPositionsIds,
      minAge: Dominance.minAge,
      maxAge: Dominance.maxAge,
      objectives: Dominance.objectives.map((objective: any) => ({
        description: objective.description,
      })),
    });

    // setNewDrill({ ...Dominance });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditedDrill(null);
    setNewDrill({ ...initialDrillsData });
  };

  const fetchDrills = () => {
    axios
      .get(
        `${config.URL}/journies/drill/updated?limit=${rowsPerPage}&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      )
      .then(({ data }) => {
        setBrandData(data.results);
        setCounts(data.totalResults);
      })
      .catch((error) => {
        toast.error("Error Fetching Drills Data");
      });
  };

  const fetchCategory = () => {
    axios
      .get(`${config.URL}/journies/category`, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((response) => {
        setCategoryData(response.data);
      })
      .catch((error) => {
        toast.error("Error Fetching Categories Data");
      });
  };

  const uploadVedio = async (img: any, e: any) => {
    if (parseInt(newDrill.maxAge) < parseInt(newDrill.minAge)) {
      toast.error("Max age should be greater than min age");
      e.preventDefault();
      return;
    }
    setImageUploading(true);
    let data = new FormData();
    data.append("drill-video", img);
    try {
      const response = await axios.post(
        `${config.URL}/journies/drill/video`,
        data,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      // setNewDrill({
      //   ...newDrill,
      //   drillUrl: response.data.videoPath,
      //   thumbnailPath: response.data.thumbnailPath,
      //   gifPath: response.data.gifPath,
      //   drillDuration: response.data.drillDuration,
      // });
      // return Promise.resolve(response.data)
      return new Promise((resolve) => {
        setNewDrill((prevNewDrill: any) => ({
          ...prevNewDrill,
          drillUrl: response.data.videoPath,
          // thumbnailPath: response.data.thumbnailPath,
          // gifPath: response.data.gifPath,
          drillDuration: response.data.drillDuration,
        }));
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Error uploading image");
    } finally {
      setImageUploading(false);
    }
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

  const saveDrill = (videoPath: string, drillDuration: any) => {
    // Correct the structure of the objectives array
    const objectivesArray =
      newDrill.objectives?.map((obj: any) => ({
        description: obj.description,
      })) || [];
    const data = {
      categoryId: parseInt(newDrill.categoryId),
      title: newDrill.title,
      description: newDrill.description,
      drillDuration: parseInt(drillDuration),
      drillUrl: videoPath,
      gifUrl: newDrill.gifPath,
      drillBannerForMobile: newDrill.drillBannerForMobile,
      drillBannerForWeb: newDrill.drillBannerForWeb,
      thumbnailUrl: newDrill.thumbnailPath,
      objectives: objectivesArray,
      minAge: parseInt(newDrill.minAge),
      maxAge: parseInt(newDrill.maxAge),
      sportId: parseInt(newDrill.sportId),
      playerPositionsIds: newDrill.playerPositionsIds,
    };
    axios
      .post(`${config.URL}/journies/drill`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((response) => {
        fetchDrills();
        closeModal();

        toast.success("Drill Added Successfully");
      })
      .catch((error) => {
        toast.error("Error Adding Drill");
      });
  };

  const editDrill = (e: any) => {
    const objectivesArray =
      newDrill.objectives?.map((obj: any) => ({
        description: obj.description,
      })) || [];
    e.preventDefault();

    const data = {
      title: newDrill.title,
      description: newDrill.description,
      objectives: objectivesArray,
      minAge: parseInt(newDrill.minAge),
      maxAge: parseInt(newDrill.maxAge),
      playerPositionsIds: newDrill.playerPositionsIds,
      drillDuration: parseInt(newDrill.drillDuration),
      drillUrl: newDrill.drillUrl,
      gifUrl: newDrill.gifPath,
      thumbnailUrl: newDrill.thumbnailPath,
    };

    axios
      .put(`${config.URL}/journies/drill/${editedDrill.id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((response) => {
        fetchDrills();
        closeModal();
        toast.success("Drill Updated Successfully");
      })
      .catch((error) => {
        toast.error("Something went wrong!");
      });
  };

  const openDeleteConfirmation = (record: any) => {
    setIsDeleteConfirmationOpen(true);
    setRecordToDelete(record);
  };

  const closeDeleteConfirmation = () => {
    setIsDeleteConfirmationOpen(false);
    setRecordToDelete(null);
  };

  const handleDelete = (id: any) => {
    if (isDeleteConfirmationOpen && recordToDelete) {
      axios
        .delete(`${config.URL}/journies/drill/${id}`, {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        })
        .then((response) => {
          fetchDrills();
          closeDeleteConfirmation();
          toast.success("Drill Deleted Successfully");
        })
        .catch((error) => {
          toast.error("Something went wrong!");
        });
    }
  };

  const handleObjectiveChange = (index: number, value: string) => {
    const updatedObjectives = [...newDrill.objectives];
    updatedObjectives[index].description = value;
    setNewDrill({
      ...newDrill,
      objectives: updatedObjectives,
    });
  };

  const handleAddObjective = () => {
    setNewDrill({
      ...newDrill,
      objectives: [...newDrill.objectives, { description: "" }],
    });
  };

  const handleRemoveObjective = (index: number) => {
    const updatedObjectives = [...newDrill.objectives];
    updatedObjectives.splice(index, 1);
    setNewDrill({
      ...newDrill,
      objectives: updatedObjectives,
    });
  };

  const fetchPosition = (selectedSportId: any) => {
    axios
      .get(`${config.URL}/playerPositions/bySportId/${selectedSportId}`, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((response) => {
        setPositionData(response.data);
      })
      .catch((error) => {
        toast.error("Error Fetching Player Positions Data");
      });
  };

  const handleSportChange = (selectedSportId: any) => {
    setIsSportSelected(!!selectedSportId);
    fetchPosition(selectedSportId);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await uploadVedio(videoData, e).then((res: any) => {
        const { videoPath, drillDuration } = res;
        if (editedDrill) {
          newDrill.drillUrl = videoPath;
          newDrill.drillDuration = drillDuration;
          editDrill(e);
        } else saveDrill(videoPath, drillDuration);
      });
    } catch (error) {
      console.error("Error uploading video", error);
    }
  };

  // useEffect(() => {
  //   if (
  //     newDrill.drillUrl &&
  //     // newDrill.thumbnailPath &&
  //     // newDrill.gifPath &&
  //     newDrill.drillDuration
  //   ) {
  //     const eventObject = {
  //       preventDefault: () => {}, // Provide a minimal preventDefault method
  //     };

  //     editedDrill ? editDrill(eventObject) : saveDrill();
  //   }
  // }, [newDrill]);

  useEffect(() => {
    if (newDrill.sportId) {
      fetchPosition(newDrill.sportId);
    }
  }, [editedDrill]);

  useEffect(() => {
    fetchDrills();
    fetchCategory();
    fetchSport();
  }, [page, rowsPerPage]);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(1);
  };

  const uploadImage = async (img: any, type: string, name: string) => {
    // Set the loading state to true when image upload begins
    setImageUploading2(true);
    let data = new FormData();
    data.append("image", img);
    try {
      const response = await axios.post(
        `${config.URL}/journies/drill/banner?type=${type}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      // Set the image after a successful upload
      setNewDrill((newDrill: any) => ({
        ...newDrill,
        [name]: response.data.bannerUrl,
      }));
    } catch (error) {
      toast.error("Error uploading image");
    } finally {
      setImageUploading2(false);
    }
  };
  return (
    <>
      <button
        onClick={openModal}
        style={{
          ...sfProDisplayStyle,
          padding: "px-4 py-2",
          borderRadius: "rounded",
          transition: "border-color 0.3s, color 0.3s",
        }}
        className="mb-4 rounded border border-white bg-white px-4 py-2 text-black hover:border-white hover:bg-transparent hover:text-white"
      >
        <AddIcon /> Add Drill
      </button>
      <div className="flex justify-end pb-2 ">
        <TablePagination
          component="div"
          rowsPerPageOptions={[25, 50, 100, 500, 1000]}
          count={counts}
          page={page - 1}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ backgroundColor: "#fff" }}
          className="rounded-full"
        />
      </div>

      <div
        className="grid grid-cols-1 gap-4 overflow-y-auto md:grid-cols-2 lg:grid-cols-3 overflow-y-auto max-h-screen"
        style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
      >
        {brandData.map((brand: any, index: any) => (
          <Card key={index} className="mb-4">
            {/* <CardHeader title={brand.title} /> */}
            <div className="justify-centerp-1 flex items-center xl:p-0">
              {brand.drillUrl ? (
                <video
                  style={{ width: "400px", height: "200px" }}
                  src={`${config.baseUrl}${brand.drillUrl}`}
                  controls
                />
              ) : (
                <span></span>
              )}
            </div>
            <CardContent>
              <span className="text-xl font-bold">{brand.title}</span> <br />
              <span>{brand.description}</span>
              <p className="mt-2">
                <b>Category Name: </b>
                {brand.category.name}
              </p>
              <p>
                <b>Drill Duration: </b>
                {brand.drillDuration.toFixed(1)}s
              </p>
              <p>
                <b>Min Age: </b>
                {brand.minAge}
              </p>
              <p>
                <b>Max Age: </b>
                {brand.maxAge}
              </p>
              <p>
                <b>Selected Sport: </b>
                {brand?.sport?.name}
              </p>
              <p className="mb-2">
                <b>Selected Positions: </b>
                {brand.playerPositions
                  .map((pos: any) => pos.playerPosition.name)
                  .join(", ")}
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
                          {objectiveIndex + 1}.{objective.description}
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

            <CardActions className="flex justify-between">
              <div>
                <IconButton
                  title="Edit"
                  onClick={() => handleEdit(brand)}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  title="Delete"
                  onClick={() => openDeleteConfirmation(brand)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </div>

              <div className="flex items-center gap-2">
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
              </div>
            </CardActions>
          </Card>
        ))}

        <AdminPopup
          isModalOpen={isModalOpen}
          closeViewModal={closeModal}
          title={editedDrill ? "Edit Drill" : "Add Drill"}
        >
          <form onSubmit={editedDrill && !videoData ? editDrill : handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                style={sfProDisplayStyle}
                className="text-sm text-gray-700"
              >
                Title
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newDrill.title}
                onChange={(e) =>
                  setNewDrill({ ...newDrill, title: e.target.value })
                }
                required
                className="mt-1 block w-full rounded-md border border-gray-300 bg-transparent p-2 text-black sm:text-sm"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="name"
                style={sfProDisplayStyle}
                className="text-sm text-gray-700"
              >
                Description
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newDrill.description}
                onChange={(e) =>
                  setNewDrill({
                    ...newDrill,
                    description: e.target.value,
                  })
                }
                required
                className="mt-1 block w-full rounded-md border border-gray-300 bg-transparent p-2 text-black sm:text-sm"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="name"
                style={sfProDisplayStyle}
                className="text-sm text-gray-700"
              >
                Min Age
              </label>
              <input
                type="number"
                id="minAge"
                name="minAge"
                value={newDrill.minAge}
                onChange={(e) =>
                  setNewDrill({ ...newDrill, minAge: e.target.value })
                }
                required
                className="mt-1 block w-full rounded-md border border-gray-300 bg-transparent p-2 text-black sm:text-sm"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="name"
                style={sfProDisplayStyle}
                className="text-sm text-gray-700"
              >
                Max Age
              </label>
              <input
                type="number"
                id="maxAge"
                name="maxAge"
                value={newDrill.maxAge}
                onChange={(e) => {
                  setNewDrill({ ...newDrill, maxAge: e.target.value });
                }}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 bg-transparent p-2 text-black sm:text-sm"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="sportId"
                style={sfProDisplayStyle}
                className="block text-sm text-gray-700"
              >
                Sport Name
              </label>
              <select
                id="sportId"
                name="sportId"
                value={newDrill.sportId}
                onChange={(e) => {
                  setNewDrill({ ...newDrill, sportId: e.target.value });
                  handleSportChange(e.target.value); // Call API on sport change
                }}
                required
                disabled={editedDrill ? true : false}
                className="mt-1 p-2 block w-full sm:text-sm text-black bg-transparent border border-gray-300 rounded-md"
              >
                <option value="">Select a Sport</option>
                {sportData.map((sport: any) => (
                  <option key={sport.id} value={sport.id}>
                    {sport.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <>
                {" "}
                <label
                  htmlFor="positionId"
                  style={sfProDisplayStyle}
                  className="text-sm text-gray-700"
                >
                  Position Name
                </label>
                <FormControl fullWidth>
                  <InputLabel id="positionId-label"></InputLabel>
                  <Select
                    labelId="positionId-label"
                    id="positionId"
                    name="positionId"
                    value={newDrill.playerPositionsIds || []}
                    onChange={(e: any) =>
                      setNewDrill({
                        ...newDrill,
                        playerPositionsIds: e.target.value,
                      })
                    }
                    required
                    multiple
                    disabled={
                      editedDrill ? false : newDrill.sportId ? false : true
                    }
                    renderValue={(selected: any) =>
                      selected
                        .map((positionId: any) => {
                          const selectedPosition = positionData.find(
                            (pos: any) => pos.id === positionId
                          );
                          return selectedPosition ? selectedPosition.name : "";
                        })
                        .join(", ")
                    }
                  >
                    {editedDrill
                      ? positionData.map((pos: any) => (
                          <MenuItem
                            key={pos.id}
                            value={pos.id}
                            disabled={initiallySelectedPositions.includes(
                              pos.id
                            )}
                          >
                            {pos.name}
                          </MenuItem>
                        ))
                      : positionData.map((pos: any) => (
                          <MenuItem key={pos.id} value={pos.id}>
                            {pos.name}
                          </MenuItem>
                        ))}
                  </Select>
                </FormControl>
              </>
            </div>

            <div className="mb-4">
              {newDrill.objectives.map((objective: any, index: any) => (
                <div key={index} className="mb-4">
                  <label
                    htmlFor={`objective-${index}`}
                    className="text-sm text-gray-700"
                  >
                    Objective
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id={`objective-${index}`}
                      name={`objective-${index}`}
                      value={objective.description}
                      onChange={(e) =>
                        handleObjectiveChange(index, e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-transparent p-2 text-black sm:text-sm"
                    />
                    {newDrill.objectives.length > 1 &&
                      index !== newDrill.objectives.length - 1 && (
                        <div
                          className="pl-2 flex justify-center items-center text-white rounded-md cursor-pointer"
                          onClick={() => handleRemoveObjective(index)}
                        >
                          <Trash2Icon color="red" />
                        </div>
                      )}
                    {index === newDrill.objectives.length - 1 && (
                      <div
                        className="pl-2 flex justify-center items-center text-white rounded-md cursor-pointer"
                        onClick={handleAddObjective}
                      >
                        <Plus color="#333" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {editedDrill ? null : (
              <>
                <div className="mb-4">
                  <label
                    htmlFor="categoryId"
                    style={sfProDisplayStyle}
                    className="block text-sm text-gray-700"
                  >
                    Category Name
                  </label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={newDrill.categoryId}
                    onChange={(e) =>
                      setNewDrill({
                        ...newDrill,
                        categoryId: e.target.value,
                      })
                    }
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-transparent p-2 text-black sm:text-sm"
                  >
                    <option value="">Select a Category </option>
                    {categoryData.map((club: any) => (
                      <option key={club.id} value={club.id}>
                        {club.name}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div className="mb-4">
              <label
                htmlFor="image"
                style={sfProDisplayStyle}
                className="block text-sm text-gray-700"
              >
                Video
              </label>
              <input type="hidden" id="image" name="image" />
              <input
                type="file"
                id="flag"
                name="flag"
                onChange={(e: any) => {
                  // uploadVedio(e.target.files[0]);
                  setVideoData(e.target.files[0]);
                }}
                accept="video/*"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-transparent p-2 text-black sm:text-sm"
              />
              {imageUploading && (
                <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-white opacity-50">
                  <Loader />
                </div>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="image"
                style={sfProDisplayStyle}
                className="block text-sm text-gray-700"
              >
                Web Thumbnail
              </label>
              <input type="hidden" id="image" name="image" />
              <input
                type="file"
                id="flag"
                name="flag"
                onChange={(e: any) => {
                  // uploadVedio(e.target.files[0]);
                  uploadImage(
                    e.target.files[0],
                    "webBanner",
                    "drillBannerForWeb"
                  );
                }}
                accept="image/*"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-transparent p-2 text-black sm:text-sm"
              />
              {imageUploading && (
                <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-white opacity-50">
                  <Loader />
                </div>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="image"
                style={sfProDisplayStyle}
                className="block text-sm text-gray-700"
              >
                Mobile Thumbnail
              </label>
              <input type="hidden" id="image" name="image" />
              <input
                type="file"
                id="flag"
                name="flag"
                onChange={(e: any) => {
                  uploadImage(
                    e.target.files[0],
                    "webBanner",
                    "drillBannerForMobile"
                  );
                }}
                accept="image/*"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-transparent p-2 text-black sm:text-sm"
              />
              {imageUploading && (
                <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-white opacity-50">
                  <Loader />
                </div>
              )}
            </div>

            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                style={sfProDisplayStyle}
                className="hover-bg-blue-700 sm-text-sm inline-flex w-full justify-center rounded-md border border-transparent bg-black px-4 py-2 text-base text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto"
              >
                {editedDrill ? "Update" : "Save"}
              </button>
              <button
                type="button"
                style={sfProDisplayStyle}
                className="hover-bg-gray-50 sm-text-sm mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </form>
        </AdminPopup>

        <AdminPopup
          isModalOpen={isDeleteConfirmationOpen}
          closeViewModal={closeDeleteConfirmation}
          title={"Confirm Deletion"}
        >
          <p style={{ color: "black" }}>
            Are you sure you want to delete this drill?
          </p>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              style={sfProDisplayStyle}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#FF453A] text-base text-white hover-bg-[#FF453A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm-text-sm"
              onClick={() => handleDelete(recordToDelete.id)}
            >
              Delete
            </button>
            <button
              type="button"
              style={sfProDisplayStyle}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base text-gray-700 hover-bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm-text-sm"
              onClick={closeDeleteConfirmation}
            >
              Cancel
            </button>
          </div>
        </AdminPopup>

        <ToastContainer />
      </div>
    </>
  );
};
export default Drills;
