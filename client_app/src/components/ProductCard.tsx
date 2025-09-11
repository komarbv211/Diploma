// src/components/ProductCard.tsx
import React from "react";
import { CartFlowerIcon, CartIcon } from "../components/icons";
import InteractiveRating from "../components/InteractiveRating";
import { useRateProductMutation } from "../services/productRatingApi ";
import { useAppSelector } from "../store/store";
import { useCart } from "../hooks/useCart";
import { APP_ENV } from "../env";
import { ICartItem } from "../store/slices/localCartSlice";
import { Link } from "react-router-dom";
import { showToast } from "../utilities/showToast";
import SuccessIcon from "./icons/toasts/SuccessIcon";
import WarnIcon from "./icons/toasts/WarnIcon";

type Props = {
  title: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string; // full URL (APP_ENV.IMAGES_1200_URL + name) or plain name
  productId: number;
  userId: number;
  userRating?: number;
  onRated?: () => void;
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
  onRated,
}) => {
  const [rateProduct] = useRateProductMutation();
  const { user } = useAppSelector((s) => s.auth);
  const { cart, addToCart } = useCart(!!user);
  const isInCart = cart.some((item: ICartItem) => item.productId === productId);

  // витягуємо тільки ім'я файлу, якщо передано повний URL
  const getImageName = (img: string) =>
    img?.startsWith(APP_ENV.IMAGES_1200_URL)
      ? img.replace(APP_ENV.IMAGES_1200_URL, "")
      : img;

  const handleRate = async (rating: number) => {
    if (!userId) {
      showToast("warn", "Ви повинні увійти, щоб оцінити продукт", <WarnIcon />);
      return;
    }
    try {
      await rateProduct({ productId, rating, userId }).unwrap();
      if (onRated) onRated();
    } catch (error) {
      console.error("Помилка при рейтингу товару", error);
    }
  };

  const handleAddToCart = async () => {
    // підготовка ICartItem схожа до твоєї структури
    const item = {
      productId,
      name: title,
      categoryName: category,
      price,
      quantity: 1,
      imageName: getImageName(image),
    };
    await addToCart(item as ICartItem);
    // відкриваємо Drawer
    window.dispatchEvent(new CustomEvent("open-cart"));
    showToast("success", "Товар додано до кошика", <SuccessIcon />);
  };

  return (
    <div className="grid grid-rows-[325px_1fr_auto] p-[15px_40px] w-[405px] h-[513px] bg-white rounded-[15px] border border-blue2">
      {/* <div className="grid grid-rows-[325px_1fr_auto] p-[15px_20px] w-full h-auto bg-white rounded-[15px] border border-blue2"> */}

      <Link
        key={productId}
        to={`/product/details/${productId}`}
        className="block rounded-[15px] overflow-hidden"
        style={{
          width: "100%",
          height: "325px",
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></Link>
      <div className="flex flex-col justify-normal gap-1">
        <Link key={productId} to={`/product/details/${productId}`}>
          <h3 className="line-clamp-2 min-h-[54px] font-manrope font-medium text-[20px] leading-[27px] bg-gradient-to-r from-blue2 to-blueLight bg-clip-text text-transparent">
            {title}
          </h3>
          <p className="line-clamp-2 min-h-[34px] text-[18px] text-gray">
            {category}
          </p>
        </Link>
        <InteractiveRating
          productId={productId}
          userRating={userRating}
          onRate={handleRate}
          size={15}
        />

        <div className="line-clamp-2 flex justify-between items-center w-[325px] h-[35px] ">
          <span className="text-pink2 font-manrope text-[20px] font-medium leading-[27px]">
            {price} ₴
            {oldPrice && (
              <span className="text-gray line-through text-[16px] ml-2">
                {oldPrice} ₴
              </span>
            )}
          </span>
          <button
            onClick={handleAddToCart}
            className="w-[28.5px] h-[23.5px] flex items-center justify-center "
          >
            {isInCart ? (
              <div className="relative w-full h-full">
                <CartIcon className="text-black w-full h-full" />
                <CartFlowerIcon className="absolute top-[6px] right-0 text-pink2 w-1/2 h-1/2" />
              </div>
            ) : (
              <CartIcon className="text-black w-full h-full" /> // 🛒 порожня іконка
            )}{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
