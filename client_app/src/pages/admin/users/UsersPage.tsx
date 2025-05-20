import { useState } from 'react';
import { Table, Button, Dropdown, Menu, Input, Space, Spin, message } from 'antd';
import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import { IUser } from '../../../types/account';
import dayjs from 'dayjs';
import { useGetAllUsersQuery } from '../../../services/admin/userAdninApi';
import PaginationComponent from '../../../components/pagination/PaginationComponent';

const UsersPage = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data, isLoading, isError } = useGetAllUsersQuery({ page: currentPage, pageSize });
  const users = data ?? { items: [], totalCount: 0 };

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
        <>
          <Table<IUser>
            rowSelection={{
              selectedRowKeys,
              onChange: handleSelectChange,
            }}
            columns={columns}
            rowKey="id"
            pagination={false}
            dataSource={users.items}
          />
          <PaginationComponent
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={users.totalCount}
            onPageChange={(page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            }}
          />
        </>
      )}
    </div>
  );
};

export default UsersPage;
