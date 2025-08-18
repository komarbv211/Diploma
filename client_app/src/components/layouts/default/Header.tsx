import React, { useEffect } from "react";
import { Avatar, Form, Dropdown, Input } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { getUser, logOut } from "../../../store/slices/userSlice";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { APP_ENV } from "../../../env";
import { UserIcon, SearchIcon } from "../../icons";
import HorizontalNavigation from "../../navigation/HorizontalNavigation";
import CartDrawer from "../../Cart/CartDrawer";
import { useCart } from "../../../hooks/useCart";
import { cartApi } from "../../../services/cartApi";
import { addItem, clearCart } from "../../../store/slices/localCartSlice";
import { useRef } from "react";

const CustomHeader: React.FC = () => {
  const user = useAppSelector(getUser);
  const dispatch = useAppDispatch();
  const isAdmin = user?.roles.includes("Admin");
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");
  const { cart } = useCart(user != null);
  const localCart = useAppSelector((state) => state.localCart.items);
  const prevUserRef = useRef<typeof user | null>(null);

  const handleLogout = async () => {
    const serverCart = [...cart];
    dispatch(logOut());
    console.log("Server cart", serverCart);
    dispatch(cartApi.util.resetApiState()); // очищення кешу запитів кошика
    console.log("Server cart", serverCart);
    serverCart.forEach((item) => {
      dispatch(addItem(item));
    });
    window.location.href = "/";
  };

  useEffect(() => {
    const prevUser = prevUserRef.current;
    if (!prevUser && user) {
      // синхронізація тільки коли відбулось логінення
      if (localCart.length > 0) {
        Promise.all(
          localCart.map((item) =>
            dispatch(cartApi.endpoints.createUpdateCart.initiate(item)).unwrap()
          )
        ).then(() => dispatch(clearCart()));
      }
      dispatch(cartApi.endpoints.getCart.initiate());
    }
    prevUserRef.current = user;
  }, [user, localCart, dispatch]);

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
      key: "logout",
      icon: <LogoutOutlined />,
      label: <span onClick={handleLogout}>Log Out</span>,
    },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-20 bg-white flex items-center justify-between px-10">
        <Link to="/" className="flex-none w-[310px] h-[58px] order-0 ">
          <img
            src="/cosmeria 1.png"
            alt="Cosmeria Logo"
            className="w-[85%] h-{85%} object-contain"
          />
        </Link>

        {!isAdminPath && (
          <Form.Item name="search">
            <Input
              placeholder="Пошук"
              className="serch-header-input"
              suffix={<SearchIcon />}
            />
          </Form.Item>
        )}

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
          {/* Drawer кошика */}
          <CartDrawer />
        </div>
      </header>

      {!isAdminPath && (
        <div className="mt-20">
          <HorizontalNavigation />
        </div>
      )}
    </>
  );
};

export default CustomHeader;
