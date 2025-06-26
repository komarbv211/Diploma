import { Form, Input, Button, Upload, message, Select, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { base64ToFile } from '../../../utilities/base64ToFile';
import ImageCropper from '../../../components/images/ImageCropper';
import { useCreateProductMutation } from '../../../services/admin/productAdminApi';
import { useGetCategoriesNamesQuery } from '../../../services/categoryApi';
import { IProductPostRequest } from '../../../types/product';
import { validateImageBeforeUpload } from '../../../utilities/validateImageUpload';

const { Item } = Form;

const CreateProductPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const [fileList, setFileList] = useState<any[]>([]);
    const [images, setImages] = useState<string[]>([]);

    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [cropIndex, setCroppingIndex] = useState<number | null>(null);
    const [isCropModalVisible, setCropModalVisible] = useState(false);

    const [createProduct, { isLoading }] = useCreateProductMutation();
    const { data: categoriesNames } = useGetCategoriesNamesQuery();

    const handleUploadChange = ({ fileList: newFileList }: any) => {
        setFileList(newFileList);

        const toUpload = newFileList.map((f: any) => {
            return new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.readAsDataURL(f.originFileObj);
            });
        });

        Promise.all(toUpload).then(setImages);
        setImageFiles(newFileList.map((f: any) => f.originFileObj));
    };

    const handleRemove = (file: any) => {
        const index = fileList.findIndex(f => f.uid == file.uid);
        if (index == -1) return;

        const newFiles = fileList.filter(f => f.uid != file.uid);
        setFileList(newFiles);

        setImages(images.filter((_, i) => i !== index));
        setImageFiles(imageFiles.filter((_, i) => i != index));
    };

    const onFinish = async (values: IProductPostRequest) => {
        try {
            const product: IProductPostRequest = {
                ...values,
                image: imageFiles,
            };

            const formData = buildProductFormData(product);
            console.log('Form data: ', formData)
            await createProduct(formData).unwrap();
            message.success('Продукт успішно створено!')

            navigate('/admin/products');
        } catch (err: any) {
            message.error(err?.data?.message || 'Не вдалося створити продукт');
        }
    };

    const handleEdit = (file: any) => {
        const index = fileList.findIndex((f) => f.uid == file.uid);
        if (index !== -1) {
            setCroppingIndex(index);
            setCropModalVisible(true);
        }
    };

    const handleCrop = (cropped: string) => {
        if (cropIndex === null) return;

        const newImages = [...images];
        newImages[cropIndex] = cropped;
        setImages(newImages);

        const newFile = base64ToFile(cropped, `cropped-${Date.now()}.jpg`);
        const newFiles = [...imageFiles];
        newFiles[cropIndex] = newFile;
        setImageFiles(newFiles);

        const updFile = [...fileList];
        updFile[cropIndex] = {
            ...updFile[cropIndex],
            thumbUrl: cropped,
            originFileObj: newFile,
        };
        setFileList(updFile);

        setCropModalVisible(false);
        setCroppingIndex(null);
    };

    const buildProductFormData = (product: IProductPostRequest): FormData => {
        const formData = new FormData();

        Object.entries(product).forEach(([key, value]) => {
            if (key !== 'image' && value !== undefined && value !== null) {
                formData.append(key, value.toString());
            }
        });

        if (product.image && Array.isArray(product.image)) {
            product.image.forEach((file) => {
                formData.append('image', file);
            });
        }

        return formData;
    };


    return (
        <div className="max-w-xl mx-auto">
            <h1 className="text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 my-6">
                Створення продукту
            </h1>
            <Form form={form} onFinish={onFinish} layout="vertical" noValidate>
                <Item name="name" label="Назва"
                    rules={[
                        { required: true, message: 'Будь ласка, введіть назву продукту!' },
                        { validator: (_, value) => Promise[value?.trim() ? 'resolve' : 'reject'](new Error('Назва не може бути лише з пробілів')) }
                    ]}>
                    <Input placeholder="Назва" />
                </Item>

                <Item name="price" label="Ціна"
                    rules={[
                        { required: true, message: 'Будь ласка, вкажіть ціну!' },
                        { validator: (_, value) => value > 0 ? Promise.resolve() : Promise.reject(new Error('Ціна має бути більше нуля')), },
                    ]}>
                    <Input type="number" placeholder="Ціна" min={0.01} step={0.01} />
                </Item>

                <Item name="description" label="Опис">
                    <TextArea rows={4} placeholder="Опис..." />
                </Item>

                <Item name="categoryId" label="Назва категорії"
                    rules={[{ required: true, message: 'Будь ласка, оберіть категорію!' }]}>
                    <Select placeholder="Категорія">
                        {categoriesNames?.map((cat) => (
                            <Select.Option key={cat.id} value={cat.id}>
                                {cat.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Item>

                <Item label="Фото продукту">
                    <Upload multiple listType="picture-card" fileList={fileList}
                        beforeUpload={validateImageBeforeUpload}
                        onChange={handleUploadChange}
                        onRemove={handleRemove}
                        onPreview={handleEdit}
                    >
                        {fileList.length >= 8 ? null : (
                            <div>
                                <UploadOutlined />
                                <div className="mt-2 text-center">Завантажити</div>
                            </div>
                        )}
                    </Upload>
                </Item>

                <Item>
                    <Button type="primary" htmlType="submit" block loading={isLoading}>
                        Створити продукт
                    </Button>
                </Item>
            </Form>

            <Modal open={isCropModalVisible} footer={null} onCancel={() => setCropModalVisible(false)} width={800}>
                {cropIndex !== null && (
                    <ImageCropper image={images[cropIndex]} onCrop={handleCrop}
                        onCancel={() => {
                            setCroppingIndex(null);
                            setCropModalVisible(false);
                        }}
                    />
                )}
            </Modal>
        </div>
    );
};

export default CreateProductPage;
