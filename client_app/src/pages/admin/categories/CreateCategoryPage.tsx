import {
  Form,
  Input,
  Button,
  Upload,
  InputNumber,
  Select,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ICategoryPostRequest } from "../../../types/category";
import { useCreateCategoryMutation } from "../../../services/admin/categoryAdmnApi";
import { useGetRootCategoriesQuery } from "../../../services/categoryApi";
import { handleFormErrors } from "../../../utilities/handleApiErrors";
import { ApiError } from "../../../types/errors";
import CropperModal from "../../../components/images/CropperModal";
import { showToast } from "../../../utilities/showToast";
import SuccessIcon from "../../../components/icons/toasts/SuccessIcon";

const { Item } = Form;

const CreateCategoryPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [createCategory] = useCreateCategoryMutation();
  const { data: categories } = useGetRootCategoriesQuery();

  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState<boolean>(false);

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

  const onFinish = async (values: ICategoryPostRequest) => {
    try {
      if (!values.parentId) {
        values.parentId = null;
      }

      if (croppedImage && croppedImage.startsWith("data:image")) {
        const blob = await fetch(croppedImage).then((res) => res.blob());
        values.image = new File([blob], "category.png", { type: blob.type });
      }

      await createCategory(values).unwrap();
      showToast("success", "Категорію створено", <SuccessIcon />);
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
      <h1 className="title">Створення категорії</h1>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ priority: 0 }}
      >
        <Item
          label="Назва"
          name="name"
          rules={[
            { required: true, message: "Введіть назву категорії" },
            {
              validator: (_, value) =>
                Promise[value?.trim() ? "resolve" : "reject"](
                  new Error("Назва не може бути лише з пробілів")
                ),
            },
          ]}
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
          Створити
        </Button>
      </Form>

      <CropperModal
        image={imagePreview}
        open={showCropper}
        aspectRatio={16 / 9}
        onCrop={handleCrop}
        onCancel={handleCancelCrop}
      />
    </div>
  );
};

export default CreateCategoryPage;
