/* LoginUser.tsx */
import React from 'react';
import { Button, Form, Input, Modal, Spin } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { APP_ENV } from '../../env';
import {
    useConfirmGoogleLoginMutation,
    useLoginUserMutation,
    useLazyCheckGoogleRegisteredQuery,
} from '../../services/authApi';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleLoginButton from '../../components/buttons/GoogleLoginButton';
import MailIcon from '../../components/icons/MailIcon';
import EyeIcon from '../../components/icons/EyeIcon';
import GoogleIcon from '../../components/icons/GoogleIcon';
import StarDecoration from '../../components/decorations/StarDecoration';
import gradients from './loginUserGradients.module.scss';

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
            if (data?.isGoogleUser) {
                setShowGoogleModal(true);
                return;
            }
            await loginUser(values).unwrap();
            navigate('/');
        } catch {
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
            <div className="absolute min-h-screen w-screen bg-beige2 overflow-x-hidden overflow-y-auto flex flex-col items-center justify-center">
                {/* Декоративний градієнт */}
                <div className={gradients.loginPage__gradient} />
                {/* Фонове зображення */}
                <img
                    src="/flowers-bg.png"
                    className="absolute top-[-112px] left-[762px] w-[calc(100vw-762px)] h-[1304px] object-cover z-10 hidden xl:block"
                    alt="background"
                />
                {/* Форма логіну */}
                <div
                  className="
                    absolute
                    box-border flex flex-col items-center  
                    bg-white border-2 border-solid border-gray-300
                    rounded-[15px] pt-[40px] pr-[60px] pb-[40px] pl-[60px]
                    gap-[37px] z-30 font-manrope lg:absolute
                    lg:left-[0px] lg:top-[126px] lg:w-[574px] lg:h-[710px]
                    md:static md:ml-[188px] md:mt-[58px] md:w-[574px] md:h-[710px]
                    sm:static sm:mx-auto sm:w-[90vw] sm:p-6 sm:gap-6
                    xs:static xs:mx-auto xs:w-[95vw] xs:p-4 xs:gap-4
                  "
                  
                    style={{ 
                        overflow: 'hidden',
                        borderWidth: '2px',
                        borderStyle: 'solid',
                        borderImage: 'linear-gradient(149.91deg, #1A3D83, #8AA8D2 100%) 1'
                    }}
                >
                  <h2
                    className="w-full max-w-[454px] h-[44px]
                      font-manrope font-semibold text-[32px] leading-[44px] text-center text-black
                      mb-0"
                  >
                    Ласкаво просимо!
                  </h2>

                  <Spin spinning={isLoading} tip="Завантаження...">
                    <Form
                      form={form}
                      onFinish={onFinish}
                      layout="vertical"
                      className="flex flex-col items-start gap-5 w-full max-w-[454px]"
                    >
                      {/* Email */}
                      <Form.Item
                        name="email"
                        label={
                          <span className="font-manrope font-medium text-[20px] leading-[27px] text-black">
                            Email
                          </span>
                        }
                        rules={[
                          { required: true, message: 'Будь ласка, введіть email!' },
                          { type: 'email', message: 'Недійсний email' },
                        ]}
                        className="flex flex-col gap-2 w-full"
                      >
                        <Input
                          className="w-full h-[52px] px-[15px] py-0 font-manrope font-medium text-[16px] leading-[22px] text-gray-600 border border-gray rounded-[15px] bg-white focus:border-blue-500 focus:shadow-none"
                          placeholder="Електронна пошта або ім'я користувача"
                          suffix={<MailIcon className="w-5 h-5 text-gray-600" />}
                        />
                      </Form.Item>

                      {/* Пароль */}
                      <Form.Item
                        name="password"
                        label={<span className="font-manrope font-medium text-[20px] leading-[27px] text-black">Пароль</span>}
                        rules={[{ required: true, message: 'Введіть пароль!' }]}
                        className="flex flex-col gap-2 w-full mb-0"
                      >
                        <Input.Password
                          className="w-full h-[52px] px-[15px] py-0 font-manrope font-medium text-[16px] leading-[22px] text-gray-600 border border-gray rounded-[15px] bg-white focus:border-blue-500 focus:shadow-none justify-between"
                          placeholder="Ваш пароль"
                          iconRender={visible => <EyeIcon style={{ color: visible ? '#666' : '#ccc' }} />}
                        />
                      </Form.Item>

                      {errorMessage && (
                        <div className="text-red-600 text-sm font-medium mt-1">{errorMessage}</div>
                      )}

                      <div
                        className="
                          flex flex-row justify-between items-center
                          w-full max-w-[454px] h-[22px] gap-[111px] mt-2
                        "
                      >
                        <label className="flex flex-row items-center gap-2">
                          <input type="checkbox" className="w-5 h-5 accent-black border-2 border-black rounded" />
                          <span className="font-manrope font-medium text-[16px] leading-[22px] text-black text-center">
                            Запам’ятати мене
                          </span>
                        </label>
                        <Link
                          to="/forgot-password"
                          className="font-manrope font-normal text-[16px] leading-[22px] text-black underline text-right cursor-pointer"
                        >
                          Забули пароль?
                        </Link>
                      </div>

                      <Button
                        type="primary"
                        htmlType="submit"
                        className="
                          flex flex-row justify-center items-center
                          p-[15px] gap-[10px] w-full max-w-[454px] h-[63px]
                          bg-pink rounded-[15px] mt-4 shadow-none border-none
                        "
                      >
                        <span className="font-manrope font-semibold text-[24px] leading-[33px] text-beige2 text-center">
                          Вхід
                        </span>
                      </Button>
                    </Form>
                  </Spin>
                  {/* Або Google */}
                  <div className="flex flex-row justify-between items-center w-full max-w-[128px] h-[22px] gap-1 my-4">
                    <div className="w-[43px] border-t border-gray-600" />
                    <span className="font-manrope font-medium text-base text-gray-600 text-center">або</span>
                    <div className="w-[43px] border-t border-gray-600" />
                  </div>
                  <div className="flex flex-row justify-center items-center p-4 gap-2 w-full max-w-[454px] h-[57px] bg-pink2 rounded-xl mt-4">
                    <GoogleLoginButton
                      icon={<GoogleIcon />}
                      title="Увійдіть за допомогою Google"
                      onLogin={onLoginGoogleResult}
                    />
                  </div>
                  <div className="flex flex-row justify-between items-center w-full max-w-[454px] h-[27px] gap-5 mt-4">
                    <span className="font-manrope font-medium text-lg text-black text-center">Немає облікового запису?</span>
                    <Link
                      to="/registr"
                      className="font-manrope font-medium text-lg text-blue2 text-center cursor-pointer"
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
            <StarDecoration width={107} height={127} style={{ position: 'absolute', top: 120, left: 135, zIndex: 40 }} className="hidden md:block" />
            <StarDecoration width={107} height={127} style={{ position: 'absolute', top: 829, left: 708, zIndex: 40 }} className="hidden md:block" />
        </div>
    </GoogleOAuthProvider>
    );
};

export default Login;