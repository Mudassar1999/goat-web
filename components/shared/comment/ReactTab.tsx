import ReactOnPost from "../ReactOnPost";
import "../../../app/profile/components/profileInfo/tabs.scss"

function ReactOnPostTabs({ reactOnPostTab, setReactOnPostTab, post }: any) {

     return (
          <>
               <div className="flex tabs-otr text-center border-y border-zinc-600 border-opacity-60 pt-[8px] relative">
                    <div
                         className={`flex w-1/3 text-13-bold color-gray items-center justify-center gap-2 forResponvieTab ${reactOnPostTab === "All" &&
                              "border-b-[1px] border-[#9FE870] !text-[#9FE870]"
                              } pb-3 text-center cursor-pointer`}
                         onClick={() => setReactOnPostTab("All")}
                    >
                         <h5>All</h5>
                    </div>
               </div>
               <>
                    {reactOnPostTab === "All" && <ReactOnPost post={post} />}{" "}
               </>
          </>
     );
}
export default ReactOnPostTabs;
