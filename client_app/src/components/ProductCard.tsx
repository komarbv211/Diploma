import React from "react";
import { CartIcon } from "../components/icons";
import InteractiveRating from "../components/InteractiveRating";
import { useRateProductMutation } from "../services/productRatingApi ";

type Props = {
  title: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  productId: number;
  userId: number; // Додано userId
  userRating?: number;
};

const ProductCard: React.FC<Props> = ({
  title,
  category,
  price,
  oldPrice,
  image,
  productId,
  userId,
  userRating = 0,
}) => {
  const [rateProduct] = useRateProductMutation();

  const handleRate = async (rating: number) => {
    try {
      await rateProduct({ productId, rating, userId }).unwrap();
      // Тут можна додати локальне оновлення або refetch даних, якщо потрібно
    } catch (error) {
      console.error("Помилка при рейтингу товару", error);
    }
  };

  return (
    <div className="grid grid-rows-[325px_1fr_auto] p-[15px_40px] w-[405px] h-[513px] bg-white rounded-[15px] border border-blue2">
      {/* Зображення */}
      <div
        className="bg-cover bg-center rounded-[15px] "
        style={{ backgroundImage: `url(${image})` }}
      ></div>

      {/* Інфа */}
      <div className="flex flex-col justify-normal gap-1">
        <div className="bg-cover ..."></div>
        <h3 className="line-clamp-2 min-h-[54px] font-manrope font-medium text-[20px] leading-[27px] bg-gradient-to-r from-blue2 to-blueLight bg-clip-text text-transparent">
          {title}
        </h3>
        <p className="line-clamp-2 min-h-[34px] text-[18px] text-gray">
          {category}
        </p>
        <InteractiveRating
          productId={productId}
          userRating={userRating}
          onRate={handleRate}
          size={15}
        />
        {/* Ціна + кошик */}
        <div className="line-clamp-2 flex justify-between items-center w-[325px] h-[35px] ">
          <span className="text-pink2 font-manrope text-[20px] font-medium leading-[27px]">
            {price} ₴
            {oldPrice && (
              <span className="text-gray line-through text-[16px] ml-2">
                {oldPrice} ₴
              </span>
            )}
          </span>
          <button className="w-[28.5px] h-[23.5px] flex items-center justify-center ">
            <CartIcon className="text-black w-full h-full" />
          </button>
        </div>{" "}
      </div>
    </div>
  );
};

export default ProductCard;
