import { AiOutlineFile, AiOutlineHeart } from "react-icons/ai";
import { HiOutlineVideoCamera } from "react-icons/hi";
import { IoIosStats } from "react-icons/io";
import { FaRegFileLines } from "react-icons/fa6";
import { useProfile } from "@/providers/ProfileProvider";
import "./tabs.scss"

function Tabs({ currentTab, setCurrentTab }: any) {
  const { profile } = useProfile()
  return (
    <>
      <div className="flex tabs-otr">
        {(profile?.user?.roleId !== 4 &&
          profile?.otherUser?.roleId !== 4) && <div
            className={`flex w-1/3 text-13-bold color-gray items-center justify-center gap-2 forResponvieTab ${currentTab === "experiences" &&
              "border-b-[1px] border-[#9FE870] !text-[#9FE870]"
              } pb-3 text-center cursor-pointer`}
            onClick={() => setCurrentTab("experiences")}
          >
            <AiOutlineFile className="text-[18px] font-semibold" />
            <h5>Experience</h5>
          </div>}
        <div
          className={`text-13-bold color-gray flex w-1/3 items-center justify-center gap-2 forResponvieTab ${currentTab === "posts" &&
            "border-b-[1px] border-[#9FE870] !text-[#9FE870]"
            } pb-3 text-center cursor-pointer`}
          onClick={() => setCurrentTab("posts")}
        >
          <HiOutlineVideoCamera className="text-[18px] font-semibold" />
          <h5>Posts</h5>
        </div>
        <div
          className={`text-13-bold color-gray flex w-1/3 items-center justify-center gap-2 forResponvieTab ${currentTab === "favorites" &&
            "border-b-[1px] border-[#9FE870] !text-[#9FE870]"
            } pb-3 text-center cursor-pointer`}
          onClick={() => setCurrentTab("favorites")}
        >
          <AiOutlineHeart className="text-[18px] font-semibold " />
          <h5>Favorites</h5>
        </div>
        {(profile?.user?.roleId !== 2 && profile?.user?.roleId !== 4 && !profile?.otherUser) && <div
          className={`text-13-bold color-gray flex w-1/3 items-center justify-center gap-2 forResponvieTab ${currentTab === "offer" &&
            "border-b-[1px] border-[#9FE870] !text-[#9FE870]"
            } pb-3 text-center cursor-pointer`}
          onClick={() => setCurrentTab("offer")}
        >
          <FaRegFileLines className="text-[18px] font-semibold " />
          <h5>Offers</h5>
        </div>}
        {(profile?.user?.roleId !== 2 &&
          profile?.user?.roleId !== 3 &&
          profile?.user?.roleId !== 4 &&
          profile?.otherUser?.roleId !== 2 &&
          profile?.otherUser?.roleId !== 3 &&
          profile?.otherUser?.roleId !== 4) && <div
            className={`text-13-bold color-gray flex w-1/3 items-center justify-center gap-2 forResponvieTab ${currentTab === "stat" &&
              "border-b-[1px] border-[#9FE870] !text-[#9FE870]"
              } pb-3 text-center cursor-pointer`}
            onClick={() => setCurrentTab("stat")}
          >
            <IoIosStats className="text-[18px] font-semibold " />
            <h5>Stat</h5>
          </div>}
      </div>
    </>
  );
}
export default Tabs;
