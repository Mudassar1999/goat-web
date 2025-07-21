import { ArrowRightIcon } from "lucide-react";
import Loading from "react-loading";

interface propsTypes {
  title?: string;
  darkButton?: boolean;
  redButton?: boolean;
  disabled?: boolean;
  className?: any;
  icon?: any;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const CustomButton = ({
  title,
  darkButton,
  redButton,
  icon,
  onClick,
  disabled,
  className,
}: propsTypes) => {
  return (
    <>
      <div className="btn-otr flex">
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
      </div>

    </>
  );
};
export default CustomButton;
