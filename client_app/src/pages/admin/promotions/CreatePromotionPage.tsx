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
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { useNavigate } from 'react-router-dom';
import moment, { Moment } from 'moment';
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
    period: [Moment, Moment];
    isActive: boolean;
    categoryId?: number | null;
    discountTypeId: number;
    amount: number; // додано поле для суми знижки
    productIds?: (string | number)[];
}

const discountTypes = [
    { id: 1, name: 'Відсоток' },
    { id: 2, name: 'Фіксована сума' },
];

const disabledDate = (current: Moment) => {
    // Заборонити вибирати дати до теперішнього часу
    return current && current < moment().startOf('minute');
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

        if (startDate.isBefore(moment())) {
            message.error('Дата початку не може бути в минулому.');
            return;
        }
        if (endDate.isBefore(moment())) {
            message.error('Дата кінця не може бути в минулому.');
            return;
        }
        if (!endDate.isAfter(startDate)) {
            message.error('Дата кінця повинна бути більшою за дату початку.');
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

            if (values.productIds && values.productIds.length > 0) {
                values.productIds.forEach((id) => {
                    const numId = Number(id);
                    if (!isNaN(numId)) {
                        formData.append('productIds', numId.toString());
                    }
                });
            }

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
        <>
            <div className="mt-6">
                <Button type="default" onClick={() => navigate(-1)}>
                    Назад
                </Button>
            </div>
            <div className="max-w-xl mx-auto">
                <h1 className="text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 my-6">
                    Створення акції
                </h1>
                <Form
                    form={form}
                    onFinish={onFinish}
                    layout="vertical"
                    initialValues={{
                        isActive: true,
                        discountTypeId: discountTypes[0].id,
                        productIds: [],
                        period: [moment(), moment().add(1, 'day')],
                        amount: 0,
                    }}
                    scrollToFirstError
                >
                    <Item
                        name="name"
                        label="Назва"
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

                    <Item name="description" label="Опис">
                        <TextArea rows={4} placeholder="Опис акції (необов’язково)" />
                    </Item>

                    <Item
                        name="period"
                        label="Період дії (початок та кінець)"
                        rules={[{ required: true, message: 'Будь ласка, виберіть період дії!' }]}
                    >
                        <RangePicker
                            locale={locale}
                            showTime={{ format: 'HH:mm' }}
                            format="YYYY-MM-DD HH:mm"
                            disabledDate={disabledDate}
                            allowClear
                            placeholder={['Початок', 'Кінець']}
                        />
                    </Item>

                    <Item name="isActive" valuePropName="checked">
                        <Checkbox>Активна</Checkbox>
                    </Item>

                    <Item
                        name="categoryId"
                        label="Категорія"
                        rules={[{ required: true, message: 'Будь ласка, оберіть категорію!' }]}
                    >
                        <CategoryTreeSelect placeholder="Оберіть категорію" allowClear showSearch allowSelectParent />
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
                            {
                                validator: (_, value) =>
                                    value && value > 0
                                        ? Promise.resolve()
                                        : Promise.reject(new Error('Сума знижки має бути більшою за 0')),
                            },
                        ]}
                    >
                        <Input type="number" min={0} placeholder="Введіть суму знижки" />
                    </Item>

                    <Item name="productIds" label="Продукти акції (введіть ID продукту)">
                        <Select
                            mode="tags"
                            placeholder="Введіть ID продукту"
                            tokenSeparators={[',', ' ']}
                            style={{ width: '100%' }}
                            filterOption={false}
                        />
                    </Item>

                    <Item
                        label="Зображення акції"
                        required
                        tooltip="Завантажте зображення акції (до 5 МБ, jpg/png)"
                    >
                        <DndContext sensors={[sensor]} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                            <SortableContext
                                items={fileList.map((file) => file.uid)}
                                strategy={verticalListSortingStrategy}
                            >
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

                    <Item>
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
                    {cropIndex !== null && (
                        <ImageCropper src={fileList[cropIndex]?.url || ''} onCrop={handleCrop} aspect={16 / 9} />
                    )}
                </Modal>
            </div>
        </>
    );
};

export default CreatePromotionPage;
