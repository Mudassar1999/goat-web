import { Images } from "@/public/Images";
import Image from "next/image";
import "./AllComponent.scss"
const Footer = () => {
  return (
    <>
      {/* <div className="inline-flex  justify-between self-stretch">
        <div className="text-[13px] font-normal leading-[18px] tracking-[-0.078px] text-violet-100">
          © GOAT 2023
        </div>
        <div className="flex items-center justify-start gap-2">
          <Image src={Images.wallet} alt="" />
          <div className="text-[13px] font-normal leading-[18px] tracking-[-0.078px] text-violet-100">
            help@goat.com
          </div>
        </div>
      </div> */}
      <div className="footer">
        <div className="footer-inr">
          <p className="footer-text">© GOAT 2023</p>
          <div className="icon-mail">
            <div className="mail-icon-otr">
              <Image className="mail-icon" src={Images.wallet} alt="" />
            </div>
            <p className="mail">help@goat.com</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
