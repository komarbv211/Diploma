import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import InteractiveRating from "../components/InteractiveRating";
import { CartIcon, CartFlowerIcon } from "../components/icons";
import { useAppSelector } from "../store/store";
import { useCart } from "../hooks/useCart";
import {
    useAddFavoriteMutation,
    useRemoveFavoriteMutation,
} from "../services/favoriteApi";
import { APP_ENV } from "../env";
import { ICartItem } from "../store/slices/localCartSlice";
import { showToast } from "../utilities/showToast";
import SuccessIcon from "./icons/toasts/SuccessIcon";
import WarnIcon from "./icons/toasts/WarnIcon";
import { useRateProductMutation } from "../services/productRatingApi ";
import { useGetProductByIdQuery } from "../services/productApi";

type Props = {
    title: string;
    category?: string;
    price: number;
    oldPrice?: number;
    image: string;
    productId: number;
    userId: number;
    userRating?: number;
    isFavorite?: boolean;
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
  isFavorite = false,
  onRated,
}) => {
    const { user } = useAppSelector((s) => s.auth);
    const { cart, addToCart } = useCart(!!user);
    const [addFavorite] = useAddFavoriteMutation();
    const [removeFavorite] = useRemoveFavoriteMutation();
    const [rateProduct] = useRateProductMutation();
    const { data: productData, refetch } = useGetProductByIdQuery(productId);

    const [favorite, setFavorite] = useState(isFavorite);

    useEffect(() => setFavorite(isFavorite), [isFavorite]);

    const isInCart = cart.some(
        (item: ICartItem) => item.productId === productId
    );

    const getImageName = (img: string) =>
        img?.startsWith(APP_ENV.IMAGES_1200_URL)
            ? img.replace(APP_ENV.IMAGES_1200_URL, "")
            : img;

    const handleRate = async (rating: number) => {
        if (!userId) {
            showToast(
                "warn",
                "Ви повинні увійти, щоб оцінити продукт",
                <WarnIcon />
            );
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
    const item: ICartItem = {
    productId,
    name: title,
    categoryName: category,
    price: productData?.price ?? price,
    quantity: 1,
    imageName: getImageName(image),
    discountPercent: productData?.discountPercent ?? 0,
    finalPrice: productData?.finalPrice ?? price,
    };
    await addToCart(item);
    window.dispatchEvent(new CustomEvent("open-cart"));
    showToast("success", "Товар додано до кошика", <SuccessIcon />);
  };

    const handleToggleFavorite = async () => {
        if (!user) {
            showToast(
                "warn",
                "Ви повинні увійти, щоб додати улюблене",
                <WarnIcon />
            );
            return;
        }
        setFavorite((prev) => !prev);
        try {
            if (!favorite) await addFavorite({ productId }).unwrap();
            else await removeFavorite(productId).unwrap();
            refetch();
        } catch (error) {
            setFavorite((prev) => !prev);
            console.error("Помилка улюбленого товару", error);
        }
    };

    return (
        <div
            className="
        bg-white rounded-[15px] border border-blue2 relative
        flex flex-col
        w-[161px] h-[293px] p-[10px_20px] gap-2
        md:w-[390px] md:h-[513px] md:p-[25px_40px] md:gap-0
        justify-between
        transition-transform duration-300 ease-in-out
        hover:scale-105 hover:border-pink2 my-5
      "
        >
            {/* Фото */}
            <Link
                to={`/product/details/${productId}`}
                className="block rounded-[15px] overflow-hidden md:min-h-[325px]"
                style={{
                    width: "100%",
                    height: "180px",
                    backgroundImage: `url(${image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />

            {/* Кнопка улюбленого */}
            <button
                onClick={handleToggleFavorite}
                className="
                    absolute top-2 right-3 md:top-4 md:right-5    
                    w-8 h-8 md:w-10 md:h-10
                    flex items-center justify-center
                    rounded-full bg-white/80 hover:bg-white shadow-md
                    transition
                "
            >
                {favorite ? (
                    <AiFillHeart className="text-pink2 w-5 h-5 md:w-6 md:h-6" />
                ) : (
                    <AiOutlineHeart className="text-gray-600 w-5 h-5 md:w-6 md:h-6" />
                )}
            </button>

            {/* Інфо */}
            <div className="flex flex-col gap-1 md:gap-2 md:mt-2">
                <Link to={`/product/details/${productId}`}>
                    <h3 className="line-clamp-2 font-manrope font-medium text-[14px] leading-[19px] md:text-[20px] md:leading-[27px] bg-gradient-to-r from-blue2 to-blueLight bg-clip-text text-transparent">
                        {title}
                    </h3>
                    <p className="line-clamp-2 text-[12px] leading-[15px] md:text-[18px] md:leading-[24px] text-gray">
                        {category}
                    </p>
                </Link>

                <InteractiveRating
                    productId={productId}
                    userRating={userRating}
                    onRate={handleRate}
                    size={12}
                    readOnly={true}
                />

                <div className="flex justify-between items-center md:gap-1">
                    {oldPrice ? (
                        <span className="font-manrope font-medium flex items-center gap-2">
                            <span className="text-pink2 text-[14px] md:text-[20px] leading-[19px] md:leading-[27px]">
                                {price} ₴
                            </span>
                            <span className="text-gray-400 line-through text-[12px] md:text-[16px]">
                                {oldPrice} ₴
                            </span>
                            </span>
                                    ) : (
                                        <span className="text-gray-900 font-manrope font-medium text-[14px] md:text-[20px] leading-[19px] md:leading-[27px]">
                            {price} ₴
                        </span>
                    )}

                    <button
                        onClick={handleAddToCart}
                        className="w-6 h-6 md:w-[28.5px] sm:h-[23.5px] flex items-center justify-center"
                    >
                        {isInCart ? (
                            <div className="relative w-full h-full">
                                <CartIcon className="text-black w-full h-full" />
                                <CartFlowerIcon className="absolute top-[3px] right-0 md:top-[6px] text-pink2 w-1/2 h-1/2" />
                            </div>
                        ) : (
                            <CartIcon className="text-black w-full h-full" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
