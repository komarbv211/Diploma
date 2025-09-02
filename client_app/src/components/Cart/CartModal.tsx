import { type ICartItem } from "../../store/slices/localCartSlice";
import { useAppSelector } from "../../store/store";
import { useCart } from "../../hooks/useCart";
import { APP_ENV } from "../../env";
import { CartIcon, DeleteIcon } from "../icons";
import ReactDOM from "react-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CartModal: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { cart, addToCart, removeFromCart } = useCart(user != null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    setIsCartOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Кнопка відкриття */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="border-none flex items-center"
      >
        <div className="relative w-[41px] h-[41px] flex-shrink-0">
          <CartIcon className="text-black w-full h-full" />
        </div>

        <div className="flex flex-col justify-between ml-1 h-[41px]">
          <div className="flex justify-center items-center w-[49px] h-[19px] p-[10px] gap-[10px] bg-light_purple rounded-[15px]">
            <span className="w-[29px] h-[20px] text-black font-manrope font-light text-[15px] leading-[20px] text-center">
              {cart?.reduce((acc, obj) => acc + (obj.quantity ?? 0), 0)}
            </span>
          </div>
          <div className="w-[49px] h-[22px] font-manrope font-medium text-[16px] leading-[22px] text-black text-center">
            Кошик
          </div>
        </div>
      </button>

      {/* Overlay + Modal */}
      {isCartOpen &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* Напівпрозорий фон на весь екран */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsCartOpen(false)}
            />

            {/* Паддинги по боках, щоб модалка не прилипала до країв */}
            <div className="w-full px-4 sm:px-8 lg:px-12">
              {/* Модальне вікно */}
              <div className="relative bg-white w-full max-w-[105rem] h-[45rem] rounded-2xl shadow-xl flex flex-col overflow-hidden z-50 py-6 sm:py-8 px-4 sm:px-8 lg:px-12 mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center">
                  <span className="text-[37px] font-normal">Кошик</span>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-gray-500 hover:text-gray-700 text-[30px]"
                  >
                    ✕
                  </button>
                </div>

                {/* Content */}
                <div className="flex flex-col xl:flex-row gap-6 py-4 border-t border-gray flex-1 overflow-hidden">
                  {/* Ліва частина зі скролом */}
                  <div className="flex-3 flex-1 overflow-y-auto pr-2">
                    {cart && cart.length > 0 ? (
                      <ul className="divide-y">
                        {cart.map((item: ICartItem) => (
                          <li key={item.productId} className="py-4 border-gray">
                            <div className="flex gap-4 w-full">
                              <img
                                src={`${APP_ENV.IMAGES_200_URL}${
                                  item.imageName || "NoImage.png"
                                }`}
                                alt="Product image"
                                className="w-[150px] h-[160px] object-cover rounded-lg flex-shrink-0"
                                onError={(e) => {
                                  e.currentTarget.src = "/public/NoImage.png";
                                }}
                              />

                              <div className="flex flex-col flex-1 gap-3 lg:flex-row lg:items-center lg:justify-between">
                                <div className="flex-1">
                                  <p className="w-[332px] h-[27px] font-manrope font-medium text-[20px] leading-[27px] bg-gradient-to-r from-blue2 to-blueLight bg-clip-text text-transparent">
                                    {item.name}
                                  </p>
                                  <p className="text-[16px] text-gray font-manrope font-medium">
                                    {item.categoryName}
                                  </p>
                                </div>

                                <div className="flex flex-col lg:flex-row lg:items-center w-1/4 lg:gap-6">
                                  {/* Кнопки кількості */}
                                  <div className="flex items-center gap-2 w-[117px] h-[52px] lg:w-28 justify-center bg-white rounded-[15px] border border-blue2">
                                    <button
                                      onClick={() =>
                                        item.quantity! > 1 &&
                                        addToCart({ ...item, quantity: -1 })
                                      }
                                      className="px-2 text-lg"
                                    >
                                      -
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                      onClick={() =>
                                        addToCart({ ...item, quantity: 1 })
                                      }
                                      className="px-2 text-lg"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                                <div className="flex flex-col w-1/4 justify-end lg:flex-row lg:items-center lg:gap-6">
                                  {/* Ціна */}
                                  <div className="w-auto text-left lg:text-right max-w-32">
                                    <span className="text-[20px] font-medium font-manrope">
                                      {item.price} ₴
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeFromCart(item.productId!)
                                    }
                                    className="p-1 rounded hover:bg-gray-100 transition text-black hover:text-pink"
                                  >
                                    <DeleteIcon size={20} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-lg text-center mt-10">
                        Кошик порожній
                      </p>
                    )}
                  </div>

                  {/* Права частина */}
                  <div className="flex flex-col px-2 w-full xl:w-[400px]">
                    <div className="bg-beige2 gap-3 p-[20px] rounded-xl">
                      <div className="flex xs:text-[27px] font-medium font-manrope mb-2 justify-between">
                        <span>Загальна сума:</span>
                        <span>
                          {cart
                            ?.reduce(
                              (acc, item) =>
                                acc + (item.price ?? 0) * (item.quantity ?? 1),
                              0
                            )
                            .toLocaleString()}{" "}
                          ₴
                        </span>
                      </div>

                      <Link to="/orders">
                        <button
                          onClick={() => setIsCartOpen(false)}
                          className="w-full h-[52px] bg-pink rounded-xl text-white xs:text-[24px] font-semibold font-manrope hover:bg-pink/90 transition"
                        >
                          Оформити замовлення
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default CartModal;
