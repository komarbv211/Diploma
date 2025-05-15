import { useState } from 'react';
import { Table, Button, Dropdown, Menu, Input, Space, Spin, message } from 'antd';
import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import { IUser } from '../../../types/account';
import dayjs from 'dayjs';
import { useGetAllUsersQuery } from '../../../services/admin/userAdninApi';

const UsersPage = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const { data: users = [], isLoading, isError } = useGetAllUsersQuery();

  if (isError) {
    message.error('Failed to fetch users');
  }

  const handleSearch = (e: any) => {
    setSearchText(e.target.value);
  };

  const handleSelectChange = (keys: React.Key[]) => {
    setSelectedRowKeys(keys);
  };

  console.log('Users: ', users)

  const handleAction = (action: string, record: IUser) => {
    console.log(`Action: ${action}`, record);
  };

  const columns = [
    { title: 'First Name', dataIndex: 'firstName', key: 'firstName' },
    { title: 'Last Name', dataIndex: 'lastName', key: 'lastName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone Number', dataIndex: 'phoneNumber', key: 'phoneNumber' },
    {
      title: 'Created Date', dataIndex: 'createdDate', key: 'createdDate',
      render: (date: string) => dayjs(date).format('DD.MM.YYYY HH:mm'),
    },
    {
      title: 'Last Activity', dataIndex: 'lastActivity', key: 'lastActivity',
      render: (date: string) => dayjs(date).format('DD.MM.YYYY HH:mm'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: IUser) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item onClick={() => handleAction('edit', record)}>Edit</Menu.Item>
              <Menu.Item onClick={() => handleAction('delete', record)}>Delete</Menu.Item>
            </Menu>
          }
        >
          <Button>
            Actions <DownOutlined />
          </Button>
        </Dropdown>
      ),
    },
  ];

  const filteredUsers = users.filter(
    (user) =>
      user.firstName?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ padding: '20px' }}>
      <Space className="mb-5 flex justify-between">
        <Input placeholder="Search" prefix={<SearchOutlined />}
          value={searchText} onChange={handleSearch} style={{ width: 200 }} />
        <Button type="primary">Add User</Button>
      </Space>
      {isLoading ? (
        <Spin />
      ) : (
        <Table
          rowSelection={{
            selectedRowKeys,
            onChange: handleSelectChange,
          }}
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          pagination={false}
        />
      )}
    </div>
  );
};

export default UsersPage;
