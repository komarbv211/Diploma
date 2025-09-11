import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import StarDecoration from "../components/decorations/StarDecoration";
import BackButton from "../components/buttons/BackButton";

const PasswordUpdatedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex w-full min-h-screen items-center justify-center bg-beige2">
      {/* Фонове зображення */}
      <img
        src="/flowers-bg.png"
        className="absolute right-0 top-0 w-[55%] h-full object-cover z-0 hidden lg:block"
        alt="background"
      />
      {/* Декоративний градієнт */}
      <div className="absolute inset-0 left-[45%] bg-gradient-to-r from-beige2  z-0" />

      <BackButton to="/" />

      {/* Форма логіну */}
      <div className="relative flex w-full max-w-sm mx-auto  rounded-lg  lg:max-w-6xl ">
        {/* Зірка вгорі зліва */}
        <StarDecoration
          width={72}
          height={86}
          className="absolute  z-20 top-[-42.5px] left-[-34.5px] hidden xl:block"
        />

        {/* Зірка внизу справа */}
        <StarDecoration
          width={72}
          height={86}
          className="absolute z-20 bottom-[-42px] right-[542.5px] hidden lg:block "
        />

        <div className="form-container xs:max-w-[100%] md:max-w-[] w-[574px]  h-full px-6 py-8 md:px-8 z-20 xs:translate-x-[-7%] md:translate-x-[-20%] lg:translate-x-[40%] xl:translate-x-0">
          <h1 className="form-title">Ваш пароль оновлено!</h1>
          <p className="text-[20px] leading-[27px] mt-[6px] text-center font-manrope font-medium text-black">
            Дякуємо
          </p>
          {/* Кнопка */}
          <Button
            type="primary"
            className=" md:w-[455px] remember-button"
            onClick={() => navigate("/login")}
          >
            <span className="remember-button-text">Увійти</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PasswordUpdatedPage;
