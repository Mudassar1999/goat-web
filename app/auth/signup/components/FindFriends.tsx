import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import "./AllComponent.scss"

const initialPhoneContacts = [
  {
    phoneNumber: "+923336533880",
    name: "mudassar",
  },
  {
    phoneNumber: "+923336533881",
    name: "ali",
  },
];
const FindFriends = () => {
  const router = useRouter();
  const [responseData, setResponseData] = useState();
  const [data, setData] = useState({
    phoneContacts: initialPhoneContacts,
  });

  const findFriend = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/friends/findFriends`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setResponseData(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <h3 className="heading-bold">
        Find your friends and peers on GOAT
      </h3>
      <p className="desc pt-[5px] pb-[32px]">
        View your friends’ latest updates, and be on the lookout for potential
        scouts.
      </p>

      {/* <CustomButton title="Find Friends" onClick={findFriend} />
      <CustomButton
        title="Maybe Later"
        darkButton={true}
        className="!text-white mt-[8px]"
        onClick={() => router.push("/signin")}
      /> */}
      <div className="friendbtn-otr">
        <div className="friendbtn-inr" onClick={findFriend}>Find Friends</div>
      </div>
      <div className="friendbtn-otr2">
        <div className="friendbtn-inr2" onClick={() => router.push("/")}>Maybe Later</div>
      </div>
      <p className="text-body-color mt-2 text-center text-base text-violet-100 text-opacity-60">
        GOAT does not text or spam your contacts.
      </p>
    </div>
  );
};

export { FindFriends };
