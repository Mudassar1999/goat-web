import axios from "axios";
import { toast } from "react-toastify";

export async function FollowAndUnfollow(friendId: number,
  action: "follow" | "unfollow", name: string) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/friends/${action}/${friendId}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    toast.success(
      `You ${action === "follow"
        ? "followed"
        : action === "unfollow"
          ? "unfollowed"
          : ""
      } ${name}`
    );

    return response.status

  } catch (error: any) {
    console.error(error);
    toast.error(error.message);
  }
}
