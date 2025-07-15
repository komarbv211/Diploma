import {useState, useEffect} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Button, Input, Upload, Form} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import Item from "antd/es/list/Item";
import { useUpdateProductMutation, useGetProductByIdQuery } from "../../../services/admin/productAdminApi";
import CategoryTreeSelect from '../../../components/category/CategoryTreeSelect';
import { IProductPutRequest } from "../../../types/product";
import { UploadFile } from "antd/es/upload/interface";
import { APP_ENV } from "../../../env";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { handleFormErrors } from "../../../utilities/handleApiErrors";
import { ApiError } from "../../../types/errors";

const EditProductPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {data: productData} = useGetProductByIdQuery(Number(id));
    const [updateProduct] = useUpdateProductMutation();
    const [form] = Form.useForm<IProductPutRequest>();
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        if (productData) {
            form.setFieldsValue({ ...form.getFieldsValue(), ...productData });
            console.log("Category id", productData.categoryId);
            form.setFieldsValue({
                ...form.getFieldsValue(),
                ...productData
            });

            const updatedFileList: UploadFile[] = productData.images?.map((image) => ({
                uid: image.id.toString(),
                name: image.name,
                url: `${APP_ENV.IMAGES_200_URL}${image.name}`,
                originFileObj: new File([new Blob([''])],image.name,{type: 'old-image'})
            } as UploadFile)) || [];

            setFileList(updatedFileList);
        }
    }, [productData, form]);

    const handleImageChange = (info: { fileList: UploadFile[] }) => {
        const newFileList = info.fileList.map((file, index) => ({
            ...file,
            uid: file.uid || Date.now().toString(),
            order: index,
        }));

        setFileList([...fileList, ...newFileList]);
    };

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const reorderedFiles = Array.from(fileList);
        const [movedFile] = reorderedFiles.splice(result.source.index, 1);
        reorderedFiles.splice(result.destination.index, 0, movedFile);
        setFileList(reorderedFiles);
    };

    const onFinish = async (values: IProductPutRequest) => {
        try {
            values.id = Number(id);
            values.image=fileList.map(x=> x.originFileObj as File);
            console.log("Submit Form", values);
            await updateProduct(values).unwrap();
            navigate("..");
        } catch (error: unknown) {
            handleFormErrors(error as ApiError, form);
        }
    }
    
    return (
        <>
        <Link to="/admin/products">
            <Button type="default" onClick={() => navigate(-1)}>Назад</Button>
        </Link>
        <div className="max-w-lg mx-auto my-6">
            
                
            <h1 className="text-3xl font-bold mb-4">Редагування продукт</h1>
            <Form
                form={form}
                onFinish={onFinish}
                layout="vertical">

                <Form.Item name="name" label="Назва" rules={[{ required: true, message: 'Будь ласка, введіть назву групи!' }]}>
                    <Input placeholder="Назва" />
                </Form.Item>

                <Form.Item name="description" label="Опис" rules={[{required: false, message: "Це поле є обов'язковим!"}]}>
                    <Input placeholder="Назва" />
                </Form.Item>

                <Form.Item name="price" label="Ціна" rules={[{ required: true, message: 'Будь ласка, введіть назву групи!' }]}>
                    <Input placeholder="Ціна" />
                </Form.Item>

                <Form.Item
                    label="Категорія"
                    name="categoryId"
                    htmlFor="categoryId"
                    rules={[{required: true, message: "Це поле є обов'язковим!"}]}
                >
                    <CategoryTreeSelect
                        placeholder="Оберіть категорію: "
                        allowClear
                        showSearch
                    />
                </Form.Item>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="upload-list" direction="horizontal">
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-wrap gap-2">
                                {fileList.map((file, index) => (
                                    <Draggable key={file.uid} draggableId={file.uid} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <Upload
                                                    listType="picture-card"
                                                    fileList={[file]}
                                                    onRemove={() => {
                                                        const newFileList = fileList.filter(f => f.uid !== file.uid);
                                                        setFileList(newFileList);                                                        
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>

                <Upload
                    multiple
                    listType="picture-card"
                    beforeUpload={() => false}
                    onChange={handleImageChange}
                    fileList={[]}
                    accept="image/*"
                >
                    <div>
                        <PlusOutlined/>
                        <div style={{marginTop: 8}}>Додати</div>
                    </div>
                </Upload>

                <Item>
                    <Button type="primary" htmlType="submit" block>
                        Зберегти
                    </Button>
                </Item>
            </Form>
        </div>
        </>
    );
};

export default EditProductPage;