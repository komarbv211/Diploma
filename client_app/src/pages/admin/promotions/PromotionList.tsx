import { useState, useEffect, useMemo } from 'react';
import { Table, Button, Dropdown, Input, Space, Spin, Image, Tag, MenuProps, notification } from 'antd';
import { SearchOutlined, PlusOutlined, MoreOutlined } from '@ant-design/icons';
import { IPromotion } from '../../../types/promotion';
import { APP_ENV } from '../../../env';
import PaginationComponent from '../../../components/pagination/PaginationComponent';
import React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDeletePromotionMutation, useGetAllPromotionsQuery } from '../../../services/admin/promotionAdminApi';

const filterPromotions = (list: IPromotion[], text: string) =>
    list.filter(promotion => promotion.name?.toLowerCase().includes(text.toLowerCase()));

const PromotionList = () => {
    const [promotions, setPromotions] = useState<IPromotion[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const navigate = useNavigate();

    const searchText = searchParams.get('search') || '';
    const currentPage = Number(searchParams.get('page') || '1');
    const pageSize = 10;

    const { data: allPromotions, isLoading } = useGetAllPromotionsQuery();
    const [deletePromotion, { isLoading: isDeleting }] = useDeletePromotionMutation();

    useEffect(() => {
        if (allPromotions) {
            setPromotions(allPromotions);
        }
    }, [allPromotions]);

    const filteredPromotions = useMemo(() => filterPromotions(promotions, searchText), [promotions, searchText]);

    const pagedPromotions = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredPromotions.slice(start, start + pageSize);
    }, [filteredPromotions, currentPage, pageSize]);

    const handleDelete = async (id: number) => {
        try {
            await deletePromotion(id).unwrap();
            notification.success({
                message: "Акцію видалено",
                description: "Акцію успішно видалено!",
            });
            // Кеш автоматично оновиться через invalidatesTags
            // Очищати локальний стан не потрібно, якщо хочеш — можеш, але краще покладатися на кеш RTK Query
        } catch (error) {
            notification.error({
                message: "Помилка видалення акції",
                description: (error as never)?.data?.message || "Спробуйте пізніше",
            });
        }
    };

    const renderActions = (id: number) => {
        const items: MenuProps["items"] = [
            { key: "edit", label: <Link to={`edit/${id}`}>Редагувати</Link> },
            {
                key: "delete",
                danger: true,
                label: (
                    <span
                        onClick={() => {
                            if (window.confirm('Ви впевнені, що хочете видалити цю акцію?')) {
                                handleDelete(id);
                            }
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        Видалити
                    </span>
                )
            },
        ];
        return (
            <Dropdown menu={{ items }} trigger={["click"]}>
                <Button icon={<MoreOutlined />} shape="circle" loading={isDeleting} />
            </Dropdown>
        );
    };

    const columns = [
        {
            title: 'Назва',
            dataIndex: 'name',
            key: 'name',
            sorter: (a: IPromotion, b: IPromotion) => a.name.localeCompare(b.name),
            render: (name: string) => name.length > 50 ? name.slice(0, 50) + '...' : name,
        },
        {
            title: 'Дата початку',
            dataIndex: 'startDate',
            key: 'startDate',
            sorter: (a: IPromotion, b: IPromotion) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Дата завершення',
            dataIndex: 'endDate',
            key: 'endDate',
            sorter: (a: IPromotion, b: IPromotion) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime(),
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Категорія',
            dataIndex: 'categoryName',
            key: 'categoryName',
            render: (catName?: string) => catName ? catName : <Tag color="blue">—</Tag>,
        },
        {
            title: 'Тип знижки',
            dataIndex: 'discountTypeName',
            key: 'discountTypeName',
            render: (discount?: string) => discount ?? <Tag color="blue">—</Tag>,
        },
        {
            title: 'Знижка',
            dataIndex: 'discountAmount',
            key: 'discountAmount',
            render: (amount?: number) => amount !== undefined ? `${amount}` : <Tag color="blue">—</Tag>,
        },
        {
            title: 'Зображення',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            render: (img?: string) =>
                img
                    ? <Image width={60} src={`${APP_ENV.IMAGES_1200_URL}${img}`} />
                    : <Tag color="blue">—</Tag>
        },
        {
            title: 'Статус',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive: boolean) => isActive
                ? <Tag color="green">Активна</Tag>
                : <Tag color="red">Неактивна</Tag>,
        },
        {
            title: 'Дії',
            key: 'actions',
            render: (_: unknown, record: IPromotion) => renderActions(record.id),
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <Space className="mb-5 flex justify-between" style={{ width: '100%' }}>
                <Input
                    placeholder="Пошук акції"
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => { setSearchParams({ search: e.target.value, page: '1' }) }}
                    style={{ width: 200 }}
                />
                <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/admin/promotions/create')}>
                    Додати акцію
                </Button>
            </Space>

            {isLoading ? (
                <div className="flex justify-center items-center h-[60vh]">
                    <Spin size="large" />
                </div>
            ) : (
                <>
                    <Table<IPromotion>
                        rowKey="id"
                        columns={columns}
                        dataSource={pagedPromotions}
                        pagination={false}
                        rowSelection={{
                            selectedRowKeys,
                            onChange: setSelectedRowKeys,
                        }}
                    />

                    <PaginationComponent
                        currentPage={currentPage}
                        pageSize={pageSize}
                        totalItems={filteredPromotions.length}
                        onPageChange={(page) => setSearchParams({ search: searchText, page: page.toString() })}
                    />
                </>
            )}
        </div>
    );
};

export default PromotionList;
