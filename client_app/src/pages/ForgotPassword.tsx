import { Button, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useForgotPasswordMutation } from '../services/authApi';

const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [forgotPassword] = useForgotPasswordMutation();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const onFinish = async (values: { email: string }) => {
        setErrorMessage('');
        setSuccessMessage('');

        try {
            await forgotPassword({ email: values.email }).unwrap();
            setSuccessMessage('Посилання для скидання пароля відправлено на ваш email!');
            form.resetFields();
        } catch (error) {
            console.error('Forgot password error:', error);
            setErrorMessage('Не вдалося відправити посилання. Перевірте email або спробуйте пізніше.');
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '0 auto', padding: 20 }}>
            <Button onClick={() => navigate(-1)}>Назад</Button>
            <h2>Скидання пароля</h2>

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
                    <Input placeholder="Ваш email" />
                </Form.Item>

                {errorMessage && <div style={{ color: 'red', marginBottom: 10 }}>{errorMessage}</div>}
                {successMessage && <div style={{ color: 'green', marginBottom: 10 }}>{successMessage}</div>}

                <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                    <Button htmlType="reset">Скасувати</Button>
                    <Button type="primary" htmlType="submit">
                        Відправити
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ForgotPassword;