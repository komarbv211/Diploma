import { useState, useEffect } from 'react';
import {
  MenuProps,
  Table,
  Button,
  Dropdown, 
  Input,
  Space,
  Spin,
  message,
  notification,
  Image,
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import { Link} from "react-router-dom";
import { ICategory } from '../../../types/category';
import { useGetCategoryTreeQuery } from '../../../services/categoryApi';
import PaginationComponent from '../../../components/pagination/PaginationComponent';
import React from 'react';
import { APP_ENV } from '../../../env';
import { useDeleteCategoryMutation } from '../../../services/admin/categoryAdmnApi';

const CategoryList = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loadingChildrenIds, setLoadingChildrenIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteCategory] = useDeleteCategoryMutation();

  const pageSize = 10;

  const {
    data: rootCategories,
    isLoading: isLoadingRoot,
  } = useGetCategoryTreeQuery();

  useEffect(() => {
    if (rootCategories) {
      const roots = rootCategories.filter((cat) => !cat.parentId);
      setCategories(roots);
    }
  }, [rootCategories]);

  const fetchChildren = async (parentId: number) => {
    if (loadingChildrenIds.includes(parentId)) return;

    try {
      setLoadingChildrenIds((prev) => [...prev, parentId]);
      const response = await fetch(`/api/category/children/${parentId}`);
      if (!response.ok) throw new Error('Failed to fetch children');
      const children: ICategory[] = await response.json();

      setCategories((prevCategories) => {
        const addChildren = (cats: ICategory[]): ICategory[] =>
          cats.map((cat) => {
            if (cat.id === parentId) {
              return { ...cat, children };
            } else if (cat.children) {
              return { ...cat, children: addChildren(cat.children) };
            }
            return cat;
          });
        return addChildren(prevCategories);
      });
    } catch (error) {
      message.error(`Не вдалося завантажити дочірні категорії: ${error}`);
    } finally {
      setLoadingChildrenIds((prev) => prev.filter((id) => id !== parentId));
    }
  };

  const handleExpand = (expanded: boolean, record: ICategory) => {
    if (expanded) {
      if (!record.children || record.children.length === 0) {
        fetchChildren(record.id);
      }
      setExpandedRowKeys((prev) => [...prev, record.id]);
    } else {
      setExpandedRowKeys((prev) => prev.filter((id) => id !== record.id));
    }
  };

  const filterCategories = (data: ICategory[]): ICategory[] =>
    data
      .map((cat) => {
        const filteredChildren = cat.children
          ? filterCategories(cat.children)
          : [];
        const isMatched = cat.name
          .toLowerCase()
          .includes(searchText.toLowerCase());
        if (isMatched || filteredChildren.length > 0) {
          return {
            ...cat,
            children:
              filteredChildren.length > 0 ? filteredChildren : undefined,
          };
        }
        return null;
      })
      .filter(Boolean) as ICategory[];

  const filteredCategories = filterCategories(categories);

  // Застосовуємо пагінацію — беремо тільки категорії поточної сторінки
  const pagedCategories = filteredCategories.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const renderActions = (id: number) => {
      const items: MenuProps["items"] = [
          { key: "edit", label: <Link to={`edit/${id}`}>Редагувати</Link> },
          { key: "delete", danger: true, label: <span onClick={() => handleDelete(id)}>Видалити</span> },
      ];
      return (
          <Dropdown menu={{ items }} trigger={["click"]}>
              <Button icon={<MoreOutlined />} shape="circle" />
          </Dropdown>
      );
  };
  const handleDelete = async (id: number) => {
      try {
          await deleteCategory(id).unwrap();
          notification.success({
              message: "Категорія видалена",
              description: "Категорія успішно видалена!",
          });
      } catch {
          notification.error({
              message: "Помилка видалення категорії",
          });
      }
  };
  const columns = [
    {
      title: 'Назва',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: ICategory, b: ICategory) => a.name.localeCompare(b.name),
    },
    {
      title: 'Slug',
      dataIndex: 'urlSlug',
      key: 'urlSlug',
      sorter: (a: ICategory, b: ICategory) =>
        a.urlSlug.localeCompare(b.urlSlug),
    },
    {
      title: 'Пріоритет',
      dataIndex: 'priority',
      key: 'priority',
      sorter: (a: ICategory, b: ICategory) =>
        (a.priority ?? 0) - (b.priority ?? 0),
    },
    {
      title: 'Опис',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Зображення',
      dataIndex: 'image',
      key: 'image',
      render: (image: string) =>
        image ? <Image width={60} src={`${APP_ENV.IMAGES_1200_URL}${image}`} /> : '—',
    },
    {
      title: 'Дії',
      key: 'actions',
      render: (_: unknown, record: ICategory) => renderActions(record.id),
    }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Space className="mb-5 flex justify-between">
        <Input
          placeholder="Пошук"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setCurrentPage(1); // скидаємо на першу сторінку при пошуку
          }}
          style={{ width: 200 }}
        />
        <Button type="primary" icon={<PlusOutlined />}>
          Додати категорію
        </Button>
      </Space>

      {isLoadingRoot && <Spin />}

      {!isLoadingRoot && (
        <Table<ICategory>
          rowKey="id"
          columns={columns}
          dataSource={pagedCategories}
          pagination={false}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          expandable={{
            expandedRowKeys,
            onExpand: handleExpand,
            rowExpandable: (record) => !record.parentId,
            expandIconColumnIndex: 0,
            expandIcon: ({ expanded, onExpand, record }) => {
              if (record.parentId) return null;
              if (loadingChildrenIds.includes(record.id)) {
                return <Spin size="small" style={{ marginLeft: 12 }} />;
              }
              return (
                <Button
                  type="link"
                  size="small"
                  onClick={(e) => onExpand(record, e)}
                  style={{ marginLeft: 12 }}
                >
                  {expanded ? '-' : '+'}
                </Button>
              );
            },
          }}
          rowClassName={(record) =>
            record.parentId ? 'child-category-row' : ''
          }
        />
      )}

      <PaginationComponent
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={filteredCategories.length}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default CategoryList;
