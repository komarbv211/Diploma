import React from "react";

type Props = React.SVGProps<SVGSVGElement> & {
  hideVertical?: boolean;
};

const MajesticonsPlusLine: React.FC<Props> = ({ hideVertical, ...props }) => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 30 31 "
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M6 14.75H14.75M14.75 14.75H23.5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    {!hideVertical && (
      <>
        <path d="M14.75 14.75V6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14.75 14.75V23.5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    )}
  </svg>
);

export default MajesticonsPlusLine;
