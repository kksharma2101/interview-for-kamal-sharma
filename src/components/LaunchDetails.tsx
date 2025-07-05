"use client";
import React from "react";
import { useState, useEffect } from "react";
import { Launch, Rocket, Launchpad, Payload } from "../types/spacex";
import { format, parseISO } from "date-fns";
import Image from "next/image";

interface LaunchDetailProps {
  launchId?: string;
}

interface LaunchDetails {
  launch: Launch;
  rocket: Rocket;
  launchpad: Launchpad;
  payloads: Payload[];
}

const LaunchDetail: React.FC<LaunchDetailProps> = ({ launchId }) => {
  const [data, setData] = useState<LaunchDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch launch data
        const launchRes = await fetch(
          `https://api.spacexdata.com/v5/launches/${launchId}`
        );
        const launch: Launch = await launchRes.json();

        // Fetch all related data in parallel
        const [rocketRes, launchpadRes, payloadsRes] = await Promise.all([
          fetch(`https://api.spacexdata.com/v4/rockets/${launch.rocket}`),
          fetch(`https://api.spacexdata.com/v4/launchpads/${launch.launchpad}`),
          Promise.all(
            launch.payloads.map((id) =>
              fetch(`https://api.spacexdata.com/v4/payloads/${id}`).then(
                (res) => res.json()
              )
            )
          ),
        ]);

        const rocket: Rocket = await rocketRes.json();
        const launchpad: Launchpad = await launchpadRes.json();
        const payloads: Payload[] = await Promise.all(payloadsRes);

        setData({
          launch,
          rocket,
          launchpad,
          payloads,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [launchId !== ""]);

  //

  if (loading)
    return <div className="text-center py-12">Loading launch details...</div>;
  if (error)
    return <div className="text-center py-12 text-red-500">Error: {error}</div>;
  if (!data)
    return <div className="text-center py-12">No launch data found</div>;

  const { launch, rocket, launchpad, payloads } = data;
  //   console.log(rocket.flickr_images[0])

  return (
    <>
      <div className="max-w-[544px] relative top-[133px] ">
        <button className="">✖️</button>
        {/* header */}
        <div className="flex items-start">
          {rocket.flickr_images[0] && (
            <Image
              src={rocket.flickr_images[0]}
              alt={rocket.name}
              width={72}
              height={72}
            />
          )}
          <div className="text-start">
            <h1 className="text-lg leading-5 font-medium text-[#1F2937] ">
              {launch.name}
            </h1>
            <p className="text-xs leading-3 text-[#374151] font-normal ">
              {launch.flight_number}
            </p>
            <div className="flex items-center gap-2">
              <Image src="/nasa-icon.svg" alt="nasa" width={16} height={16} />
              <Image src="/w-icon.svg" alt="nasa" width={16} height={16} />
              <Image
                src="/youtube-icon.svg"
                alt="nasa"
                width={16}
                height={16}
              />
            </div>
          </div>
          <div
            className={`px-3 py-1 text-xs text-center leading-3 font-medium rounded-[20px] ${
              launch.upcoming
                ? "bg-[#FEF3C7] text-[#92400F]"
                : launch.success === null
                ? "bg-[#DEF7EC] text-[#03543F]"
                : launch.success
                ? "bg-[#DEF7EC] text-[#03543F]"
                : "bg-[#FDE2E1] text-[#981B1C]"
            }`}
          >
            {launch.upcoming
              ? "Upcoming"
              : launch.success === null
              ? "Unknown"
              : launch.success
              ? "Successful"
              : "Failed"}
          </div>
        </div>

        {/* description */}
        <p className="text-sm font-normal leading-6">
          {rocket.description}{" "}
          <span className="text-sm font-medium">Wikipidia</span>{" "}
        </p>

        {/* info */}
        <div className="">
          <div className="flex items-center border-b border-[#E4E4E7] h-12 gap-4">
            <span className="text-sm leading-3.5 text-[#4B5563] font-medium ">Flight Number</span>
            <span className="text-sm font-normal text-[#1F2937] ">{launch.flight_number}</span>
          </div>
          <div className="flex items-center border-b border-[#E4E4E7] h-12 gap-4">
            <span className="text-sm leading-3.5 text-[#4B5563] font-medium ">Mission Name</span>
            <span className="text-sm font-normal text-[#1F2937] ">{launch.name}</span>
          </div>
          <div className="flex items-center border-b border-[#E4E4E7] h-12 gap-4">
            <span className="text-sm leading-3.5 text-[#4B5563] font-medium ">Rocket Name</span>
            <span className="text-sm font-normal text-[#1F2937] ">{launch.rocket}</span>
          </div>
          <div className="flex items-center border-b border-[#E4E4E7] h-12 gap-4">
            <span className="text-sm leading-3.5 text-[#4B5563] font-medium ">Menufacturer</span>
            <span className="text-sm font-normal text-[#1F2937] "></span>
          </div>
          <div className="flex items-center border-b border-[#E4E4E7] h-12 gap-4">
            <span className="text-sm leading-3.5 text-[#4B5563] font-medium ">Nationality</span>
            <span className="text-sm font-normal text-[#1F2937] "></span>
          </div>
          <div className="flex items-center border-b border-[#E4E4E7] h-12 gap-4">
            <span className="text-sm leading-3.5 text-[#4B5563] font-medium ">Launch Date</span>
            <span className="text-sm font-normal text-[#1F2937] "></span>
          </div>
          <div className="flex items-center border-b border-[#E4E4E7] h-12 gap-4">
            <span className="text-sm leading-3.5 text-[#4B5563] font-medium ">Payload Type</span>
            <span className="text-sm font-normal text-[#1F2937] "></span>
          </div>
          <div className="flex items-center border-b border-[#E4E4E7] h-12 gap-4">
            <span className="text-sm leading-3.5 text-[#4B5563] font-medium ">Orbit</span>
            <span className="text-sm font-normal text-[#1F2937] "></span>
          </div>
          <div className="flex items-center border-b border-[#E4E4E7] h-12 gap-4">
            <span className="text-sm leading-3.5 text-[#4B5563] font-medium ">Launch Site</span>
            <span className="text-sm font-normal text-[#1F2937] "></span>
          </div>
          {/* <div className="flex items-center border-b border-[#E4E4E7] h-12 gap-4">
            <span className="text-sm leading-3.5 text-[#4B5563] font-medium "></span>
            <span className="text-sm font-normal text-[#1F2937] "></span>
          </div> */}
        </div>
      </div>

      {/* second  */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header with mission name and patch */}
          <div className="bg-gray-900 text-white p-6 flex flex-col md:flex-row items-start md:items-center">
            {launch.links.patch.large && (
              <Image
                src={launch.links.patch.large}
                alt={`${launch.name} mission patch`}
                width={32}
                height={32}
                className=" object-contain mr-6 mb-4 md:mb-0"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold">{launch.name}</h1>
              <p className="text-gray-300 mt-1">
                Flight #{launch.flight_number}
              </p>
              <div
                className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  launch.upcoming
                    ? "bg-yellow-100 text-yellow-800"
                    : launch.success === null
                    ? "bg-gray-100 text-gray-800"
                    : launch.success
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {launch.upcoming
                  ? "Upcoming"
                  : launch.success === null
                  ? "Unknown"
                  : launch.success
                  ? "Successful"
                  : "Failed"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            {/* Left column - Rocket details */}
            <div className="md:col-span-1">
              <div className="bg-gray-50 rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-4">Rocket Details</h2>

                {rocket.flickr_images[0] && (
                  <Image
                    src={rocket.flickr_images[0]}
                    alt={rocket.name}
                    width={100}
                    height={48}
                    className=" object-cover rounded mb-4"
                  />
                )}

                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium text-gray-900">Rocket Name</h3>
                    <p className="text-gray-600">{rocket.name}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Type</h3>
                    <p className="text-gray-600">{rocket.type}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Manufacturer</h3>
                    <p className="text-gray-600">{rocket.company}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Nationality</h3>
                    <p className="text-gray-600">{rocket.country}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">First Flight</h3>
                    <p className="text-gray-600">{rocket.first_flight}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Description</h3>
                    <p className="text-gray-600">{rocket.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle column - Launch details */}
            <div className="md:col-span-1">
              <div className="bg-gray-50 rounded-lg p-4 h-full">
                <h2 className="text-xl font-semibold mb-4">
                  Launch Information
                </h2>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium text-gray-900">Launch Date</h3>
                    <p className="text-gray-600">
                      {format(
                        parseISO(launch.date_utc),
                        "d MMMM yyyy 'at' HH:mm"
                      )}
                      {/* {formatLaunchDate(launch.date_utc)} */}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Launch Site</h3>
                    <p className="text-gray-600">{launchpad.full_name}</p>
                    <p className="text-gray-500 text-sm">
                      {launchpad.locality}, {launchpad.region}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Launch Details
                    </h3>
                    <p className="text-gray-600">
                      {launch.details || "No details available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Payload details */}
            <div className="md:col-span-1">
              <div className="bg-gray-50 rounded-lg p-4 h-full">
                <h2 className="text-xl font-semibold mb-4">
                  Payload Information
                </h2>

                {payloads.map((payload, index) => (
                  <div
                    key={payload.id}
                    className={`space-y-3 ${
                      index > 0 ? "mt-4 pt-4 border-t border-gray-200" : ""
                    }`}
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Payload {index + 1}
                      </h3>
                      <p className="text-gray-600">{payload.name}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Type</h3>
                      <p className="text-gray-600 capitalize">
                        {payload.type.toLowerCase()}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Orbit</h3>
                      <p className="text-gray-600 capitalize">
                        {payload.orbit.toLowerCase()}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Mass</h3>
                      <p className="text-gray-600">
                        {payload.mass_kg} kg ({payload.mass_lbs} lbs)
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Media gallery */}
          {launch.links.flickr.original.length > 0 && (
            <div className="px-6 pb-6">
              <h2 className="text-xl font-semibold mb-4">Media</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {launch.links.flickr.original.map((image, index) => (
                  <a
                    key={index}
                    href={image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg overflow-hidden"
                  >
                    <Image
                      src={image}
                      alt={`Launch ${launch.name} - ${index + 1}`}
                      width={100}
                      height={40}
                      className=" object-cover hover:opacity-90 transition-opacity"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* External links */}
          <div className="px-6 pb-6 flex flex-wrap gap-4">
            {launch.links.webcast && (
              <a
                href={launch.links.webcast}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                </svg>
                Watch Webcast
              </a>
            )}
            {launch.links.article && (
              <a
                href={launch.links.article}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                    clipRule="evenodd"
                  />
                </svg>
                Read Article
              </a>
            )}
            {launch.links.wikipedia && (
              <a
                href={launch.links.wikipedia}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Wikipedia
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LaunchDetail;
