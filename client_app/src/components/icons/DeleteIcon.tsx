import React from "react";

interface DeleteIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

const DeleteIcon: React.FC<DeleteIconProps> = ({ size = 15, ...props }) => (
  <svg
    width={size}
    height={typeof size === "number" ? (size * 14) / 15 : "14"}
    viewBox="0 0 15 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M14.37 5.42262L13.37 6.56659L1.24 1.9378L2.24 0.793823L5.28 1.95102L6.64 1.70636L10.97 3.3595L11.34 4.26542L14.37 5.42262ZM0 12.0947V4.15962H5.07L12 6.80465V12.0947C12 12.4454 11.7893 12.7818 11.4142 13.0299C11.0391 13.2779 10.5304 13.4172 10 13.4172H2C1.46957 13.4172 0.960859 13.2779 0.585786 13.0299C0.210714 12.7818 0 12.4454 0 12.0947Z"
      fill="currentColor" // ВАЖЛИВО
    />
  </svg>
);

export default DeleteIcon;
