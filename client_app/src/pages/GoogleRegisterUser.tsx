// pages/GoogleRegisterUser.tsx
import { Form, Input, Upload, Button, Typography } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import { useGoogleUserInfo } from "../hooks/useGoogleUserInfo";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useConfirmGoogleRegisterMutation } from "../services/authApi";
import PhoneInput from "../components/PhoneInput";
import { handleFormErrors } from '../utilities/handleApiErrors';
import { ApiError } from '../types/errors';

const GoogleRegisterUser = () => {
    const [form] = Form.useForm();
    const [confirmGoogleRegister, { isLoading }] = useConfirmGoogleRegisterMutation();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
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

    const handleImageChange = (file: File) => {
        setSelectedImage(file);
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
        <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
            <h2>Підтвердження Google-реєстрації</h2>
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
            {userInfo?.picture && (
                    <Form.Item label="Фото профілю">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img
                                src={userInfo.picture}
                                alt="Google Profile"
                                style={{ width: 100, height: 100, borderRadius: '50%' }}
                            />
                            <Upload
                                showUploadList={false}
                                beforeUpload={(file) => {
                                    handleImageChange(file as File);
                                    return false;
                                }}
                            >
                                <Button
                                    icon={<UploadOutlined />}
                                    style={{ marginLeft: 10 }}
                                >
                                    Змінити фото 
                                </Button>
                            </Upload>
                            {selectedImage && (
                                <div style={{ marginLeft: 10 }}>
                                    <img
                                        src={URL.createObjectURL(selectedImage)}
                                        alt="Selected"
                                        style={{ width: 90, height: 90, borderRadius: '50%' }}
                                    />
                                </div>
                            )}
                        </div>
                    </Form.Item>
                )}

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
        </div>
    );
};

export default GoogleRegisterUser;
