// pages/GoogleRegisterUser.tsx
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
// import GoogleIcon from "@/components/icons/GoogleIcon";
// import MailIcon from "@/components/icons/MailIcon";
import StarDecoration from '../../src/components/decorations/StarDecoration';
import '../../src/pages/user/GoogleRegisterUser.scss';




const GoogleRegisterUser = () => {
  const [form] = Form.useForm();
  const [confirmGoogleRegister, { isLoading }] = useConfirmGoogleRegisterMutation();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
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

    <div className="min-h-screen flex items-center justify-center bg-gray-100">


      <div className="relative w-[1920px] h-[1080px] shadow-md grid grid-cols-[762px_1fr]">
        {/* Фонове зображення */}
        <img
          src="/amir-seilsepour-unsplash-2.png"
          alt="background"
          // className="absolute top-0 left-0 w-full h-full object-cover z-0"
          className="absolute top-0 left-[762px] w-[1158px] h-full object-contain z-0"
        />

        {/* Градієнт поверх зображення */}
        <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
          style={{
            background: `linear-gradient(to right, #FFF7F3 762px, rgba(255,247,243,0) 100%)`
          }}
        />

        {/* Вміст */}
        {/* <div className="relative z-20"> */}
        {/* Тут вміст лівої колонки (762px) */}
        {/* </div> */}
        {/* <div className="relative z-20"> */}
        {/* Тут вміст правої колонки */}
        {/* </div> */}

        {/* <div className="w-[1920px] h-[1080px] bg-white shadow-md fon-google-regist grid grid-cols-[762px_1fr]">  */}

        {/* <div className="relative w-[1920px] h-[1080px] ...">
  <div className="relative z-10">
    Контент
  </div>
</div> */}
        {/* Порожній блок для створення відступу */}

        {/* <div  style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
         */}




        {/* Ліва колонка (тепер та, що була правою) */}
        {/* <div className="relative z-20 h-full"> */}
        {/* <div className="pt-[109px] pr-[1131px] pb-[108px] pl-[158px] w-full h-full"> */}
        {/* Правий вміст з відступами */}
        {/* </div> */}

        <div

        //absolute забрав з класу
          className="
                  
    box-border flex flex-col items-center
    bg-[#FFF] border-[2px] border-solid border-[var(--Linear-blue,#1A3D83)]
    rounded-[15px]
    pl-[40px] pt-[60px] pb-[40px] pr-[60px]
    ml-[158px] mt-[109px] mb-[108px] mr-[1131px]
    gap-[37px] z-30 font-manrope
    lg:absolute lg:left-[0px] lg:top-[126px] lg:w-[574px] lg:h-[710px]
    md:static md:ml-[188px] md:mt-[58px] md:w-[574px] md:h-[710px]
    sm:static sm:mx-auto sm:w-[90vw] sm:p-6 sm:gap-6
    xs:static xs:mx-auto xs:w-[95vw] xs:p-4 xs:gap-4"

          style={{
            overflow: 'hidden',
            borderWidth: '2px',
            borderStyle: 'solid',
            borderImage: 'linear-gradient(149.91deg, #1A3D83, #8AA8D2 100%) 1'
          }}

        >
          


          <div
    className="box-border bg-white relative"
    style={{
      width: '511px',
      height: '783px',
      margin: '40px 60px',
      backgroundColor: '#FFF',
      overflow: 'hidden' // гарантує, що дочірні елементи не виходять
    }}
  >

  
          {/* Контент з відступами */}
          {/* <p> Контент </p> */}
          <h2 className="google-title">Підтвердження Google-реєстрації</h2>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <div className="flex-column-block">

           
            <Form.Item label={<span className="custom-label">Фото профілю</span>}>

            
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-5">
    <div
      className="rounded-full bg-cover bg-center"
      style={{
        width: '193px',
        height: '193px',
        backgroundImage: `url(${
          selectedImage
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
  className="
    flex justify-between items-center
    w-[266px] p-[15px]
    rounded-[15px] border border-[#666]
    text-black font-manrope text-[16px] font-medium
    sm:mt-0 mt-4
  "
>
   <span>Змінити фото</span>
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
            <Text strong>Email: {userInfo?.email}</Text>

            <Form.Item name="firstName" label="Ім'я" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item name="lastName" label="Прізвище">
              <Input />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Номер телефону"
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
              <PhoneInput />
            </Form.Item>

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
        {/* Декоративні зірки у кутах */}
        <StarDecoration width={109} height={127} style={{ position: 'absolute', top: 120, left: 135, zIndex: 40 }} className="hidden md:block" />
        <StarDecoration width={108} height={127} style={{ position: 'absolute', top: 829, left: 708, zIndex: 40 }} className="hidden md:block" />
        {/* <StarDecoration
      width={109}
      height={127}
      className="hidden md:block absolute z-40"
      style={{position: 'absolute', top: 120, left: 135 }}
    />
    <StarDecoration
      width={108}
      height={127}
      className="hidden md:block absolute z-40"
      style={{ bottom: 0, right: 0 }}
    />
     */}
      </div>
      {/* Ліва колонка */}
      <div className="relative z-20 h-full">
        {/* Контент лівої частини (762px) */}
      </div>

    </div>
  );
};

export default GoogleRegisterUser;
