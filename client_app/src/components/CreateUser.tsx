import React, { useEffect, useState } from 'react';
import {
    LeftOutlined,
    // PlusOutlined,
    // UpCircleOutlined,
} from '@ant-design/icons';
import {
    Button,
    DatePicker,
    Form,
    Input,
    InputNumber,
    message,
    Select,
    Space,
    // Upload,
} from 'antd';
import { useNavigate } from 'react-router-dom';
// import type { UploadFile } from 'antd/es/upload/interface';
import type { DatePickerProps } from 'antd';
import type { Rule } from 'antd/es/form';

const { TextArea } = Input;

interface Category {
    id: number;
    name: string;
}

interface UserForm {
    name: string;
    lastName?: string;
    firstName?: string;
    birthday?: string; // ISO date string
    work_experience?: number;
    categoryId?: number;
    imageUrl?: string;
}

// const normFile = (e: any): UploadFile | undefined => {
//     if (Array.isArray(e)) {
//         return e[0];
//     }
//     return e?.file;
// };

const api = 'https://localhost:5209/api/';

const CreateUser: React.FC = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<
        { label: string; value: number }[]
    >([]);

    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
    };

    useEffect(() => {
        fetch(api + 'Categorys/all')
            .then((res) => res.json())
            .then((data: Category[]) => {
                setCategories(
                    data.map((x) => ({
                        label: x.name,
                        value: x.id,
                    }))
                );
            });
    }, []);

    const onSubmit = (item: UserForm) => {
        console.log(item);

        fetch(api + 'User', {
            method: 'POST',
            body: JSON.stringify(item),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        }).then((res) => {
            if (res.status === 200) {
                message.success('User created successfully!');
                navigate(-1);
            } else {
                res.json().then((res) => {
                    const msg =
                        res.errors[Object.keys(res.errors)[0]][0] || 'Something went wrong';
                    message.error(msg);
                });
            }
        });
    };

    return (
        <>
            <Button
                onClick={() => navigate(-1)}
                icon={<LeftOutlined />}
                type="default"
            ></Button>
            <h2>Create New Doctor</h2>

            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                style={{ maxWidth: 600 }}
                onFinish={onSubmit}
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input!' } as Rule]}
                >
                    <Input />
                </Form.Item>

                <Form.Item label="LastName" name="lastName">
                    <TextArea style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item label="FirstName" name="firstName">
                    <TextArea style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item label="Birthday" name="birthday">
                    <DatePicker onChange={onChange} />
                </Form.Item>

                <Form.Item label="Work Experience" name="work_experience">
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item label="Category" name="categoryId">
                    <Select options={categories}></Select>
                </Form.Item>

                <Form.Item label="Image" name="imageUrl">
                    <Input />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
                    <Space>
                        <Button type="default" htmlType="reset">
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Create
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </>
    );
};

export default CreateUser;