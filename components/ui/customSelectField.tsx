import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import "../../app/auth/signup/components/AllComponent.scss";
import "./ui.scss";
import Image from "next/image";
import { Images } from "@/public/Images";

interface fieldTypes {
  name: string;
  options?: any;
  onChange?: any;
  placeholder?: any;
  value?: any;
  defaultOption?: any;
}
function CustomSelectField({
  name,
  options,
  onChange,
  placeholder,
  value,
  defaultOption,
}: fieldTypes) {
  console.log("defaultOption", value);
  const [color, setActiveColor] = useState(false);
  return Array.isArray(options) ? (
    <div className="relative selectGender-otr custom-select">
      <div className="custom-select">
        <select
          name={name}
          onChange={onChange}
          className={`${value === null
              ? "selectGender color-gray"
              : "selectGender color-white"
            }`}
          //@ts-ignore
          // placeholder={'try'}
          value={value}
        >
          {/* <option value={""} >
            {defaultOption ? defaultOption : "Choose a value"}
          </option> */}
          <option value="">Choose something</option>
          {options?.map((item: any) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <div className="absolute right-[24px] top-[22px] pointer-events-none">
        <Image src={Images.dropDown} alt="" className="social-icon" />
      </div>
    </div>
  ) : (
    <div className="relative selectGender-otr">
      <div className="custom-select">
        <select
          name={name}
          onChange={onChange}
          className="selectGender !cursor-not-allowed"
          disabled
        >
          <option value="">{options}</option>
        </select>
      </div>
      <div className="absolute right-[24px] top-[22px] pointer-events-none">
        <Image src={Images.dropDown} alt="" className="social-icon" />
      </div>
    </div>
  );
}
export default CustomSelectField;
