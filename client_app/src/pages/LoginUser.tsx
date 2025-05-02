import { Button, Form, Input, Spin  } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { APP_ENV } from '../env';
import { useConfirmGoogleLoginMutation, useLoginUserMutation } from '../services/authApi';
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLoginButton from '../components/buttons/GoogleLoginButton';
import { GoogleOutlined } from '@ant-design/icons';
import { useGetUserByEmailQuery } from '../services/userApi';
import { useGoogleUserInfo } from '../hooks/useGoogleUserInfo';
import GoogleAuthForm from './GoogleAuthForm';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loginUser] = useLoginUserMutation();  
    const [errorMessage, setErrorMessage] = useState<string>('');  
    const [isGoogleAuthOpen, setIsGoogleAuthOpen] = useState(false);
    const [googleToken, setGoogleToken] = useState<string | null>(null);  
    const { userInfo } = useGoogleUserInfo(googleToken);    
    const email = userInfo?.email;
    const { data, isLoading, refetch } = useGetUserByEmailQuery(email!, { skip: !email });
    const [confirmGoogleLogin] = useConfirmGoogleLoginMutation();     

    
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

    const onLoginGoogleResult = async (tokenGoogle: string) => {
        
        if(isLoading) return;
        
        if (data !== undefined) {
            console.log("Підтвердження Email:", data);
    
            const formData = new FormData();
            formData.append("GoogleAccessToken", tokenGoogle);
            await confirmGoogleLogin(formData);
            await refetch();
            navigate('/');           
        } else {
            // Користувача немає — відкриваємо форму
            setGoogleToken(tokenGoogle);
            setIsGoogleAuthOpen(true);            
        }
    };
    

    const handleCloseGoogleAuth = () => {
        setIsGoogleAuthOpen(false);
        setGoogleToken(null);
        refetch();
        navigate('/');
    };

    return (
        <GoogleOAuthProvider clientId={APP_ENV.CLIENT_ID}>
            <Spin spinning={isLoading}>
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

                <GoogleLoginButton
                    icon={<GoogleOutlined />}
                    title="Увійти через Google"
                    onLogin={onLoginGoogleResult}
                />
            </div>
            {googleToken && (
                <GoogleAuthForm
                    open={isGoogleAuthOpen}
                    onClose={handleCloseGoogleAuth}
                    token={googleToken}
                />
            )}

            </Spin>
        </GoogleOAuthProvider>
    );
};

export default Login;
