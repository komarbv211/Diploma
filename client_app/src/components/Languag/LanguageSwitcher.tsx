// // LanguageSwitcher.tsx
// import React from "react";
// import i18n from "i18next";

// const LanguageSwitcher: React.FC = () => {
//   const currentLang = i18n.language || "ua";

//   const toggleLanguage = () => {
//     const newLang = currentLang === "ua" ? "en" : "ua";
//     i18n.changeLanguage(newLang);
//   };

//   return (
//     <button
//       onClick={toggleLanguage}
//       className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-100"
//     >
//       {currentLang === "ua" ? "EN" : "UA"}
//     </button>
//   );
// };

// export default LanguageSwitcher;


import React, { useEffect, useState } from "react";
import i18n from "../i18next";
import { useTranslation } from "react-i18next";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation(); // важливо!
  const [currentLang, setCurrentLang] = useState(i18n.language || "ua");

  const toggleLanguage = () => {
    const newLang = currentLang === "ua" ? "en" : "ua";
    i18n.changeLanguage(newLang);
  };

  // Слідкуємо за зміною мови
  useEffect(() => {
    const handleLangChange = (lng: string) => setCurrentLang(lng);
    i18n.on("languageChanged", handleLangChange);

    return () => {
      i18n.off("languageChanged", handleLangChange);
    };
  }, [i18n]);

  return (
    <button
      onClick={toggleLanguage}
      className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-100"
    >
      {currentLang === "ua" ? "EN" : "UA"}
    </button>
  );
};

export default LanguageSwitcher;
