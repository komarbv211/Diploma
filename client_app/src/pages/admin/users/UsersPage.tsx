// import { useState } from 'react';
// import { Table, Button, Dropdown, Menu, Input, Space, Spin, message } from 'antd';
// import { DownOutlined, SearchOutlined } from '@ant-design/icons';
// import { IUser } from '../../../types/account';
// import dayjs from 'dayjs';
// import { useGetAllUsersQuery } from '../../../services/admin/userAdninApi';
// import PaginationComponent from '../../../components/pagination/PaginationComponent';

// const UsersPage = () => {
//   const [searchText, setSearchText] = useState('');
//   const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

// // сортування
// const [sortBy, setSortBy] = useState<string | undefined>();
// const [sortDesc, setSortDesc] = useState<boolean>(false);


//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const { data, isLoading, isError } = useGetAllUsersQuery({ page: currentPage, pageSize, sortBy, sortDesc });
//   const users = data ?? { items: [], totalCount: 0 };

//   if (isError) {
//     message.error('Failed to fetch users');
//   }

//   const handleSearch = (e: any) => {
//     setSearchText(e.target.value);
//   };

//   const handleSelectChange = (keys: React.Key[]) => {
//     setSelectedRowKeys(keys);
//   };

//   console.log('Users: ', users)

//   const handleAction = (action: string, record: IUser) => {
//     console.log(`Action: ${action}`, record);
//   };

//   const columns = [
//     { title: 'First Name', dataIndex: 'firstName', key: 'firstName' },
//     { title: 'Last Name', dataIndex: 'lastName', key: 'lastName' },
//     { title: 'Email', dataIndex: 'email', key: 'email' },
//     { title: 'Phone Number', dataIndex: 'phoneNumber', key: 'phoneNumber' },
//     {
//       title: 'Created Date', dataIndex: 'createdDate', key: 'createdDate',
//       render: (date: string) => dayjs(date).format('DD.MM.YYYY HH:mm'),
//     },
//     {
//       title: 'Last Activity', dataIndex: 'lastActivity', key: 'lastActivity',
//       render: (date: string) => dayjs(date).format('DD.MM.YYYY HH:mm'),
//     },
//     {
//       title: 'Actions',
//       key: 'actions',
//       render: (_: any, record: IUser) => (
//         <Dropdown
//           overlay={
//             <Menu>
//               <Menu.Item onClick={() => handleAction('edit', record)}>Edit</Menu.Item>
//               <Menu.Item onClick={() => handleAction('delete', record)}>Delete</Menu.Item>
//             </Menu>
//           }
//         >
//           <Button>
//             Actions <DownOutlined />
//           </Button>
//         </Dropdown>
//       ),
//     },
//   ];


//   return (
//     <div style={{ padding: '20px' }}>
//       <Space className="mb-5 flex justify-between">
//         <Input placeholder="Search  тест" prefix={<SearchOutlined />}
//           value={searchText} onChange={handleSearch} style={{ width: 200 }} />
//         <Button type="primary">Add User</Button>
//       </Space>
//       {isLoading ? (
//         <Spin />
//       ) : (
//         <>
//           <Table<IUser>
//             rowSelection={{
//               selectedRowKeys,
//               onChange: handleSelectChange,
//             }}
//             columns={columns}
//             rowKey="id"
//             pagination={false}
//             dataSource={users.items}
//           />
//           <PaginationComponent
//             currentPage={currentPage}
//             pageSize={pageSize}
//             totalItems={users.totalCount}
//             onPageChange={(page, size) => {
//               setCurrentPage(page);
//               setPageSize(size);
//             }}
//           />
//         </>
//       )}
//     </div>
//   );
// };

// export default UsersPage;


// src/pages/admin/UsersPage.tsx
// import React, { useState } from "react";
// import {
//   Table,
//   Button,
//   Dropdown,
//   Menu,
//   Input,
//   Space,
//   Spin,
//   message,
// } from "antd";
// import {
//   DownOutlined,
//   SearchOutlined,
// } from "@ant-design/icons";
// import { IUser } from "../../../types/user";
// import dayjs from "dayjs";
// import { useGetAllUsersQuery } from "../../../services/admin/userAdninApi";
// import PaginationComponent from "../../../components/pagination/PaginationComponent";

// const UsersPage = () => {
//   const [searchText, setSearchText] = useState('');
//   const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [sortBy, setSortBy] = useState<string | undefined>();
//   const [sortDesc, setSortDesc] = useState<boolean>(false);

