import { Avatar, Button, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, logOut } from '../../../store/slices/userSlice'
import { useAppDispatch, useAppSelector } from '../../../store/store';

const CustomHeader = () => {

  const user = useAppSelector(getUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logOut());
    navigate('/login');
  };

  const commonItems = [
    { key: 'profile', icon: <UserOutlined />, label: <Link to={`/profile/${user?.id}`}>Profile</Link> },
    { key: 'logout', icon: <LogoutOutlined />, label: <Link to="/" onClick={handleLogout}>Log Out</Link> },
  ];
  const adminExtraItems = [
    { key: 'settings', icon: <SettingOutlined />, label: <Link to="/admin/settings">Settings</Link> },
  ];

  // TODO
  const menuItems = user?.roles.includes('Admin') ? [...adminExtraItems, ...commonItems] : commonItems;

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-50">
      {user ? (
        <div className="flex items-center justify-end h-full px-6">
          <Dropdown menu={{ items: menuItems }}>
            <Avatar size={42} icon={<UserOutlined />} className="cursor-pointer" />
          </Dropdown>
        </div>
      ) : (
        <div className="flex justify-end px-6 gap-4">
          <Link to="/login">
            <Button>Login</Button>
          </Link>
          <Link to="/registr">
            <Button>Register</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CustomHeader;