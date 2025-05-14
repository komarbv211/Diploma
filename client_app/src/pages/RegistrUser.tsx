import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { IUserRegisterRequest } from '../types/account.ts';
import { useRegisterUserMutation } from '../services/authApi.ts';
import React, {useState} from 'react';
import InputMask from 'react-input-mask';

const RegistrUser: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [registerUser] = useRegisterUserMutation();
    const [phone, setPhone] = useState('');

    const allowedOperators = [
        '050', '066', '095', '099', // Vodafone
        '067', '068', '096', '097', '098', // Kyivstar
        '063', '073', '093' // Lifecell
    ];

    //const isValidPhone = /^\+380\d{9}$/.test(phone.replace(/\D/g, '') ? '+380' + phone.replace(/\D/g, '').slice(3) : '');

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

                {/*<Form.Item name="phone" label="Номер телефону" rules={[{ required: true, pattern: /^\+?\d{10,15}$/, message: 'Будь ласка, введіть дійсний номер телефону!' }]}>*/}
                {/*    <Input placeholder="Ваш номер телефону" />*/}
                {/*</Form.Item>*/}

                {/*<Form.Item*/}

                {/*    name="phone"*/}
                {/*    label="Номер телефону"*/}
                {/*    rules={[*/}
                {/*        { required: true, message: 'Будь ласка, введіть номер телефону!' },*/}
                {/*        {*/}
                {/*            pattern: /^\+380\d{9}$/,*/}
                {/*            message: 'Номер телефону має бути у форматі +38(0XX) XXX XX XX',*/}
                {/*        },*/}
                {/*    ]}*/}
                {/*>*/}
                {/*    <InputMask*/}
                {/*        mask="+38 (099) 999 99 99"*/}
                {/*        // mask="+380999999999"*/}
                {/*        maskChar={null}>*/}
                {/*        {(inputProps) => (*/}
                {/*            <Input {...(inputProps as React.ComponentProps<typeof Input>)} placeholder="+38 (0XX) XXX XX XX" />*/}
                {/*        )}*/}
                {/*    </InputMask>*/}
                {/*</Form.Item>*/}

                {/*<div>*/}
                {/*    <label htmlFor="phone">Номер телефону:</label>*/}
                {/*    <InputMask*/}
                {/*        mask="+38 (099) 999 99 99"*/}
                {/*        value={phone}*/}
                {/*        onChange={(e) => setPhone(e.target.value)}*/}
                {/*    >*/}
                {/*        {(inputProps) => <input {...inputProps} type="text" id="phone" />}*/}
                {/*    </InputMask>*/}

                {/*    /!*<p>Введено: {phone}</p>*!/*/}


                {/*</div>*/}

                {/*<Form.Item name="phone" label="Номер телефону">*/}

                {/*<div className="mb-4">*/}
                {/*    /!*<label*!/*/}
                {/*    /!*    htmlFor="phone"*!/*/}
                {/*    /!*    className="block text-sm font-medium text-gray-700 mb-1"*!/*/}
                {/*    /!*>*!/*/}
                {/*    /!*    Номер телефону:*!/*/}
                {/*    /!*</label>*!/*/}


                {/*    <InputMask*/}
                {/*        mask="+38 (099) 999 99 99"*/}
                {/*        maskChar={null}*/}
                {/*        value={phone}*/}
                {/*        onChange={(e) => setPhone(e.target.value)}*/}
                {/*    >*/}
                {/*        {(inputProps) => (*/}
                {/*            <input*/}
                {/*                {...inputProps}*/}
                {/*                type="text"*/}
                {/*                id="phone"*/}
                {/*                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"*/}
                {/*                placeholder="+38 (0XX) XXX XX XX"*/}
                {/*            />*/}
                {/*        )}*/}
                {/*    </InputMask>*/}
                {/*</div>*/}
                {/*</Form.Item>*/}


                <Form.Item
                    name="phone"
                    label="Номер телефону"
                    rules={[
                        {
                            required: true,
                            message: 'Будь ласка, введіть номер телефону!',
                        },
                        {
                            validator: (_, value) => {
                                const digits = value?.replace(/\D/g, '');
                                const phoneNumber = digits.startsWith('380') ? digits : null;
                                const operatorCode = phoneNumber?.slice(3, 6);

                                if (!phoneNumber || phoneNumber.length !== 12) {
                                    return Promise.reject('Номер має містити 12 цифр (включно з кодом країни +380).');
                                }

                                if (!allowedOperators.includes(operatorCode!)) {
                                    return Promise.reject(`Код оператора "${operatorCode}" не підтримується.`);
                                }

                                return Promise.resolve();
                            },
                        },
                    ]}
                >
                    <InputMask
                        mask="+38 (099) 999 99 99"
                        maskChar={null}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    >
                        {(inputProps) => (
                            <input
                                {...inputProps}
                                type="text"
                                id="phone"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="+38 (XXX) XXX XX XX"
                            />
                        )}
                    </InputMask>
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