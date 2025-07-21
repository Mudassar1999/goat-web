import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { UpdatePersonalDetail } from "@/api/profile/updatePersonalDetail";
import CustomButton from "@/components/Button/CustomButton";
import RadioInput from "@/components/ui/radioInput";
import CustomSwitch from "@/components/ui/customSwitch";
import "./editPrivacy.scss";
import { UpdateShowScout } from "@/api/profile/showScout";

const privacyStaticData = [
  {
    name: "Everyone",
    value: "Everyone",
  },
  {
    name: "Followers",
    value: "Followers",
  },
  {
    name: "No one",
    value: "No one",
  },
];

const EditPrivacy = ({
  userProfile,
  fetchProfile,
  editTitle,
  setEditPrivacyPop,
}: any) => {
  const [privacyValue, setprivacyValue] = useState<string>("");
  const [scoutedEnabled, setScoutedEnabled] = useState(
    userProfile?.user?.showScoutedBadge
  );
  const selectLeaguesHandler = (data: any) => {
    setprivacyValue(data?.value);
  };

  const handleUpdate = async () => {
    const payloadTitle =
      editTitle === "My Favorites"
        ? "favoritesPrivacy"
        : editTitle === "My Followers"
          ? "followersPrivacy"
          : "followingsPrivacy";

    const payload = {
      [payloadTitle]: privacyValue,
    };
    await UpdatePersonalDetail(payload, fetchProfile);
    setEditPrivacyPop(false);
  };

  const handleScoutedChange = async () => {
    if (!userProfile?.enableBadge) {
      toast.warning("This user didn't accept any offer till now!");
      return;
    }
    const payload = {
      showScoutedBadge: !scoutedEnabled,
    };
    await UpdateShowScout(payload, fetchProfile);
    setScoutedEnabled((prev: boolean) => !prev);
    setEditPrivacyPop(false);
  };

  useEffect(() => {
    if (userProfile && editTitle === "My Favorites") {
      setprivacyValue(userProfile?.user?.favoritesPrivacy);
    } else if (userProfile && editTitle === "My Followers") {
      setprivacyValue(userProfile?.user?.followersPrivacy);
    } else {
      setprivacyValue(userProfile?.user?.followingsPrivacy);
    }
  }, []);

  return (
    <>
      {editTitle === "Scouted Badge" ? (
        <div>
          <CustomSwitch
            title="Scouted Badge"
            enabled={scoutedEnabled}
            handleChange={handleScoutedChange}
            justifyBetween={"justify-between"}
          />

          <p className="badgeShow-desc mt-[8px]">
            Toggle whether the Scouted Badge is visible to other scouts,
            managers and coaches.
          </p>
        </div>
      ) : (
        <div>
          <h3 className="heading-bold heading-club">
            Who can see {editTitle}?
          </h3>

          <div className="clubName-name">
            {privacyStaticData.map((item: any) => (
              <div key={item.id} className="forfootBorderOtr cursor-pointer">
                <RadioInput
                  key={item.id}
                  label={item.name}
                  value={item.id}
                  checked={privacyValue === item.name}
                  onChange={() => selectLeaguesHandler(item)}
                />
              </div>
            ))}
          </div>

          {privacyValue === "" && (
            <p className="mb-2 alret-text text-[#FF453A]">
              Please Select appropriate data
            </p>
          )}
          <CustomButton
            onClick={handleUpdate}
            className={`${userProfile?.user?.roleId !== 3 && "!mt-6"}`}
          />
        </div>
      )}
    </>
  );
};

export default EditPrivacy;
