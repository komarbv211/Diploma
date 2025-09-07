// components/ScrollToTopButton.tsx
import React, { useEffect, useState } from "react";
import { ArrowUpOutlined } from "@ant-design/icons";

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Показуємо кнопку при скролі вниз
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // плавний скрол
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-[#402945] text-white shadow-lg hover:bg-[#5a3a60] transition"
        >
          <ArrowUpOutlined style={{ fontSize: "20px" }} />
        </button>
      )}
    </>
  );
};

export default ScrollToTopButton;
