// "use client";

import LaunchesTable from "@/components/LaunchesTable";
import Image from "next/image";

export default function Home() {
  return (
    <div className="">
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
      {/* Dashboard */}
      {/* <LaunchTable /> */}
      <LaunchesTable />
    </div>
  );
}
