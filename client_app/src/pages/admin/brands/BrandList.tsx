import { useState } from "react";
import { Table, Button, Dropdown, Space, Spin } from "antd";
import { PlusOutlined, MoreOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { IBrand } from "../../../types/brand";
import {
  useDeleteBrandMutation,
  useGetBrandsQuery,
} from "../../../services/admin/brandAdminApi";
import SuccessIcon from "../../../components/icons/toasts/SuccessIcon";
import { showToast } from "../../../utilities/showToast";
import ErrorIcon from "../../../components/icons/toasts/ErrorIcon";

const BrandList = () => {
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [deleteBrand] = useDeleteBrandMutation();
  const { data: brands, isLoading } = useGetBrandsQuery();

  const handleDelete = async (id: number) => {
    try {
      await deleteBrand(id).unwrap();
      showToast("success", "Бренд видалено", <SuccessIcon/>);
    } catch {
      showToast("error", "Помилка при видаленні бренду", <ErrorIcon/>);
    }
  };

  const renderActions = (id: number) => (
    <Dropdown
      menu={{
        items: [
          { key: "edit", label: <Link to={`edit/${id}`}>Редагувати</Link> },
          {
            key: "delete",
            danger: true,
            label: <span onClick={() => handleDelete(id)}>Видалити</span>,
          },
        ],
      }}
      trigger={["click"]}
    >
      <Button icon={<MoreOutlined />} shape="circle" />
    </Dropdown>
  );

  const columns = [
    { title: "Назва", dataIndex: "name", key: "name" },
    {
      title: "Дії",
      key: "actions",
      render: (_: undefined, record: IBrand) => renderActions(record.id),
    },
  ];

  if (isLoading) return <Spin size="large" />;

  return (
    <div style={{ padding: 20 }}>
      <Space className="mb-5 flex justify-end">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("create")}
        >
          Додати бренд
        </Button>
      </Space>
      <Table<IBrand>
        rowKey="id"
        columns={columns}
        dataSource={brands}
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
      />
    </div>
  );
};

export default BrandList;
