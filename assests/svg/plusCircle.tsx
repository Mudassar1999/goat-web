import React from 'react'

interface clockProps {
     color?: string
   }

function PlusCircleIcon({color}: clockProps) {
     return (
          <svg
               xmlns="http://www.w3.org/2000/svg"
               xmlSpace="preserve"
               viewBox="0 0 122.879 122.879"
               width={28}
               height={28}
          >
               <path
                    fill="#9FE870"
                    fillRule="evenodd"
                    d="M104.885 17.995c23.993 23.994 23.993 62.896 0 86.89-23.994 23.993-62.896 23.993-86.89 0-23.993-23.994-23.993-62.896 0-86.89 23.994-23.993 62.896-23.993 86.89 0zM93.607 57.949a3.49 3.49 0 1 1 0 6.98H64.93v28.678a3.49 3.49 0 1 1-6.979 0V64.93H29.272a3.49 3.49 0 1 1 0-6.98H57.95V29.271a3.49 3.49 0 0 1 6.979 0v28.678h28.678z"
                    clipRule="evenodd"
               />
          </svg>
     )
}

export default PlusCircleIcon