//   // const { data, isLoading, isError } = useGetAllUsersQuery({
//   //   page: currentPage,
//   //   pageSize,
//   //   sortBy,
//   //   sortDesc
//   // });

// //   const { data, isError, isLoading } = useGetAllUsersQuery({
// //   page: 1,
// //   pageSize: 20,
// //   sortBy: 'FirstName',   // або 'LastName', 'Email' — залежить від бекенду
// //   sortDesc: false,       // false — за зростанням, true — за спаданням
// // });

// const { data, isError, isLoading } = useGetAllUsersQuery({
//   page: currentPage,
//   pageSize,
//   sortBy,
//   sortDesc,
//   searchName: searchText,  // 🔁 Назви однаково
// });
//   const users = data ?? { items: [], totalCount: 0 };

//   if (isError) {
//     message.error("Failed to fetch users");
//   }

//   const handleSearch = (e: any) => {
//     setSearchText(e.target.value);
//   };

//   const handleSelectChange = (keys: React.Key[]) => {
//     setSelectedRowKeys(keys);
//   };

//   const handleAction = (action: string, record: IUser) => {
//     console.log(`Action: ${action}`, record);
//   };

//   const handleTableChange = (_: any, __: any, sorter: any) => {
//     if (sorter && sorter.field) {
//       setSortBy(sorter.field);
//       setSortDesc(sorter.order === "descend");
//     }
//   };

//   const columns = [
//     { title: "First Name", dataIndex: "firstName", key: "firstName", sorter: true },
//   { title: "Last Name", dataIndex: "lastName", key: "lastName", sorter: true },
//     { title: "Email", dataIndex: "email", key: "email", sorter: true },
//     { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
//     {
//       title: "Created Date",
//       dataIndex: "createdDate",
//       key: "createdDate",
//       sorter: true,
//       render: (date: string) => dayjs(date).format("DD.MM.YYYY HH:mm"),
//     },
//     {
//       title: "Last Activity",
//       dataIndex: "lastActivity",
//       key: "lastActivity",
//       sorter: true,
//       render: (date: string) => dayjs(date).format("DD.MM.YYYY HH:mm"),
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_: any, record: IUser) => (
//         <Dropdown
//           overlay={
//             <Menu>
//               <Menu.Item onClick={() => handleAction("edit", record)}>
//                 Edit
//               </Menu.Item>
//               <Menu.Item onClick={() => handleAction("delete", record)}>
//                 Delete
//               </Menu.Item>
//             </Menu>
//           }
//         >
//           <Button>
//             Actions <DownOutlined />
//           </Button>
//         </Dropdown>
//       ),
//     },
//   ];

//   return (
//     <div style={{ padding: "20px" }}>
//       <Space className="mb-5 flex justify-between">
//         <Input
//           placeholder="Search"
//           prefix={<SearchOutlined />}
//           value={searchText}
//           onChange={handleSearch}
//           style={{ width: 200 }}
//         />
//         <Button type="primary">Add User</Button>
//       </Space>
//       {isLoading ? (
//         <Spin />
//       ) : (
//         <>
//           <Table<IUser>
//             rowSelection={{
//               selectedRowKeys,
//               onChange: handleSelectChange,
//             }}
//             columns={columns}
//             rowKey="id"
//             pagination={false}
//             dataSource={users.items}
//             onChange={handleTableChange}
//           />
//           <PaginationComponent
//             currentPage={currentPage}
//             pageSize={pageSize}
//             totalItems={users.totalCount}
//             onPageChange={(page, size) => {
//               setCurrentPage(page);
//               setPageSize(size);
//             }}
//           />
//         </>
//       )}
//     </div>
//   );
// };

// export default UsersPage;


import React, { useState, useMemo } from "react";
import {
  Table,
  Button,
  Dropdown,
  Menu,
  Input,
  Space,
  Spin,
  message,
} from "antd";
import { DownOutlined, SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useGetAllUsersQuery } from "../../../services/admin/userAdninApi";
import PaginationComponent from "../../../components/pagination/PaginationComponent";
import { IUser } from "../../../types/user";
import { useDebounce } from "use-debounce"; // ✅ додаємо debounce

dayjs.extend(customParseFormat);

// Тип розширеного користувача для таблиці
interface IUserExtended extends IUser {
  firstName: string;
  lastName: string;
  createdDateObj: dayjs.Dayjs;
  lastActivityObj: dayjs.Dayjs;
}

const fieldMap: Record<string, string> = {
  firstName: "FirstName",
  lastName: "LastName",
  email: "Email",
  roles: "Roles",
  createdDateObj: "CreatedDate",
  lastActivityObj: "LastActivity",
};



// Розбиття fullName на firstName і lastName
const parseFullName = (fullName: string) => {
  const parts = fullName.trim().split(" ");
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ") || "";
  return { firstName, lastName };
};

const UsersPage = () => {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText] = useDebounce(searchText, 500); // ✅ debounce 500ms
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortDesc, setSortDesc] = useState<boolean>(false);

  const { data, isError, isLoading } = useGetAllUsersQuery({
    page: currentPage,
    pageSize,
    sortBy,
    sortDesc,
    searchName: debouncedSearchText, // ✅ використовуємо debounce версію
  });
  

  const users = data ?? { items: [], totalCount: 0 };

  if (isError) {
    message.error("Не вдалося завантажити користувачів");
  }

  // Обробка даних для таблиці
  const dataSource = useMemo<IUserExtended[]>(() => {
     console.log("users.items", users.items); // 👈 перевір, чи є `role`
    return users.items.map((user: IUser) => {
      const { firstName, lastName } = parseFullName(user.fullName);
      return {
        ...user,
        firstName,
        lastName,
         role: user.roles?.[0] || "Unknown", // ✅ Витягуємо першу роль
        createdDateObj: dayjs(user.createdDate, "DD.MM.YYYY HH:mm:ss"),
        lastActivityObj: dayjs(user.lastActivity, "DD.MM.YYYY HH:mm:ss"),
      };
    });
  }, [users]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value); // 🔁 оновлюємо searchText
  };

  const handleSelectChange = (keys: React.Key[]) => {
    setSelectedRowKeys(keys);
  };

  const handleAction = (action: string, record: IUserExtended) => {
    console.log(`Action: ${action}`, record);
  };

  // const handleTableChange = (_: any, __: any, sorter: any) => {
  //   if (sorter?.field) {
  //     setSortBy(sorter.field);
  //     setSortDesc(sorter.order === "descend");
  //   }
  // };

