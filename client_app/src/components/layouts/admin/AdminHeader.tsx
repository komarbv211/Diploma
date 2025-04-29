import { Avatar, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const AdminHeader = () => {

    const profileItems = [
        { key: '1', icon: <UserOutlined />, label: <Link to="/">Profile</Link> },
        { key: '2', icon: <LogoutOutlined />, label: <Link to="/">Log Out</Link> },
    ];

    return (
        <div className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-50">
            <div className="flex items-center justify-end h-full px-6">
                <Dropdown menu={{ items: profileItems }}>
                    <Avatar icon={<UserOutlined />} className="cursor-pointer" />
                </Dropdown>
            </div>
        </div>
    );
};

export default AdminHeader;