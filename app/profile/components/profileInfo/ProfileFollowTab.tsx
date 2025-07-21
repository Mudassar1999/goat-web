import "./tabs.scss"
import Following from "../FollowTabs/Following";
import Follower from "../FollowTabs/Followers";

function ProfileFollowTabs({ followTab, setFollowTab, setMessage }: any) {

     return (
          <>
               <div className="flex tabs-otr">
                    <div
                         className={`flex w-1/3 text-13-bold color-gray items-center justify-center gap-2 forResponvieTab ${followTab === "following" &&
                              "border-b-[1px] border-[#9FE870] !text-[#9FE870]"
                              } pb-3 text-center cursor-pointer`}
                         onClick={() => setFollowTab("following")}
                    >
                         <h5>Following</h5>
                    </div>
                    <div
                         className={`text-13-bold color-gray flex w-1/3 items-center justify-center gap-2 forResponvieTab ${followTab === "followers" &&
                              "border-b-[1px] border-[#9FE870] !text-[#9FE870]"
                              } pb-3 text-center cursor-pointer`}
                         onClick={() => setFollowTab("followers")}
                    >
                         <h5>Followers</h5>
                    </div>
               </div>
               <>
                    {followTab === "following" && <Following />}{" "}
                    {followTab === "followers" && <Follower />}
               </>
          </>
     );
}
export default ProfileFollowTabs;
