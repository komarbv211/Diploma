import { Button, message, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { APP_ENV } from '../env';
import { useLoginUserMutation, useGoogleLoginUserMutation } from '../services/authApi';
import { GoogleResponse } from '../interfaces/account';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loginUser] = useLoginUserMutation();
    const [googleLoginUser] = useGoogleLoginUserMutation();
    const [errorMessage, setErrorMessage] = useState<string>('');

    const onFinish = async (values: { email: string; password: string }) => {
        console.log('Надіслані дані для логіну:', values);
        try {
            const response = await loginUser(values).unwrap();
            console.log('Користувач успішно увійшов. Дані від сервера:', response);
            navigate('/');
        } catch (error: unknown) {
            const typedError = error as { data?: { message?: string }; status?: number };
            console.error('Помилка при вході:', {
                message: typedError?.data?.message,
                status: typedError?.status,
                details: typedError,
            });
            setErrorMessage('Невірний email або пароль');
        }
    };

    const handleGoogleCallback = async (response: GoogleResponse) => {
        const googleAccessToken = response.credential;
        console.log('Google токен:', googleAccessToken);
        try {
            const result = await googleLoginUser({ token: googleAccessToken }).unwrap();
            console.log('Google login успішний. Дані від сервера:', result);
            navigate('/');
        } catch (error: unknown) {
            const typedError = error as { data?: { message?: string }; status?: number };
            console.error('Google login error:', {
                message: typedError?.data?.message,
                status: typedError?.status,
                details: typedError,
            });
            message.error('Помилка при вході через Google');
        }
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
                    window.google.accounts.id.renderButton(buttonContainer, {
                        theme: 'outline',
                        size: 'large',
                        width: '300',
                    });
                }
            }
        };

        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.onload = loadGoogleScript;
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    return (
        <div style={{ maxWidth: 400, margin: '0 auto', padding: '20px' }}>
            <Button onClick={() => navigate(-1)} type="default">
                Назад
            </Button>
            <h2>Вхід</h2>

            <Form
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                layout="horizontal"
                style={{ maxWidth: 600 }}
                onFinish={onFinish}
                form={form}
            >
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Будь ласка, введіть email!' },
                        { type: 'email', message: 'Будь ласка, введіть дійсний email!' },
                    ]}
                >
                    <Input placeholder="Ваш email" />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Пароль"
                    rules={[{ required: true, message: 'Будь ласка, введіть пароль!' }]}
                >
                    <Input.Password placeholder="Ваш пароль" />
                </Form.Item>

                {errorMessage && (
                    <div style={{ color: 'red', marginBottom: 10 }}>{errorMessage}</div>
                )}

                <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                    <Button type="default" htmlType="reset">
                        Скасувати
                    </Button>
                    <Button type="primary" htmlType="submit">
                        Увійти
                    </Button>
                </Form.Item>
            </Form>

            <div id="google-signin-button" style={{ marginTop: 20 }}></div>
        </div>
    );
};

export default Login;