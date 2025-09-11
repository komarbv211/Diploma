import React from "react";
import MajesticonsPlusLine from "../icons/toasts/MajesticonsPlusLine";

type Props = {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
};

const ToggleIconButton: React.FC<Props> = ({ isOpen, onClick, className }) => {
  return (
<button
  onClick={onClick}
  className={`p-2 min-w-[30px] min-h-[30px] flex items-center justify-center transition-transform duration-200 ${isOpen ? "line" : ""} ${className ?? ""}`}
  aria-label="Toggle"
>
  <MajesticonsPlusLine hideVertical={isOpen} />
</button>
  );
};

export default ToggleIconButton;

