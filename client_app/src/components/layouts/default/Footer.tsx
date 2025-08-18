// src/components/Footer.tsx
import React from "react";
import { FacebookIcon, InstagramIcon, TwitterIcon } from "../../icons";
const Footer: React.FC = () => {
  return (
    <footer className="bg-[#FFF7F3] w-full py-16 justify-between ">
      {/* Підписка на розсилку */}
      <div className="max-w-6xl mx-auto text-center mb-12 px-4">
        <h2 className="text-3xl font-semibold text-black mb-6">
          Дізнавайтесь першими про розпродажі і новинки!
        </h2>
        <div className="flex items-center w-[454px] h-[52px] mx-auto border border-gray-500 rounded-[15px] px-4 gap-[38px] transition">
          <input
            type="text"
            placeholder="Введіть ваш email"
            className="flex-1 h-full bg-transparent text-[#666666] text-[16px] font-medium outline-none   transition"
          />
          <button className="h-full px-4 bg-transparent text-black text-[16px] font-medium rounded-[15px] hover:text-gray transition">
            Підписатися
          </button>
        </div>
      </div>
      <div className="flex justify-center items-center gap-6 max-w-full md:max-w-[1380px] mx-auto py-12">
        <FacebookIcon className="w-10 h-10" />
        <InstagramIcon className="w-10 h-10" />
        <TwitterIcon className="w-10 h-10" />
      </div>

      {/* Основна навігація */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-4 mb-12">
        {/* Про доставку */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Про доставку</h3>
          <ul className="space-y-1 text-base text-black">
            <li>Способи оплати</li>
            <li>Про продукцію</li>
          </ul>
        </div>

        {/* Про нас */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Про нас</h3>
          <ul className="space-y-1 text-base text-black">
            <li>Контакти</li>
            <li>Партнерська програма</li>
            <li>Cosmeria Hub</li>
          </ul>
        </div>

        {/* Cosmeria Rewards */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Cosmeria Rewards</h3>
          <ul className="space-y-1 text-base text-black">
            <li>Умови використання</li>
            <li>Повернення та обмін</li>
          </ul>
        </div>

        {/* Контакти */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Контакти</h3>
          <ul className="space-y-1 text-base text-black">
            <li>(044)3740383</li>
            <li>0(800)507740</li>
            <li>Щоденно з 8:00 до 20:00</li>
          </ul>
        </div>
      </div>

      {/* Нижній блок */}
      <div className="flex flex-col items-center gap-6 max-w-full md:max-w-[1380px] mx-auto py-12">
        <h1 className="text-[28px] font-source-sans-pro font-semibold leading-[150%] tracking-[-0.011em] text-[#1A3D83] text-center">
          Cosmeria. Beauty Without Limits
        </h1>
        <p className="text-base text-gray-600 text-center">
          © Cosmeria 2009-2025
        </p>
      </div>
    </footer>
  );
};

export default Footer;
