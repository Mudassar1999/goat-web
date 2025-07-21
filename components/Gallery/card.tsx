import { Delete, Visibility } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React from "react";

interface CardProps {
  imageUrl: string;
  type: string;
  onDelete: (url: string, type: string) => void;
  onView: () => void;
}

const GalleryCard: React.FC<CardProps> = ({
  imageUrl,
  type,
  onDelete,
  onView,
}) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg m-4">
      <img className="image-size" src={imageUrl} alt="Card" />
      <div className="px-6 py-4">
        <div className="flex justify-between">
          <IconButton onClick={() => onDelete(imageUrl, type)}>
            <Delete color="error" />
          </IconButton>

          <IconButton onClick={onView}>
            <Visibility color="info" />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default GalleryCard;
