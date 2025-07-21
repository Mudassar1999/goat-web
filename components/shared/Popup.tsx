function Popup({ isOpen, onClose, children, width }: any) {
  return (
    <>
      <div className="fixed left-0 right-0 top-0 bottom-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
        <div
          id="authentication-modal"
          aria-hidden="true"
          className="flex justify-center relative max-h-full w-full"
        >
          <div
            className="popup-otr"
            // className={`relative max-h-full ${width ? `w-full lg:w-${width}` : "w-full max-w-md"
            //   }`}
          >
            <div className="relative shadow popup-inner">
              <button
                type="button"
                className="w-[37px] h-[37px] absolute right-[16px] top-[16px] ml-auto inline-flex  items-center justify-center rounded-full close-popup z-10"
                data-modal-hide="authentication-modal"
                onClick={onClose}
              >
                <svg
                  className="h-3 w-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Popup;
