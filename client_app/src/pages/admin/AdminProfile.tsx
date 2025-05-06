import { Layout, Typography, Row, Col, Divider, Button, Space, Input, Spin, } from 'antd';
import { SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGetUserByIdQuery } from '../../services/userApi';
import { logOut } from '../../store/slices/userSlice';
import dayjs from 'dayjs';

const { Content } = Layout;
const { Title, Text } = Typography;

const AdminProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: user, isLoading } = useGetUserByIdQuery(Number(id));

  const handleLogout = () => {
    dispatch(logOut());
    navigate('/login');
  };

  if (isLoading || !user) {
    return (
      <Content className="flex justify-center items-center min-h-[300px]">
        <Spin size="large" />
      </Content>
    );
  }

  return (
    <Content className="pt-5 px-10">
      <Title level={3}>Профіль адміністратора</Title>

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
          <Input size="large" placeholder="дд.мм.рррр" />
          <Divider />

          <Text strong className="block mb-2">Телефон</Text>
          <Input size="large" defaultValue={user.phoneNumber} />
        </Col>

        <Col span={12}>
          <Text strong className="block mb-2">Старий пароль</Text>
          <Input.Password size="large" placeholder="********" />
          <Divider />

          <Text strong className="block mb-2">Новий пароль</Text>
          <Input.Password size="large" placeholder="********" />
          <Divider />

          <Text strong className="block mb-2">Підтвердження пароля</Text>
          <Input.Password size="large" placeholder="********" />
          <Divider />

          <Text strong className="block mb-2">Роль</Text>
          <Input size="large" disabled defaultValue={'Адміністратор'} />
          <Divider />

          <Text strong className="block mb-2">Останній вхід</Text>
          <Input size="large" disabled defaultValue={dayjs(user.lastActivity).format('DD.MM.YYYY HH:mm')} />
        </Col>
      </Row>
      <Divider />

      <Space className="flex justify-center gap-[500px]">
        <Button danger icon={<LogoutOutlined />} onClick={handleLogout}>
          Вийти
        </Button>
        <Button type="primary" icon={<SettingOutlined />}>
          Зберегти зміни
        </Button>
      </Space>
    </Content>
  );
};

export default AdminProfile;
