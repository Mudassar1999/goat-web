// OffCanvasMenu.js
import React from 'react';
import "./Navbar.scss"

const OffCanvasMenu = ({ isOpen, onClose, children }: any) => {
     return (
          <div className={`off-canvas-menu ${isOpen ? 'open' : ''}`}>
               <div className="menu-content">
                    <button className="close-button" onClick={onClose}>
                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-x-circle"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>
                    </button>
                    {children}
               </div>
          </div>
     );
};

export default OffCanvasMenu;