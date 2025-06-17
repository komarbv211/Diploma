import { Form, Input, Button, Upload, message, Spin } from 'antd';
import { UploadOutlined, CloseOutlined } from '@ant-design/icons';
import TextArea from "antd/es/input/TextArea";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import { ICategoryPutRequest } from '../../../types/category';
import { APP_ENV } from '../../../env';
import { useUpdateCategoryMutation } from '../../../services/admin/categoryAdmnApi';
import { useGetCategoryByIdQuery } from '../../../services/categoryApi';
import { base64ToFile } from '../../../utilities/base64ToFile';
import ImageCropper from '../../../components/images/ImageCropper';
import { handleFormErrors } from '../../../utilities/handleApiErrors';

const { Item } = Form;

const EditCategoryPage = () => {
    const { id } = useParams();
    const { data: category, isLoading } = useGetCategoryByIdQuery(Number(id));
    const [updateCategory] = useUpdateCategoryMutation();
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        if (category) {
            form.setFieldsValue({
                name: category.name,
                description: category.description,
                urlSlug: category.urlSlug,
                priority: category.priority,
                parentId: category.parentId
            });
            if (category.image) {
                setImageUrl(`${APP_ENV.IMAGES_100_URL}${category.image}`);
            }
        }
    }, [category, form]);

    const onFinish = async (values: ICategoryPutRequest) => {
        try {
            values.id = Number(id);
            values.image = imageFile;

            if (!values.image) {
                delete values.image;
            }

            await updateCategory(values).unwrap();
            message.success("Категорію оновлено");
            navigate("..");
        } catch (error: any) {
            form.setFields([
                { name: 'firstName', errors: [] },
                { name: 'lastName', errors: [] },
            ]);
            handleFormErrors(error, form);
        }
    };


    const handlePreview = (file: File) => {
        const reader = new FileReader();
        reader.onload = () => {
            setImageUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleCrop = (croppedImage: string) => {
        setImageUrl(croppedImage);
        const croppedFile = base64ToFile(croppedImage, "cropped-category.png");
        setImageFile(croppedFile);
    };

    const handleCancel = () => {
        setImageFile(null);
        setImageUrl(null);
    };

    if (isLoading) return <p>Завантаження...</p>;

    return (
        <div className="max-w-xl mx-auto">
            <h1 className="text-center text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 my-6">
                Редагувати групу
            </h1>
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Item name="name" label="Назва групи" rules={[{ required: true, message: 'Будь ласка, введіть назву групи!' }]}>
                    <Input placeholder="Назва" />
                </Item>
                <Item name="description" label="Опис">
                    <TextArea rows={4} placeholder="Текст..." />
                </Item>
                <Item name="urlSlug" label="URL Slug">
                    <Input placeholder="slug" />
                </Item>
                <Item name="priority" label="Пріоритет">
                    <Input type="number" />
                </Item>
                <Item name="parentId" label="ID Батьківської категорії">
                    <Input type="number" />
                </Item>

                <Item label="Фото групи">
                    <Spin spinning={false}>
                        {imageUrl ? (
                            <div className="mb-4 relative">
                                <img src={imageUrl} alt="Категорія" className="w-full max-h-48 object-cover rounded-lg" />
                            </div>
                        ) : (
                            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                                <span className="text-gray-400">Немає фото</span>
                            </div>
                        )}
                    </Spin>

                    <Upload
                        beforeUpload={(file) => {
                            setImageFile(file);
                            handlePreview(file);
                            return false;
                        }}
                        showUploadList={false}
                    >
                        <Button icon={<UploadOutlined />}>
                            Вибрати фото
                        </Button>
                    </Upload>

                    {imageUrl && (
                        <div className="mt-4">
                            <ImageCropper
                                image={imageUrl}
                                onCrop={handleCrop}
                                onCancel={handleCancel}
                            />
                        </div>
                    )}

                    {imageFile && (
                        <div className="mt-4 flex gap-2">
                            <Button type="default" onClick={handleCancel} icon={<CloseOutlined />}>
                                Скасувати
                            </Button>
                        </div>
                    )}
                </Item>

                <Item>
                    <Button type="primary" htmlType="submit" block>
                        Оновити групу
                    </Button>
                </Item>
            </Form>
        </div>
    );
};

export default EditCategoryPage;
