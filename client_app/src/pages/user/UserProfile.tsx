// export default UserProfile;

import { useEffect, useState } from "react";
import {
  Layout,
  Input,
  Button,
  Spin,
  Upload,
  Avatar,
  Form,
  Divider,
} from "antd";
import { getAuth, getUser } from "../../store/slices/userSlice";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "../../services/userApi";
import { useAppSelector } from "../../store/store";
import { APP_ENV } from "../../env";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import PhoneInput from "../../components/PhoneInput.tsx";
import { handleFormErrors } from "../../utilities/handleApiErrors";
import { ApiError } from "../../types/errors";
import CropperModal from "../../components/images/CropperModal.tsx";
import UserSidebar from "./userPages/UserSidebar.tsx";
import PencilFilledIcon from "../../components/icons/PencilFilledIcon.tsx";
import { showToast } from "../../utilities/showToast.ts";
import SuccessIcon from "../../components/icons/toasts/SuccessIcon.tsx";

const { Content } = Layout;

const UserProfile = () => {
  const [form] = Form.useForm();
  const client = useAppSelector(getUser);

  const { data: user, isLoading } = useGetUserByIdQuery(Number(client?.id));
  const [updateUser] = useUpdateUserMutation();

  const auth = useAppSelector(getAuth);
  const isAdmin = auth.roles.includes("Admin");

  // Стани для роботи з аватаром
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

      setCroppedImage(
        user.image ? `${APP_ENV.IMAGES_100_URL}${user.image}` : null
      );
    }
  }, [user, form]);

  const handleBeforeUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
    return false; // не вантажимо одразу
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

      if (values.birthDate) {
        formData.append("birthDate", values.birthDate.format("YYYY-MM-DD"));
      }

      if (croppedImage && croppedImage.startsWith("data:image")) {
        const blob = await fetch(croppedImage).then((res) => res.blob());
        formData.append("Image", blob, "avatar.png");
      }

      await updateUser(formData).unwrap();
      showToast('success', 'Зміни збережено', <SuccessIcon/>)
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
    <Layout className="bg-white w-[93%] mx-auto font-manrope min-h-[750px]">
      <h1 className="text-[28px] font-bold mt-12 mb-6 text-center">
        Мій профіль
      </h1>
      <div className="flex gap-6 mt-12">
        {isAdmin ? null : <UserSidebar />}

        <Content
          className="flex justify-center items-start"
          style={{ flex: 1 }}
        >
          <div className="w-full mx-16">
            <div className="grid grid-cols-1 md:grid-cols-[auto,1fr,1fr] gap-x-[50px]">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Avatar size={150} src={croppedImage || user.image} />
                  <Upload
                    showUploadList={false}
                    beforeUpload={handleBeforeUpload}
                    accept="image/*"
                    name="photoUrl"
                  >
                    <Button
                      className="absolute top-[130px] left-[60px]"
                      style={{ background: "transparent", padding: 0 }}
                      type="text"
                      icon={<PencilFilledIcon />}
                    />
                  </Upload>
                </div>
              </div>

              <div>
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
              </div>

              <div>
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
                </Form>

                <CropperModal
                  image={avatarPreview}
                  open={showCropper}
                  aspectRatio={1}
                  onCrop={handleCropped}
                  onCancel={handleCancelCrop}
                />
              </div>
            </div>

            <Divider className="mt-20" />

            <div className="flex justify-center">
              <button
                className="px-5 bg-pink2 rounded-xl border-pink2 h-[45px] hover:bg-[#58042c] text-[18px] text-white"
                onClick={handleSave}
              >
                Зберегти зміни
              </button>
            </div>
          </div>
        </Content>
      </div>
    </Layout>
  );
};

export default UserProfile;
