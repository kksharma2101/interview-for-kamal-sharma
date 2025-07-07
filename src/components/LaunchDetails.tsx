"use client";
import React, { ReactElement } from "react";
import { useState, useEffect } from "react";
import { Launch, Rocket, Launchpad, Payload } from "../types/spacex";
import { format, parseISO } from "date-fns";
import Image from "next/image";
import { Loader } from "lucide-react";

interface LaunchDetailProps {
  launchId?: string;
  children: ReactElement<HTMLButtonElement>;
}

interface LaunchDetails {
  launch: Launch;
  rocket: Rocket;
  launchpad: Launchpad;
  payloads: Payload[];
}

const LaunchDetail: React.FC<LaunchDetailProps> = ({ launchId, children }) => {
  const [data, setData] = useState<LaunchDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch launch data
        const launchRes = await fetch(
          `${process.env.NEXT_PUBLIC_SPACEX_API}/${launchId}`
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
  }, [launchId]);

  if (!data)
    return (
      <div className="relative top-32">
        <Loader width={100} height={100} />
      </div>
    );

  const { launch, rocket, launchpad, payloads } = data;

  // info data
  const infoData = [
    { label: "Flight Number", value: launch.flight_number },
    { label: "Mission Name", value: launch.name },
    { label: "Rocket Name", value: rocket.name },
    { label: "Manufacturer", value: rocket.company },
    { label: "Nationality", value: rocket.country },
    {
      label: "Launch Date",
      value: format(parseISO(launch.date_utc), "d MMMM yyyy 'at' HH:mm"),
    },
    { label: "Payload Type", value: payloads[0]?.type ?? "" },
    { label: "Orbit", value: payloads[0]?.orbit ?? "" },
    { label: "Launch Site", value: launchpad.region },
  ];

  return (
    <>
      <div className="max-w-[544px] relative bg-white z-50 shadow shadow-[#0000001A] p-8 flex gap-4 items-start justify-center flex-col rounded-md">
        {children}

        {error ?? loading ?? (
          <div className="text-center">{error ?? "Data Loading..."}</div>
        )}

        {/* header */}
        <div className="flex items-start gap-6">
          {launch?.links.patch && (
            <Image
              src={launch?.links?.patch.small ?? rocket?.flickr_images[0]}
              alt={rocket.name}
              width={72}
              height={72}
            />
          )}
          <div className="text-start space-y-2">
            <h1 className="text-lg leading-5 font-medium text-[#1F2937] ">
              {launch.name}
            </h1>
            <p className="text-xs leading-3 text-[#374151] font-normal ">
              {rocket.name}
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
              ? "Success"
              : "Failed"}
          </div>
        </div>

        {/* description */}
        <p className="text-sm font-normal leading-6">
          {rocket.description}{" "}
          <span className="text-sm leading-6 cursor-pointer font-medium text-blue-500">
            Wikipidia
          </span>{" "}
        </p>

        {/* info */}
        {infoData.map((item, idx) => (
          <div
            key={idx}
            className="w-full flex gap-4 items-center border-b border-[#E4E4E7] h-12 font-sans"
          >
            <span className="text-sm text-start w-[164px] text-[#4B5563] font-medium">
              {item.label}
            </span>
            <span className="text-sm text-[#1F2937] font-normal">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

export default LaunchDetail;
