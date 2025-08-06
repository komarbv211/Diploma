import React from "react";

const Home: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mt-[100px]">Головна сторінка</h1>
      <p className="text-lg mt-2">Ласкаво просимо до нашого додатку!</p>
      <p className="text-md mt-4 text-gray-600">
        Використовуйте навігацію зверху для перегляду категорій та товарів
      </p>
    </div>
  );
};

export default Home;
