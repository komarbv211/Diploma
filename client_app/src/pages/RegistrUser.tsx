// export default RegistrUser;

import { Button, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { IUserRegisterRequest } from '../types/account.ts';
import { useRegisterUserMutation } from '../services/authApi.ts';
import PhoneInput from "../components/PhoneInput.tsx";
import { handleFormErrors } from "../utilities/handleApiErrors.ts";
import { ApiError } from '../types/errors';

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
            <Button onClick={() => navigate(-1)} type="default">Назад</Button>
            <h2>Реєстрація нового користувача</h2>

            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                style={{ maxWidth: 600 }}
                onFinish={onFinish}
                form={form}
                initialValues={{ phone: '+38 (050) ' }}
            >
                <Form.Item
                    name="firstName"
                    label="Ваше Ім'я"
                    rules={[{ required: true, message: 'Будь ласка, введіть Ваше ім\'я!' }]}
                >
                    <Input placeholder="Ваше Ім'я" />
                </Form.Item>

                <Form.Item name="lastName" label="Ваше Прізвище">
                    <Input placeholder="Прізвище" />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Ваш Email"
                    rules={[
                        { required: true, type: 'email', message: 'Будь ласка, введіть дійсну електронну адресу!' },
                    ]}
                >
                    <Input placeholder="Ваш E-mail / login" />
                </Form.Item>

                <Form.Item
                    name="phone"
                    label="Номер телефону"
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
                    label="Пароль"
                    rules={[{ required: true, message: 'Будь ласка, введіть пароль!' }]}
                >
                    <Input.Password placeholder="Пароль" />
                </Form.Item>

                <Form.Item
                    name="password1"
                    label="Перевірка пароля"
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
                    <Input.Password placeholder="Підтвердіть пароль" />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
                    <Button type="default" htmlType="reset" style={{ marginRight: 10 }}>Скасувати</Button>
                    <Button type="primary" htmlType="submit">Реєстрація</Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default RegistrUser;