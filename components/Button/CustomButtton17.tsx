import { ArrowRightIcon } from "lucide-react";
import Loading from "react-loading";
import "./CustomButtons.scss"

interface propsTypes {
     title?: string;
     darkButton?: boolean;
     redButton?: boolean;
     disabled?: boolean;
     className?: any;
     icon?: any;
     onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const CustomButton17 = ({
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
               <div className="btn-otr ">
                    <div
                         className={`${className} btn-inner text-17-bold
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
                    </div>
               </div>

          </>
     );
};
export default CustomButton17;
