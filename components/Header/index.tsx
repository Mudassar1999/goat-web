"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useEffect, useState } from "react";
import menuData from "./menuData";
import { usePathname, useRouter } from "next/navigation";
import { Images } from "@/public/Images";
import Notifications from "../Notifications/Notifications";
import { getSearchPosts } from "@/api/search/search";
import { usePosts } from "@/providers/PostsProvider";
import "./Navbar.scss";
import OffCanvasMenu from "./oofcanvas";
import { IoSettings } from "react-icons/io5";
import axios from "axios";
import { useGoatDrill } from "@/providers/GoatDrillsProvider";
import { useSearch } from "@/providers/SearchProvider";
import { useSearchTab } from "@/providers/SearchTabProvider";

const Header = ({
  setVideoPostStatus,
  setCurrentTab,
}: any) => {
  const pathname = usePathname();
  const router = useRouter();
  const { posts, setPosts } = usePosts();
  const { setUserSearch, setReelsSearch, searchValue, setSearchValue, setSearchLoading } = useSearch()
  const { setGoatDrill } = useGoatDrill()
  const { searchTab, setSearchTab } = useSearchTab();
  // Navbar toggle
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<any>("");
  const [userInformation, setUserInformation] = useState<any>({});
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [notificationCount, setNotificationCount] = useState<number | any>(0);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<any>(null);

  const handleMenuToggle = () => {
    setMenuOpen(!isMenuOpen);
  };

  const notificationRef = useRef<any>(null);
  let timeoutId: any;

  const [logoutPopup, setLogoutPopup] = useState<boolean>(false);


  // Sticky Navbar
  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
  });

  // submenu handler
  const [openIndex, setOpenIndex] = useState(-1);
  const handleSubmenu = (index: any) => {
    if (openIndex === index) {
      setOpenIndex(-1);
    } else {
      setOpenIndex(index);
    }
  };

  const handleInputFocus = async () => {
    if (searchValue !== "") {
      let pageType = "usersPage";
      const searchResult = await getSearchPosts(1, searchValue, pageType);
      setUserSearch(searchResult?.usersPagination)
      setReelsSearch(searchResult?.reelsPagination)
      setPosts(searchResult?.reelsPagination?.results);
    }
    if (!pathname.startsWith("/search")) {
      router.push("/search")
    }
    // setPosts(searchResult);
    // router.push("/profile/posts?search=true");
  };

  const handleMenuItemClick = (title: any) => {
    setActiveTab(title);

    if (title === "Feed") {
      router.push("/");
    } else if (title === "Post") {
      if (pathname !== "/profile/posts") {
        router.push("/profile/posts");
        // setCurrentTab("posts"); //TODO
      } else {
        setVideoPostStatus("addVideo");
      }
    } else if (title === "Journey") {
      router.push("/journey");
    } else if (title === "Profile") {
      router.push("/profile");
      // if (message) {
      //   setMessage(false);
      // }
    } else if (title === "Notifications") {
      setShowNotifications(!showNotifications);
    } else if (title === "Search") {
      handleInputFocus()
    } else {
    }
  };

  // const handleOutsideClick = (event: any) => {
  //   if (
  //     showNotifications &&
  //     notificationRef.current &&
  //     !notificationRef.current.contains(event.target as Node)
  //   ) {
  //     setShowNotifications(false);
  //   }
  // };
  const handleOutsideClick = (event: any) => {
    // close notifications if body clicked is outside the notification and menu items body
    if (
      showNotifications &&
      notificationRef.current &&
      !notificationRef.current.contains(event.target as Node) &&
      menuRef.current &&
      !menuRef.current.contains(event.target as Node)
    ) {
      setShowNotifications(false);
    }
  };

  const handleInputChange = async (e: any) => {
    const { value } = e.target;

    clearTimeout(timeoutId);

    if (searchValue !== "" || value !== "") {
      timeoutId = setTimeout(async () => {
        let pageType = searchTab === "users" ? "usersPage" : "reelsPage";
        const searchResult = await getSearchPosts(1, value, pageType, setSearchLoading);
        setSearchValue(value)
        setUserSearch(searchResult?.usersPagination)
        setReelsSearch(searchResult?.reelsPagination)
        setPosts(searchResult?.reelsPagination?.results);
      }, 1000);
    }
  };

  const getNotificationCounts = async () => {
    // setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/latest`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setNotificationCount(response?.data?.latestNotificationsCount);
      // setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getNotificationCounts();
  }, []);

  useEffect(() => {
    window.addEventListener("click", handleOutsideClick);
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [showNotifications]);

  useEffect(() => {
    const user_info = localStorage.getItem("user_info");
    const userInfo = user_info ? JSON.parse(user_info) : null;
    setUserInformation(userInfo);
  }, []);

  useEffect(() => {
    // Check if the current path is a journey-related page
    const isJourneyPage = pathname.includes("/journey");
    if (!isJourneyPage) {
      // Set the default state when on a journey-related page
      setGoatDrill(true);
    }
    if (pathname.startsWith("/search")) {
      setInputFocused(true);
    } else {
      setSearchTab("users")
      setSearchValue("")
      setUserSearch([])
      setReelsSearch([])
      setInputFocused(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (inputFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputFocused]);

  useEffect(() => {
    const handleBodyOverflow = () => {
      document.body.style.overflow = logoutPopup ? "hidden" : "auto";
    };

    // Set initial state when the component mounts
    handleBodyOverflow();

    // Clean up the effect when the component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [logoutPopup]);

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <>
      <div
        className={`navbar-main ${sticky ? "shadow-sticky header-fixed !z-[1]" : "relative"
          }`}
      >
        <div className="navbar-otr">
          <div className="navbar-inr">
            <div className="main">
              <div className="navlogo-otr">
                <Image src={Images.logo} alt="" className="navbar-logo" />
              </div>
              <div className="search-input-otr">
                <input
                  ref={inputRef}
                  className="search-input"
                  placeholder="Search"
                  // value={searchValue}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                />
                <Image
                  src={Images.magnifyGlass}
                  alt=""
                  className="magnify-icon"
                />
              </div>
            </div>
            <ul className="ul-items" ref={menuRef}>
              {menuData.map((menuItem: any) => {
                const isSelected = () => {
                  if (activeTab === menuItem.title) {
                    return true;
                  }

                  if (menuItem.path === "/" && pathname === "/") {
                    return true;
                  }

                  if (
                    menuItem.path &&
                    menuItem.path !== "/" &&
                    pathname.startsWith(menuItem.path)
                  ) {
                    return true;
                  }

                  return false;
                };

                return (
                  <li
                    key={menuItem.id}
                    className={`li-items cursor-pointer relative ${isSelected() ? "text-[#9FE870]" : "text-[#ebebf599]"
                      }`}
                    onClick={() => handleMenuItemClick(menuItem.title)}
                  >
                    {menuItem.icon &&
                      React.createElement(menuItem.icon, {
                        className: "nav-icon",
                      })}
                    <p className="nav-item navbar-text-10">{menuItem.title}</p>
                    {menuItem.title === "Notifications" &&
                      notificationCount > 0 && (
                        <span className="absolute -top-1 right-2 bg-lime-300 z-10 rounded-full px-2 py-1 text-xs text-black">
                          {notificationCount}
                        </span>
                      )}
                  </li>
                );
              })}
            </ul>
            {/* <ul className="ul-items">
              {menuData.map((menuItem: any) => {
                const isSelected = () => {
                  if (activeTab === menuItem.title) {
                    return true;
                  }

                  if (menuItem.path === "/" && pathname === "/") {
                    return true;
                  }

                  if (
                    menuItem.path &&
                    menuItem.path !== "/" &&
                    pathname.startsWith(menuItem.path)
                  ) {
                    return true;
                  }

                  return false;
                };

                return (
                  <li
                    key={menuItem.id}
                    className={`li-items cursor-pointer relative ${isSelected() ? "text-[#9FE870]" : "text-[#ebebf599]"
                      }`}
                    onClick={() => handleMenuItemClick(menuItem.title)}
                  >
                    {menuItem.icon &&
                      React.createElement(menuItem.icon, {
                        className: "nav-icon",
                      })}
                    <p className="nav-item navbar-text-10">{menuItem.title}</p>
                    {menuItem.title === "Notifications" &&
                      notificationCount > 0 && (
                        <span className="absolute -top-1 right-2 bg-lime-300 z-10 rounded-full px-2 py-1 text-xs text-black">
                          {notificationCount}
                        </span>
                      )}
                  </li>
                );
              })}
            </ul> */}
            <div className="burgerIcon-main">
              <div className="forTry" onClick={handleDropdownToggle}>
                <button onClick={handleMenuToggle}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-menu"
                  >
                    <line x1="4" x2="20" y1="12" y2="12" />
                    <line x1="4" x2="20" y1="6" y2="6" />
                    <line x1="4" x2="20" y1="18" y2="18" />
                  </svg>
                </button>
              </div>

              <OffCanvasMenu isOpen={isMenuOpen} onClose={handleMenuToggle}>
                <ul className="ul-items">
                  {menuData.map((menuItem: any, index) => (
                    <li
                      key={menuItem.id}
                      className={`li-items cursor-pointer ${(activeTab === "" && pathname === menuItem.path) ||
                        activeTab === menuItem.title
                        ? "text-[#9FE870]"
                        : "text-[#ebebf599]"
                        }`}
                      onClick={() => handleMenuItemClick(menuItem.title)}
                    >
                      {menuItem.icon &&
                        React.createElement(menuItem.icon, {
                          className: "nav-icon",
                        })}
                      <p className="nav-item navbar-text-10">
                        {menuItem.title}
                      </p>
                    </li>
                  ))}
                </ul>
              </OffCanvasMenu>
            </div>
          </div>
          <div />

          {showNotifications && (
            <Notifications
              notificationRef={notificationRef}
              setNotificationCount={setNotificationCount}
            />
          )}
          {/* {logoutPopup && <LogoutPopup onClose={() => setLogoutPopup(false)} />} */}
        </div>
      </div>
    </>
  );
};

export default Header;
