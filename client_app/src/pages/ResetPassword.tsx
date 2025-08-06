import { Button, Form, Input } from "antd";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useResetPasswordMutation } from "../services/authApi";
import { handleFormErrors } from "../utilities/handleApiErrors";
import { ApiError } from "../types/errors";
import StarDecoration from "../components/decorations/StarDecoration";
import { EyeIcon, EyeOffIcon } from "../components/icons";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();
  const [resetPassword] = useResetPasswordMutation();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const idParam = searchParams.get("userId"); // Було 'id', стало 'userId'
  const id = idParam ? parseInt(idParam, 10) : null;

  const onFinish = async (values: {
    password: string;
    confirmPassword: string;
  }) => {
    setErrorMessage("");
    setSuccessMessage("");

    if (values.password !== values.confirmPassword) {
      setErrorMessage("Паролі не співпадають.");
      return;
    }

    if (!token || !id) {
      setErrorMessage("Недійсне посилання для скидання пароля.");
      return;
    }

    try {
      await resetPassword({
        id,
        token,
        password: values.password,
      }).unwrap();

      setSuccessMessage("Пароль успішно скинуто! Перенаправляємо на вхід...");
      form.resetFields();
      setTimeout(() => navigate("/login"), 2000);
    } catch (error: unknown) {
      handleFormErrors(error as ApiError, form);
    }
  };

  return (
    <div className="flex w-full min-h-screen items-center justify-center bg-beige2">
      {/* Фонове зображення */}
      <img
        src="/amir-seilsepour-unsplash-2.png"
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
          className="absolute  z-30 top-[-41.5px] left-[-34.5px] hidden xl:block"
        />

        {/* Зірка внизу справа */}
        <StarDecoration
          width={72}
          height={86}
          className="absolute z-30 bottom-[-42px] right-[542.5px] hidden lg:block "
        />

        <div className="form-container xs:max-w-[100%] md:max-w-[] w-[574px]  h-full px-6 py-8 md:px-8 z-20 xs:translate-x-[-7%] md:translate-x-[-20%] lg:translate-x-[40%] xl:translate-x-0">
          {/* Контент з відступами */}
          <h1 className="form-title">Скидання пароля</h1>

          <Form
            form={form}
            onFinish={onFinish}
            className="flex flex-col w-full gap-[12px] "
            layout="vertical"
          >
            <Form.Item
              name="password"
              label={<span className="form-label">Новий пароль</span>}
              rules={[
                { required: true, message: "Введіть новий пароль!" },
                { min: 6, message: "Пароль має бути не менше 6 символів" },
              ]}
            >
              <Input.Password
                className="form-input"
                placeholder="Новий пароль"
                iconRender={(visible) =>
                  visible ? <EyeIcon /> : <EyeOffIcon />
                }
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label={<span className="form-label">Підтвердження</span>}
              dependencies={["password"]}
              rules={[
                { required: true, message: "Підтвердіть пароль!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Паролі не співпадають."));
                  },
                }),
              ]}
            >
              <Input.Password
                className="form-input"
                placeholder="Підтвердіть пароль"
                iconRender={(visible) =>
                  visible ? <EyeIcon /> : <EyeOffIcon />
                }
              />
            </Form.Item>

            {errorMessage && (
              <div style={{ color: "red", marginBottom: 10 }}>
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div style={{ color: "green", marginBottom: 10 }}>
                {successMessage}
              </div>
            )}
            <Button
              className="remember-button"
              type="primary"
              htmlType="submit"
            >
              <span className="remember-button-text gap-[12px]">
                Скинути пароль
              </span>
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