//   const handleTableChange = (_: any, __: any, sorter: any) => {
//   const backendField = fieldMap[sorter.field];
//    console.log("🔍 sorter.field:", sorter.field);         // <-- додай
//   console.log("➡️ Sending sortBy:", backendField);       // <-- додай
//   if (backendField) {
//     setSortBy(backendField);
//     setSortDesc(sorter.order === "descend");
//   } else {
//     setSortBy(undefined);
//   }
// };

const handleTableChange = (_: any, __: any, sorter: any) => {
  const backendField = fieldMap[sorter.field];
  console.log("🟡 sorter.field:", sorter.field);        // debug
  console.log("🟢 sending SortBy:", backendField);      // debug
  if (backendField) {
    setSortBy(backendField);
    setSortDesc(sorter.order === "descend");
  } else {
    setSortBy(undefined);
  }
};

  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
      sorter: true,
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
      sorter: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: true,
    },
    {
  title: "Role",
  dataIndex: "role",
  key: "role",
  sorter: true,
   render: (role: string) => role === "admin" ? "Administrator" : role,
  //  sorter: (a: IUserExtended, b: IUserExtended) => a.roles.localeCompare(b.roles),
  // render: (role: string) => role === "admin" ? "Administrator" : role,
},
    {
      title: "Created Date",
      dataIndex: "createdDateObj",
      key: "createdDate",
      sorter: true,
      render: (date: dayjs.Dayjs) =>
        date.isValid() ? date.format("DD.MM.YYYY HH:mm") : "-",
    },
    {
      title: "Last Activity",
      dataIndex: "lastActivityObj",
      key: "lastActivity",
      sorter: true,
      render: (date: dayjs.Dayjs) =>
        date.isValid() ? date.format("DD.MM.YYYY HH:mm") : "-",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: IUserExtended) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item onClick={() => handleAction("edit", record)}>
                Edit
              </Menu.Item>
              <Menu.Item onClick={() => handleAction("delete", record)}>
                Delete
              </Menu.Item>
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
    <div style={{ padding: "20px" }}>
      <Space
        style={{ width: "100%", justifyContent: "space-between", marginBottom: 20 }}
      >
        <Input
          placeholder="Search"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={handleSearch}
          style={{ width: 200 }}
        />
        <Button type="primary">Add User</Button>
      </Space>

      {isLoading ? (
        <Spin />
      ) : (
        <>
          <Table
            rowSelection={{
              selectedRowKeys,
              onChange: handleSelectChange,
            }}
            columns={columns}
            rowKey="id"
            pagination={false}
            dataSource={dataSource}
            onChange={handleTableChange}
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
