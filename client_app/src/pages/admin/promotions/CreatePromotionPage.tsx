import { useState } from 'react';
import {
    Form,
    Input,
    Button,
    Upload,
    message,
    Modal,
    Checkbox,
    DatePicker,
    Select,
    Divider,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { useNavigate } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import locale from 'antd/es/date-picker/locale/uk_UA';

import { RcFile, UploadFile } from 'antd/es/upload';
import { base64ToFile } from '../../../utilities/base64ToFile';
import ImageCropper from '../../../components/images/ImageCropper';
import { useCreatePromotionMutation } from '../../../services/admin/promotionAdminApi';
import { validateImageBeforeUpload } from '../../../utilities/validateImageUpload';
import CategoryTreeSelect from '../../../components/category/CategoryTreeSelect';

import {
    DndContext,
    PointerSensor,
    useSensor,
    closestCenter,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable';
import type { DragEndEvent } from '@dnd-kit/core';

const { Item } = Form;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface IPromotionCreateForm {
    name: string;
    description?: string;
    period: [Dayjs | null, Dayjs | null];
    isActive: boolean;
    categoryId?: number | null;
    discountTypeId: number;
    amount: number;
    productIds?: (string | number)[];
}

const discountTypes = [
    { id: 1, name: 'Відсоток' },
    { id: 2, name: 'Фіксована сума' },
];



const disabledDate = (current: Dayjs | null): boolean => {
    if (!current) return false;
    return current < dayjs().startOf('minute');
};



const CreatePromotionPage = () => {
    const [form] = Form.useForm<IPromotionCreateForm>();
    const navigate = useNavigate();

    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [cropIndex, setCroppingIndex] = useState<number | null>(null);
    const [isCropModalVisible, setCropModalVisible] = useState(false);

    const [createPromotion, { isLoading }] = useCreatePromotionMutation();
    const sensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } });

    const onFinish = async (values: IPromotionCreateForm) => {
        if (fileList.length === 0) {
            message.error('Будь ласка, завантажте зображення акції.');
            return;
        }

        const [startDate, endDate] = values.period;

        if (!startDate || !endDate) {
            message.error('Будь ласка, виберіть період дії!');
            return;
        }

        if (!endDate.isAfter(startDate)) {
            message.error('Дата кінця повинна бути більшою за дату початку.');
            return;
        }

        if (values.discountTypeId === 1 && values.amount > 100) {
            message.error('Відсоткова знижка не може бути більше 100%.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', values.name.trim());
            if (values.description) formData.append('description', values.description.trim());

            const file = fileList[0].originFileObj as File;
            formData.append('image', file);

            formData.append('startDate', startDate.toISOString());
            formData.append('endDate', endDate.toISOString());
            formData.append('isActive', values.isActive.toString());

            if (values.categoryId !== undefined && values.categoryId !== null)
                formData.append('categoryId', values.categoryId.toString());

            formData.append('discountTypeId', values.discountTypeId.toString());
            formData.append('amount', values.amount.toString());

            // Продукти завжди пусті
            formData.append('productIds', JSON.stringify([]));

            await createPromotion(formData).unwrap();

            message.success('Акція успішно створена!');
            navigate('/admin/promotions');
        } catch {
            message.error('Помилка при створенні акції. Спробуйте ще раз.');
        }
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

    const onDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        setFileList((prev) => {
            const oldIndex = prev.findIndex((f) => f.uid === active.id);
            const newIndex = prev.findIndex((f) => f.uid === over.id);
            return arrayMove(prev, oldIndex, newIndex);
        });
    };

    const handleUploadChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
        const updatedFileList = newFileList.map((file) => {
            if (!file.url && !file.thumbUrl && file.originFileObj) {
                return {
                    ...file,
                    url: URL.createObjectURL(file.originFileObj),
                };
            }
            return file;
        });
        setFileList(updatedFileList);
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

    return (
        <div className="max-w-2xl mx-auto my-10 p-6 bg-white shadow-lg rounded-lg">
            <Button type="default" className="mb-6" onClick={() => navigate(-1)}>
                Назад
            </Button>

            <h1 className="text-center text-3xl font-extrabold text-blue-600 mb-8">
                Створення акції
            </h1>

            <Form
                form={form}
                onFinish={onFinish}
                layout="vertical"
                initialValues={{
                    isActive: true,
                    discountTypeId: discountTypes[0].id,
                    amount: 0,
                    period: [null, null],
                }}
                scrollToFirstError
            >
                <Item
                    name="name"
                    label="Назва акції"
                    rules={[
                        { required: true, message: 'Будь ласка, введіть назву акції!' },
                        {
                            validator: (_, value) =>
                                value && value.trim()
                                    ? Promise.resolve()
                                    : Promise.reject(new Error('Назва не може бути лише з пробілів')),
                        },
                    ]}
                >
                    <Input placeholder="Назва акції" />
                </Item>

                <Item name="description" label="Опис акції">
                    <TextArea rows={4} placeholder="Опис (необов’язково)" />
                </Item>

                <Divider>Період дії</Divider>
                <Item
                    name="period"
                    label="Виберіть початок та кінець акції"
                    rules={[{ required: true, message: 'Будь ласка, виберіть період дії!' }]}
                >
                    <RangePicker
                        locale={locale}
                        showTime={{ format: 'HH:mm' }}
                        format="YYYY-MM-DD HH:mm"
                        disabledDate={disabledDate}
                        allowClear
                        placeholder={['Початок', 'Кінець']}
                        style={{ width: '100%' }}
                    />
                </Item>

                <Item name="isActive" valuePropName="checked">
                    <Checkbox>Активна</Checkbox>
                </Item>

                <Divider>Категорія та знижка</Divider>
                <Item
                    name="categoryId"
                    label="Категорія"
                    rules={[{ required: true, message: 'Будь ласка, оберіть категорію!' }]}
                >
                    <CategoryTreeSelect placeholder="Оберіть категорію" allowClear showSearch/>
                </Item>

                <Item
                    name="discountTypeId"
                    label="Тип знижки"
                    rules={[{ required: true, message: 'Будь ласка, оберіть тип знижки!' }]}
                >
                    <Select placeholder="Оберіть тип знижки">
                        {discountTypes.map((dt) => (
                            <Option key={dt.id} value={dt.id}>
                                {dt.name}
                            </Option>
                        ))}
                    </Select>
                </Item>

                <Item
                    name="amount"
                    label="Сума знижки"
                    rules={[
                        { required: true, message: 'Будь ласка, введіть суму знижки!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                const type = getFieldValue('discountTypeId');
                                if (value > 0) {
                                    if (type === 1 && value > 100) {
                                        return Promise.reject(new Error('Відсоткова знижка не може перевищувати 100%'));
                                    }
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Сума знижки має бути більшою за 0'));
                            },
                        }),
                    ]}
                >
                    <Input type="number" min={0} placeholder="Введіть суму знижки" />
                </Item>

                <Divider>Зображення акції</Divider>
                <Item
                    required
                    tooltip="Завантажте зображення акції (до 5 МБ, jpg/png)"
                >
                    <DndContext sensors={[sensor]} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                        <SortableContext items={fileList.map((file) => file.uid)} strategy={verticalListSortingStrategy}>
                            <Upload
                                multiple={false}
                                beforeUpload={validateImageBeforeUpload}
                                fileList={fileList}
                                onChange={handleUploadChange}
                                onPreview={handlePreview}
                                onRemove={handleRemove}
                                listType="picture"
                            >
                                {fileList.length < 1 && <Button icon={<UploadOutlined />}>Завантажити зображення</Button>}
                            </Upload>
                        </SortableContext>
                    </DndContext>
                </Item>

                <Item className="mt-6">
                    <Button type="primary" htmlType="submit" loading={isLoading} block>
                        Створити акцію
                    </Button>
                </Item>
            </Form>

            <Modal
                open={isCropModalVisible}
                footer={null}
                onCancel={() => {
                    setCropModalVisible(false);
                    setCroppingIndex(null);
                }}
                destroyOnClose
            >
                {cropIndex !== null && fileList[cropIndex]?.url ? (
                    <ImageCropper
                        image={fileList[cropIndex]!.url!} // ! гарантує, що url не undefined
                        onCrop={handleCrop}
                        aspectRatio={16 / 9}
                    />
                ) : null}



            </Modal>
        </div>
    );
};

export default CreatePromotionPage;
