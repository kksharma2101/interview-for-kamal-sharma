"use client";

import React, { useState } from "react";
import useLaunches from "../hooks/useLaunches";
import { format, parseISO } from "date-fns";
import Image from "next/image";
import {
  CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import LaunchDetail from "./LaunchDetails";
import CategoryFilter from "./CategoryFilter";
import { LaunchCategory, tableHeadings } from "@/types/spacex";
import DateRangeFilter from "./DateRangeFilter";

const LaunchesTable: React.FC = () => {
  const {
    data,
    loading,
    error,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    hasNextPage,
    hasPrevPage,
    filter,
    setFilter,
    category,
    setCategory,
  } = useLaunches();

  const [launchId, setLaunchId] = useState<string>();
  const [active, setActive] = useState<Boolean>(false);
  const [activeDate, setActiveDate] = useState<Boolean>(false);

  const paginationData = [
    { label: 1, id: "first-page" },
    { label: currentPage, id: "current-page" },
    { label: "...", id: "dotted" },
    { label: totalPages, id: "total-page" },
  ];

  return (
    <>
      {/* Popup components  */}
      <div
        className={`absolute w-full px-2 lg:px-0 top-[133px] flex items-center justify-center ${
          !active && "hidden"
        }`}
      >
        {active && (
          <LaunchDetail launchId={launchId}>
            <X
              width={20}
              height={20}
              color="#4B5563"
              className="absolute right-8 top-3 cursor-pointer"
              onClick={() => setActive(false)}
            />
          </LaunchDetail>
        )}
      </div>

      {/* date filter */}
      {activeDate && (
        <div className="m-auto absolute w-full px-2 lg:px-0 top-[370px] flex items-center justify-center">
          <DateRangeFilter
            onSelect={setFilter}
            currentSelection={filter as any}
          >
            <X
              width={20}
              height={20}
              color="#4B5563"
              className="absolute right-1 top-0 cursor-pointer"
              onClick={() => setActiveDate(false)}
            />
          </DateRangeFilter>
        </div>
      )}

      <div
        className={`max-w-[1440px] ${
          active || activeDate ? "bg-[#E4E4E7] opacity-100" : "bg-white"
        }`}
      >
        {/* Logo container */}
        <div className="w-full shadow shadow-[#0000001A] h-[72px] flex items-center justify-center">
          <Image
            width={260}
            height={32}
            src="spacex-logo.svg"
            alt="logo"
            priority
          />
        </div>

        {/* main container */}
        <div className={`max-w-[952px] m-auto px-2 lg:px-0 ${active && "z-0"}`}>
          {/* Filter data by the date and others */}
          <div className="w-full mt-12 flex justify-between items-center ">
            <div
              onClick={() => setActiveDate(true)}
              className="flex justify-center items-center gap-2 cursor-pointer"
            >
              <CalendarIcon width={16} height={16} color="#4B5563" />

              <span className="font-medium text-base leading-4 -tracking-normal text-[#4B5563]">
                {filter}
              </span>

              <ChevronDown width={16} height={16} color="#4B5563" />
            </div>

            {/* Category filter */}
            <CategoryFilter
              onSelect={setCategory}
              currentSelection={category as LaunchCategory}
            />
          </div>

          {/* Launches Table data */}
          <div
            className={`overflow-x-auto rounded-md border border-[#E4E4E7] shadow-sm mt-16 ${
              active || activeDate ? "bg-[#E4E4E7]" : "bg-white"
            }`}
          >
            <table className="w-full text-nowrap px-6">
              <thead className="bg-[#F4F5F7] h-10">
                <tr>
                  {tableHeadings.map((item) => (
                    <th
                      key={item.id}
                      className="text-left px-6 align-middle text-[#4B5563] text-xs font-medium leading-3 tracking-wider"
                    >
                      {item.name}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="">
                {loading || !data.length ? (
                  <tr>
                    <td colSpan={7}>
                      <div
                        className={`flex justify-center items-center py-16 ${
                          (loading || !data.length) && "h-[634px]"
                        }`}
                      >
                        {loading ? (
                          <Image
                            src="Loader.svg"
                            alt="loader"
                            width={200}
                            height={200}
                          />
                        ) : (
                          <p className="text-sm font-medium text-[#374151]">
                            No results found for the specified filter
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.map((launch, index) => (
                    <tr
                      onClick={() => {
                        setLaunchId(launch?.id), setActive(true);
                      }}
                      key={launch.id}
                      className="hover:bg-gray-50 text-[#1F2937] font-normal leading-3 text-xs h-[53px] cursor-pointer"
                    >
                      <td className="px-6 align-middle">
                        {index < 9 ? `0${index + 1}` : index + 1}
                      </td>

                      <td className="px-6 align-middle ">
                        {format(
                          parseISO(launch.launched),
                          "d MMMM yyyy 'at' HH:mm"
                        )}
                      </td>

                      <td className="px-6 align-middle ">{launch.location}</td>

                      <td className="px-6 align-middle ">
                        {/* {launch.patch && (
                  <img
                    src={launch.patch}
                    alt={`${launch.mission} patch`}
                    className="w-8 h-8 mr-2 object-contain"
                  />
                )} */}
                        {launch.mission}
                      </td>

                      <td className="px-6 align-middle ">
                        {launch.orbit ?? "LEO"}
                      </td>

                      <td className="px-6 align-middle">
                        <span
                          className={`px-3 py-1 text-xs text-center leading-5 font-medium rounded-[20px] ${
                            launch.status === "Success"
                              ? "bg-[#DEF7EC] text-[#03543F]"
                              : launch.status === "Upcoming"
                              ? "bg-[#FEF3C7] text-[#92400F]"
                              : launch.status === "Failed"
                              ? "bg-[#FDE2E1] text-[#981B1C]"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {launch.status}
                        </span>
                      </td>

                      <td className="px-6 align-middle ">{launch.rocket}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Button */}
          <div className="flex items-end justify-end h-10 my-5">
            <div className="flex items-center justify-between h-full border border-[#E4E4E7] rounded-md">
              <button
                onClick={prevPage}
                disabled={!hasPrevPage}
                className={`w-10 h-full flex justify-center items-center rounded-bl-md rounded-tl-md cursor-pointer ${
                  hasPrevPage
                    ? "text-gray-500 hover:bg-gray-50"
                    : "text-gray-300 cursor-not-allowed"
                }`}
              >
                <ChevronLeft width={18} height={18} color="#4B5563" />
              </button>

              {paginationData.map((val) => (
                <span
                  className="w-10 h-full flex justify-center items-center border-l border-[#E4E4E7] text-[#4B5563] text-xs font-medium leading-4"
                  key={val.id}
                >
                  {val.label}
                </span>
              ))}

              <button
                onClick={nextPage}
                disabled={!hasNextPage}
                className={`w-10 h-full flex justify-center items-center border-l border-[#E4E4E7] rounded-br-md rounded-tr-md cursor-pointer ${
                  hasNextPage
                    ? "text-gray-500 hover:bg-gray-50"
                    : "text-gray-300 cursor-not-allowed"
                }`}
              >
                <ChevronRight width={18} height={18} color="#4B5563" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LaunchesTable;
