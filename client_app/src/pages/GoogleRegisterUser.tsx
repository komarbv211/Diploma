// pages/GoogleRegisterUser.tsx
import 'react-phone-input-2/lib/style.css'; // обов’язково
import { Form, Input, Upload, Button, Typography, Modal } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import { useGoogleUserInfo } from "../hooks/useGoogleUserInfo";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useConfirmGoogleRegisterMutation } from "../services/authApi";
import PhoneInput from "../components/PhoneInput";
import ImageCropper from "../components/images/ImageCropper";
import { base64ToFile } from "../utilities/base64ToFile";
import { handleFormErrors } from '../utilities/handleApiErrors';
import { ApiError } from '../types/errors';
import AmoonIcon from "../components/icons/AmoonIcon";
import AccountBoxIcon from "../components/icons/AccountBoxIcon";


import VectorPhoneIcon from "../components/icons/VectorPhoneIcon";
// import MailIcon from "@/components/icons/MailIcon";
import StarDecoration from '../../src/components/decorations/StarDecoration';
// import '../../src/pages/user/GoogleRegisterUser.scss';




const GoogleRegisterUser = () => {
  const [form] = Form.useForm();
  const [confirmGoogleRegister, { isLoading }] = useConfirmGoogleRegisterMutation();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);

  // const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token");
  const { userInfo } = useGoogleUserInfo(token);
  const { Text } = Typography;

  useEffect(() => {
    if (userInfo) {
      form.setFieldsValue({
        firstName: userInfo?.given_name || '',
        lastName: userInfo?.family_name || '',
        email: userInfo.email,
        phone: '',
      });
    }
  }, [userInfo, form]);


// const onFinish = async (values: { email: string; password: string }) => {
//     setErrorMessage("");
//     setIsLoading(true);
//     try {
//       const { data } = await triggerCheckGoogleRegistered(values.email);
//       if (data?.isGoogleUser) {
//         setShowGoogleModal(true);
//         return;
//       }
//       await loginUser(values).unwrap();
//       navigate("/");
//     } catch {
//       setErrorMessage("Невірний email або пароль");
//     } finally {
//       setIsLoading(false);
//     }
//   };
// тест
//test 
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
    setSelectedImage(base64ToFile(cropped, 'avatar.png'));
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
      navigate('/');
    } catch (error: unknown) {
      handleFormErrors(error as ApiError, form);
    }
  };
  const handleCancel = () => {
    navigate('/login');
  };

  return (

    <div className="flex w-full min-h-screen items-center justify-center bg-beige2">
      {/* Декоративний градієнт */}
      <div className="absolute inset-0 left-[45%] bg-gradient-to-r from-beige2  z-10" />
      {/* Фонове зображення */}
      <img
        src="/amir-seilsepour-unsplash-2.png"
        className="absolute right-0 top-0 w-[55%] h-full object-cover z-0 hidden lg:block"
        alt="background"
      />
     

      {/* Форма логіну */}
      <div className="relative flex w-full max-w-sm mx-auto  rounded-lg  lg:max-w-6xl ">
        {/* Зірка вгорі зліва */}
        <StarDecoration
          width={72}
          height={86}
          className="absolute  z-20 top-[-10.5px] left-[-3.5px] hidden xl:block"
        />

        {/* Зірка внизу справа */}
        <StarDecoration
          width={72}
          height={86}
          className="absolute z-20 bottom-[-10px] right-[574.5px] hidden lg:block "
        />

        <div className="relative  px-6 py-8 md:px-8  xs:max-w-[100%] md:max-w-[574px] z-10 xs:translate-x-[-7%] md:translate-x-[-20%] lg:translate-x-[40%] xl:translate-x-0 ">
          <div className="form-container xs:max-w-[100%] md:max-w-[574px] xl:w-full h-full px-6 py-8 md:px-8">



            {/* Контент з відступами */}
            <h2 className="google-title">Підтвердження Google-реєстрації</h2>
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <div className="flex-column-block">


                <Form.Item label={<span className="form-label">Фото профілю</span>}>


                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-5">
                    <div
                      className="rounded-full bg-cover bg-center"
                      style={{
                        width: '193px',
                        height: '193px',
                        backgroundImage: `url(${selectedImage
                            ? URL.createObjectURL(selectedImage)
                            : userInfo?.picture
                          })`,
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: 'lightgray', // fallback
                      }}
                    />

                    <Upload
                      showUploadList={false}
                      accept="image/*"
                      beforeUpload={handleBeforeUpload}
                    >
                      {/* <Button icon={<UploadOutlined />} className="h-[40px] sm:mt-0 mt-4">
        Змінити фото
      </Button> */}

                      <Button
                        className="remember-photo-button">
                        <span className="remember-button-photo gap-[12px]"> Змінити фото</span>
                        <AmoonIcon style={{
                          width: '20px',
                          height: '20px',
                          flexShrink: 0,
                          aspectRatio: '1 / 1',
                        }} />
                      </Button>
                    </Upload>
                  </div>
                </Form.Item>
              </div>
              <Text  className="email-text" strong>Email: {userInfo?.email}</Text>


<div className="h-[235px] self-stretch">
  {/* Вміст контейнера */}
  <div className="custom-container">

              <Form.Item name="firstName" label={<span className="form-label">Ім'я</span>}  rules={[{ required: true }]}>
                <Input 
                 placeholder="Ваше Ім'я"
                 className="form-input"
                suffix={
    <AccountBoxIcon
      style={{
        width: '20px',
        height: '20px',
        aspectRatio: '1 / 1',
      }}
    />
  }
                 />
              </Form.Item>
                 </div>
 <div className="custom-container">

              <Form.Item name="lastName" label={<span className="form-label">Прізвище</span>}>
                <Input
                 placeholder="Ваше Прізвище"
                 className="form-input"
suffix={
    <AccountBoxIcon
      style={{
        width: '20px',
        height: '20px',
        aspectRatio: '1 / 1',
      }} />
  }
                 />
              </Form.Item>
                 </div>
 <div className="custom-container">

              <Form.Item
                name="phone"
                label={<span className="form-label">Номер телефону</span>}
                rules={[
                  { required: true, message: 'Введіть номер телефону' },
                  {
                    validator: (_, value) => {
                      const regex_phone = /^\+38\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/;
                      if (!value || regex_phone.test(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject('Неправильний формат номера телефону');
                    },
                  },
                ]}
                >
             <div  className="relative w-full max-h-[235px] overflow-auto">
  <PhoneInput
    country={'ua'}
    inputClass="form-input pr-10" // додаємо відступ справа для іконки
    containerClass="w-full"
    placeholder="Ваш номер"
  />

  <VectorPhoneIcon
    className="absolute right-3 top-1/2 -translate-y-1/2 w-[17.387px] h-[17.11px] fill-gray-500 pointer-events-none"
  />
</div>
              </Form.Item>
                  </div>

                </div>
              <Form.Item>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <Button danger onClick={handleCancel}>
                    Скасувати
                  </Button>
                  <Button type="primary" htmlType="submit" loading={isLoading}>
                    Завершити Реєстрацію
                  </Button>
                </div>
              </Form.Item>
{/* {errorMessage && (
                      <div className="text-danger text-sm font-medium mt-1 font-manrope">
                        {errorMessage}
                      </div>
                    )} */}
            </Form>
            <Modal open={showCropper} footer={null} onCancel={handleCancelCrop} width={600}>
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
    </div>
  );
};

export default GoogleRegisterUser;
