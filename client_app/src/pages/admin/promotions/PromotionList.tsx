import React, { useState, useEffect, useMemo } from 'react';
import { Table, Button, Dropdown, Input, Space, Spin, Image, Tag, notification, Modal, List } from 'antd';
import { SearchOutlined, PlusOutlined, MoreOutlined } from '@ant-design/icons';
import { IPromotion } from '../../../types/promotion';
import {IProduct, IProductSetPromotionRequest} from '../../../types/product';
import { APP_ENV } from '../../../env';
import PaginationComponent from '../../../components/pagination/PaginationComponent';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDeletePromotionMutation, useGetAllPromotionsQuery } from '../../../services/admin/promotionAdminApi';
import { productApi } from '../../../services/productApi.ts';
import { useAppDispatch } from '../../../store/store.ts';
import { useSetProductPromotionMutation } from '../../../services/admin/productAdminApi';

const filterPromotions = (list: IPromotion[], text: string) =>
    list.filter(p => p.name?.toLowerCase().includes(text.toLowerCase()));

const PromotionList: React.FC = () => {
    const [promotions, setPromotions] = useState<IPromotion[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [productsModalVisible, setProductsModalVisible] = useState(false);
    const [currentProductsIds, setCurrentProductsIds] = useState<number[]>([]);
    const [currentProducts, setCurrentProducts] = useState<IProduct[]>([]);
    const [descriptionModalVisible, setDescriptionModalVisible] = useState(false);
    const [descriptionModalText, setDescriptionModalText] = useState('');

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const searchText = searchParams.get('search') || '';
    const currentPage = Number(searchParams.get('page') || '1');
    const pageSize = 10;

    const { data: allPromotions, isLoading } = useGetAllPromotionsQuery();
    const [deletePromotion, { isLoading: isDeleting }] = useDeletePromotionMutation();
    const [setProductPromotion] = useSetProductPromotionMutation();

    useEffect(() => {
        if (allPromotions) setPromotions(allPromotions);
    }, [allPromotions]);

    useEffect(() => {
        if (currentProductsIds.length === 0) return;

        let isMounted = true;

        const fetchProducts = async () => {
            try {
                const results = await Promise.all(
                    currentProductsIds.map(async (id) => {
                        try {
                            const product = await dispatch(
                                productApi.endpoints.getProductById.initiate(id)
                            ).unwrap();
                            return product;
                        } catch {
                            return null;
                        }
                    })
                );

                if (isMounted) {
                    setCurrentProducts(results.filter(Boolean) as IProduct[]);
                }
            } catch {
                notification.error({ message: 'Помилка завантаження продуктів' });
            }
        };

        fetchProducts();

        return () => {
            isMounted = false;
        };
    }, [currentProductsIds, dispatch]);

    const handleUnlinkProduct = async (productId: number) => {
        try {
            const payload: IProductSetPromotionRequest = {
                productId,
                promotionId: null, // 🔹 розрив прив’язки
                discountPercent: 0,
            };

            await setProductPromotion(payload).unwrap();

            notification.success({
                message: "Продукт відв'язано",
                description: "Продукт успішно видалено з акції!",
            });

            setCurrentProducts(prev => prev.filter(p => p.id !== productId));
        } catch {
            notification.error({
                message: "Помилка",
                description: "Не вдалося відв'язати продукт від акції",
            });
        }
    };


    const filteredPromotions = useMemo(() => filterPromotions(promotions, searchText), [promotions, searchText]);
    const pagedPromotions = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredPromotions.slice(start, start + pageSize);
    }, [filteredPromotions, currentPage, pageSize]);

    const handleDelete = async (id: number) => {
        try {
            await deletePromotion(id).unwrap();
            notification.success({ message: "Акцію видалено", description: "Акцію успішно видалено!" });
        } catch (error) {
            notification.error({
                message: "Помилка видалення акції",
                description: (error as any)?.data?.message || "Спробуйте пізніше",
            });
        }
    };

    const openProductsModal = (productsIds?: number[]) => {
        if (productsIds && productsIds.length > 0) {
            setCurrentProductsIds(productsIds);
            setProductsModalVisible(true);
        } else {
            notification.warning({
                message: "Продукти відсутні",
                description: "Ця акція не містить продуктів.",
            });
        }
    };

    const openDescriptionModal = (desc: string) => {
        setDescriptionModalText(desc);
        setDescriptionModalVisible(true);
    };

    const renderActions = (promotion: IPromotion) => {
        const items = [
            { key: "edit", label: <Link to={`edit/${promotion.id}`}>Редагувати</Link> },
            {
                key: "delete",
                danger: true,
                label: (
                    <span
                        onClick={() => {
                            if (window.confirm('Ви впевнені, що хочете видалити цю акцію?')) {
                                handleDelete(promotion.id);
                            }
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        Видалити
                    </span>
                ),
            },
            {
                key: "products",
                label: "Переглянути продукти",
                onClick: () => openProductsModal(promotion.productIds),
            },
        ];
        return (
            <Dropdown menu={{ items }} trigger={["click"]}>
                <Button icon={<MoreOutlined />} shape="circle" loading={isDeleting} />
            </Dropdown>
        );
    };

    const columns = [
        { title: 'Назва', dataIndex: 'name', key: 'name', sorter: (a: IPromotion, b: IPromotion) => a.name.localeCompare(b.name) },
        {
            title: 'Опис',
            dataIndex: 'description',
            key: 'description',
            render: (desc?: string) => {
                if (!desc) return <Tag color="blue">—</Tag>;
                const shortText = desc.length > 50 ? desc.slice(0, 50) + '...' : desc;
                return (
                    <>
                        {shortText}{' '}
                        {desc.length > 50 && (
                            <Button type="link" onClick={() => openDescriptionModal(desc)}>
                                Більше
                            </Button>
                        )}
                    </>
                );
            },
        },
        { title: 'Дата початку', dataIndex: 'startDate', key: 'startDate', render: (date: string) => <Tag color="green">{new Date(date).toLocaleDateString()}</Tag> },
        { title: 'Дата завершення', dataIndex: 'endDate', key: 'endDate', render: (date: string) => <Tag color="red">{new Date(date).toLocaleDateString()}</Tag> },
        { title: 'Зображення', dataIndex: 'imageUrl', key: 'imageUrl', render: (img?: string) => img ? <Image width={60} src={`${APP_ENV.IMAGES_1200_URL}${img}`} style={{ borderRadius: 8 }} /> : <Tag color="default">—</Tag> },
        { title: 'Статус', dataIndex: 'isActive', key: 'isActive', render: (isActive: boolean) => isActive ? <Tag color="success">Активна</Tag> : <Tag color="error">Неактивна</Tag> },
        { title: 'Дії', key: 'actions', render: (_: unknown, record: IPromotion) => renderActions(record) },
    ];

    return (
        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Space className="mb-5 flex justify-between" style={{ width: '100%' }}>
                <Input
                    placeholder="Пошук акції"
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => setSearchParams({ search: e.target.value, page: '1' })}
                    style={{ width: 200 }}
                />
                <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/admin/promotions/create')}>
                    Додати акцію
                </Button>
            </Space>

            {isLoading ? (
                <div className="flex justify-center items-center" style={{ height: '60vh' }}>
                    <Spin size="large" />
                </div>
            ) : (
                <>
                    <Table<IPromotion>
                        rowKey="id"
                        columns={columns}
                        dataSource={pagedPromotions}
                        pagination={false}
                        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
                    />
                    <PaginationComponent
                        currentPage={currentPage}
                        pageSize={pageSize}
                        totalItems={filteredPromotions.length}
                        onPageChange={(page) => setSearchParams({ search: searchText, page: page.toString() })}
                    />
                </>
            )}

            <Modal
                title="Повний опис акції"
                open={descriptionModalVisible}
                onCancel={() => setDescriptionModalVisible(false)}
                footer={null}
            >
                <p>{descriptionModalText}</p>
            </Modal>

            <Modal
                title="Продукти акції"
                open={productsModalVisible}
                onCancel={() => setProductsModalVisible(false)}
                footer={null}
                width={600}
            >
                {currentProductsIds.length > 0 && currentProducts.length === 0 ? (
                    <Spin />
                ) : currentProducts.length > 0 ? (
                    <List
                        itemLayout="vertical"
                        dataSource={currentProducts}
                        renderItem={(product: IProduct) => (
                            <List.Item key={product.id}>
                                <List.Item.Meta
                                    title={`${product.name} - ${product.price}₴`}
                                    description={product.description || 'Без опису'}
                                />
                                {product.images && product.images.length > 0 && (
                                    <Image width={80} src={`${APP_ENV.IMAGES_1200_URL}${product.images[0].name}`} />
                                )}
                                <Button
                                    danger
                                    onClick={() => handleUnlinkProduct(product.id)}
                                    style={{ marginTop: 10 }}
                                >
                                    Видалити з акції
                                </Button>
                            </List.Item>
                        )}
                    />
                ) : (
                    <p>Продукти відсутні для цієї акції</p>
                )}
            </Modal>
        </div>
    );
};

export default PromotionList;
