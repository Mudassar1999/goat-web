import { useRef, useEffect } from "react";
import "./Comment.scss";

function ClaimPopup({ onClose, children }: any) {

  const popupRef = useRef<any>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="fixed left-0 right-0 top-0 bottom-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
        <div
          id="authentication-modal"
          aria-hidden="true"
          className="flex justify-center relative max-h-full w-full"
        >
          <div
            className="Claim-popup-otr"
            ref={popupRef}
          >
            <div className="relative shadow Claim-popup-inner">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}
export default ClaimPopup;
