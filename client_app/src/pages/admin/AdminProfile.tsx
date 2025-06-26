// import { Layout, Typography, Row, Col, Divider, Button, Space, Input, Spin, } from 'antd';
// import { SettingOutlined, LogoutOutlined } from '@ant-design/icons';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { useGetUserByIdQuery } from '../../services/userApi';
// import { getUser, logOut } from '../../store/slices/userSlice';
// import dayjs from 'dayjs';
// import { useAppSelector } from '../../store/store';

// const { Content } = Layout;
// const { Title, Text } = Typography;

// const AdminProfile = () => {
//   const client = useAppSelector(getUser);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const { data: user, isLoading } = useGetUserByIdQuery(Number(client?.id));

//   const handleLogout = () => {
//     dispatch(logOut());
//     navigate('/login');
//   };

//   if (isLoading || !user) {
//     return (
//       <Content className="flex justify-center items-center min-h-[300px]">
//         <Spin size="large" />
//       </Content>
//     );
//   }

//   return (
//     <Content className="pt-5 px-10">
//       <Title level={3}>Профіль адміністратора</Title>

//       <Row gutter={40} className="mt-8">
//         <Col span={12}>
//           <Text strong className="block mb-2">Ім’я</Text>
//           <Input size="large" defaultValue={user.firstName} />
//           <Divider />

//           <Text strong className="block mb-2">Прізвище</Text>
//           <Input size="large" defaultValue={user.lastName} />
//           <Divider />

//           <Text strong className="block mb-2">E-mail</Text>
//           <Input size="large" defaultValue={user.email} />
//           <Divider />

//           <Text strong className="block mb-2">Дата народження</Text>
//           <Input size="large" placeholder="дд.мм.рррр" />
//           <Divider />

//           <Text strong className="block mb-2">Телефон</Text>
//           <Input size="large" defaultValue={user.phoneNumber} />
//         </Col>

//         <Col span={12}>
//           <Text strong className="block mb-2">Старий пароль</Text>
//           <Input.Password size="large" placeholder="********" />
//           <Divider />

//           <Text strong className="block mb-2">Новий пароль</Text>
//           <Input.Password size="large" placeholder="********" />
//           <Divider />

//           <Text strong className="block mb-2">Підтвердження пароля</Text>
//           <Input.Password size="large" placeholder="********" />
//           <Divider />

//           <Text strong className="block mb-2">Роль</Text>
//           <Input size="large" disabled defaultValue={'Адміністратор'} />
//           <Divider />

//           <Text strong className="block mb-2">Останній вхід</Text>
//           <Input size="large" disabled defaultValue={dayjs(user.lastActivity).format('DD.MM.YYYY HH:mm')} />
//         </Col>
//       </Row>
//       <Divider />

//       <Space className="flex justify-center gap-[500px]">
//         <Button danger icon={<LogoutOutlined />} onClick={handleLogout}>
//           Вийти
//         </Button>
//         <Button type="primary" icon={<SettingOutlined />}>
//           Зберегти зміни
//         </Button>
//       </Space>
//     </Content>
//   );
// };

// export default AdminProfile;






