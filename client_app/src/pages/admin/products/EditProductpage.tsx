import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Input, Upload, Form, InputNumber, Select } from "antd";
import { EyeOutlined, PlusOutlined, ScissorOutlined } from "@ant-design/icons";
import {
  useUpdateProductMutation,
  useGetProductByIdQuery,
} from "../../../services/admin/productAdminApi";
import CategoryTreeSelect from "../../../components/category/CategoryTreeSelect";
import { IProductPutRequest } from "../../../types/product";
import { RcFile, UploadFile } from "antd/es/upload/interface";
import { APP_ENV } from "../../../env";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { handleFormErrors } from "../../../utilities/handleApiErrors";
import { ApiError } from "../../../types/errors";
import { useGetBrandsQuery } from "../../../services/admin/brandAdminApi";
import CropperModal from "../../../components/images/CropperModal";
import { base64ToFile } from "../../../utilities/base64ToFile";
import { showToast } from "../../../utilities/showToast";
import SuccessIcon from "../../../components/icons/toasts/SuccessIcon";

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: productData } = useGetProductByIdQuery(Number(id));
  const [updateProduct,{isLoading}] = useUpdateProductMutation();
  const [form] = Form.useForm<IProductPutRequest>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { data: brands, isLoading: brandsLoading } = useGetBrandsQuery();

  // Cropper state
  const [cropIndex, setCropIndex] = useState<number | null>(null);
  const [isCropModalVisible, setCropModalVisible] = useState(false);
  const [cropImage, setCropImage] = useState<string | null>(null);

  useEffect(() => {
    if (productData) {
      form.setFieldsValue({ ...form.getFieldsValue(), ...productData });

      const updatedFileList: UploadFile[] =
        productData.images?.map(
          (image) =>
            ({
              uid: image.id.toString(),
              name: image.name,
              url: `${APP_ENV.IMAGES_200_URL}${image.name}`,
              originFileObj: new File([new Blob([""])], image.name, {
                type: "old-image",
              }),
            } as UploadFile)
        ) || [];

      setFileList(updatedFileList);
    }
  }, [productData, form]);

  const openCropModal = (index: number) => {
    const file = fileList[index];
    if (!file.originFileObj) return;

    // дозволяємо кропати лише нові зображення
    if ((file.originFileObj as RcFile).type === "old-image") return;

    const url = URL.createObjectURL(file.originFileObj as Blob);
    setCropImage(url);
    setCropIndex(index);
    setCropModalVisible(true);
  };

  const handleCrop = (croppedBase64: string) => {
    if (cropIndex === null) return;

    const newFile = base64ToFile(
      croppedBase64,
      `cropped-${Date.now()}.jpg`
    ) as RcFile;
    const newUrl = URL.createObjectURL(newFile);

    setFileList((prev) =>
      prev.map((file, index) => {
        if (index === cropIndex) {
          if ((file.originFileObj as RcFile)?.type !== "old-image") {
            newFile.uid = file.uid;
            return {
              ...file,
              uid: file.uid,
              url: newUrl,
              thumbUrl: newUrl,
              originFileObj: newFile,
            };
          }
        }
        return file;
      })
    );

    setCropModalVisible(false);
    setCropIndex(null);
    setCropImage(null);
  };

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
      values.image = fileList.map((x) => x.originFileObj as File);
      await updateProduct(values).unwrap();
      showToast("success", "Продукт успішно відредаговано!о", <SuccessIcon />);
      navigate("..");
    } catch (error: unknown) {
      handleFormErrors(error as ApiError, form);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-10 p-6 bg-white shadow-lg rounded-lg">
      <Button type="default" className="mb-6" onClick={() => navigate(-1)}>
        Назад
      </Button>
      <h1 className="title">Редагування продукту</h1>

      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          name="name"
          label="Назва"
          rules={[
            {
              required: true,
              message: "Будь ласка, введіть назву продукту!",
            },
          ]}
        >
          <Input placeholder="Назва" />
        </Form.Item>

        <Form.Item name="description" label="Опис">
          <Input placeholder="Опис" />
        </Form.Item>

        <Form.Item
          name="price"
          label="Ціна"
          rules={[{ required: true, message: "Будь ласка, введіть ціну!" }]}
        >
          <Input placeholder="Ціна" type="number" />
        </Form.Item>

        <Form.Item
          name="quantity"
          label="Кількість"
          rules={[{ required: true, message: "Вкажіть кількість!" }]}
        >
          <InputNumber
            min={0}
            placeholder="Кількість"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          label="Категорія"
          name="categoryId"
          rules={[{ required: true, message: "Це поле є обов'язковим!" }]}
        >
          <CategoryTreeSelect
            placeholder="Оберіть категорію: "
            allowClear
            showSearch
          />
        </Form.Item>

        <Form.Item
          name="brandId"
          label="Бренд"
          // rules={[{ required: true, message: "Будь ласка, оберіть бренд!" }]}
        >
          <Select
            placeholder="Оберіть бренд"
            allowClear
            showSearch
            optionFilterProp="children"
            loading={brandsLoading}
            filterOption={(input, option) =>
              (option?.children as unknown as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {brands?.map((brand) => (
              <Select.Option key={brand.id} value={brand.id}>
                {brand.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="upload-list" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-wrap gap-2"
              >
                {fileList.map((file, index) => (
                  <Draggable
                    key={file.uid}
                    draggableId={file.uid}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="relative"
                      >
                        <Upload
                          listType="picture-card"
                          fileList={[file]}
                          onRemove={() =>
                            setFileList(fileList.filter((f) => f.uid !== file.uid))
                          }
                          showUploadList={{
                            showPreviewIcon: true,
                            showRemoveIcon: true,
                            previewIcon: (file) =>
                              (file.originFileObj as RcFile)?.type === "old-image" ? (
                                <EyeOutlined
                                  title="Переглянути"
                                  onClick={(e) => {
                                    e.preventDefault(); // щоб не було стандартної поведінки
                                    window.open(file.url, "_blank");
                                  }}
                                  style={{ color: "white", fontSize: 18 }}
                                />
                              ) : (
                                <ScissorOutlined
                                  title="Обрізати"
                                  onClick={(e) => {
                                    e.preventDefault(); // дуже важливо
                                    openCropModal(index);
                                  }}
                                  style={{ color: "white", fontSize: 18 }}
                                />
                              ),
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
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Додати</div>
          </div>
        </Upload>

        <Form.Item className="mt-2">
          <Button type="primary" htmlType="submit" block loading={isLoading}>
            Зберегти
          </Button>
        </Form.Item>
      </Form>

      {/* --- модальне вікно для кропа --- */}
      <CropperModal
        image={cropImage}
        open={isCropModalVisible}
        aspectRatio={1}
        onCrop={handleCrop}
        onCancel={() => {
          setCropIndex(null);
          setCropModalVisible(false);
          setCropImage(null);
        }}
      />
    </div>
  );
};

export default EditProductPage;
