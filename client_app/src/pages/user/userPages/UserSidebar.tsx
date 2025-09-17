import { useNavigate } from "react-router-dom";
import { Menu } from "antd";
import { useLocation } from "react-router-dom";
import { useLogoutMutation } from "../../../services/authApi";

const UserSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const menuItems = [
    // { key: "contact", label: "Контактна інформація", path: "#" },
    // { key: "address", label: "Адресна книга", path: "#" },
    { key: "/profile", label: "Профіль користувача", path: "/profile" },
    { key: "/order-history", label: "Історія замовлень", path: "/order-history" },
    { key: "/wishlist", label: "Список бажань", path: "#" },
    // { key: "brands", label: "Улюблені бренди", path: "#" },
    // { key: "promocodes", label: "Промокоди", path: "#" },
    {
      key: "spacer",
      className: "!h-4 !bg-transparent hover:!bg-transparent !cursor-default",
    },
    {
      key: "/profile/delete",
      label: <span className="text-pink2 hover:text-pink">Видалити мій акаунт</span>,
      path: "/profile/delete",
    },
    {
      key: "logout",
      label: "Вихід",
      onclick:{handleLogout},
    }
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