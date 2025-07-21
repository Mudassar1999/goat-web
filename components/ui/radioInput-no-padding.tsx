import Image from "next/image";
import { ReactSVG } from 'react-svg';

interface PropsTypes {
  image?: any;
  label: string;
  value: any;
  checked: boolean;
  onChange: any;
  className?: any;
  isInputLeft?: boolean;
}
const RadioInput2 = ({
  image,
  label,
  value,
  checked,
  onChange,
  isInputLeft,
}: PropsTypes) => {

  return (
    //@ts-ignore
    <div
      className="try radio-wrapper flex justify-between gap-[6px] items-center "
      onClick={onChange}
    >

      {!isInputLeft && (
        <input
          type="radio"
          name="role"
          className="radio-Right"
          onChange={onChange}
          required
          value={value}
          checked={checked}
          style={{
            width: "22px",
            height: "22px",
          }}
        />
      )}
      <p
        className={`text-16-add-log ${checked ? "text-white" : "text-violet-100"
          }`}
      >
        {label}
      </p>
    </div>
  );
};

export default RadioInput2;
