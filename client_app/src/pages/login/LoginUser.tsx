/* LoginUser.tsx */
import React from "react";
import { Button, Form, Input, Modal, Spin } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { APP_ENV } from "../../env";
import {
  useConfirmGoogleLoginMutation,
  useLoginUserMutation,
  useLazyCheckGoogleRegisteredQuery,
} from "../../services/authApi";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLoginButton from "../../components/buttons/GoogleLoginButton";
import MailIcon from "../../components/icons/MailIcon";
import EyeIcon from "../../components/icons/EyeIcon";
import GoogleIcon from "../../components/icons/GoogleIcon";
import gradients from "./loginUserGradients.module.scss";
import StarDecoration from "../../components/decorations/StarDecoration";
const Login: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [loginUser] = useLoginUserMutation();
  const [confirmGoogleLogin] = useConfirmGoogleLoginMutation();
  const [triggerCheckGoogleRegistered] = useLazyCheckGoogleRegisteredQuery();

  const [errorMessage, setErrorMessage] = useState("");
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string }) => {
    setErrorMessage("");
    setIsLoading(true);
    try {
      const { data } = await triggerCheckGoogleRegistered(values.email);
      if (data?.isGoogleUser) {
        setShowGoogleModal(true);
        return;
      }
      await loginUser(values).unwrap();
      navigate("/");
    } catch {
      setErrorMessage("Невірний email або пароль");
    } finally {
      setIsLoading(false);
    }
  };

  const onLoginGoogleResult = async (googleToken: string) => {
    if (!googleToken) return;
    try {
      const result = await confirmGoogleLogin({
        googleAccessToken: googleToken,
      }).unwrap();
      navigate(
        result.isNewUser ? `/google-register?token=${googleToken}` : "/"
      );
    } catch (error) {
      const typed = error as { status?: number };
      setErrorMessage(
        typed?.status === 401
          ? "Токен Google недійсний або протермінований"
          : "Не вдалося увійти через Google"
      );
    }
  };

  return (
    <GoogleOAuthProvider clientId={APP_ENV.CLIENT_ID}>
      <div className="flex w-full min-h-screen items-center justify-center bg-beige2">
        {/* Декоративний градієнт */}
        <div
          className={gradients.loginPage__gradient + " absolute inset-0 z-0"}
        />
        {/* Фонове зображення */}
        <img
          src="/flowers-bg.png"
          className="absolute right-0 top-0 w-[60%] h-full object-cover z-0 hidden lg:block"
          alt="background"
        />
        {/* Форма логіну */}
        <div className="relative flex w-full max-w-sm mx-auto  rounded-lg  lg:max-w-6xl ">
          {/* Зірка вгорі зліва */}
          <StarDecoration
            width={107}
            height={127}
            className="absolute  z-20 top-[-30.5px] left-[-20px] hidden xl:block"
          />

          {/* Зірка внизу справа */}
          <StarDecoration
            width={107}
            height={127}
            className="absolute z-20 bottom-[-31px] right-[556.5px] hidden lg:block "
          />

          <div className="relative  px-6 py-8 md:px-8  xs:max-w-[450px] md:max-w-[574px] z-10 xs:translate-x-[-7%] md:translate-x-[-20%] lg:translate-x-[40%] xl:translate-x-0 ">
            <div className="p-[2.5px] rounded-[15px] h-[712px] bg-gradient-to-br from-blue2 to-blueLight">
              <div className="bg-white rounded-[14px] xs:max-w-[450px] md:max-w-[574px] xl:w-full h-full px-6 py-8 md:px-8">
                <h1 className="w-[454px] h-[44px] font-manrope font-semibold text-[32px] leading-[44px] text-black text-center">
                  Ласкаво просимо!
                </h1>

                <Spin spinning={isLoading} tip="Завантаження...">
                  <Form
                    form={form}
                    onFinish={onFinish}
                    layout="vertical"
                    className="space-y-4"
                  >
                    {/* Email */}
                    <div className="flex flex-col items-start gap-[20px]">
                      <Form.Item
                        name="email"
                        label={
                          <span className="font-manrope font-medium text-[20px] leading-[27px] text-black">
                            Email
                          </span>
                        }
                        rules={[
                          {
                            required: true,
                            message: "Будь ласка, введіть email!",
                          },
                          { type: "email", message: "Недійсний email" },
                        ]}
                        className="flex flex-col gap-2 w-full"
                      >
                        <Input
                          className="w-full h-[52px] px-[15px] py-0 font-manrope font-medium text-[16px] leading-[22px] text-gray-600 border border-gray rounded-[15px] bg-white focus:border-blue-500 focus:shadow-none"
                          placeholder="Електронна пошта або ім'я користувача"
                          suffix={<MailIcon className="w-5 h-5 text-gray" />}
                        />
                      </Form.Item>

                      {/* Пароль */}
                      <Form.Item
                        name="password"
                        label={
                          <span className="font-manrope font-medium text-[20px] leading-[27px] text-black">
                            Пароль
                          </span>
                        }
                        rules={[{ required: true, message: "Введіть пароль!" }]}
                        className="flex flex-col gap-2 w-full mb-0"
                      >
                        <Input.Password
                          className="w-full h-[52px] px-[15px] py-0 font-manrope font-medium text-[16px] leading-[22px] text-gray-600 border border-gray rounded-[15px] bg-white focus:border-blue-500 focus:shadow-none justify-between"
                          placeholder="Ваш пароль"
                          iconRender={(visible) => (
                            <EyeIcon
                              style={{ color: visible ? "#666" : "#ccc" }}
                            />
                          )}
                        />
                      </Form.Item>

                      {errorMessage && (
                        <div className="text-danger text-sm font-medium mt-1 font-manrope">
                          {errorMessage}
                        </div>
                      )}

                      <div
                        className="
                          flex flex-row justify-between items-center
                          w-full max-w-[454px] h-[22px] gap-[111px] mt-2
                        "
                      >
                        <label className="flex flex-row items-center gap-2">
                          <input
                            type="checkbox"
                            className="w-5 h-5 accent-black border-2 border-black rounded"
                          />
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
                    </div>
                    <div className="pt-[15px]">
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="
                          flex flex-row justify-center items-center
                          p-[15px] gap-[10px] w-full max-w-[454px] h-[63px]
                          bg-pink rounded-[15px]  shadow-none border-none
                        "
                      >
                        <span className="font-manrope font-semibold text-[24px] leading-[33px] text-beige2 text-center">
                          Вхід
                        </span>
                      </Button>
                    </div>
                  </Form>
                </Spin>
                {/* Google login */}
                <div className="flex items-center justify-between m-8 ml-20 mr-20">
                  <span className="w-1/3 border-b dark:border-gray md:w-1/3"></span>
                  <span className="text-[16px] text-gray ">або</span>
                  <span className="w-1/3 border-b dark:border-gray md:w-1/3"></span>
                </div>

                <div className="flex flex-row justify-center items-center p-4 gap-2 w-full max-w-[454px] h-[57px] bg-pink2 rounded-xl mt-6">
                  <GoogleLoginButton
                    icon={<GoogleIcon />}
                    title="Увійдіть за допомогою Google"
                    onLogin={onLoginGoogleResult}
                  />
                </div>
                <div className="flex flex-row justify-between items-center w-full max-w-[454px] h-[27px] gap-5 mt-6">
                  <span className="font-manrope font-medium text-lg text-black text-center">
                    Немає облікового запису?
                  </span>
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
                    <Button
                      key="cancel"
                      onClick={() => setShowGoogleModal(false)}
                    >
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
                  <p>
                    Цей email вже зареєстрований через Google. Будь ласка,
                    увійдіть через Google.
                  </p>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
