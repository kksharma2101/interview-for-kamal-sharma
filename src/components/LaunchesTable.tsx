"use client";

import React, { useEffect, useState } from "react";
import useLaunches from "../hooks/useLaunches";
import { format, parseISO } from "date-fns";
import Image from "next/image";
import {
  CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axios from "axios";
import LaunchDetail from "./LaunchDetails";

const tableHeadings = [
  { id: 1, name: "No:" },
  { id: 2, name: "Launched (UTC)" },
  { id: 3, name: "Location" },
  { id: 4, name: "Mission" },
  { id: 5, name: "Orbit" },
  { id: 6, name: "Launch Status" },
  { id: 7, name: "Rocket" },
];

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
  } = useLaunches();

  const [launchId, setLaunchId] = useState<string>();
  const [active, setActive] = useState<Boolean>(false);
  // console.log(launchId);

  if (error)
    return <div className="text-center text-red-500 py-8">Error: {error}</div>;
  if (!data.length)
    return <div className="text-center py-8">No launch data available</div>;

  return (
    <>
      <div className="max-w-[1440px] bg-white">
        {/* Popup components  */}
        <div
          className={`absolute mx-auto z-50 ${!active && "hidden"}`}
        >
          {/* {active && <LaunchDetail launchId={launchId} />} */}
        </div>

        {/* main container */}
        <div
          className={`max-w-[952px] m-auto px-2 lg:px-0 ${
            active && "z-0 opacity-40"
          }`}
        >
          {/* Filter data by the date and others */}
          <div className="w-full mt-12 flex justify-between items-center ">
            <div className="flex justify-center items-center gap-2 cursor-pointer">
              <CalendarIcon width={16} height={16} color="#4B5563" />

              <span className="font-medium text-base leading-4 -tracking-normal text-[#4B5563]">
                Past 6 Months
              </span>

              <ChevronDown width={16} height={16} color="#4B5563" />
            </div>

            <div className="flex justify-center items-center gap-2 cursor-pointer">
              <Image
                src="/launch-funnel-icon.svg"
                alt="funnel"
                width={12}
                height={12}
                priority
              />
              <span className="font-medium text-base leading-4 -tracking-normal text-[#4B5563]">
                All Launches
              </span>
              <ChevronDown width={16} height={16} color="#4B5563" />
            </div>
          </div>

          {/* Launches Table data */}
          <div className="overflow-x-auto rounded-md bg-white border border-[#E4E4E7] shadow-sm mt-16">
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

              <tbody className="bg-white">
                {loading ? (
                  <tr>
                    <td colSpan={7}>
                      <div
                        className={`flex justify-center items-center py-16 ${
                          loading && "h-[634px]"
                        }`}
                      >
                        <Image
                          src="Loader.svg"
                          alt="loader"
                          width={200}
                          height={200}
                        />
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

              <span className="w-10 h-full flex justify-center items-center border-l border-[#E4E4E7] text-[#4B5563] text-xs font-medium leading-4">
                1
              </span>
              <span className="w-10 h-full flex justify-center items-center border-l border-[#E4E4E7] text-[#4B5563] text-xs font-medium leading-4">
                {currentPage}
              </span>
              <span className="w-10 h-full flex justify-center items-center border-l border-[#E4E4E7] text-[#4B5563] text-xs font-medium leading-4">
                ...
              </span>
              <span className="w-10 h-full flex justify-center items-center border-l border-[#E4E4E7] text-[#4B5563] text-xs font-medium leading-4">
                {totalPages}
              </span>

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
