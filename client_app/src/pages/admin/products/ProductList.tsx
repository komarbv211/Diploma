import { useState, useEffect } from 'react';
import { Table, Button, Dropdown, Menu, Input, Space, Spin, Image, Tag } from 'antd';
import { DownOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { IProduct } from '../../../types/product';
import { APP_ENV } from '../../../env';
import PaginationComponent from '../../../components/pagination/PaginationComponent';
import React from 'react';
import { useGetAllProductsQuery } from '../../../services/productApi';

const ProductList = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const pageSize = 10;

    const { data: allProducts, isLoading } = useGetAllProductsQuery();

    useEffect(() => {
        if (allProducts) {
            setProducts(allProducts);
        }
    }, [allProducts]);

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const pagedProducts = filteredProducts.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

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
                (a.category?.name || '').localeCompare(b.category?.name || ''),
            render: (category: IProduct['category']) => (
                <Tag color="blue">{category?.name || '—'}</Tag>
            ),
        },
        {
            title: 'Опис',
            dataIndex: 'description',
            key: 'description',
            render: (desc: string) => desc.length > 80 ? desc.slice(0, 80) + '...' : desc,
        },
        {
            title: 'Зображення',
            dataIndex: 'imagePaths',
            key: 'imagePaths',
            render: (image: string) =>
                image ? <Image width={60} src={`${APP_ENV.IMAGES_1200_URL}${image}`} />
                    : <Tag color="blue">—</Tag>,
        },
        {
            title: 'Дії',
            key: 'actions',
            render: (_: unknown, record: IProduct) => (
                <Dropdown
                    overlay={
                        <Menu>
                            <Menu.Item onClick={() => console.log('edit', record)}>
                                Редагувати
                            </Menu.Item>
                            <Menu.Item onClick={() => console.log('delete', record)}>
                                Видалити
                            </Menu.Item>
                        </Menu>
                    }
                >
                    <Button>
                        Дії <DownOutlined />
                    </Button>
                </Dropdown>
            ),
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <Space className="mb-5 flex justify-between" style={{ width: '100%' }}>
                <Input
                    placeholder="Пошук продукту"
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => {
                        setSearchText(e.target.value);
                        setCurrentPage(1);
                    }}
                    style={{ width: 200 }}
                />
                <Button type="primary" icon={<PlusOutlined />}>
                    Додати продукт
                </Button>
            </Space>

            {isLoading ? (
                <Spin />
            ) : (
                <>
                    <Table<IProduct>
                        rowKey="name"
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
                        onPageChange={setCurrentPage}
                    />
                </>
            )}
        </div>
    );
};

export default ProductList;
