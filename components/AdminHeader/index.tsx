import React from "react";
import Link from "next/link";
import Image from "next/image";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import DropdownNotification from "./DropdownNotification";
import DropdownUser from "./DropdownUser";
const sfProDisplayStyle = {
  fontFamily: 'SF Pro Display, Arial, sans-serif',
  // Add other inline styles as needed
};
const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-0 shadow-2 md:px-6 2xl:px-11">
        <div className="z-10 flex items-center gap-2 sm:gap-4 lg:hidden"> {/* Add z-10 class */}
          {/* Material-UI Hamburger Toggle */}
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-99999"
          >
            <MenuIcon />
          </IconButton>
          {/* Material-UI Hamburger Toggle */}
          <Link className="block flex-shrink-0 lg:hidden" href="/">
            <Image
              width={32}
              height={32}
              src={"/images/logo/logo-icon.svg"}
              alt="Logo"
            />
          </Link>
        </div>
        <div className="hidden sm:block">
          <p style={sfProDisplayStyle} className="text-black ml-1">Welcome To Goat Admin </p>
        </div>
        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            <DropdownNotification />
          </ul>
          <DropdownUser />
        </div>
      </div>
    </header>
  );
};

export default Header;
