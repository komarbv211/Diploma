import React from 'react';

interface StarDecorationProps {
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  className?: string;
}

const StarDecoration: React.FC<StarDecorationProps> = ({
  width = 107,
  height = 127,
  style,
  className,
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 107 127"
    fill="none"
    className={className}
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient
        id="star-gradient"
        x1="41"
        y1="50.5"
        x2="84.5"
        y2="98.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#84A2CE" />
        <stop offset="1" stopColor="#1A3D83" />
      </linearGradient>
    </defs>
    <path
      d="M52.5237 0L55.2573 28.0491C55.5223 35.6851 58.3368 43.014 63.2539 48.8721C68.171 54.7302 74.9089 58.7817 82.3978 60.3834L107 63.5L83.3741 66.6165C75.8852 68.2182 69.1473 72.2698 64.2302 78.1279C59.3131 83.986 56.4986 91.3148 56.2336 98.9509L53.5 127L50.7664 98.9509C50.5014 91.3148 47.6869 83.986 42.7698 78.1279C37.8527 72.2698 31.1148 68.2182 23.6259 66.6165L0 63.5L23.6259 60.3834C31.1148 58.7817 37.8527 54.7302 42.7698 48.8721C47.6869 43.014 50.5014 35.6851 50.7664 28.0491L52.5237 0Z"
      fill="url(#star-gradient)"
    />
  </svg>
);

export default StarDecoration; 