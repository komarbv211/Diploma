import { Avatar, Button, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined, DashboardOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, logOut } from '../../../store/slices/userSlice'
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { APP_ENV } from '../../../env';

const CustomHeader = () => {

  const user = useAppSelector(getUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logOut());
    navigate('/login');
  };

  const isAdmin = user?.roles.includes('Admin');
  const adminPrefix = (path: string) => isAdmin ? `/admin${path}` : path;
  const avatarUrl = user?.image ? `${APP_ENV.IMAGES_100_URL}${user.image}` : null;
  console.log('avatarUrl:', avatarUrl);

  const menuItems = [
    ...(isAdmin ? [{ key: 'dashboard', icon: <DashboardOutlined />, label: <Link to={adminPrefix('/')}>Dashboard</Link> }] : []),
    { key: 'profile', icon: <UserOutlined />, label: <Link to={adminPrefix('/profile')}>Profile</Link> },
    { key: 'settings', icon: <SettingOutlined />, label: <Link to={adminPrefix('/settings')}>Settings</Link> },
    { key: 'logout', icon: <LogoutOutlined />, label: <Link to="/" onClick={handleLogout}>Log Out</Link> },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-50">
      {user ? (
        <div className="flex items-center justify-end h-full px-6">
          <Dropdown menu={{ items: menuItems }}>
           <Avatar
              size={42}
              icon={!avatarUrl && <UserOutlined />}
              src={avatarUrl || undefined}
              className="cursor-pointer"
            />
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