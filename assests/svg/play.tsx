import React from 'react'

interface clockProps {
  color?: string
}

function PlaySVG({color}: clockProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={11} height={14} viewBox="0 0 11 14">
    <title>{"play_arrow"}</title>
    <g fill="none" fillRule="evenodd">
      <path d="M-7-5h24v24H-7z" />
      <path
        fill={`${color ? color : '#1D1D1D'}`}
        d="M0 1.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18a1 1 0 0 0 0-1.69L1.54.98A.998.998 0 0 0 0 1.82Z"
      />
    </g>
  </svg>
  )
}

export default PlaySVG