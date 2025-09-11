// components/BackButton.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { PrevArrowIcon } from "../icons";

interface BackButtonProps {
  to?: string; // куди переходити, за замовчуванням "/"
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ to = "/", className }) => {
  const navigate = useNavigate();
  return (
    <div className={`absolute left-[50px] top-[30px] ${className}`}>
      <button
        type="button"
        onClick={() => navigate(to)}
        className="w-[25px] h-[50px] grid place-items-center hover:opacity-80"
      >
        <PrevArrowIcon width={25} height={50} />
      </button>
    </div>
  );
};

export default BackButton;
