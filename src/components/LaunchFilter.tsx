import React from "react";
import { filterOptions } from "@/utils/dateUtils";

interface LaunchFilterProps {
  activeFilter: string;
  setFilter: (filter: string) => void;
}

const LaunchFilter: React.FC<LaunchFilterProps> = ({
  activeFilter,
  setFilter,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filterOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => setFilter(option.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilter === option.value
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default LaunchFilter;
