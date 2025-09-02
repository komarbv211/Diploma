// src/components/AuthWatcher.tsx
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { RootState } from "../store/store";

// Функція для перевірки чи є шлях публічним
const isPublicPath = (pathname: string): boolean => {
  // Публічні шляхи, які не потребують авторизації
  const publicPaths = [
    "/",
    "/about",
    "/login",
    "/registr",
    "/forgot-password",
    "/google-register",
    "/password-updated",
    "/product/details/:id",
    "/orders",
  ];

  // Перевіряємо точні збіги
  if (publicPaths.includes(pathname)) {
    console.log("AuthWatcher: path is public (exact match):", pathname);
    return true;
  }

  // Перевіряємо динамічні шляхи
  if (pathname.startsWith("/reset-password/")) {
    console.log("AuthWatcher: path is public (reset-password):", pathname);
    return true;
  }

  // Перевіряємо шляхи категорій
  if (pathname.startsWith("/category/")) {
    console.log("AuthWatcher: path is public (category):", pathname);
    return true;
  }

  if (pathname.startsWith("/product/details/")) return true;

  console.log("AuthWatcher: path is NOT public:", pathname);
  return false;
};

const AuthWatcher = () => {
  const token = useSelector((state: RootState) => state.account.token);
  const isLogOut = useSelector(
    (state: RootState) => state.account.isLoggingOut
  );
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log(
      "AuthWatcher: token =",
      token,
      "isLogOut =",
      isLogOut,
      "pathname =",
      location.pathname
    );

    // Якщо відбувається логаут, не перенаправляємо на логін
    if (isLogOut) {
      console.log("AuthWatcher: logout in progress, skipping redirect");
      return;
    }

    // Якщо токен зник і шлях не публічний — редірект
    if (!token && !isPublicPath(location.pathname)) {
      console.log("AuthWatcher: redirecting to login");
      // Додаємо затримку, щоб дати час для window.location.href в Header
      setTimeout(() => {
        console.log("AuthWatcher: executing redirect to login after delay");
        // Перевіряємо, чи користувач вже не на головній сторінці
        if (location.pathname !== "/") {
          navigate("/login");
        } else {
          console.log(
            "AuthWatcher: user already on home page, skipping redirect"
          );
        }
      }, 100);
    }
  }, [token, isLogOut, navigate, location.pathname]);

  return null;
};

export default AuthWatcher;
