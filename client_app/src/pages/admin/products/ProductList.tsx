import { useState, useEffect, useMemo } from "react";
import {
  Table,
  Button,
  Dropdown,
  Input,
  Space,
  Spin,
  Image,
  Tag,
  MenuProps,
  Modal,
  Select,
  InputNumber,
} from "antd";
import { SearchOutlined, PlusOutlined, MoreOutlined } from "@ant-design/icons";
import { IProduct, IProductImageDto } from "../../../types/product";
import { APP_ENV } from "../../../env";
import PaginationComponent from "../../../components/pagination/PaginationComponent";
import React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useGetCategoryTreeQuery } from "../../../services/categoryApi";
import {
  useDeleteProductMutation,
  useGetAllProductsQuery,
  useSetProductPromotionMutation,
} from "../../../services/admin/productAdminApi";
import { useGetAllPromotionsQuery } from "../../../services/admin/promotionAdminApi";
import ErrorIcon from "../../../components/icons/toasts/ErrorIcon";
import { showToast } from "../../../utilities/showToast";
import SuccessIcon from "../../../components/icons/toasts/SuccessIcon";
import WarnIcon from "../../../components/icons/toasts/WarnIcon";

const filterProducts = (list: IProduct[], text: string) =>
  list.filter((product) =>
    product.name?.toLowerCase().includes(text.toLowerCase())
  );

interface ICategoryWithParent {
  id: number;
  name: string | null;
  parentId: number | null;
}

