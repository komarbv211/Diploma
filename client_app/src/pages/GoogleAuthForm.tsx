import { Modal, Form, Input, Upload, Button } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import { useConfirmGoogleLoginMutation } from "../services/authApi";
import { IGoogleAuthProps } from "../types/account";
import { useGoogleUserInfo } from "../hooks/useGoogleUserInfo";
import { useState, useEffect } from "react";
import { Typography } from 'antd';

const GoogleAuthForm: React.FC<IGoogleAuthProps> = ({ open, onClose, token }) => {
    const [form] = Form.useForm();
    const [confirmGoogleLogin] = useConfirmGoogleLoginMutation();
    const { userInfo } = useGoogleUserInfo(token);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const { Text } = Typography;

    useEffect(() => {
        if (userInfo) {
            form.setFieldsValue({
                Image: userInfo.picture,
                firstName: userInfo?.given_name || '',
                lastName: userInfo?.family_name || '',
                email: userInfo.email,
                phoneNumber: '',
            });
        }
    }, [userInfo, form]);

    const handleImageChange = (file: File) => {
        setSelectedImage(file);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const formData = new FormData();
            formData.append("GoogleAccessToken", token);
            formData.append("FirstName", values.firstName);
            formData.append("LastName", values.lastName);
            formData.append("PhoneNumber", values.phoneNumber);
            if (selectedImage) {
                formData.append("Image", selectedImage);
            }
    
            await confirmGoogleLogin(formData);
            onClose();
        } catch (error) {
            console.error("Error during form submission:", error);
        }
    };
    

    return (
        <Modal open={open} onCancel={onClose} onOk={handleSubmit} title="Підтвердіть реєстрацію">
            <Form form={form} layout="vertical">
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
                                    handleImageChange(file as File); // Cast to File
                                    return false; // Prevent automatic upload
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
                <Text strong>Email: user@example.com</Text>

                <Form.Item name="firstName" label="Ім'я" rules={[{ required: true, message: 'Будь ласка, введіть Ваше ім\'я!' }]}>
                    <Input placeholder="Ваше Ім'я" />
                </Form.Item>

                <Form.Item name="lastName" label="Прізвище">
                    <Input placeholder="Прізвище" />
                </Form.Item>
                
                <Form.Item name="phone" label="Номер телефону" rules={[{ required: true, pattern: /^\+?\d{10,15}$/, message: 'Будь ласка, введіть дійсний номер телефону!' }]}>
                    <Input placeholder="Ваш номер телефону" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default GoogleAuthForm;
