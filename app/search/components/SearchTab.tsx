import { useSearchTab } from "@/providers/SearchTabProvider";
// import "../../profile/components/profileInfo/tabs.scss";
import "./search.scss";
import SearchReels from "./searchReels";
import SearchUsers from "./searchUsers";

function SearchTabs() {
  const { searchTab, setSearchTab } = useSearchTab();

  const ToggleTab = (selectTab: string) => {
    setSearchTab(selectTab);
  };

  return (
    <div className="journeyContainer">
      <div className="flex tabs-otr">
        <div
          className={`flex w-1/3 text-13-bold color-gray items-center justify-center gap-2 forResponvieTab ${
            searchTab === "users" &&
            "border-b-[1px] border-[#9FE870] !text-[#9FE870]"
          } pb-3 text-center cursor-pointer`}
          onClick={() => ToggleTab("users")}
        >
          <h5>Users</h5>
        </div>
        <div
          className={`text-13-bold color-gray flex w-1/3 items-center justify-center gap-2 forResponvieTab ${
            searchTab === "reels" &&
            "border-b-[1px] border-[#9FE870] !text-[#9FE870]"
          } pb-3 text-center cursor-pointer`}
          onClick={() => ToggleTab("reels")}
        >
          <h5>Reels</h5>
        </div>
      </div>
      <>
        {searchTab === "users" && <SearchUsers />}{" "}
        {searchTab === "reels" && <SearchReels />}
      </>
    </div>
  );
}
export default SearchTabs;
