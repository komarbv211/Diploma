// export default AdminProfile;

import {
  Layout,
  Typography,
  Row,
  Col,
  Button,
  Input,
  Spin,
  Upload,
  Avatar,
  Form,
} from "antd";
import {
  SettingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { getUser } from "../../store/slices/userSlice";
import { useAppSelector } from "../../store/store";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "../../services/userApi";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { APP_ENV } from "../../env";
import { DatePicker } from "antd";
import PhoneInput from "../../components/PhoneInput.tsx";
import { handleFormErrors } from "../../utilities/handleApiErrors";
import { ApiError } from "../../types/errors";
import CropperModal from "../../components/images/CropperModal.tsx";
import { showToast } from "../../utilities/showToast.ts";
import SuccessIcon from "../../components/icons/toasts/SuccessIcon.tsx";

const { Content } = Layout;
const { Title } = Typography;

const AdminProfile: React.FC = () => {
  const [form] = Form.useForm();
  const client = useAppSelector(getUser);
  const { data: user, isLoading } = useGetUserByIdQuery(Number(client?.id));
  const [updateUser] = useUpdateUserMutation();

  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        birthDate: user.birthDate ? dayjs(user.birthDate) : null,
      });

      setCroppedImage(`${APP_ENV.IMAGES_100_URL}${user.image}` || null);
    }
  }, [user, form]);

  const handleBeforeUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleCropped = (cropped: string) => {
    setCroppedImage(cropped);
    setShowCropper(false);
  };

  const handleCancelCrop = () => {
    setShowCropper(false);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const formData = new FormData();
      formData.append("id", user!.id.toString());
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("email", values.email);
      formData.append("phoneNumber", values.phoneNumber);
      // formData.append('birthDate', values.birthDate);
      if (values.birthDate) {
        formData.append("birthDate", values.birthDate.format("YYYY-MM-DD"));
      }

      if (croppedImage && croppedImage.startsWith("data:image")) {
        const blob = await fetch(croppedImage).then((res) => res.blob());
        formData.append("Image", blob, "avatar.png");
      }

      await updateUser(formData).unwrap();
      console.log("avatar file:", formData.get("avatar"));
      showToast("success", "Зміни збережено", <SuccessIcon />);
    } catch (error: unknown) {
      handleFormErrors(error as ApiError, form);
    }
  };

  if (isLoading || !user) {
    return (
      <Content className="flex justify-center items-center min-h-[300px]">
        <Spin size="large" />
      </Content>
    );
  }

  return (
    <Content className="pt-5 px-10">
      <Title level={3}>Профіль адміністратора</Title>

      <div className="mb-6 flex gap-6 items-center">
        <Avatar size={100} src={croppedImage || user.image} />
        <Upload
          showUploadList={false}
          beforeUpload={handleBeforeUpload}
          accept="image/*"
          name="photoUrl" // <-- Ось тут
        >
          <Button icon={<UploadOutlined />}>Оновити аватар</Button>
        </Upload>
      </div>

      <Form layout="vertical" form={form}>
        <Row gutter={40} className="mt-8">
          <Col span={12}>
         <Form
                  form={form}
                  layout="vertical"
                  className="flex flex-col gap-2"
                >
                  <Form.Item
                    label={<span className="form-label">Ім’я</span>}
                    name="firstName"
                    className="max-w-[470px]"
                    rules={[{ required: true, message: "Введіть ім’я" }]}
                  >
                    <Input size="large" className="form-input" />
                  </Form.Item>

                  <Form.Item
                    label={<span className="form-label">Прізвище</span>}
                    name="lastName"
                    className="max-w-[470px]"
                    rules={[{ required: true, message: "Введіть прізвище" }]}
                  >
                    <Input size="large" className="form-input" />
                  </Form.Item>

                  <Form.Item
                    label={<span className="form-label">Номер телефону</span>}
                    name="phoneNumber"
                    className="max-w-[470px]"
                    rules={[
                      { required: true, message: "Введіть номер телефону" },
                    ]}
                  >
                    <PhoneInput
                      value={form.getFieldValue("phoneNumber")}
                      onChange={(e) =>
                        form.setFieldsValue({ phoneNumber: e.target.value })
                      }
                    />
                  </Form.Item>
                </Form>
          </Col>

          <Col span={12}>
            <Form
              form={form}
              layout="vertical"
              className="flex flex-col gap-2"
            >
              <Form.Item
                label={<span className="form-label">Email</span>}
                name="email"
                className="max-w-[470px]"
                rules={[{ required: true, message: "Введіть email" }]}
              >
                <Input className="form-input" />
              </Form.Item>

              <Form.Item
                label={<span className="form-label">Дата народження</span>}
                name="birthDate"
                className="max-w-[470px]"
              >
                <DatePicker format="YYYY-MM-DD" className="form-input" />
              </Form.Item>
             
              <Form.Item label className="max-w-[470px]"> 
                <Button 
                  type="primary" 
                  icon={<SettingOutlined />} 
                  onClick={handleSave} 
                  className="flex items-center justify-center gap-2 p-[10px] bg-pink rounded-xl w-full h-[45px] hover:bg-pink2 text-[18px] text-white"> 
                  Зберегти зміни 
                </Button> 
              </Form.Item>  
                  
            </Form>
          </Col>
        </Row>
      </Form>
      <CropperModal
        image={avatarPreview}
        open={showCropper}
        aspectRatio={1}
        onCrop={handleCropped}
        onCancel={handleCancelCrop}
      />
    </Content>
  );
};

export default AdminProfile;
