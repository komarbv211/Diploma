// export default RegistrUser;

import { Button, Form, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { IUserRegisterRequest } from '../types/account.ts';
import { useRegisterUserMutation } from '../services/authApi.ts';
import PhoneInput from "../components/PhoneInput.tsx";
import { handleFormErrors } from "../utilities/handleApiErrors.ts";
import { ApiError } from '../types/errors';
import AccountBox from '../components/icons/AccountBox.tsx';
import MailIcon from '../components/icons/MailIcon.tsx';
import EyeIcon from '../components/icons/EyeIcon.tsx';
import EyeOffIcon from '../components/icons/EyeOffIcon.tsx';
import StarDecoration from '../components/decorations/StarDecoration.tsx';

const RegistrUser: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [registerUser] = useRegisterUserMutation();

  const onFinish = async (values: IUserRegisterRequest) => {
    try {
      // values.phone тепер містить актуальний номер телефону
      const response = await registerUser(values).unwrap();
      console.log("Користувача успішно зареєстровано", response);
      navigate("..");
    } catch (error: unknown) {
      handleFormErrors(error as ApiError, form);
    }
  };

  return (
    <>

      {/* <div className="flex justify-center items-center bg-beige2"> */}
      <div className="flex w-screen h-screen overflow-hidden">

        <div className="relative w-3/6 flex justify-center items-center bg-beige2">
          {/* <StarDecoration
                        width={107}
                        height={127}
                        className="absolute top-[2%] left-[3%] z-10"
                    />

                    <StarDecoration
                        width={107}
                        height={127}
                        className="absolute -bottom-[0%] right-[4%] z-10"
                    /> */}

          <Form
            layout="vertical"
            className="flex flex-col w-full items-start gap-[12px] max-w-[604px] py-[20px] px-[40px] form-container"
            onFinish={onFinish}
            form={form}
            initialValues={{ phone: '+38 (050) ' }}
          >
            <h2 className="form-title">Зареєструватися</h2>
            <Form.Item name="firstName" label={<span className="form-label">Ім’я</span>}
              rules={[{ required: true, message: 'Будь ласка, введіть Ваше ім\’я!' }]}
            >
              <Input placeholder="Ім'я користувача" className="form-input" suffix={<AccountBox />} />
            </Form.Item>

            <Form.Item name="lastName" label={<span className="form-label">Прізвище</span>}>
              <Input placeholder="Прізвище" className="form-input" suffix={<AccountBox />} />
            </Form.Item>

            <Form.Item
              name="email"
              label={<span className="form-label">Email</span>}
              rules={[
                { required: true, type: 'email', message: 'Будь ласка, введіть дійсну електронну адресу!' },
              ]}
            >
              <Input placeholder="Ваш E-mail / login" className="form-input" suffix={<MailIcon />} />
            </Form.Item>

            <Form.Item
              name="phone"
              label={<span className="form-label">Номер телефону</span>}
              rules={[
                { required: true, message: 'Введіть номер телефону' },
                {
                  validator: (_, value) => {
                    const regex_phone = /^\+38\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/;
                    if (!value || regex_phone.test(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Неправильний формат номера телефону'));
                  },
                },
              ]}
              getValueFromEvent={e => e.target.value}
            >
              <PhoneInput

              //     onChange={(val: any)=> {
              //     console.log("form", form.getFieldValue('phone'));
              //     console.log("ss",val)
              // } }
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span className="form-label">Пароль</span>}
              rules={[{ required: true, message: 'Будь ласка, введіть пароль!' }]}
            >
              <Input.Password placeholder="Пароль" className="form-input"
                iconRender={(visible) => (visible ? <EyeIcon /> : <EyeOffIcon />)}
              />
            </Form.Item>

            <Form.Item
              name="password1"
              label={<span className="form-label">Перевірка пароля</span>}
              dependencies={['password']}
              rules={[
                { required: true, message: 'Будь ласка, підтвердіть пароль!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Паролі не збігаються!'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Підтвердіть пароль" className="form-input"
                iconRender={(visible) => (visible ? <EyeIcon /> : <EyeOffIcon />)}
              />
            </Form.Item>

            <p className="w-full max-w-[604px] mx-auto text-gray font-manrope text-base font-medium underline text-center">
              Натискаючи кнопку «Зареєструватися», ви погоджуєтеся з&nbsp;
              <a href="/terms">
                Умовами використання
              </a>
              &nbsp;та&nbsp;
              <a href="/privacy">
                Політикою конфіденційності
              </a>
            </p>


            <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
              {/* <Button type="primary" htmlType="submit">Зареєструватися</Button> */}
              <Button className="w-full max-w-[455px] h-[47px] bg-pink rounded-[15px] mt-4 shadow-none border-none">
                <span className="font-manrope font-semibold text-[20px] leading-normal text-beige2 text-center">
                  Зареєструватися
                </span>
              </Button>
            </Form.Item>

            <div className="flex flex-row justify-between items-center w-full max-w-[454px] h-[27px] gap-5 mt-4">
              <span className="font-manrope font-medium text-lg text-black text-center">Немає облікового запису?</span>
              <Link to="/login" className="font-manrope font-medium text-lg text-blue2 text-center cursor-pointer">
                Увійти
              </Link>
            </div>
          </Form>
        </div>
        <div className="relative w-3/6 h-screen overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/register-flowers-bg.png')] bg-cover bg-center z-0" />
          {/* Градієнт поверх */}
          <div className="absolute inset-0 bg-gradient-to-r from-beige2 to-transparent z-10" />
        </div>
      </div>

    </>
  );
};

export default RegistrUser;