// import {
//   Layout,
//   Typography,
//   Row,
//   Col,
//   Divider,
//   Button,
//   Space,
//   Input,
//   Spin,
//   Upload,
//   Avatar,
//   Modal,
//  // message,
// } from 'antd';
// import {
//   SettingOutlined,
//   LogoutOutlined,
//   UploadOutlined,
// } from '@ant-design/icons';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { getUser, logOut } from '../../store/slices/userSlice';
// import { useAppSelector } from '../../store/store';
// import { useGetUserByIdQuery } from '../../services/userApi';
// import dayjs from 'dayjs';
// import React, {useEffect, useState} from 'react';
// import ImageCropper from '../../components/images/ImageCropper';
//
// const { Content } = Layout;
// const { Title, Text } = Typography;
//
// const AdminProfile: React.FC = () => {
//   const client = useAppSelector(getUser);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { data: user, isLoading } = useGetUserByIdQuery(Number(client?.id));
//
//   const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
//   const [showCropper, setShowCropper] = useState(false);
//   //const [croppedImage, setCroppedImage] = useState<string | null>(user?.avatarUrl || null);
//   const [croppedImage, setCroppedImage] = useState<string | null>(null);
//
//   useEffect(() => {
//     if (user?.image) {
//       setCroppedImage(user.image);
//     }
//   }, [user]);
//   const handleLogout = () => {
//     dispatch(logOut());
//     navigate('/login');
//   };
//
//   const handleBeforeUpload = (file: File) => {
//     const reader = new FileReader();
//     reader.onload = () => {
//       setAvatarPreview(reader.result as string);
//       setShowCropper(true);
//     };
//     reader.readAsDataURL(file);
//     return false;
//   };
//
//   const handleCropped = async (cropped: string) => {
//     setShowCropper(false);
//     setCroppedImage(cropped);
// /*
//     try {
//       const blob = await fetch(cropped).then(r => r.blob());
//       const formData = new FormData();
//       formData.append('avatar', blob, 'avatar.png');
//
//       const response = await fetch(`/api/users/${user?.id}/avatar`, {
//         method: 'POST',
//         body: formData,
//       });
//
//       if (!response.ok) throw new Error('Upload failed');
//       message.success('Аватар успішно оновлено!');
//     } catch (error) {
//       console.error(error);
//       message.error('Помилка при завантаженні аватара');
//     }
//
//  */
//   };
//
//   const handleCancelCrop = () => {
//     setShowCropper(false);
//   };
//
//   if (isLoading || !user) {
//     return (
//         <Content className="flex justify-center items-center min-h-[300px]">
//           <Spin size="large" />
//         </Content>
//     );
//   }
//
//   return (
//       <Content className="pt-5 px-10">
//         <Title level={3}>Профіль адміністратора</Title>
//
//         {/* Аватар */}
//         <div className="mb-6 flex gap-6 items-center">
//           <Avatar size={100} src={croppedImage || user.image} />
//           <Upload
//               showUploadList={false}
//               beforeUpload={handleBeforeUpload}
//               accept="image/*"
//           >
//             <Button icon={<UploadOutlined />}>Оновити аватар</Button>
//           </Upload>
//         </div>
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
//             <Input size="large" placeholder="дд.мм.рррр" />
//             <Divider />
//
//             <Text strong className="block mb-2">Телефон</Text>
//             <Input size="large" defaultValue={user.phoneNumber} />
//           </Col>
//
//           <Col span={12}>
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
//             <Divider />
//
//             <Text strong className="block mb-2">Роль</Text>
//             <Input size="large" disabled defaultValue={'Адміністратор'} />
//             <Divider />
//
//             <Text strong className="block mb-2">Останній вхід</Text>
//             <Input size="large" disabled defaultValue={dayjs(user.lastActivity).format('DD.MM.YYYY HH:mm')} />
//           </Col>
//         </Row>
//
//         <Divider />
//
//         <Space className="flex justify-center gap-[500px]">
//           <Button danger icon={<LogoutOutlined />} onClick={handleLogout}>
//             Вийти
//           </Button>
//           <Button type="primary" icon={<SettingOutlined />}>
//             Зберегти змниі
//           </Button>
//         </Space>
//
//         {/* Модальне вікно для обрізки */}
//         <Modal
//             open={showCropper}
//             footer={null}
//             onCancel={handleCancelCrop}
//             width={600}
//         >
//           {avatarPreview && (
//               <ImageCropper
//                   image={avatarPreview}
//                   aspectRatio={1}
//                   onCrop={handleCropped}
//                   onCancel={handleCancelCrop}
//               />
//           )}
//         </Modal>
//       </Content>
//   );
// };
//
// export default AdminProfile;






//New
// import {
//   Layout,
//   Typography,
//   Row,
//   Col,
//   Divider,
//   Button,
//   Space,
//   Input,
//   Spin,
//   Upload,
//   Avatar,
//   Modal,
//   message,
// } from 'antd';
// import {
//   SettingOutlined,
//   LogoutOutlined,
//   UploadOutlined,
// } from '@ant-design/icons';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { getUser, logOut } from '../../store/slices/userSlice';
// import { useAppSelector } from '../../store/store';
// import { useGetUserByIdQuery } from '../../services/userApi';
// import dayjs from 'dayjs';
// import React, { useEffect, useState } from 'react';
// import ImageCropper from '../../components/images/ImageCropper';

