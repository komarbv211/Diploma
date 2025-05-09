import { DeleteOutlined, LogoutOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';

const AdminSidebar = () => {
  const navigate = useNavigate();

  return (
    <Menu mode="inline" defaultSelectedKeys={['1']} className='py-1' onSelect={({ key }) => navigate(key)}>
      <Menu.Item key="/admin/users" icon={<UsergroupAddOutlined />}>Користувачі</Menu.Item>
      <Menu.Item key="/delete-account" icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />} style={{ color: '#ff4d4f' }}>Видалити мій акаунт</Menu.Item>
      <Menu.Item key="/login" icon={<LogoutOutlined />}>Вихід</Menu.Item>
    </Menu>

  );
};

export default AdminSidebar;