const ProductList = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [promotionModalVisible, setPromotionModalVisible] = useState(false);
  const [selectedPromotionId, setSelectedPromotionId] = useState<number | null>(
    null
  );
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  const navigate = useNavigate();

  const searchText = searchParams.get("search") || "";
  const currentPage = Number(searchParams.get("page") || "1");
  const pageSize = 10;

  const { data: allProducts, isLoading } = useGetAllProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const [setProductPromotion, { isLoading: isSettingPromotion }] =
    useSetProductPromotionMutation();
  const { data: promotions } = useGetAllPromotionsQuery();
  const { data: categories } = useGetCategoryTreeQuery();

  const categoryMap = useMemo(() => {
    const map = new Map<number, ICategoryWithParent>();
    categories?.forEach((cat) => map.set(cat.id, cat as ICategoryWithParent));
    return map;
  }, [categories]);

  const getParentCategoryName = (categoryId: number): string | undefined => {
    const category = categoryMap.get(categoryId);
    if (!category || !category.parentId) return undefined;
    const parent = categoryMap.get(category.parentId);
    return parent?.name ?? undefined;
  };

  const getChildCategoryName = (categoryId: number): string | undefined => {
    const child = categoryMap.get(categoryId);
    return child?.name ?? undefined;
  };

  useEffect(() => {
    if (allProducts) setProducts(allProducts);
  }, [allProducts]);

  const filteredProducts = useMemo(
    () => filterProducts(products, searchText),
    [products, searchText]
  );

  const pagedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id).unwrap();
      setProducts((prev) => {
        const upd = prev.filter((p) => p.id !== id);
        const filtered = filterProducts(upd, searchText);
        const total = filtered.length;
        const maxPage = Math.max(1, Math.ceil(total / pageSize));
        if (currentPage > maxPage)
          setSearchParams({ search: searchText, page: maxPage.toString() });
        return upd;
      });
      showToast("success", "Продукт успішно видалено", <SuccessIcon />);
    } catch {
      showToast("error", "Помилка видалення продукта", <ErrorIcon />);
    }
  };

  const renderActions = (id: number) => {
    const items: MenuProps["items"] = [
      { key: "edit", label: <Link to={`edit/${id}`}>Редагувати</Link> },
      {
        key: "delete",
        danger: true,
        label: <span onClick={() => handleDelete(id)}>Видалити</span>,
      },
    ];
    return (
      <Dropdown menu={{ items }} trigger={["click"]}>
        <Button icon={<MoreOutlined />} shape="circle" />
      </Dropdown>
    );
  };

  const handleApplyPromotion = async () => {
    if (!selectedPromotionId && discountPercent === 0) {
      showToast("warn", "Виберіть акцію або введіть знижку", <WarnIcon />);
      return;
    }

    try {
      await Promise.all(
        selectedRowKeys.map((productId) =>
          setProductPromotion({
            productId: Number(productId),
            promotionId: selectedPromotionId,
            discountPercent,
          }).unwrap()
        )
      );
      showToast(
        "success",
        "Акція застосована до вибраних продуктів",
        <SuccessIcon />
      );

      setPromotionModalVisible(false);
      setSelectedRowKeys([]);
    } catch {
      showToast("error", "Помилка при застосуванні акці", <ErrorIcon />);
    }
  };

  const columns = [
    {
      title: "Назва",
      dataIndex: "name",
      key: "name",
      sorter: (a: IProduct, b: IProduct) => a.name.localeCompare(b.name),
      render: (desc: string) =>
        desc.length > 50 ? desc.slice(0, 50) + "..." : desc,
    },
    {
      title: "Ціна",
      dataIndex: "price",
      key: "price",
      sorter: (a: IProduct, b: IProduct) => a.price - b.price,
      render: (price: number) => `${price} ₴`,
    },
    {
      title: "Кількість",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a: IProduct, b: IProduct) => a.quantity - b.quantity,
      render: (quantity: number) => quantity,
    },
    {
      title: "Категорія",
      key: "parentCategory",
      render: (_: unknown, product: IProduct) => {
        const parentName = getParentCategoryName(product.categoryId);
        return parentName ? parentName : <Tag color="blue">—</Tag>;
      },
    },
    {
      title: "Каталог",
      key: "childCategory",
      render: (_: unknown, product: IProduct) => {
        const childName = getChildCategoryName(product.categoryId);
        return childName ? childName : <Tag color="blue">—</Tag>;
      },
    },
    {
      title: "Опис",
      dataIndex: "description",
      key: "description",
      render: (desc?: string) =>
        desc ? (
          desc.length > 50 ? (
            desc.slice(0, 50) + "..."
          ) : (
            desc
          )
        ) : (
          <Tag color="blue">—</Tag>
        ),
    },
    {
      title: "Зображення",
      dataIndex: "images",
      key: "images",
      render: (images?: IProductImageDto[]) =>
        !images?.length || !images[0]?.name ? (
          <Tag color="blue">—</Tag>
        ) : (
          <Image
            width={60}
            src={`${APP_ENV.IMAGES_1200_URL}${images[0].name}`}
          />
        ),
    },
    {
      title: "Дії",
      key: "actions",
      render: (_: unknown, record: IProduct) => renderActions(record.id),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Space className="mb-5 flex justify-between" style={{ width: "100%" }}>
        <Input
          placeholder="Пошук продукту"
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
              onClick={() => setPromotionModalVisible(true)}
            >
              Вибрати акцію для {selectedRowKeys.length} продуктів
            </Button>
          )}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/admin/products/create")}
          >
            Додати продукт
          </Button>
        </Space>
      </Space>

      {isLoading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Table<IProduct>
            rowKey="id"
            columns={columns}
            dataSource={pagedProducts}
            pagination={false}
            rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
          />

          <PaginationComponent
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={filteredProducts.length}
            onPageChange={(page) =>
              setSearchParams({ search: searchText, page: page.toString() })
            }
          />
        </>
      )}

      <Modal
        title="Вибір акції"
        visible={promotionModalVisible}
        onOk={handleApplyPromotion}
        onCancel={() => setPromotionModalVisible(false)}
        confirmLoading={isSettingPromotion}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Select
            placeholder="Виберіть акцію"
            style={{ width: "100%" }}
            value={selectedPromotionId || undefined}
            onChange={(value) => setSelectedPromotionId(value)}
            allowClear
          >
            {promotions?.map((promo) => (
              <Select.Option key={promo.id} value={promo.id}>
                {promo.name}
              </Select.Option>
            ))}
          </Select>

          <InputNumber
            min={0}
            max={100}
            value={discountPercent}
            onChange={(value) => setDiscountPercent(Number(value))}
            addonAfter="%"
            style={{ width: "100%" }}
            placeholder="Розмір знижки"
          />
        </Space>
      </Modal>
    </div>
  );
};

export default ProductList;
