// import { UserOutlined, HomeOutlined, HistoryOutlined, GiftOutlined, DeleteOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
// import { Layout, Menu, Input, Typography, Row, Col, Divider, Button, Space, Spin } from 'antd';
// import { useNavigate } from 'react-router-dom';
// import { getAuth, getUser, logOut } from '../../store/slices/userSlice';
// import { useGetUserByIdQuery } from '../../services/userApi';
// import { useDispatch } from 'react-redux';
// import { useAppSelector } from '../../store/store';
// import AdminSidebar from '../../components/layouts/admin/AdminSidebar';
//
// const { Content, Sider } = Layout;
// const { Title, Text } = Typography;
//
// const UserProfile = () => {
//   const client = useAppSelector(getUser);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//
//   const { data: user, isLoading } = useGetUserByIdQuery(Number(client?.id));
//
//   const auth = useAppSelector(getAuth);
//   const isAdmin = auth.roles.includes('Admin');
//
//   const handleLogout = () => {
//     dispatch(logOut());
//     navigate('/login');
//   };
//
//   const menuItems = [
//     { key: '1', icon: <UserOutlined />, label: 'Контактна інформація' },
//     { key: '2', icon: <HomeOutlined />, label: 'Адресна книга' },
//     { key: '3', icon: <HistoryOutlined />, label: 'Історія замовлень' },
//     { key: '4', icon: <UserOutlined />, label: 'Мої особливості' },
//     { key: '5', icon: <GiftOutlined />, label: 'Список бажань' },
//     { key: '6', icon: <GiftOutlined />, label: 'Промокоди' },
//     { key: '7', icon: <DeleteOutlined style={{ color: '#ff4d4f' }} />, label: 'Видалити мій акаунт', style: { color: '#ff4d4f' } },
//     { key: '8', icon: <LogoutOutlined />, label: 'Вихід', onClick: handleLogout },
//   ];
//
//   if (isLoading || !user) {
//     return (
//       <Content className="flex justify-center items-center min-h-[300px]">
//         <Spin size="large" />
//       </Content>
//     );
//   }
//
//   return (
//     <Layout>
//
//       {isAdmin ? (<AdminSidebar />) : (
//         <Sider theme="light" width={220} collapsible>
//           <Menu mode="inline" defaultSelectedKeys={['1']} className='py-1' items={menuItems} />
//         </Sider>
//       )}
//
//       <Content className="m-3 p-6 bg-white" key={user.id}>
//         <Title level={3}>Профіль користувача</Title>
//
//         <Row gutter={40} className="mt-8">
//           <Col span={12}>
//             <Text strong className="block mb-2">Ім’я</Text>
//             <Input size="large" defaultValue={user.firstName} />
//             <Divider />
//
//             <Text strong className="block mb-2">Прізвище</Text>
//             <Input size="large" defaultValue={user.lastName} />
//             <Divider />
//
//             <Text strong className="block mb-2">E-mail</Text>
//             <Input size="large" defaultValue={user.email} />
//             <Divider />
//
//             <Text strong className="block mb-2">Дата народження</Text>
//             <Input size="large" placeholder="дд.мм.рррр" type='date' />
//             <Divider />
//
//             <Text strong className="block mb-2">Телефон</Text>
//             <Input size="large" defaultValue={user.phoneNumber} />
//           </Col>
//
//           <Col span={12}>
//             <Row justify="space-between" className="mb-[77px]">
//               <Col span={8}>
//                 <div className="h-40 bg-gray-100 rounded-lg p-4 flex flex-col justify-between shadow-sm">
//                   <Text strong className="text-sm">Вподобані товари</Text>
//                   <Text className="text-4xl font-light">0</Text>
//                 </div>
//               </Col>
//               <Col span={8}>
//                 <div className="h-40 bg-gray-100 rounded-lg p-4 mx-1 flex flex-col justify-between shadow-sm">
//                   <Text strong className="text-sm">Придбані товари</Text>
//                   <Text className="text-4xl font-light">0</Text>
//                 </div>
//               </Col>
//               <Col span={8}>
//                 <div className="h-40 bg-gray-100 rounded-lg p-4 flex flex-col justify-between shadow-sm">
//                   <Text strong className="text-sm">В кошику</Text>
//                   <Text className="text-4xl font-light">0</Text>
//                 </div>
//               </Col>
//             </Row>
//
//             <Text strong className="block mb-2">Старий пароль</Text>
//             <Input.Password size="large" placeholder="********" />
//             <Divider />
//
//             <Text strong className="block mb-2">Новий пароль</Text>
//             <Input.Password size="large" placeholder="********" />
//             <Divider />
//
//             <Text strong className="block mb-2">Підтвердження пароля</Text>
//             <Input.Password size="large" placeholder="********" />
//           </Col>
//         </Row>
//
//         <Divider />
//
//         <Space className="flex justify-center">
//           <Button type="primary" icon={<SettingOutlined />}>Зберегти зміни</Button>
//         </Space>
//       </Content>
//     </Layout>
//   );
// };
//
// export default UserProfile;

