// Modal.tsx

import config from "@/config";
import React from "react";

interface ModalProps {
  imageUrl: string;
  isOpen: string;
  setIsOpen: React.Dispatch<React.SetStateAction<string>>;
}

const ImagePreviewModal: React.FC<ModalProps> = ({
  imageUrl,
  setIsOpen,
  isOpen,
}) => {
  return (
    <div className="relative">
      {/* Trigger button */}
      {/* Modal */}
      {isOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="relative bg-white rounded-lg p-12">
            {/* Close button */}
            <button
              onClick={() => setIsOpen("")}
              className="absolute top-0 right-0 mt-4 mr-4"
            >
              <svg
                className="h-6 w-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>

            {/* Image */}
            <img
              src={`${config.baseUrl}${imageUrl}`}
              alt="Image"
              className="h-96 rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePreviewModal;
