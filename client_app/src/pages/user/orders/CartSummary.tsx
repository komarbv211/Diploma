import { useState } from "react";
import { useCart } from "../../../hooks/useCart";
import { useGetAllProductsQuery } from "../../../services/productApi";
import QuantityCounter from "../../../components/counter/QuantityCounter";
import { useAppSelector } from "../../../store/store";
import { APP_ENV } from "../../../env";

const CartSummary = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { cart, addToCart, removeFromCart } = useCart(user != null);
  const { data: allProducts } = useGetAllProductsQuery();

  const [collapsedItems, setCollapsedItems] = useState<Record<string, boolean>>(
    {}
  );

  const totalPrice = cart.reduce((sum, i) => {
    const priceToUse = i.finalPrice ?? i.price;
    return sum + (priceToUse * (i.quantity ?? 0));
  }, 0);


  const deliveryPrice = 0;

  const toggleItem = (id: number) => {
    setCollapsedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div>
      <div className="flex justify-between text-center text-[24px] mb-5">
        <p>Ваше замовлення</p>
        <p>{totalPrice} ₴</p>
      </div>

      <div className="flex-1 max-h-[500px] pr-5 overflow-y-auto">
        {cart.map((cartItem, index) => {
          const product = allProducts?.find((p) => p.id == cartItem.productId);
          if (!product) return null;

          return (
            <div key={cartItem.productId}>
              <div className="flex justify-between mt-4 mb-5">
                {!collapsedItems[cartItem.productId!] && (
                  <div className="flex items-center justify-center">
                    <img
                      src={`${APP_ENV.IMAGES_200_URL}${
                        product.images?.[0]?.name || "NoImage.png"
                      }`}
                      width={110}
                      height={120}
                      alt={product.name}
                      className="object-cover rounded-lg flex-shrink-0"
                      onError={(e) => {
                        e.currentTarget.src = "/NoImage.png";
                      }}
                    />
                  </div>
                )}
                <div className="flex-1 ml-8 overflow-hidden">
                  <h3 className="text-[16px] bg-gradient-to-b from-blue2 to-blueLight bg-clip-text text-transparent mb-3">
                    {product.name}
                  </h3>
                  {!collapsedItems[cartItem.productId!] && (
                    <>
                      <p className="text-sm text-gray">{product.name}</p>
                      <p className="text-sm text-gray my-2">
                        {product.description?.length &&
                        product.description.length > 40
                          ? product.description.slice(0, 40) + "..."
                          : product.description ?? ""}
                      </p>
                      <p className="text-left text-[24px]">
                        {cartItem.discountPercent ? (
                          <>
                            <span className="line-through text-gray text-[20px]">
                              {(cartItem.price ?? 0).toFixed(2)} ₴
                            </span>
                            <br />
                            <span className="text-pink2 font-medium">
                              {(cartItem.finalPrice ?? cartItem.price ?? 0).toFixed(2)} ₴
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="invisible">
                              {(cartItem.price ?? 0).toFixed(2)} ₴
                            </span>
                            <br />
                            <span className="text-black font-medium">
                              {(cartItem.price ?? 0).toFixed(2)} ₴
                            </span>
                          </>
                        )}
                      </p>
                      <QuantityCounter
                        quantity={cartItem.quantity!}
                        onIncrease={() =>
                          addToCart({ ...cartItem, quantity: 1 })
                        }
                        onDecrease={() => {
                          if (cartItem.quantity! > 1) {
                            addToCart({ ...cartItem, quantity: -1 });
                          } else {
                            removeFromCart(cartItem.productId!);
                          }
                        }}
                        className="mt-6"
                      />
                    </>
                  )}
                </div>
                <div>
                  <button
                    onClick={() => toggleItem(cartItem.productId!)}
                    className="flex justify-between w-full text-left items-center"
                  >
                    <svg
                      className={`w-4 h-4 transform transition-transform ${
                        collapsedItems[cartItem.productId!] ? "" : "rotate-180"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {index < cart.length - 1 && (
                <hr className="my-10 border border-g rounded" />
              )}
            </div>
          );
        })}
      </div>

      <div>
        <hr className="my-5 border border-g rounded" />

        <div className="flex justify-between text-base mt-5">
          <p>Підсумок</p>
          <p>{totalPrice}</p>
        </div>

        <div className="flex justify-between text-sm mt-1">
          <p>Доставка</p>
          <p>{deliveryPrice} ₴</p>
        </div>

        <div className="flex justify-between mt-4 text-base font-semibold">
          <p>Разом</p>
          <p>{totalPrice + deliveryPrice} ₴</p>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
