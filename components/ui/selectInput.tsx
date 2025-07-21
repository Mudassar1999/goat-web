interface PropsTypes {
  name?: any;
  imgSrc?: any;
  label: string;
  type: any;
  value?: any;
  checked?: boolean;
  className?: any;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
import Image from "next/image";

const SelectInput = ({
  name,
  imgSrc,
  label,
  type,
  value,
  checked,
  onChange,
  className,
}: PropsTypes) => {
  return (
    <div
      className={`${className} checkbox-wrapper flex items-center justify-between`}
    >
      <div className="flex items-center gap-3">
        {imgSrc && <Image src={imgSrc} alt="football" width={56} height={56} />}
        <p className="text-base text-white">{label}</p>
      </div>
      <input
        type={type}
        name={name}
        onChange={onChange}
        required
        value={value}
        checked={checked}
        // style={{ transform: "scale(1.5)" }}
        className="checkbox-experienceFrom"
      />
    </div>
  );
};

export default SelectInput;
