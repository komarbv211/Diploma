// components/PromotionCard.tsx
import React from "react";

interface PromotionCardProps {
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

const PromotionCard: React.FC<PromotionCardProps> = ({
  image,
  title,
  description,
  buttonText,
  buttonLink,
}) => {
  return (
    <section className="relative max-w-[1670px] mx-auto px-4 py-12 flex flex-col lg:flex-row items-center gap-10">
      {/* Ліва картинка */}
      <div className="w-full lg:w-[815px] h-[490px] rounded-xl overflow-hidden">
        <img
          src={image}
          alt="Акційний банер"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Правий блок з текстом */}
      <div className="flex flex-col justify-between w-full lg:w-[761px] h-[490px]">
        {/* Заголовок */}
        <h2 className="text-2xl md:text-3xl lg:text-[32px] leading-snug font-sans bg-gradient-to-r from-[#1A3D83] to-[#8AA8D2] bg-clip-text text-transparent">
          {title}
        </h2>

        {/* Опис */}
        <p className="mt-6 text-base md:text-lg lg:text-[20px] leading-7 font-manrope text-black">
          {description}
        </p>

        {/* Кнопка */}
        <a
          href={buttonLink}
          className="mt-8 flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-[#E56B93] hover:bg-[#d15a83] transition text-[20px] md:text-[24px] text-[#FFF7F3] font-medium"
        >
          {buttonText}
          <span className="w-[12px] h-[23px] bg-[#FFF7F3] inline-block"></span>
        </a>
      </div>
    </section>
  );
};

export default PromotionCard;
