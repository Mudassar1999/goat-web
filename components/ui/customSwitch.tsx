import { Switch } from "@headlessui/react";
import "./ui.scss";

interface switchProps {
  title?: string;
  enabled: boolean;
  handleChange: any;
  justifyBetween?: any
}

const CustomSwitch = ({ title, enabled, handleChange, justifyBetween }: switchProps) => {
  return (
    <Switch.Group>
      <div className={`flex items-center ${justifyBetween}`}>
        <Switch.Label className="mr-4 showbadge-heading">{title}</Switch.Label>
        <Switch
          checked={enabled}
          onChange={handleChange}
          className={`${enabled ? "bg-[#34c759]" : "bg-[#545456]"
            } relative inline-flex h-[31px]  w-[51px] items-center rounded-full transition-colors focus:outline-none  focus:outline:none focus:box-shadow:none`}
        >
          <span
            className={`${enabled ? "translate-x-6" : "translate-x-1"
              } inline-block h-[25px] w-[25px] transform rounded-full bg-white transition-transform`}
          />
        </Switch>
      </div>
    </Switch.Group>
  );
};

export default CustomSwitch;
