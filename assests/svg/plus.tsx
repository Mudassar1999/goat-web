import React from "react";

interface PlusIconProps {
  fillColor?: string;
  height?: number;
  width?: number;
}

function PlusIcon({ fillColor, height, width }: PlusIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width ? width : 15}
      height={height ? height : 15}
      fill="none"
      viewBox="0 0 12 11"
    >
      <path
        fill={fillColor ? fillColor : "#163300"}
        d="M.63 5.417c0-.45.374-.819.819-.819H5.18V.866c0-.445.368-.82.819-.82.45 0 .819.375.819.82v3.732h3.732a.82.82 0 0 1 .82.819.82.82 0 0 1-.82.819H6.82v3.732a.82.82 0 0 1-.819.82.82.82 0 0 1-.819-.82V6.236H1.45a.825.825 0 0 1-.82-.819Z"
      />
    </svg>
  );
}

export default PlusIcon;