// const { Content } = Layout;
// const { Title, Text } = Typography;

// const AdminProfile: React.FC = () => {
//   const client = useAppSelector(getUser);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { data: user, isLoading } = useGetUserByIdQuery(Number(client?.id));

//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [birthDate, setBirthDate] = useState('');
//   const [croppedImage, setCroppedImage] = useState<string | null>(null);

//   const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
//   const [showCropper, setShowCropper] = useState(false);

//   useEffect(() => {
//     if (user) {
//       setFirstName(user.firstName || '');
//       setLastName(user.lastName || '');
//       setEmail(user.email || '');
//       setPhoneNumber(user.phoneNumber || '');
//       setBirthDate(user.birthDate || '');
//       setCroppedImage(user.image || null);
//     }
//   }, [user]);

//   const handleLogout = () => {
//     dispatch(logOut());
//     navigate('/login');
//   };

//   const handleBeforeUpload = (file: File) => {
//     const reader = new FileReader();
//     reader.onload = () => {
//       setAvatarPreview(reader.result as string);
//       setShowCropper(true);
//     };
//     reader.readAsDataURL(file);
//     return false;
//   };

//   const handleCropped = (cropped: string) => {
//     setCroppedImage(cropped);
//     setShowCropper(false);
//   };

//   const handleCancelCrop = () => {
//     setShowCropper(false);
//   };

//   const handleSave = async () => {
//     try {
//       const payload = {
//         id: user!.id,
//         firstName,
//         lastName,
//         email,
//         phoneNumber,
//         birthDate,
//       };

//       // Збереження аватарки, якщо є нове зображення
//       /*
//       if (croppedImage && croppedImage.startsWith('data:image')) {
//         const blob = await fetch(croppedImage).then(res => res.blob());
//         const formData = new FormData();
//         formData.append('avatar', blob, 'avatar.png');

//         const avatarRes = await fetch(`http://localhost:5209/api/User/${user!.image}/avatar`, {
//           method: 'POST',
//           body: formData,
//         });

//         if (!avatarRes.ok) throw new Error('Помилка при збереженні аватару');
//       }
// */
//       // Збереження профілю
//       const res = await fetch(`http://localhost:5209/api/User`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) throw new Error('Помилка при збереженні профілю');
//       message.success('Зміни успішно збережено!');
//     } catch (error) {
//       console.error(error);
//       message.error('Помилка при збереженні');
//     }
//   };

//   if (isLoading || !user) {
//     return (
//         <Content className="flex justify-center items-center min-h-[300px]">
//           <Spin size="large" />
//         </Content>
//     );
//   }

//   return (
//       <Content className="pt-5 px-10">
//         <Title level={3}>Профіль адміністратора</Title>

//         <div className="mb-6 flex gap-6 items-center">
//           <Avatar size={100} src={croppedImage || user.image} />
//           <Upload
//               showUploadList={false}
//               beforeUpload={handleBeforeUpload}
//               accept="image/*"
//           >
//             <Button icon={<UploadOutlined />}>Оновити аватар</Button>
//           </Upload>
//         </div>

//         <Row gutter={40} className="mt-8">
//           <Col span={12}>
//             <Text strong className="block mb-2">Ім’я</Text>
//             <Input size="large" value={firstName} onChange={e => setFirstName(e.target.value)} />
//             <Divider />

//             <Text strong className="block mb-2">Прізвище</Text>
//             <Input size="large" value={lastName} onChange={e => setLastName(e.target.value)} />
//             <Divider />

//             <Text strong className="block mb-2">E-mail</Text>
//             <Input size="large" value={email} onChange={e => setEmail(e.target.value)} />
//             <Divider />

//             <Text strong className="block mb-2">Дата народження</Text>
//             <Input size="large" value={birthDate} onChange={e => setBirthDate(e.target.value)} />
//             <Divider />

