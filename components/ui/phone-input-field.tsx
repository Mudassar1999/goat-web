import * as React from "react";
import { useRef, useEffect } from "react";
import { countries } from "country-data-list";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReactFlagsSelect from "react-flags-select";
import "./phone-input-field.css";
import { countriesLabel, countriesName } from "@/Constants/countries";
import { useForm } from "@/providers/FormProvider";
import "./ui.scss";
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export interface ExtendedInputProps extends InputProps {
  phoneNumberHandler: (e: any, i: any) => void;
  countryCode: string;
}

const PhoneInput = React.forwardRef<any, ExtendedInputProps>(
  (
    { className, phoneNumberHandler, countryCode, value, type, ...props },
    ref
  ) => {
    const buttonRef = useRef<any>(null);
    const { formState } = useForm();
    const selectCountry =
      "focus:!outline-none focus:!ring-2 focus:!ring-[#9FE870] focus:!border-transparent";

    useEffect(() => {
      const buttonElement = buttonRef.current?.querySelector("button");

      if (buttonElement) {
        // buttonElement.classList.add("select-country");
        buttonElement.classList.add(...selectCountry.split(" "));
      }
    }, []);

    return (
      <div className="relative flex w-full gap-2 relative" ref={buttonRef}>
        <ReactFlagsSelect
          className="example flag-selector menu-flags "
          selected={countryCode ? countryCode : "PK"}
          showSecondaryOptionLabel
          showOptionLabel
          searchable
          onSelect={(code: string) => {
            const a = countriesLabel[code].secondary;
            phoneNumberHandler(code, a);
          }}
          showSelectedLabel={false}

          // countries={countriesName}
          // customLabels={countriesLabel}
        />
        <div className="Allcommon-input-login">
          <div className="relative ">
            <span
              className={`countryCode ${
                value ? "color-white" : "color-placeholder"
              }`}
            >
              {formState?.phoneCode}
            </span>
            <input
              type={type}
              min={0}
              onKeyDown={(event) => {
                if (event.key === "-") {
                  event.preventDefault();
                }
              }}
              className={cn("Allcommon-input-login ", className)}
              value={value}
              ref={ref}
              {...props}
            />
          </div>
        </div>
      </div>
    );
  }
);
PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
