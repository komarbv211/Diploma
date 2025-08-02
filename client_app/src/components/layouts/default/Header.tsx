import { Avatar, Form, Dropdown, Input } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { getUser, logOut } from "../../../store/slices/userSlice";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { APP_ENV } from "../../../env";
import { UserIcon, CartIcon, SearchIcon } from "../../icons";

const CustomHeader = () => {
  const user = useAppSelector(getUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAdmin = user?.roles.includes("Admin");

  const handleLogout = () => {
    dispatch(logOut());
    navigate("/");
  };

  const avatarUrl = user?.image
    ? `${APP_ENV.IMAGES_100_URL}${user.image}`
    : undefined;

  const menuItems = [
    ...(isAdmin
      ? [
          {
            key: "dashboard",
            icon: <DashboardOutlined />,
            label: <Link to="/admin">Dashboard</Link>,
          },
        ]
      : []),
    {
      key: "profile",
      icon: <UserOutlined />,
      label: <Link to="/profile">Profile</Link>,
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: <Link to="/settings">Settings</Link>,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: <span onClick={handleLogout}>Log Out</span>,
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-white shadow-sm z-50 flex items-center justify-between px-10">
      {/* Логотип */}
      <Link to="/" className="flex-none w-[310px] h-[58px] order-0 ">
        <img
          src="/cosmeria 1.png"
          alt="Cosmeria Logo"
          className="w-[85%] h-{85%} object-contain"
        />
      </Link>
      {/* Пошук */}
      <div className="relative flex flex-row items-center justify-between px-4 py-3 gap-[38px] w-[660px] h-[52px] ">
        <Form.Item name="search">
          <Input
            placeholder="Пошук"
            className="flex p-[5px] pl-[15px] justify-between items-center self-stretch rounded-xl border-[1px] border-black text-gray placeholder:text- font-manrope text-[20px] font-medium leading-normal"
            suffix={<SearchIcon />}
          />
        </Form.Item>
      </div>

      {/* Користувач і кошик */}
      <div className="flex items-center gap-8">
        {user ? (
          <Dropdown menu={{ items: menuItems }}>
            <Avatar
              size={42}
              icon={!avatarUrl && <UserOutlined />}
              src={avatarUrl}
              className="cursor-pointer"
            />
          </Dropdown>
        ) : (
          <div className="flex items-center gap-2">
            <UserIcon />
            <div className="flex flex-col items-start">
              <span className="text-[15px] leading-[20px] text-black font-light font-manrope">
                Ласкаво просимо!
              </span>
              <span className="text-[16px] leading-[22px] text-black font-medium font-manrope">
                <Link to="/login">Вхід</Link> /{" "}
                <Link to="/registr">Реєстрація</Link>
              </span>
            </div>
          </div>
        )}

        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          {/* Іконка ліворуч */}
          <div className="relative w-[41px] h-[41px] flex-shrink-0">
            <CartIcon className="text-black w-full h-full" />
          </div>

          {/* Справа блок з бейджем і текстом */}
          <div className="flex flex-col justify-between ml-3 h-[41px]">
            {/* Бейдж зверху справа */}
            <div
              className="flex justify-center items-center
                 w-[49px] h-[19px] p-[10px] gap-[10px]
                 bg-[#C89FB8] rounded-[15px]"
            >
              <span className="w-[29px] h-[20px] text-black font-manrope font-light text-[15px] leading-[20px] text-center">
                0
              </span>
            </div>

            {/* Текст знизу справа */}
            <div className="w-[49px] h-[22px] font-manrope font-medium text-[16px] leading-[22px] text-black text-center">
              Кошик
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CustomHeader;
