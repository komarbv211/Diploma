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
      <div className="flex flex-col lg:flex-row min-h-screen">
        <div className="flex w-full lg:w-[50vw] justify-center items-center bg-beige2 p-4">

          <div className="form-container relative">
            <StarDecoration width={72} height={83} className="absolute z-20 -top-10 -left-9 hidden md:block" />
            <StarDecoration width={72} height={83} className="absolute z-20 -bottom-10 -right-9 hidden md:block" />

            <div className="bg-white rounded-[13px] py-[20px] px-[40px]">
              <Form
                layout="vertical"
                className=""
                onFinish={onFinish}
                form={form}
                initialValues={{ phone: '+38 (050) ' }}
              >
                <h2 className="form-title">Зареєструватися</h2>
                <Form.Item name="firstName" label={<span className="form-label">Ім’я</span>}
                  rules={[{ required: true, message: 'Будь ласка, введіть Ваше ім\’я!' }]}>
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
                  <PhoneInput // TODO: provide more suitable width
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

                <p className="w-full text-[14px] text-gray font-manrope text-base font-medium underline text-center pt-[4px] pb-[12px]">
                  Натискаючи кнопку «Зареєструватися», ви погоджуєтеся з <br />
                  <a href="/terms">
                    Умовами використання
                  </a>
                  &nbsp;та&nbsp;
                  <a href="/privacy">
                    Політикою конфіденційності
                  </a>
                </p>

                <Form.Item>
                  <Button className='btn-pink'>
                    <span>
                      Зареєструватися
                    </span>
                  </Button>
                </Form.Item>

                <div className="font-manrope text-[18px] flex justify-between pt-[8px]">
                  <span>Вже маєте обліковий запис?</span>
                  <Link to="/login" className='text-blue2'>
                    Увійти
                  </Link>
                </div>
              </Form>
            </div>
          </div>
        </div>

        <div className="hidden lg:block fixed top-0 right-0 w-[50vw] h-full bg-cover bg-center bg-[url('/images/register-flowers-bg.png')]">
          <div className="absolute inset-0 bg-gradient-to-r from-beige2 to-transparent z-10" />
        </div>

      </div>
    </>
  );
};

export default RegistrUser;
