// pages/GoogleRegisterUser.tsx
import "react-phone-input-2/lib/style.css"; // обов’язково
import { Form, Input, Upload, Button, Typography, Modal } from "antd";
import { useGoogleUserInfo } from "../hooks/useGoogleUserInfo";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useConfirmGoogleRegisterMutation } from "../services/authApi";
import PhoneInput from "../components/PhoneInput";
import ImageCropper from "../components/images/ImageCropper";
import { base64ToFile } from "../utilities/base64ToFile";
import { handleFormErrors } from "../utilities/handleApiErrors";
import { ApiError } from "../types/errors";
import AmoonIcon from "../components/icons/AmoonIcon";
import AccountBoxIcon from "../components/icons/AccountBoxIcon";
import StarDecoration from "../../src/components/decorations/StarDecoration";
import BackButton from "../components/buttons/BackButton";

const GoogleRegisterUser = () => {
  const [form] = Form.useForm();
  const [confirmGoogleRegister, { isLoading }] =
    useConfirmGoogleRegisterMutation();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token");
  const { userInfo } = useGoogleUserInfo(token);
  const { Text } = Typography;
  const profileImageUrl = selectedImage
    ? URL.createObjectURL(selectedImage)
    : userInfo?.picture || "/default-avatar.png";

  useEffect(() => {
    if (userInfo) {
      form.setFieldsValue({
        firstName: userInfo?.given_name || "",
        lastName: userInfo?.family_name || "",
        email: userInfo.email,
        phone: "",
      });
    }
  }, [userInfo, form]);

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
    setSelectedImage(base64ToFile(cropped, "avatar.png"));
    setShowCropper(false);
  };

  const handleCancelCrop = () => {
    setShowCropper(false);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log("values google reg:", values);

      await confirmGoogleRegister({
        ...values,
        googleAccessToken: token!,
        image: selectedImage ?? undefined,
      }).unwrap();
      navigate("/");
    } catch (error: unknown) {
      handleFormErrors(error as ApiError, form);
    }
  };
  const handleCancel = () => {
    navigate("/login");
  };

  return (
    <div className="flex w-full min-h-screen items-center justify-center bg-beige2">
      {/* Фонове зображення */}
      <img
        src="/amir-seilsepour-unsplash-2.png"
        className="absolute right-0 top-0 w-[55%] h-full object-cover z-0 hidden lg:block"
        alt="background"
      />
      {/* Декоративний градієнт */}
      <div className="absolute inset-0 left-[45%] bg-gradient-to-r from-beige2  z-0" />

      <BackButton to="/" />

      {/* Форма логіну */}
      <div className="relative flex w-full max-w-sm mx-auto  rounded-lg  lg:max-w-6xl ">
        {/* Зірка вгорі зліва */}
        <StarDecoration
          width={72}
          height={86}
          className="absolute  z-20 top-[-41.5px] left-[-34.5px] hidden xl:block"
        />

        {/* Зірка внизу справа */}
        <StarDecoration
          width={72}
          height={86}
          className="absolute z-20 bottom-[-42px] right-[582.5px] hidden lg:block "
        />

        <div className="form-container xs:max-w-[100%] md:max-w-[] w-[535px]  h-full px-6 py-8 md:px-8 z-20 xs:translate-x-[-7%] md:translate-x-[-20%] lg:translate-x-[40%] xl:translate-x-0">
          {/* Контент з відступами */}
          <h1 className="form-title">Підтвердження Google-реєстрації</h1>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <div className="flex-column-block">
              <Form.Item
                label={<span className="form-label mt-2">Фото профілю</span>}
              >
                <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 mt-1">
                  <div
                    className="rounded-full bg-cover bg-center flex-shrink-0"
                    style={{
                      width: "193px",
                      height: "193px",
                      backgroundImage: `url("${profileImageUrl}")`,
                      backgroundRepeat: "no-repeat",
                      backgroundColor: "lightgray", // fallback
                    }}
                  />

                  <Upload
                    showUploadList={false}
                    accept="image/*"
                    beforeUpload={handleBeforeUpload}
                  >
                    <Button className="flex justify-center items-center p-[15px] sm:mt-[20px] xs:mt-[20px] gap-[12px] w-[260px] h-[40px] rounded-[15px] shadow-none border-gray">
                      <span className="text-black font-manrope text-[14px] font-medium leading-normal">
                        {" "}
                        Змінити фото
                      </span>
                      <AmoonIcon
                        style={{
                          width: "20px",
                          height: "20px",
                          flexShrink: 0,
                          aspectRatio: "1 / 1",
                        }}
                      />
                    </Button>
                  </Upload>
                </div>
              </Form.Item>
            </div>
            <div className="text-black font-manrope text-[20px] font-medium leading-normal">
              <Text className="email-text" strong>
                Email: {userInfo?.email}
              </Text>
            </div>

            <Form.Item
              name="firstName"
              label={<span className="form-label">Ім'я</span>}
              rules={[{ required: true }]}
            >
              <Input
                placeholder="Ваше Ім'я"
                className="form-input"
                suffix={
                  <AccountBoxIcon
                    style={{
                      width: "20px",
                      height: "20px",
                      aspectRatio: "1 / 1",
                    }}
                  />
                }
              />
            </Form.Item>

            <Form.Item
              name="lastName"
              label={<span className="form-label">Прізвище</span>}
            >
              <Input
                placeholder="Ваше Прізвище"
                className="form-input"
                suffix={
                  <AccountBoxIcon
                    style={{
                      width: "20px",
                      height: "20px",
                      aspectRatio: "1 / 1",
                    }}
                  />
                }
              />
            </Form.Item>

            <Form.Item
              name="phone"
              label={<span className="form-label">Номер телефону</span>}
              rules={[
                { required: true, message: "Введіть номер телефону" },
                {
                  validator: (_, value) => {
                    const regex_phone = /^\+38\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/;
                    if (!value || regex_phone.test(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Неправильний формат номера телефону")
                    );
                  },
                },
              ]}
              getValueFromEvent={(e) => e.target.value}
            >
              <PhoneInput />
            </Form.Item>

            <Form.Item>
              <div className="w-full">
                <div className="flex flex-wrap items-start sm:items-center gap-4 mt-5 min-w-0">
                  <Button
                    className="remember-button sm:w-[120px] w-full"
                    danger
                    onClick={handleCancel}
                  >
                    <span className="form-label">Скасувати</span>
                  </Button>

                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isLoading}
                    className="remember-button sm:flex-1 w-full"
                  >
                    <span className="remember-button-text">
                      Завершити Реєстрацію
                    </span>
                  </Button>
                </div>
              </div>
            </Form.Item>
          </Form>
          <Modal
            open={showCropper}
            footer={null}
            onCancel={handleCancelCrop}
            width={600}
          >
            {avatarPreview && (
              <ImageCropper
                image={avatarPreview}
                aspectRatio={1}
                onCrop={handleCropped}
                onCancel={handleCancelCrop}
              />
            )}
          </Modal>
        </div>
      </div>
      {/* Ліва колонка */}
      <div className="relative z-20 h-full">
        {/* Контент лівої частини (762px) */}
      </div>
    </div>
  );
};

export default GoogleRegisterUser;
