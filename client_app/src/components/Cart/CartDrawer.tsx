import { Button, Drawer, List, Space, Image, Typography, Divider } from "antd";
import { type ICartItem } from "../../store/slices/localCartSlice.ts";
import { useState } from "react";
import { useAppSelector } from "../../store/store.ts";
import { useCart } from "../../hooks/useCart.ts";
import { APP_ENV } from "../../env/index.ts";
//import OrderForm from "../orderForm";
import { CartIcon } from "../../components/icons";

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

        <div className="flex flex-col justify-between ml-3 h-[41px]">
          <div className="flex justify-center items-center w-[49px] h-[19px] p-[10px] gap-[10px] bg-[#C89FB8] rounded-[15px]">
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
        title="Ваш кошик"
        onClose={() => setOpen(false)}
        open={open}
        width={1680}
        className="form-container"
      >
        {/* Вміст Drawer */}
        <List
          dataSource={cart}
          locale={{ emptyText: "Кошик порожній" }}
          renderItem={(item: ICartItem) => (
            <List.Item
              actions={[
                <Button danger onClick={() => removeFromCart(item.productId!)}>
                  Видалити
                </Button>,
              ]}
            >
              <Space align="start" className="gap-4">
                <Image
                  src={`${APP_ENV.IMAGES_200_URL}${item.imageName}`}
                  width={64}
                  height={64}
                  preview={false}
                  className="rounded-md"
                />
                <div>
                  <Text strong className="text-lg">
                    {item.name}
                  </Text>
                  <br />
                  <Text type="secondary" className="text-sm">
                    {item.categoryName}
                  </Text>
                  <br />
                  <div className="flex items-center gap-2 my-2">
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
                  <Text className="text-base">Ціна: {item.price} ₴</Text>
                </div>
              </Space>
            </List.Item>
          )}
        />
        <Divider />
        {/* <OrderForm onClose={handlerCloseOrderForm} /> */}
      </Drawer>
    </>
  );
};

export default CartDrawer;
