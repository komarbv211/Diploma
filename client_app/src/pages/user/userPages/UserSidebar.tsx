import { useNavigate } from "react-router-dom";
import { Menu } from "antd";
import { useLocation } from "react-router-dom";
import { useLogoutMutation } from "../../../services/authApi";
import { useAppSelector } from "../../../store/store";
import { getAuth } from "../../../store/slices/userSlice";

const UserSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [logout] = useLogoutMutation();
  const auth = useAppSelector(getAuth);
  const isAdmin = auth.roles.includes("Admin");


  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const menuItems = [

    // { key: "contact", label: "Контактна інформація", path: "#" },
    // { key: "address", label: "Адресна книга", path: "#" },
    { key: "/profile", label: "Профіль користувача", path: "/profile" },
    { key: "/order-history", label: "Історія замовлень", path: "/order-history" },
    { key: "/profile/wishlist", label: "Список бажань", path: "/profile/wishlist" },
    // { key: "brands", label: "Улюблені бренди", path: "#" },
    // { key: "promocodes", label: "Промокоди", path: "#" },
    {
      key: "spacer",
      className: "!h-4 !bg-transparent hover:!bg-transparent !cursor-default",
    },
    ...(!isAdmin
      ? [
          {
            key: "/profile/delete",
            label: (
              <span className="text-pink2 hover:text-pink">
                Видалити мій акаунт
              </span>
            ),
            path: "/profile/delete",
          },
        ]
      : []),
    ...(isAdmin
      ? [
           {
            key: "dashboard",
            label:(<span className="text-pink2 hover:text-pink">Панель керування </span>),
            path: "/admin",
          },
        ]
      : []),
    {
      key: "logout",
      label: "Вихід",
    },
  ];

  return (
    <>
      <div className="border border-blue2 bg-white rounded-xl p-2 [&_.ant-menu-root]:!border-0 h-[260px]">
        <Menu
          mode="inline"
          defaultSelectedKeys={[location.pathname]}
          onClick={({ key }) => {
            if (key === "logout") {
              handleLogout();
            } else {
              const item = menuItems.find((i) => i.key === key);
              if (item?.path && item.path !== "#") navigate(item.path);
            }
          }}
          items={menuItems}
          className="font-manrope text-[16px] [&_.ant-menu-item:hover]:!bg-transparent [&_.ant-menu-item:hover]:!text-pink2"
        />
      </div>
    </>
  );
};

export default UserSidebar;