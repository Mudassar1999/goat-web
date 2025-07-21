import Image from "next/image";
import { ReactSVG } from 'react-svg';
import "./ui.scss"

interface PropsTypes {
  image?: any;
  label: string;
  value: any;
  checked: boolean;
  onChange: any;
  className?: any;
  isInputLeft?: boolean;
}
const DominentRadioInput = ({
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
      onClick={onChange}
      className="check "
    >
      <p
        className={`text-[17px] font-semibold capitalize leading-[22px] tracking-[-0.408px] ${checked ? "text-white" : "text-violet-100"
          }`}
      >
        {label}
      </p>
      {!isInputLeft && (
        <input
          type="radio"
          name="role"
          className="trybg"
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
    </div>
  );
};

export default DominentRadioInput;