import { useEffect, useState } from 'react';
import { UserOutlined, HomeOutlined, HistoryOutlined, GiftOutlined, DeleteOutlined, LogoutOutlined, SettingOutlined, UploadOutlined } from '@ant-design/icons';
import { Layout, Menu, Input, Typography, Row, Col, Divider, Button, Space, Spin, Upload, Avatar, Modal, message, Form } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getAuth, getUser, logOut } from '../../store/slices/userSlice';
import { useGetUserByIdQuery, useUpdateUserMutation } from '../../services/userApi';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../store/store';
import ImageCropper from '../../components/images/ImageCropper';
import { APP_ENV } from '../../env';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import PhoneInput from "../../components/PhoneInput.tsx";

const { Content, Sider } = Layout;
const { Title, Text } = Typography;

const UserProfile = () => {
  const [form] = Form.useForm();
  const client = useAppSelector(getUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: user, isLoading } = useGetUserByIdQuery(Number(client?.id));
  const [updateUser] = useUpdateUserMutation();

  const auth = useAppSelector(getAuth);
  const isAdmin = auth.roles.includes('Admin');

  // Стани для роботи з аватаром
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);

  // useEffect(() => {
  //   if (user) {
  //     form.setFieldsValue({
  //       firstName: user.firstName || '',
  //       lastName: user.lastName || '',
  //       email: user.email || '',
  //       phoneNumber: user.phoneNumber || '',
  //       birthDate: user.birthDate || '',
  //     });
  //     setCroppedImage(user.image ? `${APP_ENV.IMAGES_100_URL}${user.image}` : null);
  //   }
  // }, [user, form]);

  useEffect(() => {
    if (user) {

      form.setFieldsValue({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
       // birthDate: dayjs('1995-01-01'),
        birthDate: user.birthDate ? dayjs(user.birthDate) : null,

       // phone: user.phoneNumber || '', // маска має співпадати з цим форматом
      });
      console.log("user------", user);

      setCroppedImage(user.image ? `${APP_ENV.IMAGES_100_URL}${user.image}` : null);
    }
  }, [user, form]);


  const handleLogout = () => {
    dispatch(logOut());
    navigate('/login');
  };

  const handleBeforeUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
    return false; // Не завантажуємо одразу, будемо через cropper
  };

  const handleCropped = (cropped: string) => {
    setCroppedImage(cropped);
    setShowCropper(false);
  };

  const handleCancelCrop = () => {
    setShowCropper(false);
  };

  // const handleSave = async () => {
  //   try {
  //     const values = await form.validateFields();
  //
  //     const formData = new FormData();
  //     formData.append('id', user!.id.toString());
  //     formData.append('firstName', values.firstName);
  //     formData.append('lastName', values.lastName);
  //     formData.append('email', values.email);
  //     formData.append('phoneNumber', values.phoneNumber);
  //     formData.append('birthDate', values.birthDate);
  //
  //     if (croppedImage && croppedImage.startsWith('data:image')) {
  //       const blob = await fetch(croppedImage).then(res => res.blob());
  //       formData.append('Image', blob, 'avatar.png');
  //     }
  //
  //     await updateUser(formData).unwrap();
  //     message.success('Зміни збережено');
  //   } catch (error) {
  //     console.error(error);
  //     message.error('Помилка при збереженні');
  //   }
  // };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const formData = new FormData();
      formData.append('id', user!.id.toString());
      formData.append('firstName', values.firstName);
      formData.append('lastName', values.lastName);
      formData.append('email', values.email);
      formData.append('phoneNumber', values.phoneNumber);
      formData.append('birthDate', values.birthDate.format('YYYY-MM-DD'));
      // Форматуємо дату у формат YYYY-MM-DD, якщо вона є
      if (values.birthDate) {
        formData.append('birthDate', values.birthDate.format('YYYY-MM-DD'));
      }

      if (croppedImage && croppedImage.startsWith('data:image')) {
        const blob = await fetch(croppedImage).then(res => res.blob());
        formData.append('Image', blob, 'avatar.png');
      }

      await updateUser(formData).unwrap();
      message.success('Зміни збережено');
    } catch (error) {
      console.error(error);
      message.error('Помилка при збереженні');
    }
  };



  const menuItems = [
    { key: '1', icon: <UserOutlined />, label: 'Контактна інформація' },
    { key: '2', icon: <HomeOutlined />, label: 'Адресна книга' },
    { key: '3', icon: <HistoryOutlined />, label: 'Історія замовлень' },
    { key: '4', icon: <UserOutlined />, label: 'Мої особливості' },
    { key: '5', icon: <GiftOutlined />, label: 'Список бажань' },
    { key: '6', icon: <GiftOutlined />, label: 'Промокоди' },
    { key: '7', icon: <DeleteOutlined style={{ color: '#ff4d4f' }} />, label: 'Видалити мій акаунт', style: { color: '#ff4d4f' } },
    { key: '8', icon: <LogoutOutlined />, label: 'Вихід', onClick: handleLogout },
  ];

  if (isLoading || !user) {
    return (
        <Content className="flex justify-center items-center min-h-[300px]">
          <Spin size="large" />
        </Content>
    );
  }

  return (
      <Layout>
        {isAdmin ? null : (
            <Sider theme="light" width={220} collapsible>
              <Menu mode="inline" defaultSelectedKeys={['1']} className='py-1' items={menuItems} />
            </Sider>
        )}

        <Content className="m-3 p-6 bg-white" key={user.id}>
          <Title level={3}>Профіль користувача</Title>

          <div className="mb-6 flex gap-6 items-center">
            <Avatar size={100} src={croppedImage || user.image} />
            <Upload
                showUploadList={false}
                beforeUpload={handleBeforeUpload}
                accept="image/*"
                name="photoUrl"
            >
              <Button icon={<UploadOutlined />}>Оновити аватар</Button>
            </Upload>
          </div>

          <Form form={form} layout="vertical">
            <Row gutter={40} className="mt-8">
              <Col span={12}>
                <Form.Item label="Ім’я" name="firstName" rules={[{ required: true, message: 'Введіть ім’я' }]}>
                  <Input size="large" />
                </Form.Item>

                <Form.Item label="Прізвище" name="lastName" rules={[{ required: true, message: 'Введіть прізвище' }]}>
                  <Input size="large" />
                </Form.Item>

                <Form.Item label="E-mail" name="email" rules={[{ required: true, message: 'Введіть email' }]}>
                  <Input size="large" />
                </Form.Item>

                {/*<Form.Item label="Дата народження" name="birthDate">*/}
                {/*  <Input size="large" type="date" />*/}
                {/*</Form.Item>*/}
                <Form.Item label="Дата народження" name="birthDate">
                  <DatePicker size="large" format="YYYY-MM-DD" />
                </Form.Item>

                <Form.Item
                    name="phoneNumber"
                    label="Номер телефону"
                    rules={[
                      { required: true, message: 'Введіть номер телефону' },
                      {
                        validator: (_, value) => {
                          const regex_phone = /^\+38\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/;
                          if (!value || regex_phone.test(value)) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Неправильний формат номера телефону'));
                        },
                      },
                    ]}
                    getValueFromEvent={e => e.target.value}
                >
                  <PhoneInput
                      value={form.getFieldValue('phoneNumber')}
                      //     onChange={(val: any)=> {
                      //     console.log("form", form.getFieldValue('phone'));
                      //     console.log("ss",val)
                      // } }
                  />
                </Form.Item>


                {/*<Form.Item label="Телефон" name="phoneNumber">*/}
                {/*  <Input size="large" />*/}
                {/*</Form.Item>*/}
              </Col>

              <Col span={12}>
                <Text strong className="block mb-2">Старий пароль</Text>
                <Input.Password size="large" placeholder="********" disabled />
                <Divider />

                <Text strong className="block mb-2">Новий пароль</Text>
                <Input.Password size="large" placeholder="********" disabled />
                <Divider />

                <Text strong className="block mb-2">Підтвердження пароля</Text>
                <Input.Password size="large" placeholder="********" disabled />
              </Col>
            </Row>
          </Form>

          <Divider />

          <Space className="flex justify-center">
            <Button type="primary" icon={<SettingOutlined />} onClick={handleSave}>
              Зберегти зміни
            </Button>
          </Space>

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
        </Content>
      </Layout>
  );
};

export default UserProfile;
