import { useState, useEffect, useMemo } from 'react';
import { Table, Button, Dropdown, Input, Space, Spin, Image, Tag, MenuProps, notification } from 'antd';
import { SearchOutlined, PlusOutlined, MoreOutlined } from '@ant-design/icons';
import { IProduct, IProductImageDto } from '../../../types/product';
import { APP_ENV } from '../../../env';
import PaginationComponent from '../../../components/pagination/PaginationComponent';
import React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useGetCategoriesNamesQuery } from '../../../services/categoryApi';
import { useDeleteProductMutation, useGetAllProductsQuery } from '../../../services/admin/productAdminApi';

const filterProducts = (list: IProduct[], text: string) =>
    list.filter(product => product.name?.toLowerCase().includes(text.toLowerCase()));

const ProductList = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const navigate = useNavigate();

    const searchText = searchParams.get('search') || '';
    const currentPage = Number(searchParams.get('page') || '1');
    const pageSize = 10;

    const { data: allProducts, isLoading } = useGetAllProductsQuery();
    const [deleteProduct] = useDeleteProductMutation();
    const { data: categoryNames } = useGetCategoriesNamesQuery();

    const categoryMap = useMemo(() => {
        const map = new Map<number, string>();
        categoryNames?.forEach(cat => map.set(cat.id, cat?.name ?? ''));
        return map;
    }, [categoryNames]);

    useEffect(() => {
        if (allProducts) {
            setProducts(allProducts);
        }
    }, [allProducts]);

    const filteredProducts = useMemo(() => filterProducts(products, searchText), [products, searchText]);

    const pagedProducts = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredProducts.slice(start, start + pageSize);
    }, [filteredProducts, currentPage, pageSize]);

    const handleDelete = async (id: number) => {
        try {
            await deleteProduct(id).unwrap();
            setProducts(prev => {
                const upd = prev.filter(p => p.id !== id);
                const filtered = filterProducts(upd, searchText);
                const total = filtered.length;
                const maxPage = Math.max(1, Math.ceil(total / pageSize));
                if (currentPage > maxPage) setSearchParams({ search: searchText, page: maxPage.toString() });
                return upd;
            });
            notification.success({
                message: "Продукт видалено",
                description: "Продукт успішно видалено!",
            });
        } catch {
            notification.error({
                message: "Помилка видалення продукта",
            });
        }
    };

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

    const columns = [
        {
            title: 'Назва',
            dataIndex: 'name',
            key: 'name',
            sorter: (a: IProduct, b: IProduct) => a.name.localeCompare(b.name),
            render: (desc: string) => desc.length > 50 ? desc.slice(0, 50) + '...' : desc,
        },
        {
            title: 'Ціна',
            dataIndex: 'price',
            key: 'price',
            sorter: (a: IProduct, b: IProduct) => a.price - b.price,
            render: (price: number) => `${price} ₴`,
        },
        {
            title: 'Категорія',
            dataIndex: 'category',
            key: 'category',
            sorter: (a: IProduct, b: IProduct) =>
                (categoryMap.get(a.categoryId) ?? '').localeCompare(categoryMap.get(b.categoryId) ?? ''),
            render: (_: any, cat: IProduct) => categoryMap.get(cat.categoryId) ?? <Tag color="blue">—</Tag>,
        },
        {
            title: 'Опис',
            dataIndex: 'description',
            key: 'description',
            render: (desc?: string) => desc ? (desc.length > 50 ? desc.slice(0, 50) + '...' : desc)
                : <Tag color="blue">—</Tag>,
        },
        {
            title: 'Зображення',
            dataIndex: 'images',
            key: 'images',
            render: (images?: IProductImageDto[]) =>
                !images?.length || !images[0]?.name
                    ? <Tag color="blue">—</Tag>
                    : <Image width={60} src={`${APP_ENV.IMAGES_1200_URL}${images[0].name}`} />
        },
        {
            title: 'Дії',
            key: 'actions',
            render: (_: unknown, record: IProduct) => renderActions(record.id),
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <Space className="mb-5 flex justify-between" style={{ width: '100%' }}>
                <Input
                    placeholder="Пошук продукту"
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => { setSearchParams({ search: e.target.value, page: '1' }) }}
                    style={{ width: 200 }}
                />
                <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/admin/products/create')}>
                    Додати продукт
                </Button>
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
                        rowSelection={{
                            selectedRowKeys,
                            onChange: setSelectedRowKeys,
                        }}
                    />

                    <PaginationComponent
                        currentPage={currentPage}
                        pageSize={pageSize}
                        totalItems={filteredProducts.length}
                        onPageChange={(page) => setSearchParams({ search: searchText, page: page.toString() })}
                    />
                </>
            )}
        </div>
    );
};

export default ProductList;
