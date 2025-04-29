import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { IUserRegisterRequest } from '../types/account.ts';
import { useRegisterUserMutation } from '../services/authApi.ts';

const RegistrUser: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [registerUser] = useRegisterUserMutation();

    const onFinish = async (values: IUserRegisterRequest) => {
        try {
            console.log("Register user", values);
            const response = await registerUser(values).unwrap();
            console.log("Користувача успішно зареєстровано", response);
            navigate("..");
        } catch (error) {
            console.error("Помилка при реєстрації", error);
            message.error('Не вдалося зареєструватися. Спробуйте пізніше.');
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
            >
                <Form.Item name="firstName" label="Ваше Ім'я" rules={[{ required: true, message: 'Будь ласка, введіть Ваше ім\'я!' }]}>
                    <Input placeholder="Ваше Ім'я" />
                </Form.Item>

                <Form.Item name="lastName" label="Ваше Прізвище">
                    <Input placeholder="Прізвище" />
                </Form.Item>

                <Form.Item name="email" label="Ваш Email" rules={[{ required: true, type: 'email', message: 'Будь ласка, введіть дійсну електронну адресу!' }]}>
                    <Input placeholder="Ваш E-mail / login" />
                </Form.Item>

                <Form.Item name="phone" label="Номер телефону" rules={[{ required: true, pattern: /^\+?\d{10,15}$/, message: 'Будь ласка, введіть дійсний номер телефону!' }]}>
                    <Input placeholder="Ваш номер телефону" />
                </Form.Item>

                <Form.Item name="password" label="Пароль" rules={[{ required: true, message: 'Будь ласка, введіть пароль!' }]}>
                    <Input.Password placeholder="Пароль" />
                </Form.Item>

                <Form.Item
                    name="password1"
                    label="Перевірка пароля"
                    dependencies={['password1']}
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
