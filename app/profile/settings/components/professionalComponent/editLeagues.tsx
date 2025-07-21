import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import CustomButton from "@/components/Button/CustomButton";
import { FaSearch } from "react-icons/fa";
import Image from "next/image";
import RadioInput from "@/components/ui/radioInput";
import useApiRequest from "@/custom_hooks/useGetApiRequest";
import "../../../../auth/signup/components/AllComponent.scss";
import { UpdateProfessionalDetail } from "@/api/profile/updateProfessionalDetail";
import CustomCheckbox from "@/components/ui/customCheckbox";

const EditLeagues = ({
  userProfile,
  fetchProfile,
  editTitle,
  setEditProfessionalInfoPop,
}: any) => {
  const { responseData, loading, fetchData } = useApiRequest();
  const [searchQuery, setSearchQuery] = useState("");
  const [leaguesData, setLeaguesData] = useState<any>([]);
  const [checkValidation, setCheckValidation] = useState(false);

  const handleSubmit = async () => {
    try {
      const payload = {
        leagues: leaguesData.map((item: any) => item.id),
      };

      setCheckValidation(true);
      await UpdateProfessionalDetail(payload, fetchProfile);
      setEditProfessionalInfoPop(false);
    } catch (error) {
      setEditProfessionalInfoPop(false);
      console.error(error);
    }
  };

  const Continue = () => {
    setCheckValidation(true);
    if (leaguesData?.length > 0) {
      handleSubmit();
    }
  };

  const selectLeaguesHandler = (data: any) => {
    if (leaguesData.some((league: any) => league.id === data.id)) {
      const filterdLeague = leaguesData.filter(
        (league: any) => league.id !== data.id
      );
      setLeaguesData(filterdLeague);
    } else {
      const newLeague = {
        name: data?.name,
        id: data?.id,
      };
      setLeaguesData((prev: any) => [...prev, newLeague]);
    }
  };

  const handleSearch = (e: any) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = responseData.filter((item: any) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchData(`leagues/bySportId/${userProfile?.sportsData[0]?.sportId}`, null);

    const extractLeagues = userProfile?.sportsData[0]?.leagues.map(
      (item: any) => ({
        id: item.League.id,
        name: item.League.name,
      })
    );

    setLeaguesData(extractLeagues);
  }, []);
  console.log(leaguesData, "leaguesData");
  return (
    <div>
      <h3 className="heading-bold heading-club">
        What leagues are you interested in scouting in?
      </h3>
      <div className="relative mt-[8px]">
        <FaSearch className="absolute search-icon" />
        <Input
          type="search"
          className="search-input"
          placeholder="Search"
          onChange={handleSearch}
        />
      </div>

      {searchQuery === "" ? (
        <div className="images-main">
          {responseData.map((item: any) => (
            <div className="" key={item.id}>
              {item.image && (
                <div
                  onClick={() => selectLeaguesHandler(item)}
                  className={`api-img-otr ${
                    leaguesData.some((league: any) => league.id === item.id)
                      ? " border-4 border-[#9FE870]"
                      : ""
                  }`}
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.image}`}
                    alt=""
                    width={47}
                    height={47}
                    className="img"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="clubName-name">
          {filteredData.map((item: any) => (
            <div key={item.id}>
              <div className="forborderC">
                {/* <RadioInput
                                             key={item.id}
                                             label={item.name}
                                             value={item.id}
                                             checked={
                                                  leaguesData?.length > 0 &&
                                                  leaguesData.some((league: any) => league.id === item.id)
                                             }
                                             onChange={() => selectLeaguesHandler(item)}
                                        /> */}
                <CustomCheckbox
                  key={item.id}
                  name="country"
                  label={item.name}
                  type="checkbox"
                  value={item.id}
                  checked={
                    leaguesData?.length > 0 &&
                    leaguesData.some((league: any) => league.id === item.id)
                  }
                  onChange={() => selectLeaguesHandler(item)}
                  className=""
                />
              </div>
            </div>
          ))}
        </div>
      )}
      {checkValidation && leaguesData?.length < 1 && (
        <p className="mb-2 alret-text text-[#FF453A]">
          Please Select at least 1 league
        </p>
      )}
      <CustomButton
        onClick={Continue}
        className={`${userProfile?.user?.roleId !== 3 && "!mt-6"}`}
      />
    </div>
  );
};

export { EditLeagues };
