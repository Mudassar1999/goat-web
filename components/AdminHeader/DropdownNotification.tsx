import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';

const DropdownNotification = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);

  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);
  const sfProDisplayStyle = {
    fontFamily: 'SF Pro Display, Arial, sans-serif',
    // Add other inline styles as needed
  };
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // Close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  return (
    <li className="relative">
      <Link
        ref={trigger}
        onClick={() => {
          setNotifying(false);
          setDropdownOpen(!dropdownOpen);
        }}
        href="#"
      >
        <span
          className={`absolute -top-0.5 right-0 z-1 h-2 w-2 rounded-full bg-meta-1 ${notifying === false ? 'hidden' : 'inline'
            }`}
        >
          <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-meta-1 opacity-75"></span>
        </span>

        <CircleNotificationsIcon
          className="fill-current duration-300 ease-in-out dark:text-black"
          width="18"
          height="18"
          viewBox="0 0 22 22"
          fill="none"
        />
      </Link>

      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute -right-27 mt-2.5 flex h-90 w-75 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0 sm:w-80 ${dropdownOpen === true ? 'block' : 'hidden'
          }`}
        style={{ zIndex: 9999 }} // Set a higher z-index value
      >
        <div className="px-4.5 py-3">
          <h5 style={sfProDisplayStyle} className="text-sm text-bodydark2 text-black">Notification</h5>
        </div>

        <ul className="flex h-auto flex-col overflow-y-auto">
          <li>
            <Link
              className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
              href="#"
            >
              <p className="text-sm text-black">
                <span className="text-black">Edit your information in a swipe</span>
                Sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim.
              </p>

              <p className="text-xs text-black">12 May, 2025</p>
            </Link>
          </li>
          <li>
            <Link
              className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
              href="#"
            >
              <p className="text-sm text-black">
                <span className="text-black">It is a long established fact</span>
                that a reader will be distracted by the readable.
              </p>

              <p className="text-xs text-black">24 Feb, 2025</p>
            </Link>
          </li>
          <li>
            <Link
              className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover-bg-meta-4"
              href="#"
            >
              <p className="text-sm text-black">
                <span className="text-black">There are many variations</span>
                of passages of Lorem Ipsum available, but the majority have
                suffered.
              </p>

              <p className="text-xs text-black">04 Jan, 2025</p>
            </Link>
          </li>
          <li>
            <Link
              className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover-bg-meta-4"
              href="#"
            >
              <p className="text-sm text-black">
                <span className="text-black">There are many variations</span>
                of passages of Lorem Ipsum available, but the majority have
                suffered.
              </p>

              <p className="text-xs text-black">01 Dec, 2024</p>
            </Link>
          </li>
        </ul>
      </div>
    </li>
  );
};

export default DropdownNotification;