//             <Text strong className="block mb-2">Телефон</Text>
//             <Input size="large" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
//           </Col>

//           <Col span={12}>
//             <Text strong className="block mb-2">Старий пароль</Text>
//             <Input.Password size="large" placeholder="********" disabled />
//             <Divider />

//             <Text strong className="block mb-2">Новий пароль</Text>
//             <Input.Password size="large" placeholder="********" disabled />
//             <Divider />

//             <Text strong className="block mb-2">Підтвердження пароля</Text>
//             <Input.Password size="large" placeholder="********" disabled />
//             <Divider />

//             <Text strong className="block mb-2">Роль</Text>
//             <Input size="large" disabled defaultValue={'Адміністратор'} />
//             <Divider />

//             <Text strong className="block mb-2">Останній вхід</Text>
//             <Input
//                 size="large"
//                 disabled
//                 defaultValue={dayjs(user.lastActivity).format('DD.MM.YYYY HH:mm')}
//             />
//           </Col>
//         </Row>

//         <Divider />

//         <Space className="flex justify-center gap-[500px]">
//           <Button danger icon={<LogoutOutlined />} onClick={handleLogout}>
//             Вийти
//           </Button>
//           <Button type="primary" icon={<SettingOutlined />} onClick={handleSave}>
//             Зберегти зміни
//           </Button>
//         </Space>

//         <Modal
//             open={showCropper}
//             footer={null}
//             onCancel={handleCancelCrop}
//             width={600}
//         >
//           {avatarPreview && (
//               <ImageCropper
//                   image={avatarPreview}
//                   aspectRatio={1}
//                   onCrop={handleCropped}
//                   onCancel={handleCancelCrop}
//               />
//           )}
//         </Modal>
//       </Content>
//   );
// };

// export default AdminProfile;


// import {
//   Layout,
//   Typography,
//   Row,
//   Col,
//   Divider,
//   Button,
//   Space,
//   Input,
//   Spin,
//   Upload,
//   Avatar,
//   Modal,
//   message,
// } from 'antd';
// import {
//   SettingOutlined,
//   LogoutOutlined,
//   UploadOutlined,
// } from '@ant-design/icons';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { getUser, logOut } from '../../store/slices/userSlice';
// import { useAppSelector } from '../../store/store';
// import {
//   useGetUserByIdQuery,
//   useUpdateUserMutation,
// } from '../../services/userApi';
// import dayjs from 'dayjs';
// import React, { useEffect, useState } from 'react';
// import ImageCropper from '../../components/images/ImageCropper';

// const { Content } = Layout;
// const { Title, Text } = Typography;

// const AdminProfile: React.FC = () => {
//   const client = useAppSelector(getUser);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const { data: user, isLoading } = useGetUserByIdQuery(Number(client?.id));
//   const [updateUser] = useUpdateUserMutation();

//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [birthDate, setBirthDate] = useState('');
//   const [croppedImage, setCroppedImage] = useState<string | null>(null);
//   const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
//   const [showCropper, setShowCropper] = useState(false);

//   useEffect(() => {
//     if (user) {
//       setFirstName(user.firstName || '');
//       setLastName(user.lastName || '');
//       setEmail(user.email || '');
//       setPhoneNumber(user.phoneNumber || '');
//       setBirthDate(user.birthDate || '');
//       setCroppedImage(user.image || null);
//     }
//   }, [user]);

//   const handleLogout = () => {
//     dispatch(logOut());
//     navigate('/login');
//   };

//   const handleBeforeUpload = (file: File) => {
//     const reader = new FileReader();
//     reader.onload = () => {
//       setAvatarPreview(reader.result as string);
//       setShowCropper(true);
//     };
//     reader.readAsDataURL(file);
//     return false;
//   };

//   const handleCropped = (cropped: string) => {
//     setCroppedImage(cropped);
//     setShowCropper(false);
//   };

//   const handleCancelCrop = () => {
//     setShowCropper(false);
//   };

//   const handleSave = async () => {
//     if (!user) return;

