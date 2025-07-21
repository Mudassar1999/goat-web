import React from 'react'

interface clockProps {
  color?: string
}

function ClockSVG({ color }: clockProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={13}
      height={13}
      fill="none"
      viewBox="0 0 13 13"
    >
      <path
        fill="#EBEBF5"
        fillOpacity={0.6}
        d="M6.475 12.95C2.939 12.95 0 10.01 0 6.474 0 2.933 2.933 0 6.468 0c3.542 0 6.481 2.933 6.481 6.475 0 3.535-2.932 6.474-6.474 6.474Zm0-1.08c2.996 0 5.395-2.4 5.395-5.395a5.38 5.38 0 0 0-5.402-5.396 5.364 5.364 0 0 0-5.383 5.396 5.37 5.37 0 0 0 5.39 5.395Zm-3.32-4.71a.434.434 0 0 1-.445-.444c0-.248.19-.438.445-.438H6.03v-3.84A.43.43 0 0 1 6.468 2c.248 0 .445.19.445.438v4.278a.438.438 0 0 1-.445.444H3.155Z"
      />
    </svg>
  )
}

export default ClockSVG