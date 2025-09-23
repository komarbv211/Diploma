import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  DatePicker,
  Upload,
  Divider,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import locale from "antd/es/date-picker/locale/uk_UA";
import { RcFile } from "antd/es/upload";

import CropperModal from "../../../components/images/CropperModal";
import {
  useGetPromotionByIdQuery,
  useUpdatePromotionMutation,
} from "../../../services/admin/promotionAdminApi";
import { PromotionFormValues } from "../../../types/promotion";
import { APP_ENV } from "../../../env";
import { showToast } from "../../../utilities/showToast";
import ErrorIcon from "../../../components/icons/toasts/ErrorIcon";
import SuccessIcon from "../../../components/icons/toasts/SuccessIcon";

const { Item } = Form;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const disabledDate = (current: dayjs.Dayjs | null) => {
  if (!current) return false;
  return current < dayjs().startOf("minute");
};

const EditPromotionPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: promotion, isLoading } = useGetPromotionByIdQuery(Number(id));
  const [updatePromotion, { isLoading: isUpdating }] =
    useUpdatePromotionMutation();
  const [form] = Form.useForm();
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [selectedFile, setSelectedFile] = useState<RcFile | null>(null);

  useEffect(() => {
    if (promotion) {
      form.setFieldsValue({
        name: promotion.name,
        description: promotion.description ?? "",
        period: [dayjs(promotion.startDate), dayjs(promotion.endDate)],
        isActive: promotion.isActive,
        productIds: promotion.productIds ?? [],
      });
      if (promotion.imageUrl) {
        setCroppedImage(`${APP_ENV.IMAGES_200_URL}${promotion.imageUrl}`);
        setSelectedFile(null);
      }
    }
  }, [promotion, form]);

  const handleBeforeUpload = (file: RcFile) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      setSelectedFile(file);
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
    setImagePreview(null);
    setSelectedFile(null);
  };

  const handlePreview = () => {
    if (croppedImage) {
      setImagePreview(croppedImage);
      setShowCropper(true);
    }
  };

  const onFinish = async (values: PromotionFormValues) => {
    if (!croppedImage) {
      showToast("error", "Будь ласка, завантажте зображення", <ErrorIcon />);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("id", id!);
      formData.append("name", values.name.trim());
      if (values.description)
        formData.append("description", values.description.trim());
      formData.append("startDate", values.period[0].toISOString());
      formData.append("endDate", values.period[1].toISOString());
      formData.append("isActive", values.isActive.toString());

      if (croppedImage.startsWith("data:image") && selectedFile) {
        const blob = await (await fetch(croppedImage)).blob();
        const file = new File([blob], selectedFile.name, { type: blob.type });
        formData.append("image", file);
      }

      if (values.productIds?.length) {
        values.productIds.forEach((pid) =>
          formData.append("productIds", pid.toString())
        );
      }

      await updatePromotion({ id: Number(id), formData }).unwrap();
      showToast("success", "Акцію успішно оновлено", <SuccessIcon />);
      navigate("/admin/promotions");
    } catch {
      showToast("error", "Помилка при оновленні акції", <ErrorIcon />);
    }
  };

  if (isLoading) return <div>Завантаження...</div>;

  return (
    <div className="max-w-2xl mx-auto my-10 p-6 bg-white shadow-lg rounded-lg">
      <Button type="default" className="mb-6" onClick={() => navigate(-1)}>
        Назад
      </Button>

      <h1 className="title">Редагування акції</h1>

      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        initialValues={{ isActive: true, period: [null, null] }}
        scrollToFirstError
      >
        <Item
          name="name"
          label="Назва акції"
          rules={[
            { required: true, message: "Введіть назву акції!" },
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
                alt="Зображення акції"
                style={{
                  maxWidth: "200px",
                  height: "auto",
                  border: "1px solid #ccc",
                  cursor: selectedFile ? "pointer" : "default",
                }}
                onClick={selectedFile ? handlePreview : undefined}
              />
            </div>
          )}

          <Upload
            showUploadList={false}
            beforeUpload={handleBeforeUpload}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>
              Завантажити нове зображення
            </Button>
          </Upload>
        </div>

        <Item className="mt-6">
          <Button type="primary" htmlType="submit" loading={isUpdating} block>
            Оновити акцію
          </Button>
        </Item>
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

export default EditPromotionPage;
