import React from 'react';
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
import GoogleIcon from '../components/icons/GoogleIcon';
import StarDecoration from '../components/decorations/StarDecoration';
import styles from '../styles/authForm.module.css';
import MailIcon from '../components/icons/MailIcon';
import EyeIcon from '../components/icons/EyeIcon';

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
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage('Невірний email або пароль');
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
            <div className="relative w-screen h-screen bg-beige2 overflow-hidden">
                {/* Фонове зображення */}
                <img
                    src="/flowers-bg.png"
                    className={styles.flowerBg}
                    alt="background"
                />
                {/* Градієнт */}
                <div
                    className="absolute left-[762px] top-0 w-[1158px] h-full z-20"
                    style={{
                        background:
                            'linear-gradient(270deg, rgba(217,217,217,0) 2.09%, #FFF7F3 100%)',
                    }}
                />
                {/* Форма логіну */}
                <div
                    className={styles.authFormContainer}
                >
                    <h2 className={styles.authFormTitle}>
                        Ласкаво просимо!
                    </h2>
                    <Spin spinning={isLoading} tip="Завантаження...">
                        <Form
                            form={form}
                            onFinish={onFinish}
                            layout="vertical"
                            className={styles.authFormInner}
                        >
                            {/* Email */}
                            <Form.Item
                                name="email"
                                label={<span className="text-[20px] font-medium font-manrope text-black">Email</span>}
                                rules={[
                                    { required: true, message: 'Будь ласка, введіть email!' },
                                    { type: 'email', message: 'Недійсний email' },
                                ]}
                                className="mb-0"
                            >
                                <Input
                                    className="border border-gray rounded-xl px-[15px] py-[15px] text-[16px] font-medium font-manrope text-gray bg-transparent h-[52px]"
                                    placeholder="Електронна пошта або ім'я користувача"
                                    suffix={<MailIcon />}
                                />
                            </Form.Item>
                            {/* Пароль */}
                            <Form.Item
                                name="password"
                                label={<span className="text-[20px] font-medium font-manrope text-black">Пароль</span>}
                                rules={[{ required: true, message: 'Введіть пароль!' }]}
                                className="mb-0"
                            >
                                <Input.Password
                                    className="border border-gray rounded-xl px-[15px] py-[15px] text-[16px] font-medium font-manrope text-gray bg-transparent h-[52px]"
                                    placeholder="Ваш пароль"
                                    iconRender={visible => <EyeIcon style={{ color: visible ? '#666' : '#ccc' }} />}
                                />
                            </Form.Item>
                            {errorMessage && (
                                <div className={styles.authFormError}>{errorMessage}</div>
                            )}
                            <div className="flex flex-row justify-between items-center w-full">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" className="w-5 h-5 rounded border-black" />
                                    <span className="text-[16px] font-medium font-manrope text-black">Запам’ятати мене</span>
                                </label>
                                <Link
                                    to="/forgot-password"
                                    className="text-[16px] font-normal font-manrope text-black underline"
                                >
                                    Забули пароль?
                                </Link>
                            </div>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="w-full h-[63px] bg-pink rounded-xl flex items-center justify-center text-[24px] font-semibold font-manrope text-beige2 border-none shadow-none hover:bg-pink2"
                            >
                                Вхід
                            </Button>
                        </Form>
                    </Spin>
                    {/* Або Google */}
                    <div className="flex flex-row items-center justify-between w-[128px] h-[22px] gap-1 my-2">
                        <div className="w-[43px] border-t border-gray" />
                        <span className="text-[16px] font-medium font-manrope text-gray text-center">або</span>
                        <div className="w-[43px] border-t border-gray" />
                    </div>
                    <GoogleLoginButton
                        icon={<GoogleIcon />}
                        title="Увійдіть за допомогою Google"
                        onLogin={onLoginGoogleResult}
                    />
                    <div className={styles.authFormFooter}>
                        <span className="text-[20px] font-medium font-manrope text-black text-center">Немає облікового запису?</span>
                        <Link
                            to="/registr"
                            className="text-[20px] font-medium font-manrope text-blue2 text-center"
                        >
                            Зареєструватися
                        </Link>
                    </div>
                    <Modal
                        open={showGoogleModal}
                        onCancel={() => setShowGoogleModal(false)}
                        footer={[
                            <Button key="cancel" onClick={() => setShowGoogleModal(false)}>
                                Скасувати
                            </Button>,
                            <GoogleLoginButton
                                key="google"
                                icon={<GoogleIcon />}
                                title="Увійти через Google"
                                onLogin={onLoginGoogleResult}
                            />,
                        ]}
                    >
                        <p>Цей email вже зареєстрований через Google. Будь ласка, увійдіть через Google.</p>
                    </Modal>
                </div>
                {/* Декоративні зірки у кутах */}
                <StarDecoration width={107} height={127} style={{ position: 'absolute', top: 120, left: 136, zIndex: 40 }} />
                <StarDecoration width={107} height={127} style={{ position: 'absolute', top: 829, left: 708, zIndex: 40 }} />
               
            </div>
        </GoogleOAuthProvider>
    );
};

export default Login;