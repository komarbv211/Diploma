// src/components/FavoriteProductCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import { APP_ENV } from "../env";
import { ICartItem } from "../store/slices/localCartSlice";
import { useCart } from "../hooks/useCart";
import { useAppSelector } from "../store/store";
import { showToast } from "../utilities/showToast";
import SuccessIcon from "./icons/toasts/SuccessIcon";

type Props = {
    productId: number;
    title: string;
    category: string;
    price: number;
    oldPrice?: number;
    image: string;
};

const FavoriteProductCard: React.FC<Props> = ({
                                                  productId,
                                                  title,
                                                  category,
                                                  price,
                                                  oldPrice,
                                                  image,
                                              }) => {
    const { user } = useAppSelector((s) => s.auth);
    const { addToCart } = useCart(!!user);

    // отримати тільки ім’я з URL
    const getImageName = (img: string) =>
        img?.startsWith(APP_ENV.IMAGES_1200_URL)
            ? img.replace(APP_ENV.IMAGES_1200_URL, "")
            : img;

    const handleAddToCart = async () => {
        const item: ICartItem = {
            productId,
            name: title,
            categoryName: category,
            price,
            quantity: 1,
            imageName: getImageName(image),
        };
        await addToCart(item);
        window.dispatchEvent(new CustomEvent("open-cart"));
        showToast("success", "Товар додано до кошика", <SuccessIcon />);
    };

    return (
        <div className="flex flex-col justify-between bg-white rounded-[15px] border border-gray-200 shadow-sm w-[405px] h-[572px] p-[15px_40px] ml-16">
            {/* Зображення */}
            <Link
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

            {/* Інформація */}
            <div className="flex flex-col justify-between flex-1 mt-4">
                <div>
                    <Link to={`/product/details/${productId}`}>
                        <h3 className="line-clamp-2 min-h-[54px] font-manrope font-medium text-[20px] leading-[27px] bg-gradient-to-r from-blue2 to-blueLight bg-clip-text text-transparent">
                            {title}
                        </h3>
                        <p className="line-clamp-2 min-h-[34px] text-[18px] text-gray">
                            {category}
                        </p>
                    </Link>
                </div>

                {/* Ціна */}
                <div className="mt-2">
          <span className="text-pink2 font-manrope text-[20px] font-medium leading-[27px]">
            {price} ₴
              {oldPrice && (
                  <span className="text-gray line-through text-[16px] ml-2">
                {oldPrice} ₴
              </span>
              )}
          </span>
                </div>

                {/* Кнопка Купити */}
                <button
                    onClick={handleAddToCart}
                    className="mt-4 w-[405px] h-[45px] bg-pink2 text-white rounded-[15px] border border-gray-300 px-10 py-[15px] hover:bg-[#58042c] transition"
                >
                    Купити
                </button>
            </div>
        </div>
    );
};

export default FavoriteProductCard;
