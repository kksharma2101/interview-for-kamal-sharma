import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

const DownArrowIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-chevron-down-icon lucide-chevron-down text-[#4B5563]"
    {...props}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
  //
  //   <svg
  //     width={size}
  //     height={size}
  //     viewBox="0 0 24 24"
  //     fill="none"
  //     stroke="currentColor"
  //     strokeWidth="2"
  //     strokeLinecap="round"
  //     strokeLinejoin="round"
  //     {...props}
  //   >
  //     <path d="M5 12h14M12 5l7 7-7 7" />
  //   </svg>
);

export default DownArrowIcon;
