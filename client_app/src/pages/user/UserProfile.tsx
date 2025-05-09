import { UserOutlined, HomeOutlined, HistoryOutlined, GiftOutlined, DeleteOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { Layout, Menu, Input, Typography, Row, Col, Divider, Button, Space, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { logOut } from '../../store/slices/userSlice';
import { useGetUserByIdQuery } from '../../services/userApi';
import { useDispatch } from 'react-redux';

const { Content, Sider } = Layout;
const { Title, Text } = Typography;

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: user, isLoading } = useGetUserByIdQuery(Number(id));

  const handleLogout = () => {
    dispatch(logOut());
    navigate('/login');
  };

  const menuItems = [
    { key: '1', icon: <UserOutlined />, label: 'Контактна інформація' },
    { key: '2', icon: <HomeOutlined />, label: 'Адресна книга' },
    { key: '3', icon: <HistoryOutlined />, label: 'Історія замовлень' },
    { key: '4', icon: <UserOutlined />, label: 'Мої особливості' },
    { key: '5', icon: <GiftOutlined />, label: 'Список бажань' },
    { key: '6', icon: <GiftOutlined />, label: 'Промокоди' },
    { key: '7', icon: <DeleteOutlined style={{ color: '#ff4d4f' }} />, label: 'Видалити мій акаунт', style: { color: '#ff4d4f' } },
    { key: '8', icon: <LogoutOutlined />, label: 'Вихід', onClick: handleLogout },
  ];

  if (isLoading || !user) {
    return (
      <Content className="flex justify-center items-center min-h-[300px]">
        <Spin size="large" />
      </Content>
    );
  }

  return (
    <Layout>
      <Sider theme="light" width={220} collapsible>
        <Menu mode="inline" defaultSelectedKeys={['1']} className='py-1' items={menuItems} />
      </Sider>

      <Content className="m-3 p-6 bg-white" key={user.id}>
        <Title level={3}>Профіль користувача</Title>

        <Row gutter={40} className="mt-8">
          <Col span={12}>
            <Text strong className="block mb-2">Ім’я</Text>
            <Input size="large" defaultValue={user.firstName} />
            <Divider />

            <Text strong className="block mb-2">Прізвище</Text>
            <Input size="large" defaultValue={user.lastName} />
            <Divider />

            <Text strong className="block mb-2">E-mail</Text>
            <Input size="large" defaultValue={user.email} />
            <Divider />

            <Text strong className="block mb-2">Дата народження</Text>
            <Input size="large" placeholder="дд.мм.рррр" type='date' />
            <Divider />

            <Text strong className="block mb-2">Телефон</Text>
            <Input size="large" defaultValue={user.phoneNumber} />
          </Col>

          <Col span={12}>
            <Row justify="space-between" className="mb-[77px]">
              <Col span={8}>
                <div className="h-40 bg-gray-100 rounded-lg p-4 flex flex-col justify-between shadow-sm">
                  <Text strong className="text-sm">Вподобані товари</Text>
                  <Text className="text-4xl font-light">0</Text>
                </div>
              </Col>
              <Col span={8}>
                <div className="h-40 bg-gray-100 rounded-lg p-4 mx-1 flex flex-col justify-between shadow-sm">
                  <Text strong className="text-sm">Придбані товари</Text>
                  <Text className="text-4xl font-light">0</Text>
                </div>
              </Col>
              <Col span={8}>
                <div className="h-40 bg-gray-100 rounded-lg p-4 flex flex-col justify-between shadow-sm">
                  <Text strong className="text-sm">В кошику</Text>
                  <Text className="text-4xl font-light">0</Text>
                </div>
              </Col>
            </Row>

            <Text strong className="block mb-2">Старий пароль</Text>
            <Input.Password size="large" placeholder="********" />
            <Divider />

            <Text strong className="block mb-2">Новий пароль</Text>
            <Input.Password size="large" placeholder="********" />
            <Divider />

            <Text strong className="block mb-2">Підтвердження пароля</Text>
            <Input.Password size="large" placeholder="********" />
          </Col>
        </Row>

        <Divider />

        <Space className="flex justify-center">
          <Button type="primary" icon={<SettingOutlined />}>Зберегти зміни</Button>
        </Space>
      </Content>
    </Layout>
  );
};

export default UserProfile;
