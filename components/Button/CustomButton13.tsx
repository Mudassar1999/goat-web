import { ArrowRightIcon } from "lucide-react";
import { CgSpinner } from "react-icons/cg";
import "./CustomButtons.scss"

interface propsTypes {
     title?: string;
     darkButton?: boolean;
     redButton?: boolean;
     disabled?: boolean;
     isLoading?: boolean;
     className?: any;
     icon?: any;
     onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const CustomButton13 = ({
     title,
     darkButton,
     redButton,
     icon,
     isLoading,
     onClick,
     disabled,
     className,
}: propsTypes) => {
     return (
          <>
               <div className="btn-otr ">
                    {isLoading ?
                         <button
                              className={`${className} w-full flex justify-center items-center rounded-[10px] 
                    px-[20px] py-[14px] text-13-bold
      ${darkButton
                                        ? "bg-[#2C2C2E] text-[#9FE870]"
                                        : redButton
                                             ? "bg-[#FF453A] text-white"
                                             : "bg-[#9FE870] dark:text-[#163300]"
                                   } font-semibold `}
                              //@ts-ignore
                              onClick={onClick}
                              disabled={disabled ?? false}
                         >
                              <CgSpinner size={20} className="mr-[10px] animate-spin" />

                         </button>
                         :
                         <button
                              className={`${className} w-full flex justify-center items-center rounded-[10px] 
                         px-[20px] py-[14px] text-13-bold
           ${darkButton
                                        ? "bg-[#2C2C2E] text-[#9FE870]"
                                        : redButton
                                             ? "bg-[#FF453A] text-white"
                                             : "bg-[#9FE870] dark:text-[#163300]"
                                   } font-semibold `}
                              //@ts-ignore
                              onClick={onClick}
                              disabled={disabled ?? false}
                         >

                              <div className="leftIcon">{icon ?? icon}</div>
                              {title ? title : "Continue"}

                              {!title ? <ArrowRightIcon className="rightIcon" /> : ""}
                         </button>}
               </div>
          </>
     );
};
export default CustomButton13;
