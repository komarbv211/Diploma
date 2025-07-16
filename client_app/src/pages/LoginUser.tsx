import { Button, Form, Input, Modal, Spin } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { APP_ENV } from '../env';
import {
    useConfirmGoogleLoginMutation,
    useLoginUserMutation,
    useLazyCheckGoogleRegisteredQuery,
} from '../services/authApi';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleLoginButton from '../components/buttons/GoogleLoginButton';
import { GoogleOutlined } from '@ant-design/icons';
import { handleFormErrors } from '../utilities/handleApiErrors';
import { ApiError } from '../types/errors';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [loginUser] = useLoginUserMutation();
    const [confirmGoogleLogin] = useConfirmGoogleLoginMutation();
    const [triggerCheckGoogleRegistered] = useLazyCheckGoogleRegisteredQuery();

    const [errorMessage, setErrorMessage] = useState('');
    const [showGoogleModal, setShowGoogleModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onFinish = async (values: { email: string; password: string }) => {
        setErrorMessage('');

        setIsLoading(true);
        try {
            const { data } = await triggerCheckGoogleRegistered(values.email);
            console.log('Google registration check response:', data);

            if (data?.isGoogleUser) {
                setShowGoogleModal(true);
                return;
            }

            await loginUser(values).unwrap();
            navigate('/');
        } catch (error: unknown) {
            handleFormErrors(error as ApiError, form);
        } finally {
            setIsLoading(false);
        }
    };

    const onLoginGoogleResult = async (googleToken: string) => {
        if (!googleToken) return;

        try {
            const result = await confirmGoogleLogin({ googleAccessToken: googleToken }).unwrap();
            navigate(result.isNewUser ? `/google-register?token=${googleToken}` : '/');
        } catch (error) {
            const typed = error as { status?: number };
            setErrorMessage(
                typed?.status === 401
                    ? 'Токен Google недійсний або протермінований'
                    : 'Не вдалося увійти через Google'
            );
        }
    };

    return (
        <GoogleOAuthProvider clientId={APP_ENV.CLIENT_ID}>
            <div style={{ maxWidth: 400, margin: '0 auto', padding: 20 }}>
                <Button onClick={() => navigate(-1)}>Назад</Button>
                <h2>Вхід</h2>

                <Spin spinning={isLoading} tip="Завантаження...">
                    <Form
                        form={form}
                        onFinish={onFinish}
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        layout="horizontal"
                    >
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Будь ласка, введіть email!' },
                                { type: 'email', message: 'Недійсний email' },
                            ]}
                        >
                            <Input placeholder="Ваш email" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Пароль"
                            rules={[{ required: true, message: 'Введіть пароль!' }]}
                        >
                            <Input.Password placeholder="Ваш пароль" />
                        </Form.Item>

                        {errorMessage && <div style={{ color: 'red', marginBottom: 10 }}>{errorMessage}</div>}

                        <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                            <Button htmlType="reset">Скасувати</Button>
                            <Button type="primary" htmlType="submit">
                                Увійти
                            </Button>
                        </Form.Item>
                    </Form>
                </Spin>

                <div style={{ textAlign: 'center', margin: '10px 0' }}>
                    <Link to="/forgot-password">Забули пароль?</Link>
                </div>

                <GoogleLoginButton
                    icon={<GoogleOutlined />}
                    title="Увійти через Google"
                    onLogin={onLoginGoogleResult}
                />

                <Modal
                    open={showGoogleModal}
                    onCancel={() => setShowGoogleModal(false)}
                    footer={[
                        <Button key="cancel" onClick={() => setShowGoogleModal(false)}>
                            Скасувати
                        </Button>,
                        <GoogleLoginButton
                            key="google"
                            icon={<GoogleOutlined />}
                            title="Увійти через Google"
                            onLogin={onLoginGoogleResult}
                        />,
                    ]}
                >
                    <p>Цей email вже зареєстрований через Google. Будь ласка, увійдіть через Google.</p>
                </Modal>
            </div>
        </GoogleOAuthProvider>
    );
};

export default Login;