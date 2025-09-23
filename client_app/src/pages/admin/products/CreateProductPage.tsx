import { useState } from "react";
import { Form, Input, Button, Upload, UploadFile, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { useNavigate } from "react-router-dom";
import { base64ToFile } from "../../../utilities/base64ToFile";
import { useCreateProductMutation } from "../../../services/admin/productAdminApi";
import { IProductPostRequest } from "../../../types/product";
import { validateImageBeforeUpload } from "../../../utilities/validateImageUpload";
import CategoryTreeSelect from "../../../components/category/CategoryTreeSelect";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
} from "@dnd-kit/core";
import { RcFile } from "antd/es/upload";
import DraggableUploadListItem from "../../../components/draggable/DraggableUploadListItem";
import { handleFormErrors } from "../../../utilities/handleApiErrors";
import { ApiError } from "../../../types/errors";
import type { DragEndEvent } from "@dnd-kit/core";
import { useGetBrandsQuery } from "../../../services/admin/brandAdminApi";
import CropperModal from "../../../components/images/CropperModal";
import { showToast } from "../../../utilities/showToast";
import SuccessIcon from "../../../components/icons/toasts/SuccessIcon";

const { Item } = Form;

const CreateProductPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [cropIndex, setCroppingIndex] = useState<number | null>(null);
  const [isCropModalVisible, setCropModalVisible] = useState(false);
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const sensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 10 },
  });
  const { data: brands, isLoading: brandsLoading } = useGetBrandsQuery();

  const onFinish = async (values: IProductPostRequest) => {
    try {
      const product: IProductPostRequest = {
        ...values,
        image: fileList
          .map((f) => f.originFileObj as File)
          .filter((file): file is File => !!file),
      };

      const formData = buildProductFormData(product);

      await createProduct(formData).unwrap();
      showToast("success", "Продукт успішно створено!", <SuccessIcon />);
      navigate("/admin/products");
    } catch (error: unknown) {
      handleFormErrors(error as ApiError, form);
    }
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
          newFile.uid = file.uid;
          return {
            ...newFile,
            url: newUrl,
            thumbUrl: newUrl,
            originFileObj: newFile,
          };
        }
        return file;
      })
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

  const handleUploadChange = ({
    fileList: newFileList,
  }: {
    fileList: UploadFile[];
  }) => {
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

  const buildProductFormData = (product: IProductPostRequest): FormData => {
    const formData = new FormData();

    Object.entries(product).forEach(([key, value]) => {
      if (key !== "image" && value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    if (product.image && Array.isArray(product.image)) {
      product.image.forEach((file) => {
        formData.append("image", file);
      });
    }

    return formData;
  };

  const handlePreview = (file: UploadFile) => {
    const index = fileList.findIndex((f) => f.uid === file.uid);
    if (index !== -1) {
      setCroppingIndex(index);
      setCropModalVisible(true);
    }
  };

  const handleRemove = async (file: UploadFile) => {
    setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
    return true;
  };

  return (
    <div className="max-w-2xl mx-auto my-10 p-6 bg-white shadow-lg rounded-lg">
      <Button type="default" className="mb-6" onClick={() => navigate(-1)}>
        Назад
      </Button>
      <h1 className="title">Створення продукту</h1>
      <Form form={form} onFinish={onFinish} layout="vertical" noValidate>
        <Item
          name="name"
          label="Назва"
          rules={[
            {
              required: true,
              message: "Будь ласка, введіть назву продукту!",
            },
            {
              validator: (_, value) =>
                value && value.trim()
                  ? Promise.resolve()
                  : Promise.reject(
                      new Error("Назва не може бути лише з пробілів")
                    ),
            },
          ]}
        >
          <Input placeholder="Назва" />
        </Item>

        <Item
          name="price"
          label="Ціна"
          rules={[
            { required: true, message: "Будь ласка, вкажіть ціну!" },
            {
              validator: (_, value) =>
                value > 0
                  ? Promise.resolve()
                  : Promise.reject(new Error("Ціна має бути більше нуля")),
            },
          ]}
        >
          <Input type="number" placeholder="Ціна" min={0.01} step={0.01} />
        </Item>

        {/* 🔹 Нове поле quantity */}
        <Item
          name="quantity"
          label="Кількість"
          rules={[
            { required: true, message: "Будь ласка, вкажіть кількість!" },
            {
              validator: (_, value) =>
                value > 0
                  ? Promise.resolve()
                  : Promise.reject(new Error("Кількість має бути більше нуля")),
            },
          ]}
        >
          <Input type="number" placeholder="Кількість" min={1} step={1} />
        </Item>

        <Item name="description" label="Опис">
          <TextArea rows={4} placeholder="Опис..." />
        </Item>

        <Item
          name="categoryId"
          label="Категорія"
          rules={[
            { required: true, message: "Будь ласка, оберіть категорію!" },
          ]}
        >
          <CategoryTreeSelect
            placeholder="Оберіть категорію"
            allowClear
            showSearch
          />
        </Item>
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

        <Item label="Фото продукту">
          <DndContext
            sensors={[sensor]}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={fileList.map((f) => f.uid)}
              strategy={verticalListSortingStrategy}
            >
              <Upload
                multiple
                listType="picture-card"
                fileList={fileList}
                beforeUpload={validateImageBeforeUpload}
                onChange={handleUploadChange}
                onPreview={handlePreview}
                onRemove={handleRemove}
                itemRender={(originNode, file) => (
                  <DraggableUploadListItem
                    originNode={originNode}
                    file={file}
                  />
                )}
              >
                {fileList.length < 8 && (
                  <button type="button">
                    <UploadOutlined />
                    <div className="mt-3">Завантажити</div>
                  </button>
                )}
              </Upload>
            </SortableContext>
          </DndContext>
        </Item>

        <Item>
          <Button type="primary" htmlType="submit" block loading={isLoading}>
            Створити продукт
          </Button>
        </Item>
      </Form>

      <CropperModal
        image={
          cropIndex !== null && fileList[cropIndex]?.originFileObj
            ? URL.createObjectURL(fileList[cropIndex]?.originFileObj as Blob)
            : null
        }
        open={isCropModalVisible}
        aspectRatio={1}
        onCrop={handleCrop}
        onCancel={() => {
          setCroppingIndex(null);
          setCropModalVisible(false);
        }}
        width={800}
      />
    </div>
  );
};

export default CreateProductPage;
