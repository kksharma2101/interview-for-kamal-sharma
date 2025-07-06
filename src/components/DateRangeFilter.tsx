"uce client";

import { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addDays,
  subDays,
  isWithinInterval,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { filterOptions } from "@/utils/dateUtils";

type DateRange = {
  start: Date;
  end: Date;
};

type TimeRangeOption =
  | "Past Week"
  | "Past Month"
  | "Past 3 Months"
  | "Past 6 Months"
  | "Past Year"
  | "Past 10 Years";

interface TimeRangePopupProps {
  onSelect: (option: TimeRangeOption) => void;
  currentSelection: TimeRangeOption;
  children?: any;
}

const DateRangeFilter = ({
  onSelect,
  currentSelection,
  children,
}: TimeRangePopupProps) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedRange, setSelectedRange] = useState<DateRange | null>(null);

  // Handle date selection
  const handleDateClick = (day: Date) => {
    if (!selectedRange) {
      setSelectedRange({ start: day, end: day });
    } else if (!selectedRange.end || selectedRange.end < selectedRange.start) {
      setSelectedRange({ ...selectedRange, end: day });
    } else {
      setSelectedRange({ start: day, end: day });
    }
  };

  // Navigation between months
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Generate days for the calendar view
  const renderDays = (monthDate: Date) => {
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return days.map((day, i) => {
      const isCurrentMonth = isSameMonth(day, monthDate);
      const isSelected =
        selectedRange &&
        (isSameDay(day, selectedRange.start) ||
          isSameDay(day, selectedRange.end) ||
          (selectedRange.start &&
            selectedRange.end &&
            isWithinInterval(day, {
              start: selectedRange.start,
              end: selectedRange.end,
            })));

      return (
        <div
          key={i}
          onClick={() => handleDateClick(day)}
          className={`p-1 text-center cursor-pointer rounded-full
            ${isCurrentMonth ? "text-gray-900" : "text-gray-400"}
            ${isSelected ? "bg-blue-500 text-white" : ""}
            hover:bg-gray-100`}
        >
          {format(day, "d")}
        </div>
      );
    });
  };

  //
  const handleOptionClick = (option: TimeRangeOption) => {
    onSelect(option);
  };

  return (
    <div className="max-w-[618px] max-h-[283px] relative bg-white z-50 shadow shadow-[#0000001A] p-2 flex items-start rounded-md">
      {children}
      <div className="w-36">
        <div className="flex flex-col items-start ">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleOptionClick(option.value as TimeRangeOption)}
              className={`${
                currentSelection === option.value
                  ? "bg-gray-100 text-[#4B5563]"
                  : "text-gray-700"
              } block w-full text-left pl-2 py-1 text-sm hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150 cursor-pointer`}
              role="menuitem"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 border-l border-[#4B5563]">
        {/* Two Month Calendar View */}
        <div className="flex justify-between mb-3">
          <div className="flex justify-between items-center gap-5">
            <ChevronLeft
              onClick={prevMonth}
              width={24}
              height={24}
              color="#4B5563"
              className="font-medium cursor-pointer"
            />

            <span className="font-medium">
              {format(currentDate, "MMMM yyyy")}
            </span>
          </div>

          <div className="flex justify-between items-center gap-5">
            <span className="font-medium">
              {format(addMonths(currentDate, 1), "MMMM yyyy")}
            </span>
            <ChevronRight
              onClick={nextMonth}
              width={24}
              height={24}
              color="#4B5563"
              className="font-medium cursor-pointer"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* First Month */}
          <div className="grid grid-cols-7 gap-1">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div
                key={day}
                className="text-center text-xs font-bold text-black"
              >
                {day}
              </div>
            ))}
            {renderDays(currentDate)}
          </div>

          {/* Second Month */}
          <div className="grid grid-cols-7 gap-1">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div
                key={day}
                className="text-center text-xs font-bold text-black"
              >
                {day}
              </div>
            ))}
            {renderDays(addMonths(currentDate, 0))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateRangeFilter;
