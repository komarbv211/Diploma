// src/components/ScrollToTop.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Прокрутити до верху при зміні шляху
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null; // нічого не рендериться
};

export default ScrollToTop;