//     try {
//       const formData = new FormData();
//       formData.append('id', user.id.toString());
//       formData.append('firstName', firstName);
//       formData.append('lastName', lastName);
//       formData.append('email', email);
//       formData.append('phoneNumber', phoneNumber);
//       formData.append('birthDate', birthDate);

//       if (croppedImage && croppedImage.startsWith('data:image')) {
//         const blob = await fetch(croppedImage).then(res => res.blob());
//         formData.append('avatar', blob, 'avatar.png');
//       }

//       await updateUser(form).unwrap();
//       message.success('Зміни збережено');
//     } catch (error) {
//       console.error(error);
//       message.error('Помилка при збереженні');
//     }
//   };

//   if (isLoading || !user) {
//     return (
//       <Content className="flex justify-center items-center min-h-[300px]">
//         <Spin size="large" />
//       </Content>
//     );
//   }

//   return (
//     <Content className="pt-5 px-10">
//       <Title level={3}>Профіль адміністратора</Title>

//       <div className="mb-6 flex gap-6 items-center">
//         <Avatar size={100} src={croppedImage || user.image} />
//         <Upload
//           showUploadList={false}
//           beforeUpload={handleBeforeUpload}
//           accept="image/*"
//         >
//           <Button icon={<UploadOutlined />}>Оновити аватар</Button>
//         </Upload>
//       </div>

//       <Row gutter={40} className="mt-8">
//         <Col span={12}>
//           <Text strong className="block mb-2">Ім’я</Text>
//           <Input size="large" value={firstName} onChange={e => setFirstName(e.target.value)} />
//           <Divider />

//           <Text strong className="block mb-2">Прізвище</Text>
//           <Input size="large" value={lastName} onChange={e => setLastName(e.target.value)} />
//           <Divider />

//           <Text strong className="block mb-2">E-mail</Text>
//           <Input size="large" value={email} onChange={e => setEmail(e.target.value)} />
//           <Divider />

//           <Text strong className="block mb-2">Дата народження</Text>
//           <Input size="large" value={birthDate} onChange={e => setBirthDate(e.target.value)} />
//           <Divider />

//           <Text strong className="block mb-2">Телефон</Text>
//           <Input size="large" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
//         </Col>

//         <Col span={12}>
//           <Text strong className="block mb-2">Старий пароль</Text>
//           <Input.Password size="large" placeholder="********" disabled />
//           <Divider />

//           <Text strong className="block mb-2">Новий пароль</Text>
//           <Input.Password size="large" placeholder="********" disabled />
//           <Divider />

//           <Text strong className="block mb-2">Підтвердження пароля</Text>
//           <Input.Password size="large" placeholder="********" disabled />
//           <Divider />

//           <Text strong className="block mb-2">Роль</Text>
//           <Input size="large" disabled value={'Адміністратор'} />
//           <Divider />

//           <Text strong className="block mb-2">Останній вхід</Text>
//           <Input
//             size="large"
//             disabled
//             value={dayjs(user.lastActivity).format('DD.MM.YYYY HH:mm')}
//           />
//         </Col>
//       </Row>

//       <Divider />

//       <Space className="flex justify-center gap-[500px]">
//         <Button danger icon={<LogoutOutlined />} onClick={handleLogout}>
//           Вийти
//         </Button>
//         <Button type="primary" icon={<SettingOutlined />} onClick={handleSave}>
//           Зберегти зміни
//         </Button>
//       </Space>

//       <Modal open={showCropper} footer={null} onCancel={handleCancelCrop} width={600}>
//         {avatarPreview && (
//           <ImageCropper
//             image={avatarPreview}
//             aspectRatio={1}
//             onCrop={handleCropped}
//             onCancel={handleCancelCrop}
//           />
//         )}
//       </Modal>
//     </Content>
//   );
// };

// export default AdminProfile;

import {
  Layout,
  Typography,
  Row,
  Col,
  Divider,
  Button,
  Space,
  Input,
  Spin,
  Upload,
  Avatar,
  Modal,
  message,
  Form,
} from 'antd';
import {
  SettingOutlined,
  LogoutOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getUser, logOut } from '../../store/slices/userSlice';
