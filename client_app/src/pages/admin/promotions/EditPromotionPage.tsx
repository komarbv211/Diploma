import React, { useEffect, useState } from 'react';
import {
    Form,
    Input,
    Button,
    Checkbox,
    DatePicker,
    Select,
    message,
    Upload,
    Modal,
    InputNumber,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import moment, { Moment } from 'moment';
import locale from 'antd/es/date-picker/locale/uk_UA';
import { UploadFile } from 'antd/es/upload/interface';
import { RcFile } from 'antd/es/upload';

import CategoryTreeSelect from '../../../components/category/CategoryTreeSelect';
import ImageCropper from '../../../components/images/ImageCropper';

import {
    useGetPromotionByIdQuery,
    useUpdatePromotionMutation,
} from '../../../services/admin/promotionAdminApi';

import { base64ToFile } from '../../../utilities/base64ToFile';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

const discountTypes = [
    { id: 1, name: 'Відсоток' },
    { id: 2, name: 'Фіксована сума' },
];

const disabledDate = (current: Moment) => {
    return current && current < moment().startOf('day');
};

const EditPromotionPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: promotion, isLoading } = useGetPromotionByIdQuery(Number(id));
    const [updatePromotion, { isLoading: isUpdating }] = useUpdatePromotionMutation();

    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [isCropModalVisible, setCropModalVisible] = useState(false);
    const [cropIndex, setCroppingIndex] = useState<number | null>(null);

    useEffect(() => {
        if (promotion) {
            form.setFieldsValue({
                name: promotion.name,
                description: promotion.description,
                period: [moment(promotion.startDate), moment(promotion.endDate)],
                isActive: promotion.isActive,
                categoryId: promotion.categoryId ?? null,
                discountTypeId: promotion.discountTypeId,
                amount: promotion.amount, // зміна discountAmount -> amount
                productIds: promotion.productIds ?? [],
            });

            if (promotion.imageUrl) {
                setFileList([
                    {
                        uid: '-1',
                        name: 'image.jpg',
                        url: promotion.imageUrl,
                        status: 'done',
                    },
                ]);
            }
        }
    }, [promotion, form]);

    const handleUploadChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
        const updated = newFileList.map((file) => {
            if (!file.url && file.originFileObj) {
                return {
                    ...file,
                    url: URL.createObjectURL(file.originFileObj),
                };
            }
            return file;
        });
        setFileList(updated);
    };

    const handleCrop = (croppedBase64: string) => {
        if (cropIndex === null) return;

        const newFile = base64ToFile(croppedBase64, `cropped-${Date.now()}.jpg`) as RcFile;
        const newUrl = URL.createObjectURL(newFile);

        setFileList((prev) =>
            prev.map((file, idx) => {
                if (idx === cropIndex) {
                    newFile.uid = file.uid;
                    return {
                        ...newFile,
                        url: newUrl,
                        thumbUrl: newUrl,
                        originFileObj: newFile,
                    };
                }
                return file;
            }),
        );

        setCropModalVisible(false);
        setCroppingIndex(null);
    };

    const handlePreview = (file: UploadFile) => {
        const index = fileList.findIndex((f) => f.uid === file.uid);
        if (index !== -1) {
            setCroppingIndex(index);
            setCropModalVisible(true);
        }
    };

    const handleRemove = (file: UploadFile) => {
        setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
        return true;
    };

    const validatePeriod = (_: any, value: [Moment, Moment]) => {
        if (!value || value.length !== 2) {
            return Promise.reject(new Error('Будь ласка, виберіть період дії!'));
        }
        return Promise.resolve();
    };

    const onFinish = async (values: any) => {
        if (fileList.length === 0) {
            message.error('Будь ласка, завантажте зображення.');
            return;
        }

        try {
            const formData = new FormData();

            formData.append('id', id!);
            formData.append('name', values.name.trim());
            if (values.description) formData.append('description', values.description.trim());

            const file = fileList[0].originFileObj as File | undefined;
            if (file) {
                formData.append('image', file);
            }

            formData.append('startDate', values.period[0].toISOString());
            formData.append('endDate', values.period[1].toISOString());
            formData.append('isActive', values.isActive.toString());

            if (values.categoryId !== undefined && values.categoryId !== null) {
                formData.append('categoryId', values.categoryId.toString());
            }

            formData.append('discountTypeId', values.discountTypeId.toString());
            formData.append('amount', values.amount.toString()); // зміна discountAmount -> amount

            if (values.productIds?.length) {
                values.productIds.forEach((pid: string | number) => {
                    const numPid = Number(pid);
                    if (!isNaN(numPid)) {
                        formData.append('productIds', numPid.toString());
                    }
                });
            }

            await updatePromotion({ id: Number(id), formData }).unwrap();
            message.success('Акцію успішно оновлено!');
            navigate('/admin/promotions');
        } catch (error) {
            message.error('Помилка при оновленні акції.');
        }
    };

    if (isLoading) return <div>Завантаження...</div>;

    return (
        <>
            <div className="mt-6">
                <Button type="default" onClick={() => navigate(-1)}>
                    Назад
                </Button>
            </div>

            <div className="max-w-xl mx-auto">
                <h1 className="text-center text-3xl font-extrabold my-6">Редагування акції</h1>

                <Form
                    form={form}
                    onFinish={onFinish}
                    layout="vertical"
                    scrollToFirstError
                    initialValues={{
                        isActive: true,
                        discountTypeId: 1,
                        amount: 0,
                    }}
                >
                    <Form.Item
                        name="name"
                        label="Назва"
                        rules={[
                            { required: true, message: 'Введіть назву!' },
                            {
                                validator: (_, value) =>
                                    value && value.trim()
                                        ? Promise.resolve()
                                        : Promise.reject(new Error('Назва не може бути лише з пробілів')),
                            },
                        ]}
                    >
                        <Input placeholder="Назва акції" />
                    </Form.Item>

                    <Form.Item name="description" label="Опис">
                        <TextArea rows={4} placeholder="Опис (необов’язково)" />
                    </Form.Item>

                    <Form.Item
                        name="period"
                        label="Період дії"
                        rules={[{ required: true }, { validator: validatePeriod }]}
                    >
                        <RangePicker
                            locale={locale}
                            showTime={{ format: 'HH:mm' }}
                            format="YYYY-MM-DD HH:mm"
                            disabledDate={disabledDate}
                            allowClear
                            placeholder={['Початок', 'Кінець']}
                        />
                    </Form.Item>

                    <Form.Item name="isActive" valuePropName="checked">
                        <Checkbox>Активна</Checkbox>
                    </Form.Item>

                    <Form.Item
                        name="categoryId"
                        label="Категорія"
                        rules={[{ required: true, message: 'Оберіть категорію!' }]}
                    >
                        <CategoryTreeSelect />
                    </Form.Item>

                    <Form.Item
                        name="discountTypeId"
                        label="Тип знижки"
                        rules={[{ required: true, message: 'Оберіть тип знижки!' }]}
                    >
                        <Select>
                            {discountTypes.map((type) => (
                                <Option key={type.id} value={type.id}>
                                    {type.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="amount"
                        label="Сума знижки"
                        rules={[
                            { required: true, message: 'Вкажіть суму знижки' },
                            {
                                type: 'number',
                                min: 0.01,
                                message: 'Мінімальне значення — 0.01',
                            },
                        ]}
                    >
                        <InputNumber min={0.01} style={{ width: '100%' }} placeholder="10 / 20.5 / ..." />
                    </Form.Item>

                    <Form.Item name="productIds" label="Продукти акції (ID)">
                        <Select
                            mode="tags"
                            placeholder="Введіть ID продукту"
                            tokenSeparators={[',', ' ']}
                            style={{ width: '100%' }}
                            filterOption={false}
                        />
                    </Form.Item>

                    <Form.Item label="Зображення">
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onChange={handleUploadChange}
                            onPreview={handlePreview}
                            onRemove={handleRemove}
                            beforeUpload={() => false}
                            maxCount={1}
                        >
                            {fileList.length >= 1 ? null : (
                                <div>
                                    <UploadOutlined />
                                    <div>Завантажити</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isUpdating} className="w-full">
                            Оновити акцію
                        </Button>
                    </Form.Item>
                </Form>
            </div>

            <Modal open={isCropModalVisible} onCancel={() => setCropModalVisible(false)} footer={null} width={800}>
                <ImageCropper imageFile={fileList[cropIndex ?? 0]?.originFileObj as File} onCrop={handleCrop} />
            </Modal>
        </>
    );
};

export default EditPromotionPage;
