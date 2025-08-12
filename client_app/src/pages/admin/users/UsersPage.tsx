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











//
// import React, { useState, useMemo } from "react";
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
// import { DownOutlined, SearchOutlined } from "@ant-design/icons";
// import dayjs from "dayjs";
// import customParseFormat from "dayjs/plugin/customParseFormat";
// import { useGetAllUsersQuery } from "../../../services/admin/userAdninApi";
// import PaginationComponent from "../../../components/pagination/PaginationComponent";
// import { IUser } from "../../../types/user";
// import { useDebounce } from "use-debounce"; // ✅ додаємо debounce
//
// dayjs.extend(customParseFormat);
//
// // Тип розширеного користувача для таблиці
// interface IUserExtended extends IUser {
//   firstName: string;
//   lastName: string;
//   createdDateObj: dayjs.Dayjs;
//   lastActivityObj: dayjs.Dayjs;
// }
//
// const fieldMap: Record<string, string> = {
//   firstName: "FirstName",
//   lastName: "LastName",
//   email: "Email",
//   roles: "Roles",
//   createdDateObj: "CreatedDate",
//   lastActivityObj: "LastActivity",
// };
//
//
//
// // Розбиття fullName на firstName і lastName
// const parseFullName = (fullName: string) => {
//   const parts = fullName.trim().split(" ");
//   const firstName = parts[0] || "";
//   const lastName = parts.slice(1).join(" ") || "";
//   return { firstName, lastName };
// };
//
// const UsersPage = () => {
//   const [searchText, setSearchText] = useState("");
//
//
//   const [searchField, setSearchField] = useState<"name" | "email" | "roles">("name");
//
//   const [debouncedSearchText] = useDebounce(searchText, 500); // ✅ debounce 500ms
//   const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [sortBy, setSortBy] = useState<string | undefined>();
//   const [sortDesc, setSortDesc] = useState<boolean>(false);
//
//   const { data, isError, isLoading } = useGetAllUsersQuery({
//     page: currentPage,
//     pageSize,
//     sortBy,
//     sortDesc,
//     // searchName: debouncedSearchText, // ✅ використовуємо debounce версію
//     ...(searchField === "name" && { searchName: debouncedSearchText }),
//     ...(searchField === "email" && { searchEmail: debouncedSearchText }),
//     ...(searchField === "roles" && { searchRoles: debouncedSearchText }),
//   });
//
//
//   const users = data ?? { items: [], totalCount: 0 };
//
//   if (isError) {
//     message.error("Не вдалося завантажити користувачів");
//   }
//
//   // Обробка даних для таблиці
//   const dataSource = useMemo<IUserExtended[]>(() => {
//      console.log("users.items", users.items); // 👈 перевір, чи є `role`
//     return users.items.map((user: IUser) => {
//       const { firstName, lastName } = parseFullName(user.fullName);
//       return {
//         ...user,
//         firstName,
//         lastName,
//          role: user.roles?.[0] || "Unknown", // ✅ Витягуємо першу роль
//         createdDateObj: dayjs(user.createdDate, "DD.MM.YYYY HH:mm:ss"),
//         lastActivityObj: dayjs(user.lastActivity, "DD.MM.YYYY HH:mm:ss"),
//       };
//     });
//   }, [users]);
//
//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchText(e.target.value); // 🔁 оновлюємо searchText
//   };
//
//   const handleSelectChange = (keys: React.Key[]) => {
//     setSelectedRowKeys(keys);
//   };
//
//   const handleAction = (action: string, record: IUserExtended) => {
//     console.log(`Action: ${action}`, record);
//   };
//
//   // const handleTableChange = (_: any, __: any, sorter: any) => {
//   //   if (sorter?.field) {
//   //     setSortBy(sorter.field);
//   //     setSortDesc(sorter.order === "descend");
//   //   }
//   // };
//
// //   const handleTableChange = (_: any, __: any, sorter: any) => {
// //   const backendField = fieldMap[sorter.field];
// //    console.log("🔍 sorter.field:", sorter.field);         // <-- додай
// //   console.log("➡️ Sending sortBy:", backendField);       // <-- додай
// //   if (backendField) {
// //     setSortBy(backendField);
// //     setSortDesc(sorter.order === "descend");
// //   } else {
// //     setSortBy(undefined);
// //   }
// // };
//
// const handleTableChange = (_: any, __: any, sorter: any) => {
//   const backendField = fieldMap[sorter.field];
//   console.log("🟡 sorter.field:", sorter.field);        // debug
//   console.log("🟢 sending SortBy:", backendField);      // debug
//   if (backendField) {
//     setSortBy(backendField);
//     setSortDesc(sorter.order === "descend");
//   } else {
//     setSortBy(undefined);
//   }
// };
//
//   const columns = [
//     {
//       title: "First Name",
//       dataIndex: "firstName",
//       key: "firstName",
//       sorter: true,
//     },
//     {
//       title: "Last Name",
//       dataIndex: "lastName",
//       key: "lastName",
//       sorter: true,
//     },
//     {
//       title: "Email",
//       dataIndex: "email",
//       key: "email",
//       sorter: true,
//     },
//     {
//   title: "Role",
//   dataIndex: "role",
//   key: "role",
//   sorter: true,
//    render: (role: string) => role === "admin" ? "Administrator" : role,
//   //  sorter: (a: IUserExtended, b: IUserExtended) => a.roles.localeCompare(b.roles),
//   // render: (role: string) => role === "admin" ? "Administrator" : role,
// },
//     {
//       title: "Created Date",
//       dataIndex: "createdDateObj",
//       key: "createdDate",
//       sorter: true,
//       render: (date: dayjs.Dayjs) =>
//         date.isValid() ? date.format("DD.MM.YYYY HH:mm") : "-",
//     },
//     {
//       title: "Last Activity",
//       dataIndex: "lastActivityObj",
//       key: "lastActivity",
//       sorter: true,
//       render: (date: dayjs.Dayjs) =>
//         date.isValid() ? date.format("DD.MM.YYYY HH:mm") : "-",
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_: any, record: IUserExtended) => (
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
//
//   return (
//     <div style={{ padding: "20px" }}>
//       <Space
//         style={{ width: "100%", justifyContent: "space-between", marginBottom: 20 }}
//       >
//         <Select
//             value={searchField}
//             onChange={(value) => setSearchField(value)}
//             style={{ width: 120 }}
//         >
//           <Select.Option value="name">Name</Select.Option>
//           <Select.Option value="email">Email</Select.Option>
//           <Select.Option value="roles">Role</Select.Option>
//         </Select>
//         <Input
//           placeholder="Search"
//           prefix={<SearchOutlined />}
//           value={searchText}
//           onChange={handleSearch}
//           style={{ width: 200 }}
//         />
//         <Button type="primary">Add User</Button>
//       </Space>
//
//       {isLoading ? (
//         <Spin />
//       ) : (
//         <>
//           <Table
//             rowSelection={{
//               selectedRowKeys,
//               onChange: handleSelectChange,
//             }}
//             columns={columns}
//             rowKey="id"
//             pagination={false}
//             dataSource={dataSource}
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
//
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
  Select,
} from "antd";
import type {
  TablePaginationConfig,
  SorterResult,
  TableCurrentDataSource,
} from "antd/es/table/interface";
import { DownOutlined, SearchOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useGetAllUsersQuery } from "../../../services/admin/userAdninApi";
import PaginationComponent from "../../../components/pagination/PaginationComponent";
import { IUser } from "../../../types/user";
import { useDebounce } from "use-debounce";
import { DatePicker } from "antd";
import type { TableProps } from "antd";
// import type { RangeValue } from 'rc-picker/lib/interface';
// import dayjs, { Dayjs } from "dayjs";