import { useAppSelector } from '../../store/store';
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from '../../services/userApi';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import ImageCropper from '../../components/images/ImageCropper';
import { APP_ENV } from '../../env';
import { DatePicker } from 'antd';
import PhoneInput from "../../components/PhoneInput.tsx";

const { Content } = Layout;
const { Title, Text } = Typography;

const AdminProfile: React.FC = () => {
  const [form] = Form.useForm();
  const client = useAppSelector(getUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: user, isLoading } = useGetUserByIdQuery(Number(client?.id));
  const [updateUser] = useUpdateUserMutation();

  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);

  //  useEffect(() => {
  //       if (category) {
  //           form.setFieldsValue({
  //               name: category.name,
  //               description: category.description,
  //               urlSlug: category.urlSlug,
  //               priority: category.priority,
  //               parentId: category.parentId
  //           });
  //           if (category.image) {
  //               setImageUrl(`${APP_ENV.IMAGES_100_URL}${category.image}`);
  //           }
  //       }
  //   }, [category, form]);


  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        birthDate: user.birthDate ? dayjs(user.birthDate) : null,
      });

      setCroppedImage(`${APP_ENV.IMAGES_100_URL}${user.image}`|| null);
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
      formData.append('id', user!.id.toString());
      formData.append('firstName', values.firstName);
      formData.append('lastName', values.lastName);
      formData.append('email', values.email);
      formData.append('phoneNumber', values.phoneNumber);
      formData.append('birthDate', values.birthDate);
      if (croppedImage && croppedImage.startsWith('data:image')) {
        const blob = await fetch(croppedImage).then((res) => res.blob());
        formData.append('Image', blob, 'avatar.png');
      }
      
      await updateUser(formData).unwrap();
      console.log('avatar file:', formData.get('avatar'));
      message.success('Зміни збережено');
    } catch (error) {
      console.error(error);
      message.error('Помилка при збереженні');
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
        <Avatar  size={100} src={croppedImage || user.image} />
        <Upload
          showUploadList={false}
          beforeUpload={handleBeforeUpload}
          accept="image/*"
          name="photoUrl"  // <-- Ось тут
        >
          <Button icon={<UploadOutlined />}>Оновити аватар</Button>
        </Upload>
      </div>

      <Form layout="vertical" form={form}>
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


            <Form.Item label="Дата народження" name="birthDate">
              <DatePicker size="large" format="YYYY-MM-DD" />
            </Form.Item>



            {/* <Form.Item label="Дата народження" name="birthDate">
              <Input size="large" />
            </Form.Item> */}



            <Form.Item
              label="Номер телефону"
              name="phoneNumber"
              rules={[
                { required: true, message: 'Введіть номер телефону' },
                {
                  validator: (_, value) => {
                    const regex = /^\+38\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/;
                    if (!value || regex.test(value)) return Promise.resolve();
                    return Promise.reject(new Error('Невірний формат телефону'));
                  },
                },
              ]}
            >
              <PhoneInput />
            </Form.Item>


            {/* <Form.Item label="Телефон" name="phoneNumber">
              <Input size="large" />
            </Form.Item> */}
          </Col>

          <Col span={12}>
            <Form.Item label="Старий пароль">
              <Input.Password size="large" placeholder="********" disabled />
            </Form.Item>

            <Form.Item label="Новий пароль">
              <Input.Password size="large" placeholder="********" disabled />
            </Form.Item>

            <Form.Item label="Підтвердження пароля">
              <Input.Password size="large" placeholder="********" disabled />
            </Form.Item>

            <Form.Item label="Роль">
              <Input size="large" disabled value="Адміністратор" />
            </Form.Item>

            <Form.Item label="Останній вхід">
              <Input
                size="large"
                disabled
                value={dayjs(user.lastActivity).format('DD.MM.YYYY HH:mm')}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Divider />

      <Space className="flex justify-center gap-[500px]">
        <Button danger icon={<LogoutOutlined />} onClick={handleLogout}>
          Вийти
        </Button>
        <Button type="primary" icon={<SettingOutlined />} onClick={handleSave} >
        
          Зберегти зміни
        </Button>
      </Space>

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
    </Content>
  );
};

export default AdminProfile;

