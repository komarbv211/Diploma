import React, { useState } from "react";
import { Button, Form, Input } from "antd";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleOutlined } from '@ant-design/icons';
import { IUserLoginRequest } from "../types/account";
import { APP_ENV } from "../env";
import GoogleLoginButton from "../components/buttons/GoogleLoginButton";
import GoogleAuth from "./GoogleAuth";


const { Item } = Form;

const LoginPage: React.FC = () => {
    const [form] = Form.useForm<IUserLoginRequest>();
    const [isGoogleAuthOpen, setIsGoogleAuthOpen] = useState(false);
    const [googleToken, setGoogleToken] = useState<string | null>(null);

    const onFinish = async (values: IUserLoginRequest) => {
        console.log("Login user через email/пароль", values);
        // Тут має бути код логіну через email/password
    };

    const onLoginGoogleResult = async (tokenGoogle: string) => {
        console.log("Login user через Google token:", tokenGoogle);
        setGoogleToken(tokenGoogle);
        setIsGoogleAuthOpen(true); 
    };
    

    const handleCloseGoogleAuth = () => {
        setIsGoogleAuthOpen(false);
        setGoogleToken(null);
    };

    return (
        <GoogleOAuthProvider clientId={APP_ENV.CLIENT_ID}>
            <h1 className="text-center text-4xl font-bold text-blue-500 mb-8">Вхід на сайт</h1>

            <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                <Form
                    form={form}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Item
                        name="username"
                        label="Електронна пошта"
                        rules={[
                            { required: true, message: "Вкажіть свою пошту" },
                            { type: "email", message: "Введіть коректний email" }
                        ]}
                    >
                        <Input placeholder="Електронна пошта" />
                    </Item>

                    <Item
                        name="password"
                        label="Пароль"
                        rules={[
                            { required: true, message: "Введіть пароль" },
                            { min: 6, message: "Пароль має містити щонайменше 6 символів" }
                        ]}
                    >
                        <Input.Password placeholder="Введіть пароль" />
                    </Item>

                    <Item>
                        <Button type="primary" htmlType="submit" block>
                            Вхід
                        </Button>
                    </Item>

                    <div className="text-center my-4">
                        або
                    </div>

                    <GoogleLoginButton
                        icon={<GoogleOutlined />}
                        title="Увійти через Google"
                        onLogin={onLoginGoogleResult}
                    />
                </Form>
            </div>

            {googleToken && (
                <GoogleAuth
                    open={isGoogleAuthOpen}
                    onClose={handleCloseGoogleAuth}
                    token={googleToken}
                />
            )}

        </GoogleOAuthProvider>
    );
};

export default LoginPage;
