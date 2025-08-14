

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
  ConfigProvider,
  DatePicker,
} from "antd";
import type { TableProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DownOutlined, SearchOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/uk";
import ukUA from "antd/es/locale/uk_UA";
import { useGetAllUsersQuery } from "../../../services/admin/userAdninApi";
import PaginationComponent from "../../../components/pagination/PaginationComponent";
import { IUser } from "../../../types/user";
import { useDebounce } from "use-debounce";

dayjs.extend(customParseFormat);
dayjs.locale("uk");

interface IUserExtended extends IUser {
  firstName: string;
  lastName: string;
  createdDateObj: Dayjs;
  lastActivityObj: Dayjs;
  role: string;
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
  const [searchRoles, setSearchRoles] = useState<string | undefined>(undefined);

  const [dateField, setDateField] = useState<"createdDate" | "lastActivity">(
    "createdDate"
  );
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(
    null
  );

  const [debouncedSearchText] = useDebounce(searchText, 500);
  const [debouncedSearchRoles] = useDebounce(searchRoles, 500);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
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
        role: user.roles?.[0] || "Невідомо",
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

  const handleTableChange: TableProps<IUserExtended>["onChange"] = (
    pagination,
    filters,
    sorter
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
    setSearchRoles(undefined);
    setSearchText("");
    setDateField("createdDate");
    setDateRange(null);

    setSortBy(undefined);
    setSortDesc(false);
    setCurrentPage(1);
  };

  const columns: ColumnsType<IUserExtended> = [
    {
      title: "Ім'я",
      dataIndex: "firstName",
      key: "firstName",
      sorter: true,
      sortOrder:
        sortBy === "FirstName" ? (sortDesc ? "descend" : "ascend") : null,
    },
    {
      title: "Прізвище",
      dataIndex: "lastName",
      key: "lastName",
      sorter: true,
      sortOrder:
        sortBy === "LastName" ? (sortDesc ? "descend" : "ascend") : null,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: true,
      sortOrder: sortBy === "Email" ? (sortDesc ? "descend" : "ascend") : null,
    },
    {
      title: "Роль",
      dataIndex: "role",
      key: "role",
      sorter: true,
      sortOrder: sortBy === "Roles" ? (sortDesc ? "descend" : "ascend") : null,
      render: (role: string) => (role === "admin" ? "Адміністратор" : role),
    },
    {
      title: "Дата створення",
      dataIndex: "createdDateObj",
      key: "createdDate",
      sorter: true,
      sortOrder:
        sortBy === "CreatedDate" ? (sortDesc ? "descend" : "ascend") : null,
      render: (date: Dayjs) =>
        date.isValid() ? date.format("DD.MM.YYYY HH:mm") : "-",
    },
    {
      title: "Остання активність",
      dataIndex: "lastActivityObj",
      key: "lastActivity",
      sorter: true,
      sortOrder:
        sortBy === "LastActivity" ? (sortDesc ? "descend" : "ascend") : null,
      render: (date: Dayjs) =>
        date.isValid() ? date.format("DD.MM.YYYY HH:mm") : "-",
    },
    {
      title: "Дії",
      key: "actions",
      render: (_: unknown, record: IUserExtended) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item onClick={() => handleAction("edit", record)}>
                Редагувати
              </Menu.Item>
              <Menu.Item onClick={() => handleAction("delete", record)}>
                Видалити
              </Menu.Item>
            </Menu>
          }
        >
          <Button>
            Дії <DownOutlined />
          </Button>
        </Dropdown>
      ),
    },
  ];

  return (
    <ConfigProvider locale={ukUA}>
      <div style={{ padding: "20px" }}>
        <Space
          style={{
            width: "100%",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <Space>
            <Select
              placeholder="Обрати роль"
              value={searchRoles || undefined}
              allowClear
              onChange={(value) => setSearchRoles(value)}
              style={{ width: 150 }}
            >
              <Select.Option value="Admin">Адміністратор</Select.Option>
              <Select.Option value="User">Користувач</Select.Option>
            </Select>

            <Input
              placeholder="Пошук за ім'ям"
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

            <DatePicker.RangePicker
              placeholder={["Початкова дата", "Кінцева дата"]}
              value={dateRange}
              onChange={(dates) => {
                setDateRange(dates);
                setCurrentPage(1);
              }}
              format="DD.MM.YYYY"
            />
          </Space>

          <Space>
            <Button onClick={resetSorting}>Скинути сортування</Button>
            <Button type="primary">Додати користувача</Button>
          </Space>
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
              totalItems={data?.pagination?.totalCount}
              onPageChange={(page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              }}
            />
          </>
        )}
      </div>
    </ConfigProvider>
  );
};

export default UsersPage;
