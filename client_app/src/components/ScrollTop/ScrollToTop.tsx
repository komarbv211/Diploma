// src/components/ScrollToTop.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ScrollToTopButton from "../ScrollToTopButton";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Прокрутити до верху при зміні шляху
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return <ScrollToTopButton />; // нічого не рендериться
};

export default ScrollToTop;
