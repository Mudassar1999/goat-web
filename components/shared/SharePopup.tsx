import { useState } from "react";
import {
  EmailShareButton,
  FacebookShareButton,
  HatenaShareButton,
  FacebookShareCount,
  InstapaperShareButton,
  LineShareButton,
  LinkedinShareButton,
  LivejournalShareButton,
  MailruShareButton,
  OKShareButton,
  PinterestShareButton,
  PocketShareButton,
  RedditShareButton,
  TelegramShareButton,
  TumblrShareButton,
  TwitterShareButton,
  ViberShareButton,
  VKShareButton,
  WhatsappShareButton,
  WorkplaceShareButton,
  EmailIcon,
  FacebookIcon,
  FacebookMessengerIcon,
  HatenaIcon,
  InstapaperIcon,
  LineIcon,
  LinkedinIcon,
  LivejournalIcon,
  MailruIcon,
  OKIcon,
  PinterestIcon,
  PocketIcon,
  RedditIcon,
  TelegramIcon,
  TumblrIcon,
  TwitterIcon,
  ViberIcon,
  VKIcon,
  WeiboIcon,
  WhatsappIcon,
  WorkplaceIcon,
} from "react-share";
import Popup from "./Popup";
import axios from "axios";
function SharePostPopup({ setSharePopup, post, setPost }: any) {
  console.log("post", post);
  const SharePost = async (videoId: any) => {
    console.log(videoId);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/share-post/${videoId}`,
        "",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      // Update the sharedPosts count
      setPost((prevData: any) => ({
        ...prevData,
        _count: {
          ...prevData._count,
          sharedPosts: prevData?._count?.sharedPosts + 1,
        },
      }));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Popup onClose={() => setSharePopup(false)}>
        <div className="px-6 pb-6 pt-10 lg:px-8 gap-3 flex">
          <FacebookShareButton
            url={`https://goatdev.genial365.com:3001/shared-reel${post?.shareLink}`}
            onShareWindowClose={() => SharePost(post?.id)}
          >
            <FacebookIcon size={40} round={true} />
          </FacebookShareButton>
          <TwitterShareButton
            url={`https://goatdev.genial365.com:3001/shared-reel${post?.shareLink}`}
            onShareWindowClose={() => SharePost(post?.id)}
          >
            <TwitterIcon size={40} round={true} />
          </TwitterShareButton>
          <WhatsappShareButton
            url={`https://goatdev.genial365.com:3001/shared-reel${post?.shareLink}`}
            onShareWindowClose={() => SharePost(post?.id)}
          >
            <WhatsappIcon size={40} round={true} />
          </WhatsappShareButton>
        </div>
      </Popup>
    </>
  );
}
export default SharePostPopup;
