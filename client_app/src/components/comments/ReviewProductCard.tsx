// ReviewProductCard.tsx
import React from "react";
import { ArrowRight } from "lucide-react";

interface ReviewCardProps {
  productName: string;
  productImage: string;
  reviewTitle: string;
  userName: string;
  reviewText: string;
  onGoToProduct?: () => void;
}

const ReviewProductCard: React.FC<ReviewCardProps> = ({
  productName,
  productImage,
  reviewTitle,
  userName,
  reviewText,
  onGoToProduct,
}) => {
  return (
    <div className="relative flex flex-col justify-between items-start p-10 pl-[374px] gap-[110px] mx-auto w-[830px] h-[515px] bg-[#FFF7F3] rounded-[15px]">
      {/* Фото продукту */}
      <img
        src={productImage}
        alt={productName}
        className="absolute left-10 top-1/2 -translate-y-1/2 w-[300px] h-[400px] object-cover rounded-lg shadow-md"
      />

      {/* Заголовок + товар */}
      <div className="flex flex-col items-start gap-2 w-[416px] h-[240px] mx-auto">
        <div className="flex flex-col gap-2 w-[416px] h-[125px]">
          <p className="w-full font-manrope font-medium text-[20px] leading-[27px] text-black">
            {reviewTitle}
          </p>
          <p className="w-full font-['Source Sans Pro'] text-[30px] leading-[45px] tracking-[-0.011em] text-black">
            {productName}
          </p>
        </div>

        {/* Відгук */}
        <div className="flex flex-col gap-2 w-[416px] h-[107px]">
          <p className="font-manrope font-medium text-[24px] leading-[33px] text-[#1A3D83]">
            {userName}
          </p>
          <p className="font-manrope font-medium text-[16px] leading-[22px] text-[#1A3D83]">
            {reviewText}
          </p>
        </div>
      </div>

      {/* Кнопка */}
      <button
        onClick={onGoToProduct}
        className="flex flex-row items-center justify-center gap-3 px-6 py-2 w-[291px] h-[49px] mx-auto bg-[#E56B93] rounded-[15px] hover:bg-[#d15c83] transition"
      >
        <span className="font-manrope font-medium text-[24px] leading-[33px] text-[#FFF7F3]">
          Перейти до товару
        </span>
        <ArrowRight className="w-3 h-5 text-[#FFF7F3]" />
      </button>
    </div>
  );
};

export default ReviewProductCard;
