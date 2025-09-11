import { useState } from "react";
import { Button, Space, Empty, Card, Layout } from "antd";
import UserSidebar from "../userPages/UserSidebar";
import { OrderDto } from "../../../types/order";

const OrderHistoryPage = () => {
  const [filter, setFilter] = useState("all");

  // const orders = [];
  const orders: OrderDto[] = [];

  const filters = [
    { key: "all", label: "Всі" },
    { key: "thisMonth", label: "Цього місяця" },
    { key: "lastMonth", label: "Минулого місяця" },
    { key: "thisYear", label: "Цього року" },
    { key: "lastYear", label: "Минулого року" },
  ];

  return (
    <Layout className="bg-white w-[93%] mx-auto font-manrope min-h-[750px]">
      <h1 className="text-[28px] font-bold mt-12 mb-6 text-center">
        Історія замовлень
      </h1>

      <div className="flex gap-6 mt-12">
        <UserSidebar />

        <div className="flex-1 font-manrope bg-white flex flex-col gap-5  mx-16">
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

          {orders.length == 0 ? (
            <div className="w-full flex flex-col items-center justify-center py-20">
              <Empty
                description={
                  <span className="text-[18px] text-gray-500">
                    Немає замовлень
                  </span>
                }
              />
            </div>
          ) : (
            <div className="w-full text-[24px]">
              {orders.map((order) => (
                <Card key={order.id} className="mb-4 w-full">
                  <p>
                    <strong>Замовлення №{order.id}</strong> — {order.date}
                  </p>
                  <p>Сума: {order.total} ₴</p>
                  <p>Статус: {order.status}</p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OrderHistoryPage;
