import { Button, Form, Input } from "antd";
import { useState } from "react";
import { useForgotPasswordMutation } from "../services/authApi";
import { handleFormErrors } from "../utilities/handleApiErrors";
import { ApiError } from "../types/errors";
import StarDecoration from "../components/decorations/StarDecoration";
import { MailIcon } from "../components/icons";
import { Link } from "react-router-dom";
const ForgotPassword: React.FC = () => {
  const [form] = Form.useForm();
  const [forgotPassword] = useForgotPasswordMutation();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const onFinish = async (values: { email: string }) => {
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await forgotPassword({ email: values.email }).unwrap();
      setSuccessMessage(
        "Посилання для скидання пароля відправлено на ваш email!"
      );
      form.resetFields();
    } catch (error: unknown) {
      handleFormErrors(error as ApiError, form);
    }
  };

  return (
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

        <div className="form-container xs:max-w-[100%] md:max-w-[] w-[574px]  h-full px-6 py-8 md:px-8 z-20 xs:translate-x-[-7%] md:translate-x-[-20%] lg:translate-x-[40%] xl:translate-x-0">
          <h1 className="form-title">Забули пароль?</h1>

          <div className="text-base font-normal text-dark mb-6 space-y-1 text-center">
            <p>Введіть свою електронну адресу, і ми</p>
            <p>надішлемо вам посилання для</p>
            <p>скидання пароля</p>
          </div>

          <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
            className="space-y-5"
          >
            <Form.Item
              name="email"
              label={
                <span className="form-label text-dark text-sm font-medium">
                  Email
                </span>
              }
              rules={[
                { required: true, message: "Будь ласка, введіть email!" },
                { type: "email", message: "Недійсний email" },
              ]}
            >
              <Input
                placeholder="Електрона пошта"
                className="form-input h-12 rounded-lg px-4 text-sm"
                suffix={<MailIcon />}
              />
            </Form.Item>

            {errorMessage && (
              <div className="text-red-600 text-sm font-medium mt-1 font-manrope">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="bg-green-50 border border-green-300 text-green-800 text-sm font-medium px-4 py-2 rounded-md mt-2">
                {successMessage}
              </div>
            )}
            <Button
              type="primary"
              htmlType="submit"
              className="remember-button"
            >
              <span className="remember-button-text gap-[12px]">
                Відправити
              </span>
            </Button>

            <div className="flex flex-row justify-between items-center w-full max-w-[100%] h-[27px] gap-5 mt-6">
              <span className="font-manrope font-medium text-[18px] text-black text-center">
                Згадали свій пароль?
              </span>
              <Link
                to="/login"
                className="font-manrope font-medium text-[18px] ml-1 text-blue2 text-center cursor-pointer hover:text-pink2"
              >
                Повернутися до входу
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
