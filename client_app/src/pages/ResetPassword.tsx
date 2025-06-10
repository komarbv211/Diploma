import { Button, Form, Input } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useResetPasswordMutation } from '../services/authApi';
import axios from 'axios';

const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const { token } = useParams<{ token: string }>();
    const [form] = Form.useForm();
    const [resetPassword] = useResetPasswordMutation();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(true);

    // Отримуємо email за токеном
    useEffect(() => {
        const fetchEmail = async () => {
            if (!token) {
                setErrorMessage('Токен не надано.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('/api/auth/validate-reset-token', {
                    params: { token },
                });
                form.setFieldsValue({ email: response.data.email });
            } catch (error) {
                console.error('Error fetching email:', error);
                setErrorMessage('Недійсний або прострочений токен.');
            } finally {
                setLoading(false);
            }
        };

        fetchEmail();
    }, [form, token]);

    const onFinish = async (values: { email: string; password: string }) => {
        setErrorMessage('');
        setSuccessMessage('');

        try {
            await resetPassword({
                email: values.email,
                token: token!, // Передаємо токен із URL
                password: values.password,
            }).unwrap();
            setSuccessMessage('Пароль успішно скинуто! Ви можете увійти з новим паролем.');
            form.resetFields();
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            console.error('Reset password error:', error);
            setErrorMessage('Не вдалося скинути пароль. Перевірте дані або спробуйте ще раз.');
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '0 auto', padding: 20 }}>
            <Button onClick={() => navigate(-1)}>Назад</Button>
            <h2>Скидання пароля</h2>

            {loading ? (
                <div>Завантаження...</div>
            ) : (
                <Form
                    form={form}
                    onFinish={onFinish}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    layout="horizontal"
                >
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Будь ласка, введіть email!' },
                            { type: 'email', message: 'Недійсний email' },
                        ]}
                    >
                        <Input placeholder="Ваш email"/>
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Новий пароль"
                        rules={[
                            { required: true, message: 'Введіть новий пароль!' },
                            { min: 6, message: 'Пароль має містити щонайменше 6 символів' },
                        ]}
                    >
                        <Input.Password placeholder="Новий пароль" />
                    </Form.Item>

                    {errorMessage && <div style={{ color: 'red', marginBottom: 10 }}>{errorMessage}</div>}
                    {successMessage && <div style={{ color: 'green', marginBottom: 10 }}>{successMessage}</div>}

                    <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Скинути пароль
                        </Button>
                    </Form.Item>
                </Form>
            )}
        </div>
    );
};

export default ResetPassword;