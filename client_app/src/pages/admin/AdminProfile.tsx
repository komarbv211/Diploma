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
import { handleFormErrors } from '../../utilities/handleApiErrors';
import { ApiError } from '../../types/errors';

const { Content } = Layout;
const { Title } = Typography;

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
    navigate('/');
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
     // formData.append('birthDate', values.birthDate);
      if (values.birthDate) {
        formData.append('birthDate', values.birthDate.format('YYYY-MM-DD'));
      }

      if (croppedImage && croppedImage.startsWith('data:image')) {
        const blob = await fetch(croppedImage).then((res) => res.blob());
        formData.append('Image', blob, 'avatar.png');
      }
      
      await updateUser(formData).unwrap();
      console.log('avatar file:', formData.get('avatar'));
      message.success('Зміни збережено');
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

            <Form.Item
                label="Номер телефону"
                name="phoneNumber"
                rules={[
                  { required: true, message: 'Введіть номер телефону' },
                  {
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.reject(new Error('Введіть номер телефону'));
                      }
                      // Видаляємо всі _ (якщо є)
                      const cleanedValue = value.replace(/_/g, '');
                      if (cleanedValue.includes('_')) {
                        return Promise.reject(new Error('Номер телефону не повністю введений'));
                      }
                      const regex = /^\+38\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/;
                      if (regex.test(cleanedValue)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Невірний формат телефону'));
                    },
                  },
                ]}
            >
              <PhoneInput
                  value={form.getFieldValue('phoneNumber')}
                  onChange={(e) => {
                    form.setFieldsValue({ phoneNumber: e.target.value });
                    console.log('target', e.target.value);
                  }}
              />
            </Form.Item>
            
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

