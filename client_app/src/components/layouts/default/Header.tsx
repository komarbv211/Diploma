import React, { useEffect, useState, useRef } from "react";
import { Button, Drawer, Dropdown, AutoComplete, Input, Spin } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getUser } from "../../../store/slices/userSlice";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { UserIcon, SearchIcon } from "../../icons";
import HorizontalNavigation from "../../navigation/HorizontalNavigation";
import VerticalNavigation from "../../navigation/VerticalNavigation";
import Avatar from "../../Avatar";
import { useLogoutMutation } from "../../../services/authApi";
import { useCart } from "../../../hooks/useCart";
import { cartApi } from "../../../services/cartApi";
import { addItem, clearCart } from "../../../store/slices/localCartSlice";
import { categoryApi } from "../../../services/categoryApi";
import { useSearchProductsQuery } from "../../../services/productApi";
import { useDebounce } from "use-debounce";
import CartModal from "../../Cart/CartModal";
import { APP_ENV } from "../../../env";

const CustomHeader: React.FC = () => {
  const user = useAppSelector(getUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");
  const isAdmin = user?.roles.includes("Admin");

  const { cart } = useCart(user != null);
  const localCart = useAppSelector((state) => state.localCart.items);
  const prevUserRef = useRef<typeof user | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [logout] = useLogoutMutation();

  // Live search
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch] = useDebounce(searchText, 500);
  const { data: searchResults, isFetching } = useSearchProductsQuery(
    { Query: debouncedSearch, Page: 1, ItemPerPage: 5 },
    { skip: !debouncedSearch }
  );

  const options =
    searchResults?.items.map((product) => ({
      value: product.name,
      label: (
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate(`/product/details/${product.id}`)}
        >
          <img
            src={`${APP_ENV.IMAGES_200_URL}${product.imageUrl}`}
              alt="Product image"
              className="w-10 h-10 object-cover rounded"  
              onError={(e) => {
              e.currentTarget.src = "/public/NoImage.png";
            }}
          />
          <div className="flex flex-col">
            <span className="font-medium">{product.name}</span>
            {product.categoryName && (
              <span className="text-xs text-gray">{product.categoryName}</span>
            )}
          </div>
        </div>
      ),
    })) || [];

  useEffect(() => {
    setSearchText("");
  }, [location.pathname]);


  const handleLogout = async () => {
    const serverCart = [...cart];
    await logout();
    dispatch(cartApi.util.resetApiState());
    dispatch(categoryApi.util.resetApiState());
    serverCart.forEach((item) => dispatch(addItem(item)));
    window.location.href = "/";
  };

  useEffect(() => {
    const prevUser = prevUserRef.current;
    if (!prevUser && user) {
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
      label: <Link to={isAdmin ? "/admin/profile" : "/profile"}>Профіль</Link>,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Вийти",
      onClick: handleLogout,
    },
  ];

  const guestMenuItems = [
    { key: "login", label: <Link to="/login">Вхід</Link> },
    { key: "registr", label: <Link to="/registr">Реєстрація</Link> },
  ];

  return (
    <>
<header className="fixed top-0 left-0 right-0 h-20 bg-white flex items-center px-4 xl:px-[120px] shadow-none">
  <div className="flex flex-1 items-center max-w-[1680px] mx-auto">
    
    {/* Логотип */}
    <Link
      to="/"
      className="flex flex-1 justify-center xl:justify-start w-[150px] md:w-[310px] md:h-[58px] h-[29px] md:pl-36 pl-20 xl:pl-0"
    >
      <img
        src="/cosmeria 1.png"
        alt="Cosmeria Logo"
        className="h-full w-auto object-contain"
      />
    </Link>

    {/* Пошук */}
    {!isAdminPath && (
      <div className="hidden xl:flex flex-1 justify-center px-4">      
        <AutoComplete
          value={searchText}
          options={options}
          onSelect={(value) => {
            const product = searchResults?.items.find((p) => p.name === value);
            if (product) {
              navigate(`/product/details/${product.id}`);
              setSearchText("");
            }
          }}
          onSearch={(value) => setSearchText(value)}
          notFoundContent={isFetching ? <Spin size="small" /> : "Нічого не знайдено"}
          className="w-full"
        >
          <Input
            placeholder="Пошук"
            className="serch-header-input"
            suffix={isFetching ? <Spin size="small" /> : <SearchIcon />}
          />
        </AutoComplete>
      </div>
    )}

 {/* Користувач / кошик */}
    <div className="flex flex-[80% 20%] xl:flex-1 items-center justify-end gap-4">
      {user ? (
        <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
          <span className="cursor-pointer">
            <Avatar
              firstName={user.firstName}
              lastName={user.lastName}
              image={user.image || undefined}
              size={window.innerWidth >= 1280 ? 42 : 32}
            />
          </span>
        </Dropdown>
      ) : (
        <div className="flex items-center gap-2">
          <Dropdown menu={{ items: guestMenuItems }} trigger={["click"]}>
            <span className="cursor-pointer">
              <UserIcon className="w-8 h-8 xl:w-10 xl:h-10" />
            </span>
          </Dropdown>

          <div className="hidden xl:flex flex-col items-start">
            <span className="text-[15px] leading-[20px] text-black font-light font-manrope">
              Ласкаво просимо!
            </span>
            <span className="text-[16px] leading-[22px] text-black font-medium font-manrope">
              <Link to="/login">Вхід</Link> / <Link to="/registr">Реєстрація</Link>
            </span>
          </div>
        </div>
      )}
      
            <CartModal />
    </div>
  </div>
</header>
      {/* Гамбургер для мобільних */}
      {!isAdminPath && (
        <Button
          type="text"
          className="mt-7 xl:hidden font-[32px]"
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
          {!isAdminPath && <Input placeholder="Пошук" suffix={<SearchIcon />} />}
          <VerticalNavigation onSelectCategory={() => setDrawerVisible(false)} />
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
