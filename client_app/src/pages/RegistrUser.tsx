// import { Button, Form, Input, message } from 'antd';
// import { useNavigate } from 'react-router-dom';
// import { IUserRegisterRequest } from '../types/account.ts';
// import { useRegisterUserMutation } from '../services/authApi.ts';
// // import React, {useState} from 'react';
// // import InputMask from 'react-input-mask';
// import PhoneInput from "../components/PhoneInput.tsx";
// import {useState} from "react";
// import {handleFormErrors} from "../utilities/handleApiErrors.ts";
//
// const RegistrUser: React.FC = () => {
//     const navigate = useNavigate();
//     const [form] = Form.useForm();
//     const [registerUser] = useRegisterUserMutation();
//     const [phone, setPhone] = useState('+38 (050) ');
//     // const [phone, setPhone] = useState('');
//
//     // const allowedOperators = [
//     //     '050', '066', '095', '099', // Vodafone
//     //     '067', '068', '096', '097', '098', // Kyivstar
//     //     '063', '073', '093' // Lifecell
//     // ];
//
//
//     //const isValidPhone = /^\+380\d{9}$/.test(phone.replace(/\D/g, '') ? '+380' + phone.replace(/\D/g, '').slice(3) : '');
//
//     // const checkEmailExists = async (email: string): Promise<boolean> => {
//     //     const response = await fetch(`/api/check-email?email=${encodeURIComponent(email)}`);
//     //     const data = await response.json();
//     //     return data.exists; // true або false
//     // };
//
//
//     // const onFinish = async (values: IUserRegisterRequest) => {
//     if = Перевіряємо чи правильне значення в фоне
//     PhoneError - буде змінна яка зберігає помилку по телефону
//     return ;
//     //     try {
//     //         console.log("Register user", values);
//     //         console.log("test"+phone);
//     //         const response = await registerUser(values).unwrap();
//     //         console.log("Користувача успішно зареєстровано", response);
//     //         navigate("..");
//     //     } catch (error : any) {
//     //         console.error("Помилка при реєстрації", error.data.message);
//     //         message.error(error.data.message);
//     //     }
//     // };
//
//
//     const onFinish = async (values: IUserRegisterRequest) => {
//         try {
//             const response = await registerUser(values).unwrap();
//             console.log("Користувача успішно зареєстровано", response);
//             navigate("..");
//         } catch (error: any) {
//             handleFormErrors(error, form);
//         }
//     };
//
//     return (
//         <>
//             <Button onClick={() => navigate(-1)} type="default">Назад</Button>
//             <h2>Реєстрація нового користувача</h2>
//
//             <Form
//                 labelCol={{ span: 4 }}
//                 wrapperCol={{ span: 14 }}
//                 layout="horizontal"
//                 style={{ maxWidth: 600 }}
//                 onFinish={onFinish}
//                 form={form}
//             >
//                 <Form.Item name="firstName" label="Ваше Ім'я" rules={[{ required: true, message: 'Будь ласка, введіть Ваше ім\'я!' }]}>
//                     <Input placeholder="Ваше Ім'я" />
//                 </Form.Item>
//
//                 <Form.Item name="lastName" label="Ваше Прізвище">
//                     <Input placeholder="Прізвище" />
//                 </Form.Item>
//
//                 <Form.Item
//                     // name="email" label="Ваш Email" rules={[{ required: true, type: 'email', message: 'Будь ласка, введіть дійсну електронну адресу!' }]}>
//                     name="email"
//                     label="Ваш Email"
//                     rules={[
//                         {
//                             required: true,
//                             type: 'email',
//                             message: 'Будь ласка, введіть дійсну електронну адресу!',
//                         },
//                         // {
//                         //     validator: async (_, value) => {
//                         //         if (!value) return Promise.resolve(); // якщо порожнє — не перевіряємо тут
//                         //         const exists = await checkEmailExists(value); // виклик API
//                         //         if (exists) {
//                         //             return Promise.reject(new Error('Ця електронна адреса вже використовується!'));
//                         //         }
//                         //         return Promise.resolve();
//                         //     },
//                         // },
//                     ]}
//                 >
//                     <Input placeholder="Ваш E-mail / login" />
//                 </Form.Item>
//
//                 <Form.Item
//                     name="phone"
//                     label="Номер телефону"
//                     rules={[
//
//
//                         // { required: true, message: 'Введіть номер телефону' },
//                         {
//                             validator: (_, value) => {
//                                 const regex_phone = /^\+38\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/;
//                                 if (!value || regex_phone.test(value)) {
//                                     return Promise.resolve();
//                                 }
//                                 return Promise.reject('Неправильний формат номера телефону');
//                             },
//                         },
//                     ]}
//                 >
//                     {/*<PhoneInput />*/}
//                     <h2>Введіть номер телефону</h2>
//                     <PhoneInput
//                         value={phone}
//                         onChange={(e) => setPhone(e.target.value)}
//                         onOperatorChange={(operator) => console.log('Вибрано оператора:', operator)}
//                     />
//                 </Form.Item>
//
//
//
//
//                 {/*<Form.Item*/}
//                 {/*    name="phone"*/}
//                 {/*    label="Номер телефону"*/}
//                 {/*    rules={[*/}
//                 {/*        { required: true, message: 'Введіть номер телефону' },*/}
//                 {/*        {*/}
//                 {/*            validator: (_, value) => {*/}
//                 {/*                const regex_phone = /^\+38\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/;*/}
//                 {/*                if (!value || regex_phone.test(value)) {*/}
//                 {/*                    return Promise.resolve();*/}
//                 {/*                }*/}
//                 {/*                return Promise.reject('Неправильний формат номера телефону');*/}
//                 {/*            },*/}
//                 {/*        },*/}
//                 {/*    ]}*/}
//                 {/*>*/}
//                 {/*    <PhoneInput*/}
//                 {/*        value={phone}*/}
//                 {/*        onChange={(e) => setPhone(e.target.value)}*/}
//                 {/*        onOperatorChange={(operator) => console.log('Вибрано оператора:', operator)}*/}
//                 {/*    />*/}
//                 {/*</Form.Item>*/}
//                 <Form.Item name="password" label="Пароль" rules={[{ required: true, message: 'Будь ласка, введіть пароль!' }]}>
//                     <Input.Password placeholder="Пароль" />
//                 </Form.Item>
//
//                 <Form.Item
//                     name="password1"
//                     label="Перевірка пароля"
//                     dependencies={['password1']}
//                     rules={[
//                         { required: true, message: 'Будь ласка, підтвердіть пароль!' },
//                         ({ getFieldValue }) => ({
//                             validator(_, value) {
//                                 if (!value || getFieldValue('password') === value) {
//                                     return Promise.resolve();
//                                 }
//                                 return Promise.reject(new Error('Паролі не збігаються!'));
//                             },
//                         }),
//                     ]}
//                 >
//                     <Input.Password placeholder="Підтвердіть пароль" />
//                 </Form.Item>
//
//                 <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
//                     <Button type="default" htmlType="reset" style={{ marginRight: 10 }}>Скасувати</Button>
//                     <Button type="primary" htmlType="submit">Реєстрація</Button>
//                 </Form.Item>
//             </Form>
//         </>
//     );
// };
//
// export default RegistrUser;


