import { useState } from "react";
import { Button, Space, Empty, Layout, Spin, Collapse } from "antd";
import UserSidebar from "../userPages/UserSidebar";
import { useGetMyOrdersQuery } from "../../../services/orderApi";
import { OrderHistoryDto, OrderHistoryItemDto } from "../../../types/order";
import { OrderStatus } from "../../../types/enums";
import { DownOutlined } from "@ant-design/icons";
import { APP_ENV } from "../../../env";

const { Panel } = Collapse;

const OrderHistoryPage = () => {
  const { data: orders = [], isLoading, error } = useGetMyOrdersQuery();

  const [activeKey, setActiveKey] = useState<string | string[]>();

  type FilterType = "all" | "thisMonth" | "lastMonth" | "thisYear" | "lastYear";
  const [filter, setFilter] = useState<FilterType>("all");

  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "Усі" },
    { key: "thisMonth", label: "Цього місяця" },
    { key: "lastMonth", label: "Минулого місяця" },
    { key: "thisYear", label: "Цього року" },
    { key: "lastYear", label: "Минулого року" },
  ];

  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.dateCreated);
    const now = new Date();
    switch (filter) {
      case "thisMonth":
        return (
          orderDate.getMonth() == now.getMonth() &&
          orderDate.getFullYear() == now.getFullYear()
        );
      case "lastMonth": {
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
        return (
          orderDate.getMonth() == lastMonth.getMonth() &&
          orderDate.getFullYear() == lastMonth.getFullYear()
        );
      }
      case "thisYear":
        return orderDate.getFullYear() == now.getFullYear();
      case "lastYear":
        return orderDate.getFullYear() == now.getFullYear() - 1;
      default:
        return true;
    }
  });

  return (
    <Layout className="bg-white w-[93%] mx-auto font-manrope min-h-[810px]">
      <h1 className="text-[28px] font-bold mt-12 mb-6 text-center">
        Історія замовлень
      </h1>

      <div className="flex gap-6 mt-12">
        <UserSidebar />

        <div className="flex-1 font-manrope bg-white flex flex-col gap-5 mx-16">
          <p className="text-[24px]">Ваші замовлення</p>

          <Space wrap>
            {filters.map((f) => (
              <Button
                key={f.key}
                type={filter === f.key ? "primary" : "default"}
                onClick={() => setFilter(f.key)}
                className={`font-manrope py-5 !rounded-xl text-[18px] ${
                  filter === f.key
                    ? "!bg-pink2 !text-white !border-pink2"
                    : "!bg-white !text-black !border-gray-300 hover:!border-pink2 hover:!text-pink2"
                }`}
              >
                {f.label}
              </Button>
            ))}
          </Space>

          {isLoading ? (
            <div className="w-full flex justify-center py-20">
              <Spin size="large" />
            </div>
          ) : error ? (
            <p className="text-red-500 text-[18px] py-20 text-center font-manrope">
              Помилка завантаження замовлень
            </p>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-start ml-[34%] py-20 font-manrope">
              <Empty
                description={
                  <span className="text-[18px] text-gray-500">
                    Немає замовлень
                  </span>
                }
              />
            </div>
          ) : (
            <Collapse
              accordion
              onChange={(key) => setActiveKey(key)}
              expandIcon={({ isActive }) => (
                <DownOutlined
                  rotate={isActive ? 180 : 0}
                  className="absolute top-1/2 -translate-x-1/5 -translate-y-1/2"
                />
              )}
              className="w-full [&_.ant-collapse-header]:!px-5 [&_.ant-collapse-header]:relative [&_.ant-collapse-content-box]:!px-4 rounded-xl bg-white font-manrope"
            >
              {filteredOrders.map((order: OrderHistoryDto) => (
                <Panel
                  key={order.id}
                  header={
                    <div className="flex justify-between items-center w-full py-2 pl-5 text-[18px]">
                      <div className="flex flex-col">
                        <span>
                          Замовлення №{order.id} —{" "}
                          {order.dateCreated
                            ? new Date(order.dateCreated).toLocaleString(
                                "uk-UA",
                                {
                                  dateStyle: "long",
                                  timeStyle: "short",
                                }
                              )
                            : "-"}
                        </span>
                        <span className="text-green-600 mt-2">
                          {order.status == OrderStatus.Completed
                            ? "Доставлено"
                            : "В обробці"}
                        </span>
                      </div>
                      <div
                        className={`flex items-center gap-4 transition-all duration-500 ease-in-out ${
                          activeKey == order.id.toString()
                            ? "opacity-0 -translate-y-2 pointer-events-none"
                            : "opacity-100 translate-y-0"
                        }`}
                      >
                        <span>{order.totalPrice} ₴</span>
                      </div>
                      <div className="flex items-center gap-2 w-[10%] flex-shrink-0 flex-row-reverse">
                        {order.items?.slice(0, 2).map((item, idx) => (
                          <img
                            key={idx}
                            src={`${APP_ENV.IMAGES_200_URL}${
                              item.imageUrl || "NoImage.png"
                            }`}
                            width={40}
                            height={40}
                            alt={item.name}
                            className="object-cover rounded"
                            onError={(e) =>
                              (e.currentTarget.src = "/NoImage.png")
                            }
                          />
                        ))}

                        {order.items && order.items.length > 2 && (
                          <div className="font-manrope flex items-center justify-center text-pink font-semibold mr-3">
                            +{order.items.length - 2}
                          </div>
                        )}
                      </div>
                    </div>
                  }
                >
                  <div className="flex flex-col gap-4 text-[18px] font-manrope">
                    {order.items?.map(
                      (item: OrderHistoryItemDto, idx: number) => (
                        <div
                          key={idx}
                          className="grid grid-cols-3 items-center gap-4"
                        >
                          <div className="flex gap-4 items-center">
                            <img
                              src={`${APP_ENV.IMAGES_200_URL}${
                                item.imageUrl || "NoImage.png"
                              }`}
                              width={110}
                              height={120}
                              alt={item.name}
                              className="object-cover rounded-lg flex-shrink-0 w-12 h-12"
                              onError={(e) => {
                                console.warn("Image not found:", item.imageUrl);
                                e.currentTarget.src = "/NoImage.png";
                              }}
                            />
                            <p>
                              {item.name.length > 40
                                ? item.name.slice(0, 40) + "..."
                                : item.name}
                            </p>
                          </div>
                          <div className="text-center">{item.quantity} шт.</div>
                          <div className="flex justify-end">
                            {item.price * item.quantity} ₴
                          </div>
                        </div>
                      )
                    )}
                    <hr className="my-3 border border-[#d9d9d9] rounded" />
                    <div className="flex items-center justify-between font-semibold text-[18px]">
                      <p>Разом</p>
                      <div className="flex justify-between text-base font-semibold">
                        <p>{order.totalPrice} ₴</p>
                      </div>
                    </div>
                    <p
                      defaultValue={">"}
                      className="absolute right-1/2 translate-x-1/2 text-gray-500"
                    />
                  </div>
                </Panel>
              ))}
            </Collapse>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OrderHistoryPage;
