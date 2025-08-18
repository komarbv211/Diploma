import { Button, Drawer, List, Image, Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { type ICartItem } from "../../store/slices/localCartSlice.ts";
import { useState } from "react";
import { useAppSelector } from "../../store/store.ts";
import { useCart } from "../../hooks/useCart.ts";
import { APP_ENV } from "../../env/index.ts";
//import OrderForm from "../orderForm";
import { CartIcon, DeleteIcon } from "../../components/icons";
import Link from "antd/es/typography/Link";

const { Text } = Typography;

const CartDrawer: React.FC = () => {
  const [open, setOpen] = useState(false);

  const { user } = useAppSelector((state) => state.auth);

  const { cart, addToCart, removeFromCart } = useCart(user != null);

  //   const handlerCloseOrderForm = () => {
  //     setOpen(false);
  //   };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="border-none">
        <div className="relative w-[41px] h-[41px] flex-shrink-0">
          <CartIcon className="text-black w-full h-full" />
        </div>

        <div className="flex flex-col justify-between ml-1 h-[41px]">
          <div className="flex justify-center items-center w-[49px] h-[19px] p-[10px] gap-[10px] bg-light_purple rounded-[15px]">
            {/* Тут можна показувати кількість товарів із useCart */}
            <span className="w-[29px] h-[20px] text-black font-manrope font-light text-[15px] leading-[20px] text-center">
              <span className="...">
                {cart?.reduce((acc, obj) => acc + (obj.quantity ?? 0), 0)}
              </span>
            </span>
          </div>

          <div className="w-[49px] h-[22px] font-manrope font-medium text-[16px] leading-[22px] text-black text-center">
            Кошик
          </div>
        </div>
      </Button>

      <Drawer
        placement="right"
        open={open}
        width={"full"} // ширина дравера в пікселях
        headerStyle={{ borderBottom: "none" }}
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 37, fontWeight: 400 }}>Кошик</span>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setOpen(false)}
              style={{
                fontSize: 30,
                fontFamily: "Arial, sans-serif",
                color: "grey",
              }}
            />
          </div>
        }
        className="form-container border-b-0"
        closable={false} // вимикає стандартну кнопку закриття
      >
        {/* Головний контейнер із flex */}
        <div className="flex flex-col cart-left xl:flex-row gap-6 px-6 py-4 border-t border-gray">
          {/* Ліва частина зі скролом */}
          <div
            className="flex-3"
            style={{
              flex: 3,
              overflowY: "auto",
              height: "100%",
              paddingRight: "5px", // щоб не захлинався контент під скролом
            }}
          >
            <List
              dataSource={cart}
              locale={{ emptyText: "Кошик порожній" }}
              renderItem={(item: ICartItem) => (
                <List.Item
                  actions={[
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.productId!)}
                      className="p-1 rounded hover:bg-gray-100 transition text-black hover:text-pink"
                    >
                      <DeleteIcon size={20} />
                    </button>,
                  ]}
                >
                  <div className="flex gap-4 w-full">
                    {/* Фото (завжди ліворуч) */}
                    <Image
                      src={`${APP_ENV.IMAGES_200_URL}${item.imageName}`}
                      width={150}
                      height={160}
                      preview={false}
                      className="rounded-lg flex-shrink-0"
                    />

                    {/* Контейнер з інформацією */}
                    <div className="flex flex-col flex-1 gap-3 lg:flex-row lg:items-center lg:justify-between">
                      {/* Назва + категорія */}
                      <div className="flex-1 min-w-[100px]">
                        <Text
                          strong
                          className="w-[332px] h-[27px] font-manrope font-medium text-[20px] leading-[27px] bg-gradient-to-r from-blue2 to-blueLight bg-clip-text text-transparent"
                        >
                          {item.name}
                        </Text>

                        <br />
                        <Text type="secondary" className="text-[16px]">
                          {item.categoryName}
                        </Text>
                      </div>

                      {/* Кнопки та ціна */}
                      <div className="flex flex-col lg:flex-row lg:items-center lg:gap-6">
                        {/* Кнопки */}
                        <div className="flex items-center gap-2 w-[117px] h-[52px] lg:w-28 justify-center  bg-white rounded-[15px] border border-blue2">
                          <Button
                            size="small"
                            onClick={() =>
                              item.quantity! > 1 &&
                              addToCart({ ...item, quantity: -1 })
                            }
                          >
                            -
                          </Button>
                          <Text>{item.quantity}</Text>
                          <Button
                            size="small"
                            onClick={() => addToCart({ ...item, quantity: 1 })}
                          >
                            +
                          </Button>
                        </div>

                        {/* Ціна */}
                        <div className="w-58 text-left lg:text-right">
                          <Text className="text-[20px] font-medium font-manrope">
                            {item.price} ₴
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </div>

          {/* Права частина без скролу */}
          <div className="flex flex-col  px-2 ">
            <div className="bg-beige2 gap-3 p-[20px] rounded-xl">
              <div className="flex xl:text-[27px] font-medium font-manrope mb-2 justify-between">
                <div className="flex flex-col">
                  <span>Загальна сума:</span>
                </div>
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

            <Link href="/orders">
              <button className="w-full h-[63px] bg-pink rounded-xl text-white xl:text-[24px] font-semibold font-manrope hover:bg-pink/90 transition">
                <p className="ml-3 mr-3 sm:justify-between sm:items-center">
                  Оформити замовлення
                </p>
              </button>
            </Link>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default CartDrawer;
