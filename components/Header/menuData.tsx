import { Menu } from "@/types/menu";
import { PiFilmReelFill } from "react-icons/pi";
import { FaSearch, FaBell } from "react-icons/fa";
import { AiFillPlusCircle } from "react-icons/ai";
import { IoHome } from "react-icons/io5";
import { FaCircleUser } from "react-icons/fa6";
const menuData: Menu[] = [
  {
    id: 1,
    title: "Feed",
    icon: IoHome,
    path: "/",
    newTab: false,
  },
  {
    id: 2,
    title: "Search",
    icon: FaSearch,
    path: "/search",
    newTab: false,
  },
  {
    id: 3,
    title: "Post",
    icon: AiFillPlusCircle,
    path: "/profile/posts",
    newTab: false,
  },
  {
    id: 4,
    title: "Journey",
    icon: PiFilmReelFill,
    path: "/journey",
    newTab: false,
  },
  {
    id: 5,
    title: "Notifications",
    icon: FaBell,
    path: "",
    newTab: false,
  },
  {
    id: 6,
    title: "Profile",
    icon: FaCircleUser,
    path: "/profile",
    newTab: false,
  },
];
export default menuData;
