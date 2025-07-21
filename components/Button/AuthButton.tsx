import Image from "next/image";
import { Images } from "@/public/Images";

interface propsTypes {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const AuthButton = ({ onClick }: propsTypes) => {
  return (
    <>
      {/* <div className="btn-otr flex">
        <button
          className={`${className} dark:hover:bg-lime-450 w-full flex justify-center items-center  rounded-xl ${darkButton
            ? "bg-[#2C2C2E] text-[#9FE870]"
            : redButton
              ? "bg-[#FF453A] text-white"
              : "bg-[#9FE870] dark:text-[#163300]"
            } py-[14px] px-[20px] font-semibold `}
          onClick={onClick}
          disabled={disabled ?? false}
        >
          <div className="pr-[4px]">{icon ?? icon}</div>
          {title ? title : "Continue"}

          {!title ? <ArrowRightIcon className="" /> : ""}
        </button>
      </div> */}
      <button
        className="mt-[24px]  py-[17px] px-[60px] text-[17px] font-semibold tracking-[-0.078px] leading-[22px] rounded-[10px] cursor-pointer dark:hover:bg-lime-450 flex w-full items-center justify-center bg-lime-300 dark:bg-lime-300 dark:text-[#163300]"
        onClick={onClick}
      >
        Continue
        <Image className="arrowtry" src={Images.arrowForward} alt="img" />
      </button>
    </>
  );
};
export default AuthButton;
