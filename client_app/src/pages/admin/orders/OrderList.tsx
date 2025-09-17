import { useState, useMemo } from "react";
import {
  Table,
  Button,
  Dropdown,
  Space,
  Spin,
  Tag,
  MenuProps,
  notification,
  Modal,
  Select,
  Input,
} from "antd";
import { MoreOutlined, SearchOutlined } from "@ant-design/icons";
import { Link, useSearchParams } from "react-router-dom";
import PaginationComponent from "../../../components/pagination/PaginationComponent";
import {
  useGetAllOrdersQuery,
  useDeleteOrderMutation,
  useUpdateOrderStatusMutation,
} from "../../../services/admin/orderAdminApi";
import { OrderDto } from "../../../types/order";
import {
  DeliveryType,
  OrderStatus,
  PaymentMethod,
} from "../../../types/enums.ts";
import { showToast } from "../../../utilities/showToast.ts";
import SuccessIcon from "../../../components/icons/toasts/SuccessIcon.tsx";
import ErrorIcon from "../../../components/icons/toasts/ErrorIcon.tsx";
import WarnIcon from "../../../components/icons/toasts/WarnIcon.tsx";

const statusLabels: Record<OrderStatus, { label: string; color: string }> = {
  [OrderStatus.Pending]: { label: "Очікується", color: "orange" },
  [OrderStatus.Paid]: { label: "Сплачено", color: "blue" },
  [OrderStatus.Shipped]: { label: "Відправлено", color: "violet" },
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

const OrderList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(
    null
  );
  const [pendingOrderIds, setPendingOrderIds] = useState<number[]>([]);

  const searchText = searchParams.get("search") || "";
  const currentPage = Number(searchParams.get("page") || "1");
  const pageSize = 10;

  const { data: orders, isLoading } = useGetAllOrdersQuery();
  const [deleteOrder] = useDeleteOrderMutation();
  const [updateOrderStatus, { isLoading: isUpdatingStatus }] =
    useUpdateOrderStatusMutation();

  const filteredOrders = useMemo(
    () =>
      orders?.filter(
        (order) =>
          order.email.toLowerCase().includes(searchText.toLowerCase()) ||
          `${order.firstName} ${order.lastName}`
            .toLowerCase()
            .includes(searchText.toLowerCase())
      ) || [],
    [orders, searchText]
  );
  
  const pagedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  const handleStatusChange = async () => {
    if (!selectedStatus) {
      showToast("warn", "Оберіть статус замовлення", <WarnIcon/>);
      return;
    }

    if (pendingOrderIds.length === 0) {
      showToast("warn", "Не обрано замовлення для зміни статусу", <WarnIcon/>);
      return;
    }

    try {
      await Promise.all(
        pendingOrderIds.map((orderId) =>
          updateOrderStatus({ id: orderId, status: selectedStatus }).unwrap()
        )
      );

      showToast("success", "Статус оновлено", <SuccessIcon/>);
      setStatusModalVisible(false);
      setSelectedRowKeys([]);
      setPendingOrderIds([]);
      setSelectedStatus(null);
    } catch {
      showToast("error", "Помилка при оновленні статусу", <ErrorIcon/>);
    }
  };

  const openStatusModal = (orderIds: number[]) => {
    setPendingOrderIds(orderIds);
    setSelectedStatus(null);
    setStatusModalVisible(true);
  };

  const renderActions = (orderId: number) => {
    const items: MenuProps["items"] = [
      { key: "view", label: <Link to={`order/${orderId}`}>Переглянути</Link> },
      {
        key: "edit",
        label: (
          <span onClick={() => openStatusModal([orderId])}>Змінити статус</span>
        ),
      },
      {
        key: "delete",
        danger: true,
        label: (
          <span
            onClick={async () => {
              try {
                await deleteOrder(orderId).unwrap();
                notification.success({ message: "Замовлення видалено" });
              } catch {
                notification.error({ message: "Помилка видалення" });
              }
            }}
          >
            Видалити
          </span>
        ),
      },
    ];
    return (
      <Dropdown menu={{ items }} trigger={["click"]}>
        <Button icon={<MoreOutlined />} shape="circle" />
      </Dropdown>
    );
  };

  const columns = [
    { title: "№ Замовлення", dataIndex: "id", key: "id" },
    {
      title: "Дата",
      dataIndex: "dateCreated",
      key: "dateCreated",
      render: (date: string) =>
        date ? new Date(date).toLocaleString("uk-UA") : "-",
    },
    {
      title: "Покупець",
      key: "customerName",
      render: (order: OrderDto) => `${order.firstName} ${order.lastName}`,
    },
    {
      title: "Сума",
      key: "total",
      render: (order: OrderDto) => `${order.total ?? order.totalPrice} ₴`,
    },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
      render: (status: OrderStatus) => (
        <Tag color={statusLabels[status].color}>
          {statusLabels[status].label}
        </Tag>
      ),
    },
    {
      title: "Спосіб оплати",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (payment: PaymentMethod) =>
        paymentMethodLabels[payment] || payment,
    },
    {
      title: "Доставка",
      dataIndex: "deliveryType",
      key: "deliveryType",
      render: (delivery: DeliveryType) =>
        deliveryTypeLabels[delivery] || delivery,
    },
    {
      title: "Дії",
      key: "actions",
      render: (_: unknown, record: OrderDto) => renderActions(record.id),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Space className="mb-5 flex justify-between" style={{ width: "100%" }}>
        <Input
          placeholder="Пошук по замовленнях"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) =>
            setSearchParams({ search: e.target.value, page: "1" })
          }
          style={{ width: 200 }}
        />
        <Space>
          {selectedRowKeys.length > 0 && (
            <Button
              type="primary"
              onClick={() =>
                openStatusModal(selectedRowKeys.map((k) => Number(k)))
              }
            >
              Змінити статус для {selectedRowKeys.length} замовлень
            </Button>
          )}
        </Space>
      </Space>

      {isLoading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Table<OrderDto>
            rowKey="id"
            columns={columns}
            dataSource={pagedOrders}
            pagination={false}
            rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
          />
          <PaginationComponent
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={filteredOrders.length}
            onPageChange={(page) =>
              setSearchParams({ search: searchText, page: page.toString() })
            }
          />
        </>
      )}

      <Modal
        title="Змінити статус замовлення"
        open={statusModalVisible}
        onOk={handleStatusChange}
        onCancel={() => setStatusModalVisible(false)}
        confirmLoading={isUpdatingStatus}
      >
        <Select
          placeholder="Оберіть статус"
          className="my-3 p-5 border rounded-xl border-g"
          style={{ width: "100%" }}
          value={selectedStatus ?? undefined}
          onChange={(value: OrderStatus) => setSelectedStatus(value)}
        >
          {Object.keys(OrderStatus)
            .filter((key) => isNaN(Number(key)))
            .map((key) => {
              const status = OrderStatus[key as keyof typeof OrderStatus];
              return (
                <Select.Option key={status} value={status}>
                  {statusLabels[status].label}
                </Select.Option>
              );
            })}
        </Select>
      </Modal>
    </div>
  );
};

export default OrderList;
