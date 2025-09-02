import { useEffect, useState } from "react";
import { Form, Input, Button, Upload, Spin, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { IBrandPutRequest } from "../../../types/brand";
import {
  useGetBrandByIDQuery,
  useUpdateBrandMutation,
} from "../../../services/admin/brandAdminApi";
import CropperModal from "../../../components/images/CropperModal";

const EditBrandPage = () => {
  const { id } = useParams();
  const { data: brand, isLoading } = useGetBrandByIDQuery(Number(id));
  const [updateBrand] = useUpdateBrandMutation();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);

  useEffect(() => {
    if (brand) {
      form.setFieldsValue({ name: brand.name });
      //   if (brand.image) setCroppedImage(brand.image);
    }
  }, [brand, form]);

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

  const onFinish = async (values: IBrandPutRequest) => {
    try {
      values.id = Number(id);
      //   if (croppedImage?.startsWith("data:image")) {
      //     const blob = await fetch(croppedImage).then((res) => res.blob());
      //     values.image = new File([blob], "brand.png", { type: blob.type });
      //   }
      await updateBrand(values).unwrap();
      message.success("Бренд оновлено");
      navigate("..");
    } catch {
      message.error("Помилка при оновленні бренду");
    }
  };

  if (isLoading || !brand) return <Spin size="large" />;

  return (
    <>
      <Button type="link" onClick={() => navigate(-1)}>
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

export default EditBrandPage;
