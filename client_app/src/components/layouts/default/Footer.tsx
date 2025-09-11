// src/components/Footer.tsx
import React from "react";
import { FacebookIcon, InstagramIcon, TwitterIcon } from "../../icons";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  // функція для скролу наверх
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // функція для кнопки (reload + скрол)
  const handleSubscribe = () => {
    window.scrollTo(0, 0);
    window.location.reload();
  };

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
                className="flex-1 h-full bg-transparent text-[#666666] text-[16px] font-medium outline-none transition"
            />
            <button
                onClick={handleSubscribe}
                className="h-full px-4 bg-transparent text-black text-[16px] font-medium rounded-[15px] hover:text-gray transition"
            >
              Підписатися
            </button>
          </div>
        </div>

        {/* Соцмережі */}
        <div className="flex justify-center items-center gap-6 max-w-full md:max-w-[1380px] mx-auto py-12">
          <a
              href="https://facebook.com/cosmeria"
              target="_blank"
              rel="noopener noreferrer"
          >
            <FacebookIcon className="w-10 h-10 hover:opacity-70 transition" />
          </a>
          <a
              href="https://instagram.com/cosmeria"
              target="_blank"
              rel="noopener noreferrer"
          >
            <InstagramIcon className="w-10 h-10 hover:opacity-70 transition" />
          </a>
          <a
              href="https://twitter.com/cosmeria"
              target="_blank"
              rel="noopener noreferrer"
          >
            <TwitterIcon className="w-10 h-10 hover:opacity-70 transition" />
          </a>
        </div>

        {/* Основна навігація */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 px-4 mb-12">
          {/* Про доставку */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Про доставку</h3>
            <ul className="space-y-1 text-base text-black">
              <li>
                <Link to="/payment" onClick={scrollToTop}>
                  Способи оплати
                </Link>
              </li>
              <li>
                <Link to="/products-info" onClick={scrollToTop}>
                  Про продукцію
                </Link>
              </li>
              <li>
                <Link to="/quality" onClick={scrollToTop}>
                  Про якість товару
                </Link>
              </li>
            </ul>
          </div>

          {/* Про нас */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Про нас</h3>
            <ul className="space-y-1 text-base text-black">
              <li>
                <Link to="/about" onClick={scrollToTop}>
                  Про компанію
                </Link>
              </li>
              <li>
                <Link to="/contacts" onClick={scrollToTop}>
                  Контакти
                </Link>
              </li>
              <li>
                <Link to="/partners" onClick={scrollToTop}>
                  Партнерська програма
                </Link>
              </li>
              <li>
                <Link to="/hub" onClick={scrollToTop}>
                  Cosmeria Hub
                </Link>
              </li>
            </ul>
          </div>

          {/* Cosmeria Rewards */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Cosmeria Rewards</h3>
            <ul className="space-y-1 text-base text-black">
              <li>
                <Link to="/terms" onClick={scrollToTop}>
                  Умови використання
                </Link>
              </li>
              <li>
                <Link to="/returns" onClick={scrollToTop}>
                  Повернення та обмін
                </Link>
              </li>
            </ul>
          </div>

          {/* Порожній блок для відступу */}
          <div></div>

          {/* Контакти */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Контакти</h3>
            <ul className="space-y-1 text-base text-black">
              <li>
                <a href="tel:+380443740383">(044) 374 03 83</a>
              </li>
              <li>
                <a href="tel:0800507740">0 (800) 507 740</a>
              </li>
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
