// ReviewProductCard.tsx
import React from "react";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  return (
    <div className="relative flex flex-col lg:flex-row items-center lg:items-start gap-8 p-6 lg:p-10 bg-[#FFF7F3] rounded-[15px] shadow-sm max-w-[830px] h-full">
      {/* Фото продукту */}
      <img
        src={productImage}
        alt={productName}
        className="w-full max-w-[250px] lg:max-w-[300px] max-h-[435px] object-cover rounded-lg shadow-md"
      />

      {/* Контент */}
      <div className="flex flex-col gap-6 w-full h-full">
        {/* Заголовок + товар */}
        <div className="flex flex-col gap-2">
          <p className="font-manrope font-medium text-lg sm:text-xl text-black">
            {reviewTitle}
          </p>
          <p className="font-['Source Sans Pro'] text-2xl sm:text-3xl leading-tight tracking-[-0.011em] text-black">
            {productName}
          </p>
        </div>

        {/* Відгук */}
        <div className="flex flex-col gap-2 flex-1">
          <p className="font-manrope font-medium text-xl text-[#1A3D83]">
            {userName}
          </p>
          <p className="font-manrope font-medium text-base text-[#1A3D83]">
            {reviewText}
          </p>
        </div>

        {/* Кнопка */}
        <button
          onClick={onGoToProduct}
          className="flex flex-row items-center justify-center gap-3 px-6 py-2 w-full sm:w-auto bg-[#E56B93] rounded-[15px] hover:bg-[#d15c83] transition mt-auto"
        >
          <span className="font-manrope font-medium text-lg sm:text-xl text-[#FFF7F3]">
            {/* Перейти до товару */}
            {t('home.goToProduct')}
          </span>
          <ArrowRight className="w-4 h-5 text-[#FFF7F3]" />
        </button>
      </div>
    </div>
  );
};

export default ReviewProductCard;
