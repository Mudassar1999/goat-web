import React from 'react'

interface propsTypes {
  title?: string;
  disabled?: boolean;
  darkButton?: boolean;
  className?: any;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const CustomSmallBtn = ({
  title,
  darkButton,
  onClick,
  disabled,
  className,
}: propsTypes) => {
  return (
    <>
        <div className='customSmallBtn-otr'>
            <button 
            className={`${className} w-full customSmallBtn-inr ${darkButton ? 'bg-[#2C2C2E] text-[#fff]' : 'dark:text-[#163300] bg-[#9FE870] '} rounded-[10px] text-[13px] font-semibold tracking-[-0.078px] leading-[18px] cursor-pointer`}
            onClick={onClick}
            disabled={disabled ?? false}
            >
               {title ? title : "Get Started"}
            </button>
        </div>
    </>
  )
}

export default CustomSmallBtn