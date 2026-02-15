import { LaunchCategory, PopupProps } from "@/types/spacex";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const CategoryFilter = ({ onSelect, currentSelection }: PopupProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => setIsOpen(!isOpen);

  const handleOptionClick = (option: LaunchCategory) => {
    onSelect(option);
    setIsOpen(false);
  };

  const options = [
    { value: "all", label: "All Launches" },
    { value: "upcoming", label: "Upcoming Launches" },
    { value: "successful", label: "Successful Launches" },
    { value: "failed", label: "Failed Launches" },
  ];

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          onClick={togglePopup}
          className="flex justify-center items-center gap-2 cursor-pointer"
          id="options-menu"
          aria-expanded="true"
          aria-haspopup="true"
        >
          <Image
            src="/launch-funnel-icon.svg"
            alt="funnel"
            width={12}
            height={12}
            priority
          />
          <span className="font-medium text-base leading-4 -tracking-normal text-[#4B5563]">
            {options.find((opt) => opt.value === currentSelection)?.label}
          </span>
          <ChevronDown width={16} height={16} color="#4B5563" />
        </button>
      </div>

      {isOpen && (
        <div
          className="w-44 rounded-md shadow shadow-[#0000001A] absolute right-0 bg-white z-10 top-6"
          role="menu"
        >
          <div className="w-full" role="none">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() =>
                  handleOptionClick(option.value as LaunchCategory)
                }
                className={`${
                  currentSelection === option.value && "bg-[#F4F5F7]"
                } block w-full text-left pl-4 font-normal hover:bg-gray-100 text-sm leading-3.5 text-[#1F2937] h-[30px]`}
                role="menuitem"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
