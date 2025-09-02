import { useState } from "react";
import { Form, Input, Button, Upload, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { IBrandPostRequest } from "../../../types/brand";
import { useCreateBrandMutation } from "../../../services/admin/brandAdminApi";
import CropperModal from "../../../components/images/CropperModal";
import { ApiError } from "../../../types/errors";
import { handleFormErrors } from "../../../utilities/handleApiErrors";

const CreateBrandPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [createBrand] = useCreateBrandMutation();

  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);

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

  const handleCancelCrop = () => setShowCropper(false);

  const onFinish = async (values: IBrandPostRequest) => {
    try {
      //   if (croppedImage?.startsWith("data:image")) {
      //     const blob = await fetch(croppedImage).then((res) => res.blob());
      //     values.image = new File([blob], "brand.png", { type: blob.type });
      //   }
      await createBrand(values).unwrap();
      message.success("Бренд створено");
      navigate("..");
    } catch (error: unknown) {
      handleFormErrors(error as ApiError, form);
      message.error("Помилка при створенні бренду");
    }
  };

  return (
    <>
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
      >
        Назад
      </Button>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Назва"
          name="name"
          rules={[{ required: true, message: "Введіть назву бренду" }]}
        >
          <Input />
        </Form.Item>

        <div className="mb-4">
          {croppedImage && (
            <img
              src={croppedImage}
              alt="brand"
              style={{ maxWidth: 200, border: "1px solid #ccc" }}
            />
          )}
          <Upload
            showUploadList={false}
            beforeUpload={handleBeforeUpload}
            accept="image/*"
          >
            {/* <Button icon={<UploadOutlined />}>Завантажити зображення</Button> */}
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
    </>
  );
};

export default CreateBrandPage;