// import { Button, Form, Input } from 'antd';
// import { useNavigate } from 'react-router-dom';
// import { IUserRegisterRequest } from '../types/account.ts';
// import { useRegisterUserMutation } from '../services/authApi.ts';
// import PhoneInput from "../components/PhoneInput.tsx";
// // import { useState } from "react";
// import { handleFormErrors } from "../utilities/handleApiErrors.ts";
//
// const RegistrUser: React.FC = () => {
//     const navigate = useNavigate();
//     const [form] = Form.useForm();
//     const [registerUser] = useRegisterUserMutation();
//
//     const onFinish = async (values: IUserRegisterRequest) => {
//         try {
//             // Переконаємось, що телефон в values правильний (він звідси вже)
//             const response = await registerUser(values).unwrap();
//             // console.log("чи приходить занчення"+values);
//             console.log("Користувача успішно зареєстровано", response);
//             navigate("..");
//         } catch (error: any) {
//             form.setFields([
//                             {
//                                 name: 'firstName',
//                                 errors: [],
//                             },
//                 {
//                     name: 'lastName',
//                     errors: [],
//                 },
//                 // {
//                 //     name: 'phone',
//                 //     errors: [],  // повідомлення під email
//                 // },
//                         ]);
//             handleFormErrors(error, form);
//         }
//     };
//
//     // const onFinish = async (values: IUserRegisterRequest) => {
//     //     try {
//     //         const response = await registerUser(values).unwrap();
//     //         console.log("Користувача успішно зареєстровано", response);
//     //         navigate("..");
//     //     } catch (error: any) {
//     //         // Тест: виводимо помилку під полем firstName
//     //         form.setFields([
//     //             {
//     //                 name: 'firstName',
//     //                 errors: ['First name must start with uppercase letter.'],
//     //             },
//     //         ]);
//     //
//     //         // Або викликаємо обробник помилок, якщо хочеш з бекендом
//     //         // handleFormErrors(error, form);
//     //     }
//     // };
//
//
//     return (
//         <>
//             <Button onClick={() => navigate(-1)} type="default">Назад</Button>
//             <h2>Реєстрація нового користувача</h2>
//
//             <Form
//                 labelCol={{ span: 4 }}
//                 wrapperCol={{ span: 14 }}
//                 layout="horizontal"
//                 style={{ maxWidth: 600 }}
//                 onFinish={onFinish}
//                 form={form}
//                 initialValues={{ phone: '+38 (050) ' }}
//             >
//                 <Form.Item
//                     name="firstName"
//                     label="Ваше Ім'я"
//                     rules={[{ required: true, message: 'Будь ласка, введіть Ваше ім\'я!' }]}
//                 >
//                     <Input placeholder="Ваше Ім'я" />
//                 </Form.Item>
//
//                 <Form.Item name="lastName" label="Ваше Прізвище">
//                     <Input placeholder="Прізвище" />
//                 </Form.Item>
//
//                 <Form.Item
//                     name="email"
//                     label="Ваш Email"
//                     rules={[
//                         {
//                             required: true,
//                             type: 'email',
//                             message: 'Будь ласка, введіть дійсну електронну адресу!',
//                         },
//                     ]}
//                 >
//                     <Input placeholder="Ваш E-mail / login" />
//                 </Form.Item>
//
//                 <Form.Item
//                     name="phone"
//                     label="Номер телефону"
//                     rules={[
//                         { required: true, message: 'Введіть номер телефону' },
//                         {
//                             validator: (_, value) => {
//                                 const regex_phone = /^\+38\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/;
//                                 if (!value || regex_phone.test(value)) {
//                                     return Promise.resolve();
//                                 }
//                                 return Promise.reject(new Error('Неправильний формат номера телефону'));
//                             },
//                         },
//                     ]}
//                     // Щоб форма брала значення з події onChange PhoneInput
//                     getValueFromEvent={e => e.target.value}
//                 >
//                     {/*<PhoneInput value={form.getFieldValue('phone')}/>*/}
//                     {({ value, onChange }) => (
//                         <PhoneInput
//                             value={value}
//                             onChange={onChange}
//                         />
//                     )}
//
//                 </Form.Item>
//
//                 <Form.Item
//                     name="password"
//                     label="Пароль"
//                     rules={[{ required: true, message: 'Будь ласка, введіть пароль!' }]}
//                 >
//                     <Input.Password placeholder="Пароль" />
//                 </Form.Item>
//
//                 <Form.Item
//                     name="password1"
//                     label="Перевірка пароля"
//                     dependencies={['password']}
//                     rules={[
//                         { required: true, message: 'Будь ласка, підтвердіть пароль!' },
//                         ({ getFieldValue }) => ({
//                             validator(_, value) {
//                                 if (!value || getFieldValue('password') === value) {
//                                     return Promise.resolve();
//                                 }
//                                 return Promise.reject(new Error('Паролі не збігаються!'));
//                             },
//                         }),
//                     ]}
//                 >
//                     <Input.Password placeholder="Підтвердіть пароль" />
//                 </Form.Item>
//
//                 <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
//                     <Button type="default" htmlType="reset" style={{ marginRight: 10 }}>Скасувати</Button>
//                     <Button type="primary" htmlType="submit">Реєстрація</Button>
//                 </Form.Item>
//             </Form>
//         </>
//     );
// };
//
// export default RegistrUser;


import { Button, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { IUserRegisterRequest } from '../types/account.ts';
import { useRegisterUserMutation } from '../services/authApi.ts';
import PhoneInput from "../components/PhoneInput.tsx";
import { handleFormErrors } from "../utilities/handleApiErrors.ts";

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
        } catch (error: any) {
            form.setFields([
                { name: 'firstName', errors: [] },
                { name: 'lastName', errors: [] },
            ]);
            handleFormErrors(error, form);
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