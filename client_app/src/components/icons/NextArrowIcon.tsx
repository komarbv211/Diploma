// src/components/icons/NextArrowIcon.tsx
import React, { useState } from "react";

type Props = React.SVGProps<SVGSVGElement>;

const NextArrowIcon: React.FC<Props> = (props) => {
  const [hover, setHover] = useState(false);

  const width = hover ? 16 : 25;
  const height = hover ? 28 : 50;
  const fillColor = hover ? "#000000" : "#666666";
  const path = hover
    ? "M15.16 15.4813L3.37454 27.2667L0.428711 24.3208L10.7412 14.0083L0.428711 3.69583L3.37454 0.75L15.16 12.5354C15.5505 12.9261 15.7699 13.4559 15.7699 14.0083C15.7699 14.5608 15.5505 15.0906 15.16 15.4813Z"
    : "M3.84004 23.5187L15.6255 11.7333L18.5713 14.6792L8.25879 24.9917L18.5713 35.3042L15.6255 38.25L3.84004 26.4646C3.44948 26.0739 3.23007 25.5441 3.23007 24.9917C3.23007 24.4392 3.44948 23.9094 3.84004 23.5187Z";

  return (
    <svg
      width={width}
      height={height}
      viewBox={hover ? "0 0 16 28" : "0 0 25 50"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        transform: hover ? "none" : "scaleX(-1)", // направо при hover = false
      }}
    >
      <path fillRule="evenodd" clipRule="evenodd" d={path} fill={fillColor} />
    </svg>
  );
};

export default NextArrowIcon;
