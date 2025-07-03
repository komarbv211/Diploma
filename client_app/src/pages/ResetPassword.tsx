import { Button, Form, Input } from 'antd';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { useResetPasswordMutation } from '../services/authApi';

const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const { token } = useParams<{ token: string }>();
    const [searchParams] = useSearchParams();
    const [form] = Form.useForm();
    const [resetPassword] = useResetPasswordMutation();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const idParam = searchParams.get('userId'); // Було 'id', стало 'userId'
    const id = idParam ? parseInt(idParam, 10) : null;


    const onFinish = async (values: { password: string; confirmPassword: string }) => {
        setErrorMessage('');
        setSuccessMessage('');

        if (values.password !== values.confirmPassword) {
            setErrorMessage('Паролі не співпадають.');
            return;
        }

        if (!token || !id) {
            setErrorMessage('Недійсне посилання для скидання пароля.');
            return;
        }

        try {
            await resetPassword({
                id,
                token,
                password: values.password,
            }).unwrap();

            setSuccessMessage('Пароль успішно скинуто! Перенаправляємо на вхід...');
            form.resetFields();
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            console.error('Помилка скидання пароля:', error);
            setErrorMessage('Не вдалося скинути пароль. Спробуйте ще раз.');
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '0 auto', padding: 20 }}>
            <Button onClick={() => navigate(-1)}>Назад</Button>
            <h2>Скидання пароля</h2>

            <Form
                form={form}
                onFinish={onFinish}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                layout="horizontal"
            >
                <Form.Item
                    name="password"
                    label="Новий пароль"
                    rules={[
                        { required: true, message: 'Введіть новий пароль!' },
                        { min: 6, message: 'Пароль має бути не менше 6 символів' },
                    ]}
                >
                    <Input.Password placeholder="Новий пароль" />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    label="Підтвердження"
                    dependencies={['password']}
                    rules={[
                        { required: true, message: 'Підтвердіть пароль!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Паролі не співпадають.'));
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder="Підтвердіть пароль" />
                </Form.Item>

                {errorMessage && <div style={{ color: 'red', marginBottom: 10 }}>{errorMessage}</div>}
                {successMessage && <div style={{ color: 'green', marginBottom: 10 }}>{successMessage}</div>}

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Скинути пароль
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ResetPassword;
