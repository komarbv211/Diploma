import React from "react";
import { CartIcon } from "../components/icons";

type Props = {
  title: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
};

const ProductCard: React.FC<Props> = ({
  title,
  category,
  price,
  oldPrice,
  image,
}) => {
  return (
    <div className="flex flex-col items-start p-[15px_40px] gap-[18px] w-[405px] h-[513px] bg-white rounded-[15px] box-border border-[1px] border-blue2">
      {/* Зображення */}
      <div
        className="w-[325px] h-[325px] bg-cover bg-center rounded-[15px]"
        style={{ backgroundImage: `url(${image})` }}
      ></div>

      {/* Інформація */}
      <div className="flex flex-col items-start gap-[12px] w-[325px] h-[148px]">
        <div className="flex flex-col items-start gap-[8px] w-[325px] h-[101px]">
          <h3 className="w-full font-manrope font-medium text-[20px] leading-[27px] bg-gradient-to-r from-blue2 to-blueLight bg-clip-text text-transparent">
            {title}
          </h3>
          <p className="text-gray text-[14px] leading-[18px] font-sans">
            {category}
          </p>
        </div>

        {/* Ціна + кошик */}
        <div className="flex justify-between items-center w-[325px] h-[35px]">
          <span className="text-pink2 font-manrope text-[20px] font-medium leading-[27px]">
            {price} ₴
            {oldPrice && (
              <span className="text-gray line-through text-[16px] ml-2">
                {oldPrice} ₴
              </span>
            )}
          </span>
          <button className="w-[35px] h-[35px] flex items-center justify-center ">
            <CartIcon className="text-black w-full h-full" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
