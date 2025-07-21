"use client";

import {
  useState,
  Fragment,
  useMemo,
  useRef,
  RefObject,
  useEffect,
} from "react";
import { Combobox as HeadlessCombobox, Transition } from "@headlessui/react";
// import ChevronDownIcon from "@/icons/chevron-down.svg";
// import { FlagImage } from "react-international-phone";
import { useVirtualizer } from "@tanstack/react-virtual";
import { cn } from "@/lib/utils";
// import { cn } from "@/utils";
import { CheckIcon } from "lucide-react";
import "./ui.scss";
import { Images } from "@/public/Images";
import Image from "next/image";

interface ComboboxProps<TData> {
  onChange: (value: any) => void;
  placeholder?: string;
  data?: TData[];
  showFlag?: boolean;
  isServerSide?: boolean;
  isLoading?: boolean;
  position?: "top" | "bottom";
  displayValue: (item: TData) => string;
  defaultSelectedValue?: any;
  isIconHide?: boolean;
  onSearch?: (query?: string) => void;
}

export function Combobox<TData>({
  data,
  onChange,
  placeholder,
  showFlag,
  isServerSide,
  isLoading,
  position,
  displayValue,
  isIconHide,
  defaultSelectedValue,
  onSearch,
}: ComboboxProps<TData>) {
  const parentRef = useRef<HTMLUListElement>(null);

  const [query, setQuery] = useState<string>();

  useEffect(() => {
    onSearch?.(query);
  }, [onSearch, query]);

  const filteredItems = useMemo(() => {
    const searchTerm = query?.toLowerCase().trim();

    if (!data?.length || isServerSide || !searchTerm) return data || [];

    // client-side search
    return data.filter((item) =>
      displayValue(item).trim().toLowerCase().includes(searchTerm)
    );
  }, [data, displayValue, isServerSide, query]);

  return (
    <HeadlessCombobox onChange={onChange} nullable>
      <div className="relative w-full selectGender-otr selectGender">
        <HeadlessCombobox.Button className="relative flex w-full cursor-pointer border-none bg-none text-inherit outline-none">
          <HeadlessCombobox.Input
            className={cn(`input selectGender input-bordered w-full`)}
            displayValue={displayValue}
            placeholder={placeholder}
            value={query || defaultSelectedValue}
            onChange={(e) => setQuery(e.target.value)}
          />
          {!isIconHide && <div className="absolute right-[24px] top-[22px] pointer-events-none">
            <Image src={Images.dropDown} alt="" className="social-icon" />
          </div>}
        </HeadlessCombobox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery(undefined)}
        >
          <HeadlessCombobox.Options
            ref={parentRef}
            className={cn(
              "absolute z-50 my-1 max-h-60 w-full overflow-auto ourCustomDropDown pt-[2px] text-base shadow-lg sm:text-sm",
              { "bottom-full": position === "top" }
            )}
          >
            {() => {
              // loading
              if (isLoading || !parentRef) {
                return (
                  <div className="relative flex cursor-default select-none items-center gap-2 px-4 py-2">
                    <span className="loading loading-spinner loading-xs bg-zinc-400"></span>
                    <span className="text-zinc-400">Loading...</span>
                  </div>
                );
              }

              // if no items
              if (!filteredItems.length && (!data || !data.length || !query?.trim())) {
                return (
                  <div className="relative cursor-default select-none no-data">
                    Nothing found.
                  </div>
                );
              }

              // items
              return (
                <VirtualizedList
                  parentRef={parentRef}
                  items={filteredItems}
                  displayValue={displayValue}
                  showFlag={showFlag}
                />
              );
            }}
          </HeadlessCombobox.Options>
        </Transition>
      </div>
    </HeadlessCombobox>
  );
}

interface VirtualizedListProps<TData> {
  parentRef: RefObject<HTMLUListElement | null>;
  items: TData[];
  displayValue: (item: TData) => string;
  showFlag?: boolean;
}

function VirtualizedList<TData>({
  items,
  showFlag,
  displayValue,
  parentRef,
}: VirtualizedListProps<TData>) {
  const rowVirtualizer = useVirtualizer({
    // The total number of items to virtualize.
    count: items.length,
    // scrollable element for the virtualizer
    getScrollElement: () => parentRef.current,
    // the height of each item
    estimateSize: () => 36,
    // The number of items to render above and below the visible area.
    overscan: 5,
  });

  return (
    <div
      style={{
        height: `${rowVirtualizer.getTotalSize()}px`,
        width: "100%",
        position: "relative",
      }}
    >
      {rowVirtualizer.getVirtualItems().map((virtualRow) => (
        <HeadlessCombobox.Option
          key={virtualRow.index}
          value={items[virtualRow.index]}
          className={({ active }) =>
            cn(`relative cursor-default select-none px-4 py-2 text-gray-900`, {
              "bg-red text-white": active,
            })
          }
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: `${virtualRow.size}px`,
            transform: `translateY(${virtualRow.start}px)`,
          }}
        >
          {({ active }) => {
            return (
              <div className="flex items-center gap-2">
                {/* {showFlag && <FlagImage iso2={(items[virtualRow.index] as any).code.toLowerCase()} size="24px" />} */}
                <span
                  className={cn(`block truncate`, { "font-medium": active })}
                >
                  {displayValue(items[virtualRow.index])}
                </span>
              </div>
            );
          }}
        </HeadlessCombobox.Option>
      ))}
    </div>
  );
}
