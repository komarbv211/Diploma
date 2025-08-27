import {
  Form,
  Input,
  Button,
  Upload,
  message,
  Spin,
  InputNumber,
  Select,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ICategoryPutRequest } from "../../../types/category";
import { APP_ENV } from "../../../env";
import {
  useGetCategoryByIDQuery,
  useUpdateCategoryMutation,
} from "../../../services/admin/categoryAdmnApi";
import { handleFormErrors } from "../../../utilities/handleApiErrors";
import { ApiError } from "../../../types/errors";
import { useGetRootCategoriesQuery } from "../../../services/categoryApi";
import CropperModal from "../../../components/images/CropperModal";

const { Item } = Form;

const EditCategoryPage = () => {
  const { id } = useParams();
  const { data: category, isLoading } = useGetCategoryByIDQuery(Number(id));
  const { data: categories } = useGetRootCategoriesQuery();

  const [updateCategory] = useUpdateCategoryMutation();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState<boolean>(false);

  useEffect(() => {
    if (category) {
      form.setFieldsValue({
        name: category.name,
        description: category.description,
        urlSlug: category.urlSlug,
        priority: category.priority,
        parentId: category.parentId,
      });
      if (category.image) {
        setCroppedImage(`${APP_ENV.IMAGES_100_URL}${category.image}`);
      }
    }
  }, [category, form]);

  const handleBeforeUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleCrop = (cropped: string) => {
    setCroppedImage(cropped);
    setShowCropper(false);
  };

  const handleCancelCrop = () => {
    setShowCropper(false);
  };

  const onFinish = async (values: ICategoryPutRequest) => {
    try {
      values.id = Number(id);

      if (!values.parentId) {
        values.parentId = null;
      }

      if (croppedImage && croppedImage.startsWith("data:image")) {
        const blob = await fetch(croppedImage).then((res) => res.blob());
        values.image = new File([blob], "category.png", { type: blob.type });
      } else {
        delete values.image;
      }

      await updateCategory(values).unwrap();
      message.success("Категорію оновлено");
      navigate("..");
    } catch (error: unknown) {
      handleFormErrors(error as ApiError, form);
    }
  };

  if (isLoading || !category) {
    return <Spin size="large" />;
  }

  return (
    <>
      <Link to="/admin/categories">
        <Button type="default" onClick={() => navigate(-1)}>
          Назад
        </Button>
      </Link>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ priority: 0 }}
      >
        <Item
          label="Назва"
          name="name"
          rules={[{ required: true, message: "Введіть назву категорії" }]}
        >
          <Input />
        </Item>

        <Item label="Опис" name="description">
          <TextArea rows={4} />
        </Item>

        <Item
          label="URL Slug"
          name="urlSlug"
          rules={[{ required: true, message: "Введіть slug категорії" }]}
        >
          <Input />
        </Item>

        <Item label="Пріоритет" name="priority">
          <InputNumber min={0} />
        </Item>

        <Item label="Батьківська категорія" name="parentId">
          <Select
            allowClear
            placeholder="Оберіть батьківську категорію"
            options={categories?.map((cat) => ({
              value: cat.id,
              label: cat.name,
            }))}
          />
        </Item>

        <div className="mb-4">
          {croppedImage && (
            <div style={{ marginBottom: 8 }}>
              <img
                src={croppedImage}
                alt="Зображення"
                style={{
                  maxWidth: "200px",
                  height: "auto",
                  border: "1px solid #ccc",
                }}
              />
            </div>
          )}

          <Upload
            showUploadList={false}
            beforeUpload={handleBeforeUpload}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Завантажити зображення</Button>
          </Upload>
        </div>

        <Button type="primary" htmlType="submit">
          Зберегти
        </Button>
      </Form>

      <CropperModal
        image={imagePreview}
        open={showCropper}
        aspectRatio={16 / 9}
        onCrop={handleCrop}
        onCancel={handleCancelCrop}
      />
    </>
  );
};

export default EditCategoryPage;
