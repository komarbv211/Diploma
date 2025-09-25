import { type ICartItem } from "../../store/slices/localCartSlice";
import { useAppSelector } from "../../store/store";
import { useCart } from "../../hooks/useCart";
import { APP_ENV } from "../../env";
import { CartFlowerIcon, CartIcon, DeleteIcon } from "../icons";
import ReactDOM from "react-dom";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CartModal: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { cart, addToCart, removeFromCart } = useCart(user != null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    setIsCartOpen(false);
  }, []);

  return (
    <>
      {/* Кнопка відкриття */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="border-none flex items-center gap-2"
      >
        {cart && cart.length > 0 ? (
          <div className="relative w-8 h-8 flex-shrink-0 md:w-[41px] md:h-[41px]">
            <CartIcon className="text-black w-full h-full" />
            <CartFlowerIcon className="absolute top-[3px] right-0 text-pink2 w-1/2 h-1/2 block md:hidden" />
          </div>
        ) : (
          <CartIcon className="text-black w-full h-full" />
        )}

        {/* Текст та лічильник для десктопу */}
        <div className="hidden md:flex flex-col justify-between h-[41px] ml-1">
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
                                  <span className="flex flex-col">
                                    {item.discountPercent ? (  
                                      <>
                                        <span className="text-gray-400 line-through text-[16px]">
                                          {(item.price ?? 0).toFixed(2)} ₴
                                        </span>
                                        <span className="text-[20px] font-medium text-pink2">
                                          {(item.finalPrice ?? item.price ?? 0).toFixed(2)} ₴
                                        </span>
                                      </>
                                    ) : (
                                      <span className="text-[20px] font-medium text-black">
                                        {(item.price ?? 0).toFixed(2)} ₴
                                      </span>
                                    )}
                                  </span>
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
                      <div className="font-manrope flex flex-col items-center justify-center h-full text-center py-20">
                        <CartIcon className="w-32 h-32 mb-6 text-gray animate-bounce" />
                        <h2 className="text-2xl font-semibold mb-2">
                          Ваш кошик порожній
                        </h2>
                        <p className="text-gray-400 mb-6">
                          Додайте товари, щоб оформити замовлення
                        </p>
                        <button
                          onClick={() => {
                            setIsCartOpen(false);
                            navigate("/");
                          }}
                          className="px-6 py-3 bg-pink text-white rounded-lg hover:bg-pink/90 transition"
                        >
                          Повернутися до каталогу
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Права частина */}
                  {cart.length > 0 && (
                    <div className="flex flex-col px-2 w-full xl:w-[400px]">
                      <div className="bg-beige2 gap-3 p-[20px] rounded-xl">
                        <div className="flex xs:text-[27px] font-medium font-manrope mb-2 justify-between">
                          <span>Загальна сума:</span>
                          <span>
                            {cart?.reduce((acc, item) => {
                              const finalPrice = item.discountPercent
                                ? (item.finalPrice ?? item.price ?? 0)
                                : (item.price ?? 0);
                              return acc + finalPrice * (item.quantity ?? 1);
                            }, 0).toLocaleString()} ₴
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
                  )}
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
