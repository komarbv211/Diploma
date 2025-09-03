import { useState } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  message,
  Checkbox,
  DatePicker,
  Divider,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { useNavigate } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import locale from "antd/es/date-picker/locale/uk_UA";

import { useCreatePromotionMutation } from "../../../services/admin/promotionAdminApi";
import { handleFormErrors } from "../../../utilities/handleApiErrors";
import { ApiError } from "../../../types/errors";
import CropperModal from "../../../components/images/CropperModal";

const { Item } = Form;
const { RangePicker } = DatePicker;

interface PromotionFormValues {
  name: string;
  description?: string;
  period: [Dayjs | null, Dayjs | null];
  isActive: boolean;
  productIds?: number[];
}

const disabledDate = (current: Dayjs | null): boolean => {
  if (!current) return false;
  return current < dayjs().startOf("minute");
};

const CreatePromotionPage = () => {
  const [form] = Form.useForm<PromotionFormValues>();
  const navigate = useNavigate();
  const [createPromotion, { isLoading }] = useCreatePromotionMutation();

  // 🔹 Для кропера
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
    return false; // щоб antd не завантажував сам
  };

  const handleCrop = (cropped: string) => {
    setCroppedImage(cropped);
    setShowCropper(false);
  };

  const handleCancelCrop = () => {
    setShowCropper(false);
  };

  const onFinish = async (values: PromotionFormValues) => {
    try {
      const [startDate, endDate] = values.period;

      if (!startDate || !endDate) {
        message.error("Будь ласка, виберіть період дії!");
        return;
      }

      if (!endDate.isAfter(startDate)) {
        message.error("Дата кінця повинна бути більшою за дату початку.");
        return;
      }

      if (!croppedImage) {
        message.error("Будь ласка, завантажте зображення акції.");
        return;
      }

      const formData = new FormData();
      formData.append("name", values.name.trim());
      if (values.description)
        formData.append("description", values.description.trim());

      // 🔹 Конвертуємо кропнуту base64 в файл
      const blob = await fetch(croppedImage).then((res) => res.blob());
      const file = new File([blob], "promotion.png", { type: blob.type });
      formData.append("image", file);

      formData.append("startDate", startDate.toISOString());
      formData.append("endDate", endDate.toISOString());
      formData.append("isActive", values.isActive.toString());

      if (values.productIds && values.productIds.length > 0) {
        values.productIds.forEach((id) =>
          formData.append("productIds", id.toString())
        );
      }

      await createPromotion(formData).unwrap();

      message.success("Акція успішно створена!");
      navigate("/admin/promotions");
    } catch (error: unknown) {
      handleFormErrors(error as ApiError, form);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-10 p-6 bg-white shadow-lg rounded-lg">
      <Button type="default" className="mb-6" onClick={() => navigate(-1)}>
        Назад
      </Button>

      <h1 className="title">Створення акції</h1>

      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          isActive: true,
          period: [null, null],
        }}
        scrollToFirstError
      >
        <Item
          name="name"
          label="Назва акції"
          rules={[
            { required: true, message: "Будь ласка, введіть назву акції!" },
          ]}
        >
          <Input placeholder="Назва акції" />
        </Item>

        <Item name="description" label="Опис акції">
          <TextArea rows={4} placeholder="Опис (необов’язково)" />
        </Item>

        <Divider>Період дії</Divider>
        <Item
          name="period"
          label="Виберіть початок та кінець акції"
          rules={[
            { required: true, message: "Будь ласка, виберіть період дії!" },
          ]}
        >
          <RangePicker
            locale={locale}
            showTime={{ format: "HH:mm" }}
            format="YYYY-MM-DD HH:mm"
            disabledDate={disabledDate}
            allowClear
            placeholder={["Початок", "Кінець"]}
            style={{ width: "100%" }}
          />
        </Item>

        <Item name="isActive" valuePropName="checked">
          <Checkbox>Активна</Checkbox>
        </Item>

        <Divider>Зображення акції</Divider>
        <div className="mb-4">
          {croppedImage && (
            <div style={{ marginBottom: 8 }}>
              <img
                src={croppedImage}
                alt="Зображення"
                style={{
                  maxWidth: "300px",
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

        <Button type="primary" htmlType="submit" loading={isLoading} block>
          Створити акцію
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

export default CreatePromotionPage;
