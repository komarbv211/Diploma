import React, { useEffect, useState } from "react";
import { Button, Drawer, Dropdown, Input } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { getUser } from "../../../store/slices/userSlice";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { UserIcon, SearchIcon } from "../../icons";
import HorizontalNavigation from "../../navigation/HorizontalNavigation";
import { useCart } from "../../../hooks/useCart";
import { cartApi } from "../../../services/cartApi";
import { addItem, clearCart } from "../../../store/slices/localCartSlice";
import { useRef } from "react";
import CartModal from "../../Cart/CartModal";
import VerticalNavigation from "../../navigation/VerticalNavigation";
import { categoryApi } from "../../../services/categoryApi";
import Avatar from "../../Avatar";
import { useLogoutMutation } from "../../../services/authApi";
const CustomHeader: React.FC = () => {
  const user = useAppSelector(getUser);
  const dispatch = useAppDispatch();
  const isAdmin = user?.roles.includes("Admin");
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");
  const { cart } = useCart(user != null);
  const localCart = useAppSelector((state) => state.localCart.items);
  const prevUserRef = useRef<typeof user | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    const serverCart = [...cart];
    await logout();
    console.log("Server cart", serverCart);
    dispatch(cartApi.util.resetApiState()); // очищення кешу запитів кошика
    dispatch(categoryApi.util.resetApiState());
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

  const menuItems = [
    ...(isAdmin
      ? [
          {
            key: "dashboard",
            icon: <DashboardOutlined />,
            label: <Link to="/admin">Панель керування</Link>,
          },
        ]
      : []),
    {
      key: "profile",
      icon: <UserOutlined />,
      label: <Link to="/profile">Профіль</Link>,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Вийти",
      onClick: handleLogout,
    },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-20 bg-white flex items-center justify-between px-[120px] shadow-none">
        <Link to="/" className="flex-none w-[150px] sm:w-[310px]">
          <img
            src="/cosmeria 1.png"
            alt="Cosmeria Logo"
            className="w-[85%] h-{85%} object-contain"
          />
        </Link>

        {!isAdminPath && (
          <div className="hidden xl:flex">
            <Input
              placeholder="Пошук"
              className="serch-header-input w-[200px]"
              suffix={<SearchIcon />}
            />
          </div>
        )}

        <div className="flex items-center gap-8">
          {user ? (
            <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
              <span className="cursor-pointer">
                <Avatar
                  firstName={user.firstName}
                  lastName={user.lastName}
                  image={user.image || undefined}
                  size={42}
                />
              </span>
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
          {/* Modal кошика */}
          <CartModal />
        </div>
      </header>
      {/* Гамбургер для мобільних */}
      {!isAdminPath && (
        <Button
          type="text"
          className="mt-16 xl:hidden font-[32px]"
          icon={<MenuOutlined className="text-2xl" />}
          onClick={() => setDrawerVisible(true)}
        />
      )}
      {/* Мобільне меню Drawer */}
      <Drawer
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        closable={true}
      >
        <div className="flex flex-col gap-4">
          {!isAdminPath && (
            <Input placeholder="Пошук" suffix={<SearchIcon />} />
          )}
          <VerticalNavigation
            onSelectCategory={() => setDrawerVisible(false)}
          />
        </div>
      </Drawer>

      {!isAdminPath && (
        <div className="flex flex-row w-full bg-white justify-center">
          <div className="mt-20 hidden xl:flex justify-center">
            <HorizontalNavigation />
          </div>
        </div>
      )}
    </>
  );
};

export default CustomHeader;
