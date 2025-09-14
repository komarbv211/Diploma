import { useParams } from "react-router-dom";
import { Spin, Tag, Descriptions, Card } from "antd";
import { useGetOrderByIdQuery } from "../../../services/admin/orderAdminApi";
import {
  OrderStatus,
  PaymentMethod,
  DeliveryType,
} from "../../../types/enums.ts";

const statusLabels: Record<OrderStatus, { label: string; color: string }> = {
  [OrderStatus.Pending]: { label: "Очікується", color: "orange" },
  [OrderStatus.Paid]: { label: "Сплачено", color: "blue" },
  [OrderStatus.Shipped]: { label: "Відправлено", color: "purple" },
  [OrderStatus.Completed]: { label: "Доставлено", color: "green" },
  [OrderStatus.Cancelled]: { label: "Скасовано", color: "red" },
};

const deliveryTypeLabels: Record<DeliveryType, string> = {
  [DeliveryType.Courier]: "Кур'єр",
  [DeliveryType.NovaPoshta]: "Нова Пошта",
};

const paymentMethodLabels: Record<PaymentMethod, string> = {
  [PaymentMethod.Cash]: "Готівка",
  [PaymentMethod.CreditCard]: "Оплата картою",
};

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useGetOrderByIdQuery(Number(id));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spin size="large" />
      </div>
    );
  }

  if (!order) return <p>Замовлення не знайдено</p>;

  return (
    <Card title={`Замовлення №${order.id}`}>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Дата">
          {order.dateCreated
            ? new Date(order.dateCreated).toLocaleString("uk-UA")
            : "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Покупець">
          {order.firstName} {order.lastName}
        </Descriptions.Item>
        <Descriptions.Item label="Email">{order.email}</Descriptions.Item>
        <Descriptions.Item label="Телефон">{order.phone}</Descriptions.Item>
        <Descriptions.Item label="Сума">
          {order.total ?? order.totalPrice} ₴
        </Descriptions.Item>
        <Descriptions.Item label="Статус">
          <Tag color={statusLabels[order.status].color}>
            {statusLabels[order.status].label}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Спосіб оплати">
          {paymentMethodLabels[order.paymentMethod]}
        </Descriptions.Item>
        <Descriptions.Item label="Доставка">
          {deliveryTypeLabels[order.deliveryType]}
        </Descriptions.Item>
        <Descriptions.Item label="Адреса доставки">
          {order.deliveryAddress
            ? order.deliveryAddress
            : `${order.city ?? ""} ${order.street ?? ""} ${order.house ?? ""} ${
                order.apartment ?? ""
              }`.trim()}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default OrderDetails;
