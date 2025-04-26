import { Button, message, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { jwtParse } from '../utilities/jwtParse';
import { GoogleJwtPayload, GoogleResponse, IUserRegisterRequest } from '../interfaces/account';
import { APP_ENV } from '../env';
import { useRegisterUserMutation } from '../services/authApi';

const CreateUser: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [registerUser] = useRegisterUserMutation();

    const handleGoogleCallback = (response: GoogleResponse) => {
        console.log('Google callback отримано');
        const decoded = jwtParse(response.credential) as GoogleJwtPayload;
        if (!decoded) {
            message.error('Помилка при декодуванні Google токену');
            return;
        }
        const googleRequest = {
            email: decoded.email,
            firstName: decoded.given_name,
            lastName: decoded.family_name,
            imageUrl: decoded.picture,
            phone: '', 
        };        
        form.setFieldsValue(googleRequest);
        console.log(googleRequest);
    };

    useEffect(() => {
        const loadGoogleScript = () => {
            if (window.google) {
                window.google.accounts.id.initialize({
                    client_id: APP_ENV.CLIENT_ID,
                    callback: handleGoogleCallback,
                });

                const buttonContainer = document.getElementById('google-signin-button');
                if (buttonContainer) {
                    window.google.accounts.id.renderButton(
                        buttonContainer,
                        {
                            theme: 'outline',
                            size: 'large',
                            width: "300",
                        }
                    );
                }
            }
        };

        const script = document.createElement('script');
        script.src = "https://accounts.google.com/gsi/client";
        script.onload = loadGoogleScript;
        document.head.appendChild(script);
    }, []); 

    const onFinish = async (values: IUserRegisterRequest) => {
        try {
            console.log("Register user", values);
            const response = await registerUser(values).unwrap();
            console.log("Користувача успішно зареєстровано", response);
            navigate("..");
        } catch (error) {
            console.error("Помилка при реєстрації", error);
        }
    };

    return (
        <>
            <Button onClick={() => navigate(-1)} type="default">Назад</Button>
            <h2>Контактна інформація</h2>

            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                style={{ maxWidth: 600 }}
                onFinish={onFinish}
                form={form}
            >
                <Form.Item name="firstName" label="Ваше Ім'я" rules={[{ required: true, message: 'Будь ласка, введіть Ваше ім\'я!' }]}>
                    <Input placeholder="Ваше Ім'я" />
                </Form.Item>

                <Form.Item name="lastName" label="Ваше Прізвище">
                    <Input placeholder="Прізвище" />
                </Form.Item>

                <Form.Item name="email" label="Ваш Email" rules={[{ required: true, type: 'email', message: 'Будь ласка, введіть дійсну електронну адресу!' }]}>
                    <Input placeholder="Ваш E-mail / login" />
                </Form.Item>

                <Form.Item name="phone" label="Номер телефону" rules={[{ required: true, pattern: /^\+?\d{10,15}$/, message: 'Будь ласка, введіть дійсний номер телефону!' }]}>
                    <Input placeholder="Ваш номер телефону" />
                </Form.Item>

                <Form.Item name="password" label="Пароль" rules={[{ required: true, message: 'Будь ласка, введіть пароль!' }]}>
                    <Input.Password placeholder="Пароль" />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
                    <Button type="default" htmlType="reset">Скасувати</Button>
                    <Button type="primary" htmlType="submit">Створити</Button>
                </Form.Item>
            </Form>

            <div id="google-signin-button" style={{ marginTop: 20 }}></div>
        </>
    );
};

export default CreateUser;