dayjs.extend(customParseFormat);

interface IUserExtended extends IUser {
  firstName: string;
  lastName: string;
  createdDateObj: dayjs.Dayjs;
  lastActivityObj: dayjs.Dayjs;
  role: string; // ✅ потрібно для колонок таблиці
}

const fieldMap: Record<string, string> = {
  firstName: "FirstName",
  lastName: "LastName",
  email: "Email",
  role: "Roles",
  createdDateObj: "CreatedDate",
  lastActivityObj: "LastActivity",
};

const parseFullName = (fullName: string) => {
  const parts = fullName.trim().split(" ");
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ") || "";
  return { firstName, lastName };
};

const UsersPage: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [searchRoles, setSearchRoles] = useState("");

  const [dateField, setDateField] = useState<"createdDate" | "lastActivity">("createdDate");
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
const { RangePicker } = DatePicker;
  // const [searchField, setSearchField] = useState<"name" | "email" | "roles">("name");
  const [debouncedSearchText] = useDebounce(searchText, 500);
  const [debouncedSearchRoles] = useDebounce(searchRoles, 500);
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
    searchName: debouncedSearchText,
    searchRoles: debouncedSearchRoles,
    startDate: dateRange?.[0]?.format("DD.MM.YYYY"),
  endDate: dateRange?.[1]?.format("DD.MM.YYYY"),
  dateField: dateField === "createdDate" ? "CreatedDate" : "LastActivity",
  //   startDate: dateRange && dateRange[0] ? dateRange[0].format("YYYY-MM-DD") : undefined,
  // endDate: dateRange && dateRange[1] ? dateRange[1].format("YYYY-MM-DD") : undefined,
  // dateField: dateField === "createdDate" ? "CreatedDate" : "LastActivity",
    // ...(searchField === "name" && { searchName: debouncedSearchText }),
    // ...(searchField === "email" && { searchEmail: debouncedSearchText }),
    // ...(searchField === "roles" && { searchRoles: debouncedSearchRoles }),
  });

  const users = data ?? { items: [], totalCount: 0 };

  if (isError) {
    message.error("Не вдалося завантажити користувачів");
  }

  const dataSource = useMemo<IUserExtended[]>(() => {
    return users.items.map((user: IUser) => {
      const { firstName, lastName } = parseFullName(user.fullName);
      return {
        ...user,
        firstName,
        lastName,
        role: user.roles?.[0] || "Unknown",
        createdDateObj: dayjs(user.createdDate, "DD.MM.YYYY HH:mm:ss"),
        lastActivityObj: dayjs(user.lastActivity, "DD.MM.YYYY HH:mm:ss"),
      };
    });
  }, [users]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSelectChange = (keys: React.Key[]) => {
    setSelectedRowKeys(keys);
  };

  const handleAction = (action: string, record: IUserExtended) => {
    console.log(`Action: ${action}`, record);
  };

  // const handleTableChange = (
  //     // _: TablePaginationConfig,
  //     // // __: Record<string, (string | number)[] | null>,
  //     //  filters: Record<string, (string | number | boolean)[] | null>,
  //     // sorter: SorterResult<IUserExtended> | SorterResult<IUserExtended>[],
  //     // ___: TableCurrentDataSource<IUserExtended>

  //     pagination: TablePaginationConfig,
  // filters: Record<string, (string | number | boolean)[] | null>,
  // sorter: SorterResult<IUserExtended> | SorterResult<IUserExtended>[],
  // extra: TableCurrentDataSource<IUserExtended>
  // ) => {
  //   const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
  //   const field = singleSorter?.field as string;
  //   const backendField = fieldMap[field];

  //   if (backendField) {
  //     setSortBy(backendField);
  //     setSortDesc(singleSorter.order === "descend");
  //   } else {
  //     setSortBy(undefined);
  //      setSortDesc(false); // Важливо, щоб скидалось!
  //   }
  //   setCurrentPage(1); // Якщо юзер сортує - йому варто бачити 1 сторінку
  // };
  const handleTableChange: TableProps<IUserExtended>["onChange"] = (
  pagination,
  filters,
  sorter,
  extra
) => {
  const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
  const field = singleSorter?.field as string;
  const backendField = fieldMap[field];

  if (backendField) {
    setSortBy(backendField);
    setSortDesc(singleSorter.order === "descend");
  } else {
    setSortBy(undefined);
    setSortDesc(false);
  }

  setCurrentPage(1);
};


  const resetSorting = () => {
     console.log("resetSorting called");
  setSortBy(undefined);
  setSortDesc(false);
  setCurrentPage(1); // щоб оновити дані
};

  // const columns = [
  //   {
  //     title: "First Name",
  //     dataIndex: "firstName",
  //     key: "firstName",
  //     sorter: true,
  //   },
  //   {
  //     title: "Last Name",
  //     dataIndex: "lastName",
  //     key: "lastName",
  //     sorter: true,
  //   },
  //   {
  //     title: "Email",
  //     dataIndex: "email",
  //     key: "email",
  //     sorter: true,
  //   },
  //   {
  //     title: "Role",
  //     dataIndex: "role",
  //     key: "role",
  //     sorter: true,
  //     render: (role: string) => (role === "admin" ? "Administrator" : role),
  //   },
  //   {
  //     title: "Created Date",
  //     dataIndex: "createdDateObj",
  //     key: "createdDate",
  //     sorter: true,
  //     render: (date: dayjs.Dayjs) =>
  //         date.isValid() ? date.format("DD.MM.YYYY HH:mm") : "-",
  //   },
  //   {
  //     title: "Last Activity",
  //     dataIndex: "lastActivityObj",
  //     key: "lastActivity",
  //     sorter: true,
  //     render: (date: dayjs.Dayjs) =>
  //         date.isValid() ? date.format("DD.MM.YYYY HH:mm") : "-",
  //   },
  //   {
  //     title: "Actions",
  //     key: "actions",
  //     render: (_: unknown, record: IUserExtended) => (
  //         <Dropdown
  //             overlay={
  //               <Menu>
  //                 <Menu.Item onClick={() => handleAction("edit", record)}>
  //                   Edit
  //                 </Menu.Item>
  //                 <Menu.Item onClick={() => handleAction("delete", record)}>
  //                   Delete
  //                 </Menu.Item>
  //               </Menu>
  //             }
  //         >
  //           <Button>
  //             Actions <DownOutlined />
  //           </Button>
  //         </Dropdown>
  //     ),
  //   },
  // ];


  const columns = [
  {
    title: "First Name",
    dataIndex: "firstName",
    key: "firstName",
    sorter: true,
    sortOrder: sortBy === "FirstName" ? (sortDesc ? "descend" : "ascend") : null,
  },
  {
    title: "Last Name",
    dataIndex: "lastName",
    key: "lastName",
    sorter: true,
    sortOrder: sortBy === "LastName" ? (sortDesc ? "descend" : "ascend") : null,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    sorter: true,
    sortOrder: sortBy === "Email" ? (sortDesc ? "descend" : "ascend") : null,
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
    sorter: true,
    sortOrder: sortBy === "Roles" ? (sortDesc ? "descend" : "ascend") : null,
    render: (role: string) => (role === "admin" ? "Administrator" : role),
  },
  {
    title: "Created Date",
    dataIndex: "createdDateObj",
    key: "createdDate",
    sorter: true,
    sortOrder: sortBy === "CreatedDate" ? (sortDesc ? "descend" : "ascend") : null,
    render: (date: dayjs.Dayjs) =>
      date.isValid() ? date.format("DD.MM.YYYY HH:mm") : "-",
  },
  {
    title: "Last Activity",
    dataIndex: "lastActivityObj",
    key: "lastActivity",
    sorter: true,
    sortOrder: sortBy === "LastActivity" ? (sortDesc ? "descend" : "ascend") : null,
    render: (date: dayjs.Dayjs) =>
      date.isValid() ? date.format("DD.MM.YYYY HH:mm") : "-",
  },
  {
    title: "Actions",
    key: "actions",
    render: (_: unknown, record: IUserExtended) => (
      <Dropdown
        overlay={
          <Menu>
            <Menu.Item onClick={() => handleAction("edit", record)}>Edit</Menu.Item>
            <Menu.Item onClick={() => handleAction("delete", record)}>Delete</Menu.Item>
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
          {/* <Space>
            
            <Select
                placeholder="Select role"
                // value={searchRoles}
                onChange={(value) => setSearchRoles(value)}
                style={{ width: 200 }}
            >
              <Select.Option value="Admin">Administrator</Select.Option>
              <Select.Option value="User">User</Select.Option>
            </Select>

            <Input
                placeholder="Search"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={handleSearch}
                style={{ width: 200 }}
            />
          </Space> */}

          <Space>
  <Select
    placeholder="Select role"
    onChange={(value) => setSearchRoles(value)}
    style={{ width: 150 }}
  >
    <Select.Option value="Admin">Administrator</Select.Option>
    <Select.Option value="User">User</Select.Option>
  </Select>

  <Input
    placeholder="Search"
    prefix={<SearchOutlined />}
    value={searchText}
    onChange={handleSearch}
    style={{ width: 200 }}
  />

  <Select
    value={dateField}
    onChange={(value) => {
      setDateField(value);
      setCurrentPage(1);
    }}
    style={{ width: 180 }}
  >
    <Select.Option value="createdDate">Дата створення</Select.Option>
    <Select.Option value="lastActivity">Остання активність</Select.Option>
  </Select>

  <RangePicker
    value={dateRange}
    onChange={(dates) => {
      setDateRange(dates);
      setCurrentPage(1);
    }}
    format="DD.MM.YYYY"
  />
</Space>
          <Button onClick={() => resetSorting()}>Скинути сортування</Button>
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
  sorter={
    sortBy
      ? {
          field: Object.entries(fieldMap).find(([key, value]) => value === sortBy)?.[0],
          order: sortDesc ? "descend" : "ascend",
        }
      : undefined
  }
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

