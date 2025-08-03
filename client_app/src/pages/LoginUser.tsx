/* LoginUser.tsx */
import React from "react";
import { Button, Form, Input, Modal, Spin } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { APP_ENV } from "../env";
import {
  useConfirmGoogleLoginMutation,
  useLoginUserMutation,
  useLazyCheckGoogleRegisteredQuery,
} from "../services/authApi";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLoginButton from "../components/buttons/GoogleLoginButton";
import StarDecoration from "../components/decorations/StarDecoration";
import { MailIcon, EyeIcon, EyeOffIcon, GoogleIcon } from "../components/icons";
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
        {/* Фонове зображення */}
        <img
          src="/flowers-bg.png"
          className="absolute right-0 top-0 w-[55%] h-full object-cover z-0 hidden lg:block"
          alt="background"
        />
        {/* Декоративний градієнт */}
        <div className="absolute inset-0 left-[45%] bg-gradient-to-r from-beige2  z-0" />

        {/* Форма логіну */}
        <div className="relative flex w-full max-w-sm mx-auto  rounded-lg  lg:max-w-6xl ">
          {/* Зірка вгорі зліва */}
          <StarDecoration
            width={72}
            height={86}
            className="absolute  z-20 top-[-42.5px] left-[-34.5px] hidden xl:block"
          />

          {/* Зірка внизу справа */}
          <StarDecoration
            width={72}
            height={86}
            className="absolute z-20 bottom-[-42px] right-[542.5px] hidden lg:block "
          />

          <div className="relative  px-6 py-8 md:px-8  xs:max-w-[100%] md:max-w-[574px] z-10 xs:translate-x-[-7%] md:translate-x-[-20%] lg:translate-x-[40%] xl:translate-x-0 ">
            <div className="form-container xs:max-w-[100%] md:max-w-[574px] xl:w-full h-full px-6 py-8 md:px-8">
              <h1 className="form-title">Ласкаво просимо!</h1>

            <Spin spinning={isLoading} tip="Завантаження...">
              <Form
                layout="vertical"
                className="flex flex-col w-full gap-[12px] "
                onFinish={onFinish}
                form={form}
              >
                {/* Email */}
                <div className="flex flex-col items-start gap-[12px]">
                  <Form.Item
                    name="email"
                    label={<span className="form-label">Email</span>}
                    rules={[
                      {
                        required: true,
                        type: "email",
                        message:
                          "Будь ласка, введіть дійсну електронну адресу!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Ваш E-mail / login"
                      className="form-input"
                      suffix={<MailIcon />}
                    />
                  </Form.Item>

                  {/* Пароль */}
                  <Form.Item
                    name="password"
                    label={<span className="form-label">Пароль</span>}
                    rules={[
                      {
                        required: true,
                        message: "Будь ласка, введіть пароль!",
                      },
                    ]}
                  >
                    <Input.Password
                      placeholder="Пароль"
                      className="form-input"
                      iconRender={(visible) =>
                        visible ? <EyeIcon /> : <EyeOffIcon />
                      }
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
                          w-full max-w-[454px] h-[18px] gap-[12px] mt-2
                        "
                  >
                    <label className="form-label">
                      <input type="checkbox" className="form-label" />
                      <span className="form-label  ml-1">Запам’ятати мене</span>
                    </label>
                    <Link to="/forgot-password" className="form-label">
                      Забули пароль?
                    </Link>
                  </div>
                </div>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="remember-button"
                >
                  <span className="remember-button-text gap-[12px]">Вхід</span>
                </Button>
              </Form>
            </Spin>
            {/* Google login */}
            <div className="flex items-center justify-between m-4 ml-[8rem] mr-[8rem]">
              <span className="w-1/3 border-b dark:border-gray md:w-1/3"></span>
              <span className="text-[16px] text-gray ">або</span>
              <span className="w-1/3 border-b dark:border-gray md:w-1/3"></span>
            </div>

            <div className="flex justify-center items-center ">
              <GoogleLoginButton
                icon={<GoogleIcon />}
                title="Увійдіть за допомогою Google"
                onLogin={onLoginGoogleResult}
              />
            </div>
            <div className="flex flex-row justify-between items-center w-full max-w-[100%] h-[27px] gap-5 mt-6">
              <span className="font-manrope font-medium text-[18px] text-black text-center">
                Немає облікового запису?
              </span>
              <Link
                to="/registr"
                className="font-manrope font-medium text-[18px] text-blue2 text-center cursor-pointer hover:text-hover_blue"
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
              <p>
                Цей email вже зареєстрований через Google. Будь ласка, увійдіть
                через Google.
              </p>
            </Modal>
          </div>
        </div>
      </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
