import React from "react";
import { IoIosArrowDown } from "react-icons/io";
interface fieldTypes {
  name: string;
  options?: any;
  onChange?: any;
  placeholder?: any;
  value?: any;
}
function SelectField({ name, options, onChange, placeholder }: fieldTypes) {
  return Array.isArray(options) ? (
    <div className="relative">
      <select
        name={name}
        onChange={onChange}
        className="!mb-2 flex w-full !basis-0 rounded-[8px] border-input bg-background bg-zinc-800 px-6 py-3 !text-base !font-normal !leading-tight !text-violet-100 !placeholder-violet-100 ring-offset-background file:border-0 file:bg-transparent file:text-base file:font-medium focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#9FE870] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#1C1C1F] cursor-pointer appearance-none"
        //@ts-ignore
        placeholder={placeholder}
      >
        <option value="">Choose a value</option>
        {options?.map((item: any) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
      <IoIosArrowDown className="absolute right-[26px] top-1/2 -translate-y-1/2" />
    </div>
  ) : (
    <div className="relative">
      <select
        name={name}
        onChange={onChange}
        className="!mb-2 flex w-full !basis-0 rounded-[8px] border-input bg-background bg-zinc-800 px-6 py-3 !text-base !font-normal !leading-tight !text-violet-100 !placeholder-violet-100 ring-offset-background file:border-0 file:bg-transparent file:text-base file:font-medium focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#9FE870] disabled:cursor-not-allowed dark:bg-[#1C1C1F] appearance-none"
        disabled
      >
        <option value="">{options}</option>
      </select>
      <IoIosArrowDown className="absolute right-[26px] top-1/2 -translate-y-1/2" />
    </div>
  );
}
export default SelectField;
