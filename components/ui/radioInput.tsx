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
const RadioInput = ({
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
      className="try radio-wrapper flex justify-between gap-5 px-4 py-6 items-center "
      onClick={onChange}
    >
      <div className="flex gap-[16px] items-center ">
        {/* {image && (
          <Image src={image} alt="" className="" width={56} height={56} />
        )} */}
        {image && (
          image?.endsWith('.svg') ? (
            <ReactSVG
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${image}`}
            />
          ) : (
            <Image src={image} alt="" className="" width={56} height={56} />
          )
        )}
        {isInputLeft && (
          <input
            type="radio"
            name="role"
            onChange={onChange}
            required
            value={value}
            checked={checked}
            style={{
              transform: "scale(1.2)",
              borderRadius: "4px",
              width: "18px",
              height: "20px",
              lineHeight: "1.3em",
            }}
          />
        )}
        <p
          className={`text-[17px] w-[230px] font-semibold capitalize leading-[22px] tracking-[-0.408px] ${checked ? "text-white" : "text-violet-100"
            }`}
        >
          {label}
        </p>
      </div>
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
    </div>
  );
};

export default RadioInput;
