// import React, { useState } from "react";
// import { Slider } from 'antd';
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { format } from "date-fns";
// import { useGetBrandsQuery } from "../../services/brandApi";
// import BrandListWithAlphabet from "../brand/BrandListWithAlphabet";

// export interface ProductFilterData {
//   Query?: string;
//   PriceMin?: number;
//   PriceMax?: number;
//   MinRating?: number;
//   InStock?: boolean;
//   SortBy?: string;
//   SortDesc?: boolean;

//   StartDate?: string; // "dd.MM.yyyy"
//   EndDate?: string;   // "dd.MM.yyyy"
// }

// type Props = {
//   onChange: (filters: ProductFilterData) => void;
// };

// const ProductFilter: React.FC<Props> = ({ onChange }) => {
//   const [query, setQuery] = useState("");
//   const [priceMin, setPriceMin] = useState("");
//   const [priceMax, setPriceMax] = useState("");
//   const [minRating, setMinRating] = useState("");
//   const [inStock, setInStock] = useState(false);
//   const [sortBy, setSortBy] = useState("");
//   const [sortDesc, setSortDesc] = useState(false);
//   const [selectedLetter, setSelectedLetter] = useState("");
//   const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
//   const [startDate, setStartDate] = useState<Date | null>(null);
//   const [endDate, setEndDate] = useState<Date | null>(null);


//   const { data: brands = [], isLoading, isError, error } = useGetBrandsQuery();
//   console.log("Помилка брендів:", error);

//   const handleApply = () => {
//     onChange({
//       Query: query || undefined,
//       PriceMin: priceMin ? Number(priceMin) : undefined,
//       PriceMax: priceMax ? Number(priceMax) : undefined,
//       MinRating: minRating ? Number(minRating) : undefined,
//       InStock: inStock,
//       SortBy: sortBy || undefined,
//       SortDesc: sortDesc || undefined,
//       StartDate: startDate ? format(startDate, "dd.MM.yyyy") : undefined,
//       EndDate: endDate ? format(endDate, "dd.MM.yyyy") : undefined,
//     });
//   };

//   const handleReset = () => {
//     // setQuery("");
//     // setPriceMin("");
//     // setPriceMax("");
//     // setMinRating("");
//     // setInStock(false);
//     // setSortBy("");
//     // setSortDesc(false);
//     // onChange({});
//     // setSelectedLetter("");
//     // setStartDate(null);
//     // setEndDate(null);


//     setQuery("");
//     setPriceMin("");
//     setPriceMax("");
//     setMinRating("");
//     setInStock(false);
//     setSortBy("");
//     setSortDesc(false);
//     setSelectedLetter("");
//     setStartDate(null);
//     setEndDate(null);
//     setSelectedBrandId(null);

//     // Очистити фільтри
//     onChange({});

//     // Оновити сторінку (опціонально)
//     window.location.reload();
//   };

//   // const handleBrandSelect = (brand: { name: string }) => {
//   //   setQuery(brand.name);
//   //   onChange({
//   //     Query: brand.name,
//   //     PriceMin: priceMin ? Number(priceMin) : undefined,
//   //     PriceMax: priceMax ? Number(priceMax) : undefined,
//   //     MinRating: minRating ? Number(minRating) : undefined,
//   //     InStock: inStock,
//   //     SortBy: sortBy || undefined,
//   //     SortDesc: sortDesc || undefined,
//   //   });
//   // };

//   const handleBrandSelect = (brand: { name: string; id: number } | null) => {
//     if (brand === null) {
//       setSelectedBrandId(null);
//       setQuery("");
//       onChange({}); // скинути фільтр бренду
//     } else {
//       setSelectedBrandId(brand.id);
//       setQuery(brand.name);
//       onChange({
//         Query: brand.name,
//         PriceMin: priceMin ? Number(priceMin) : undefined,
//         PriceMax: priceMax ? Number(priceMax) : undefined,
//         MinRating: minRating ? Number(minRating) : undefined,
//         InStock: inStock,
//         SortBy: sortBy || undefined,
//         SortDesc: sortDesc || undefined,
//       });
//     }
//   };


//   const minPriceFromApi = 100;
//   const maxPriceFromApi = 10000;

//   return (
//     <div className="w-full max-w-[1680px] flex flex-col gap-4 px-4 mb-4">
//       <div className="flex flex-col gap-4 w-full">

//         {/* 👉 Компонент з брендами */}
//       <div className="border-t pt-4">
//         {isLoading && <p>Завантаження брендів...</p>}
//         {isError && <p>Помилка при завантаженні брендів.</p>}
//         {!isLoading && !isError && (
//   //          <BrandListWithAlphabet
//   //   brands={brands}
//   //   selectedLetter={selectedLetter}
//   //   onLetterSelect={setSelectedLetter}
//   //   onBrandSelect={handleBrandSelect}
//   // />

//             <BrandListWithAlphabet
//                 brands={brands}
//                 selectedLetter={selectedLetter}
//                 onLetterSelect={setSelectedLetter}
//                 onBrandSelect={handleBrandSelect}
//                 selectedBrandId={selectedBrandId}
//             />

//         )}
//       </div>

//         {/* Пошук */}
//         <input
//           type="text"
//           placeholder="Пошук..."
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           className="border px-3 py-2 rounded w-full"
//         />

//         {/* Ціна (слайдер) */}
//         <div className="w-full">
//           <label className="block mb-2 font-medium">Ціна, грн</label>
//           <Slider
//             range
//             min={minPriceFromApi}
//             max={maxPriceFromApi}
//             step={10}
//             value={[Number(priceMin) || minPriceFromApi, Number(priceMax) || maxPriceFromApi]}
//             onChange={([min, max]) => {
//               setPriceMin(String(min));
//               setPriceMax(String(max));
//             }}
//           />
//           <div className="flex justify-between text-sm text-gray-600 mt-1">
//             <span>{priceMin || minPriceFromApi} грн</span>
//             <span>{priceMax || maxPriceFromApi} грн</span>
//           </div>
//         </div>


//         <div className="flex flex-col gap-2">
//           <label className="font-medium">Дата від</label>
//           <DatePicker
//               selected={startDate}
//               onChange={(date) => setStartDate(date)}
//               dateFormat="dd.MM.yyyy"
//               className="border px-3 py-2 rounded w-full"
//               placeholderText="Оберіть дату від"
//               isClearable
//           />

//           <label className="font-medium mt-2">Дата до</label>
//           <DatePicker
//               selected={endDate}
//               onChange={(date) => setEndDate(date)}
//               dateFormat="dd.MM.yyyy"
//               className="border px-3 py-2 rounded w-full"
//               placeholderText="Оберіть дату до"
//               isClearable
//           />
//         </div>


//         {/* Мін. рейтинг */}
//         <input
//           type="number"
//           placeholder="Мін. рейтинг"
//           value={minRating}
//           onChange={(e) => setMinRating(e.target.value)}
//           className="border px-3 py-2 rounded w-full"
//           min={0}
//           max={5}
//           step={0.1}
//         />

//         {/* В наявності */}
//         <label className="flex items-center gap-2">
//           <input
//             type="checkbox"
//             checked={inStock}
//             onChange={(e) => setInStock(e.target.checked)}
//           />
//           В наявності
//         </label>

//         {/* Сортування */}
//         <select
//           value={sortBy}
//           onChange={(e) => setSortBy(e.target.value)}
//           className="border px-3 py-2 rounded w-full"
//         >
//           <option value="">Сортування</option>
//           <option value="Price">Ціна</option>
//           <option value="Rating">Рейтинг</option>
//           <option value="CreatedAt">Дата створення</option>
//         </select>

//         {/* За спаданням */}
//         <label className="flex items-center gap-2">
//           <input
//             type="checkbox"
//             checked={sortDesc}
//             onChange={(e) => setSortDesc(e.target.checked)}
//           />
//           За спаданням
//         </label>

//       </div>
//       {/* Кнопки */}
//       <div className="flex flex-col gap-2 w-full">
//         <button
//             onClick={handleApply}
//             className="bg-blue-500 text-white px-4 py-2 rounded w-full"
//         >
//           Застосувати
//         </button>

//         <button
//             onClick={handleReset}
//             className="bg-red-500 text-white px-4 py-2 rounded w-full"
//         >
//           Очистити фільтр
//         </button>
//       </div>

      
//     </div>
//   );
// };

// export default ProductFilter;



// import React, { useState } from "react";
// import { Slider } from "antd";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { format } from "date-fns";
// import { useGetBrandsQuery } from "../../services/brandApi";
// import BrandListWithAlphabet from "../brand/BrandListWithAlphabet";

// export interface ProductFilterData {
//   Query?: string;
//   PriceMin?: number;
//   PriceMax?: number;
//   MinRating?: number;
//   InStock?: boolean;
//   SortBy?: string;
//   SortDesc?: boolean;

//   StartDate?: string; // "dd.MM.yyyy"
//   EndDate?: string;   // "dd.MM.yyyy"
// }

// type Props = {
//   onChange: (filters: ProductFilterData) => void;
//   isAdmin: boolean; // отримуємо пропс, щоб розрізняти роль
// };

// const ProductFilter: React.FC<Props> = ({ onChange, isAdmin }) => {
//   // Стани для фільтрів
//   const [query, setQuery] = useState("");
//   const [priceMin, setPriceMin] = useState("");
//   const [priceMax, setPriceMax] = useState("");
//   const [minRating, setMinRating] = useState("");
//   const [inStock, setInStock] = useState(false);
//   const [sortBy, setSortBy] = useState("");
//   const [sortDesc, setSortDesc] = useState(false);
//   const [selectedLetter, setSelectedLetter] = useState("");
//   const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
//   const [startDate, setStartDate] = useState<Date | null>(null);
//   const [endDate, setEndDate] = useState<Date | null>(null);

//   // Стани для відкриття/закриття інпутів
//   const [showQuery, setShowQuery] = useState(false);
//   const [showMinRating, setShowMinRating] = useState(false);
//   const [showInStock, setShowInStock] = useState(false);
//   const [showSortBy, setShowSortBy] = useState(false);
//   const [showSortDesc, setShowSortDesc] = useState(false);
//   const [showDateFilter, setShowDateFilter] = useState(false); // для дати (тільки для адміна)

//   const { data: brands = [], isLoading, isError, error } = useGetBrandsQuery();
//   console.log("Помилка брендів:", error);

//   const handleApply = () => {
//     onChange({
//       Query: query || undefined,
//       PriceMin: priceMin ? Number(priceMin) : undefined,
//       PriceMax: priceMax ? Number(priceMax) : undefined,
//       MinRating: minRating ? Number(minRating) : undefined,
//       InStock: inStock,
//       SortBy: sortBy || undefined,
//       SortDesc: sortDesc || undefined,
//       StartDate: startDate ? format(startDate, "dd.MM.yyyy") : undefined,
//       EndDate: endDate ? format(endDate, "dd.MM.yyyy") : undefined,
//     });
//   };

//   const handleReset = () => {
//     setQuery("");
//     setPriceMin("");
//     setPriceMax("");
//     setMinRating("");
//     setInStock(false);
//     setSortBy("");
//     setSortDesc(false);
//     setSelectedLetter("");
//     setStartDate(null);
//     setEndDate(null);
//     setSelectedBrandId(null);

//     onChange({});

//     // Можна перезавантажувати сторінку або ні
//     // window.location.reload();
//   };

//   const handleBrandSelect = (brand: { name: string; id: number } | null) => {
//     if (brand === null) {
//       setSelectedBrandId(null);
//       setQuery("");
//       onChange({});
//     } else {
//       setSelectedBrandId(brand.id);
//       setQuery(brand.name);
//       onChange({
//         Query: brand.name,
//         PriceMin: priceMin ? Number(priceMin) : undefined,
//         PriceMax: priceMax ? Number(priceMax) : undefined,
//         MinRating: minRating ? Number(minRating) : undefined,
//         InStock: inStock,
//         SortBy: sortBy || undefined,
//         SortDesc: sortDesc || undefined,
//       });
//     }
//   };

//   const minPriceFromApi = 100;
//   const maxPriceFromApi = 10000;

//   return (
//     <div className="w-full max-w-[1680px] flex flex-col gap-4 px-4 mb-4">
//       <div className="flex flex-col gap-4 w-full">

//         {/* Компонент з брендами */}
//         <div className="pt-4">
//           {isLoading && <p>Завантаження брендів...</p>}
//           {isError && <p>Помилка при завантаженні брендів.</p>}
//           {!isLoading && !isError && (
//             <BrandListWithAlphabet
//               brands={brands}
//               selectedLetter={selectedLetter}
//               onLetterSelect={setSelectedLetter}
//               onBrandSelect={handleBrandSelect}
//               selectedBrandId={selectedBrandId}
//             />
//           )}
//         </div>

//         {/* Пошук - назва + кнопка */}
//         <div className="w-full">
//           <div className="flex justify-between items-center">
//             <label className="font-medium">Пошук</label>
//             <button
//               onClick={() => setShowQuery(!showQuery)}
//               className="text-gray-500 hover:text-black text-lg"
//             >
//               ✖
//             </button>
//           </div>
//           {showQuery && (
//             <input
//               type="text"
//               placeholder="Пошук..."
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               className="mt-2 px-3 py-2 rounded w-full border"
//             />
//           )}
//         </div>

//         {/* Ціна (слайдер) - завжди видно, без кнопки */}
//         <div className="w-full">
//           <label className="block mb-2 font-medium">Ціна, грн</label>
//           <Slider
//             range
//             min={minPriceFromApi}
//             max={maxPriceFromApi}
//             step={10}
//             value={[Number(priceMin) || minPriceFromApi, Number(priceMax) || maxPriceFromApi]}
//             onChange={([min, max]) => {
//               setPriceMin(String(min));
//               setPriceMax(String(max));
//             }}
//           />
//           <div className="flex justify-between text-sm text-gray-600 mt-1">
//             <span>{priceMin || minPriceFromApi} грн</span>
//             <span>{priceMax || maxPriceFromApi} грн</span>
//           </div>
//         </div>

//         {/* Мін. рейтинг - назва + кнопка */}
//         <div className="w-full">
//           <div className="flex justify-between items-center">
//             <label className="font-medium">Мін. рейтинг</label>
//             <button
//               onClick={() => setShowMinRating(!showMinRating)}
//               className="text-gray-500 hover:text-black text-lg"
//             >
//               ✖
//             </button>
//           </div>
//           {showMinRating && (
//             <input
//               type="number"
//               placeholder="Введіть мін. рейтинг"
//               value={minRating}
//               onChange={(e) => setMinRating(e.target.value)}
//               className="mt-2 px-3 py-2 rounded w-full border"
//               min={0}
//               max={5}
//               step={0.1}
//             />
//           )}
//         </div>

//         {/* В наявності - назва + кнопка */}
//         <div className="w-full">
//           <div className="flex justify-between items-center">
//             <label className="font-medium">В наявності</label>
//             <button
//               onClick={() => setShowInStock(!showInStock)}
//               className="text-gray-500 hover:text-black text-lg"
//             >
//               ✖
//             </button>
//           </div>
//           {showInStock && (
//             <label className="flex items-center gap-2 mt-2">
//               <input
//                 type="checkbox"
//                 checked={inStock}
//                 onChange={(e) => setInStock(e.target.checked)}
//               />
//               Показувати тільки товари в наявності
//             </label>
//           )}
//         </div>

//         {/* Сортування - назва + кнопка */}
//         <div className="w-full">
//           <div className="flex justify-between items-center">
//             <label className="font-medium">Сортування</label>
//             <button
//               onClick={() => setShowSortBy(!showSortBy)}
//               className="text-gray-500 hover:text-black text-lg"
//             >
//               ✖
//             </button>
//           </div>
//           {showSortBy && (
//             <select
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}
//               className="mt-2 px-3 py-2 rounded w-full border"
//             >
//               <option value="">Оберіть сортування</option>
//               <option value="Price">Ціна</option>
//               <option value="Rating">Рейтинг</option>
//               <option value="CreatedAt">Дата створення</option>
//             </select>
//           )}
//         </div>

//         {/* За спаданням - назва + кнопка */}
//         <div className="w-full">
//           <div className="flex justify-between items-center">
//             <label className="font-medium">За спаданням</label>
//             <button
//               onClick={() => setShowSortDesc(!showSortDesc)}
//               className="text-gray-500 hover:text-black text-lg"
//             >
//               ✖
//             </button>
//           </div>
//           {showSortDesc && (
//             <label className="flex items-center gap-2 mt-2">
//               <input
//                 type="checkbox"
//                 checked={sortDesc}
//                 onChange={(e) => setSortDesc(e.target.checked)}
//               />
//               За спаданням
//             </label>
//           )}
//         </div>

//         {/* Дата - показуємо тільки для адміна */}
//         {isAdmin && (
//           <div className="w-full">
//             <div className="flex justify-between items-center">
//               <label className="font-medium">Дата</label>
//               <button
//                 onClick={() => setShowDateFilter(!showDateFilter)}
//                 className="text-gray-500 hover:text-black text-lg"
//               >
//                 ✖
//               </button>
//             </div>
//             {showDateFilter && (
//               <div className="flex flex-col gap-2 mt-2">
//                 <div>
//                   <label className="block">Дата від</label>
//                   <DatePicker
//                     selected={startDate}
//                     onChange={(date) => setStartDate(date)}
//                     dateFormat="dd.MM.yyyy"
//                     className="border px-3 py-2 rounded w-full"
//                     placeholderText="Оберіть дату від"
//                     isClearable
//                   />
//                 </div>
//                 <div>
//                   <label className="block">Дата до</label>
//                   <DatePicker
//                     selected={endDate}
//                     onChange={(date) => setEndDate(date)}
//                     dateFormat="dd.MM.yyyy"
//                     className="border px-3 py-2 rounded w-full"
//                     placeholderText="Оберіть дату до"
//                     isClearable
//                   />
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Кнопки */}
//       <div className="flex flex-col gap-2 w-full">
//         <button
//           onClick={handleApply}
//           className="bg-blue-500 text-white px-4 py-2 rounded w-full"
//         >
//           Застосувати
//         </button>

//         <button
//           onClick={handleReset}
//           className="bg-red-500 text-white px-4 py-2 rounded w-full"
//         >
//           Очистити фільтр
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProductFilter;


import React, { useState, useEffect } from "react";
import { Slider } from "antd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { useGetBrandsQuery } from "../../services/brandApi";
import BrandListWithAlphabet from "../brand/BrandListWithAlphabet";

export interface ProductFilterData {
  Query?: string;
  PriceMin?: number;
  PriceMax?: number;
  MinRating?: number;
  InStock?: boolean;
  SortBy?: string;
  SortDesc?: boolean;

  StartDate?: string; // "dd.MM.yyyy"
  EndDate?: string; // "dd.MM.yyyy"
}

type Props = {
  onChange: (filters: ProductFilterData) => void;
  isAdmin: boolean; // додаємо прапорець для адміна
};

const ProductFilter: React.FC<Props> = ({ onChange, isAdmin }) => {
  const [query, setQuery] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [minRating, setMinRating] = useState("");
  const [inStock, setInStock] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [sortDesc, setSortDesc] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Стани для розгортання фільтрів (крім пошуку і ціни)
  const [showMinRating, setShowMinRating] = useState(false);
  const [showInStock, setShowInStock] = useState(false);
  const [showSortBy, setShowSortBy] = useState(false);
  const [showSortDesc, setShowSortDesc] = useState(false);
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);

  const { data: brands = [], isLoading, isError, error } = useGetBrandsQuery();

  // Автоматичне застосування фільтрів при будь-якій зміні
  useEffect(() => {
    onChange({
      Query: query || undefined,
      PriceMin: priceMin ? Number(priceMin) : undefined,
      PriceMax: priceMax ? Number(priceMax) : undefined,
      MinRating: minRating ? Number(minRating) : undefined,
      InStock: inStock,
      SortBy: sortBy || undefined,
      SortDesc: sortDesc || undefined,
      StartDate: isAdmin && startDate ? format(startDate, "dd.MM.yyyy") : undefined,
      EndDate: isAdmin && endDate ? format(endDate, "dd.MM.yyyy") : undefined,
    });
  }, [
    query,
    priceMin,
    priceMax,
    minRating,
    inStock,
    sortBy,
    sortDesc,
    startDate,
    endDate,
    onChange,
    isAdmin,
  ]);

  const handleReset = () => {
    setQuery("");
    setPriceMin("");
    setPriceMax("");
    setMinRating("");
    setInStock(false);
    setSortBy("");
    setSortDesc(false);
    setSelectedLetter("");
    setStartDate(null);
    setEndDate(null);
    setSelectedBrandId(null);
  };

  const handleBrandSelect = (brand: { name: string; id: number } | null) => {
    if (brand === null) {
      setSelectedBrandId(null);
      setQuery("");
    } else {
      setSelectedBrandId(brand.id);
      setQuery(brand.name);
    }
  };

  const minPriceFromApi = 100;
  const maxPriceFromApi = 10000;

  return (
    <div className="w-full max-w-[1680px] flex flex-col gap-4 px-4 mb-4">
      <div className="flex flex-col gap-4 w-full">
        {/* Бренди */}
        <div className="pt-4">
          {isLoading && <p>Завантаження брендів...</p>}
          {isError && <p>Помилка при завантаженні брендів.</p>}
          {!isLoading && !isError && (
            <BrandListWithAlphabet
              brands={brands}
              selectedLetter={selectedLetter}
              onLetterSelect={setSelectedLetter}
              onBrandSelect={handleBrandSelect}
              selectedBrandId={selectedBrandId}
            />
          )}
        </div>

        {/* Пошук */}
        <input
          type="text"
          placeholder="Пошук..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-3 py-2 rounded w-full"
          style={{ border: "none" }} // Прибрав бордер
        />

        {/* Ціна (слайдер) */}
        {/* Ціна (слайдер) */}
{/* Ціна (слайдер) */}
<div className="w-full">
  <label className="block mb-2 font-medium">Ціна, грн</label>
  <Slider
    range
    min={minPriceFromApi}
    max={maxPriceFromApi}
    step={10}
    value={[Number(priceMin) || minPriceFromApi, Number(priceMax) || maxPriceFromApi]}
    onChange={([min, max]) => {
      setPriceMin(String(min));
      setPriceMax(String(max));
    }}
  />
  <div className="flex justify-between mt-1 gap-4">
    {/* Ліва сторона */}
    <div className="flex flex-col items-center w-1/2">
      <span className="text-xs font-medium mb-1">Від</span>
      <div className="border rounded px-2 py-1 text-center text-sm w-16">
        {priceMin || minPriceFromApi} грн
      </div>
    </div>

    {/* Права сторона */}
    <div className="flex flex-col items-center w-1/2">
      <span className="text-xs font-medium mb-1">До</span>
      <div className="border rounded px-2 py-1 text-center text-sm w-16">
        {priceMax || maxPriceFromApi} грн
      </div>
    </div>
  </div>
</div>



        {/* Мінімальний рейтинг */}
        <div className="flex items-center justify-between">
          <span className="font-medium">Мін. рейтинг</span>
          <button
            onClick={() => setShowMinRating((prev) => !prev)}
            className="text-xl font-bold px-2"
            aria-label="Toggle MinRating input"
          >
            ×
          </button>
        </div>
        {showMinRating && (
          <input
            type="number"
            placeholder="Мін. рейтинг"
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            className="px-3 py-2 rounded w-full"
            min={0}
            max={5}
            step={0.1}
            style={{ border: "none" }}
          />
        )}

        {/* В наявності */}
        <div className="flex items-center justify-between">
          <span className="font-medium">В наявності</span>
          <button
            onClick={() => setShowInStock((prev) => !prev)}
            className="text-xl font-bold px-2"
            aria-label="Toggle InStock input"
          >
            ×
          </button>
        </div>
        {showInStock && (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
            />
            Так
          </label>
        )}

        {/* Сортування */}
        <div className="flex items-center justify-between">
          <span className="font-medium">Сортування</span>
          <button
            onClick={() => setShowSortBy((prev) => !prev)}
            className="text-xl font-bold px-2"
            aria-label="Toggle SortBy select"
          >
            ×
          </button>
        </div>
        {showSortBy && (
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded w-full"
            style={{ border: "none" }}
          >
            <option value="">Сортування</option>
            <option value="Price">Ціна</option>
            <option value="Rating">Рейтинг</option>
            <option value="CreatedAt">Дата створення</option>
          </select>
        )}

        {/* За спаданням */}
        <div className="flex items-center justify-between">
          <span className="font-medium">За спаданням</span>
          <button
            onClick={() => setShowSortDesc((prev) => !prev)}
            className="text-xl font-bold px-2"
            aria-label="Toggle SortDesc checkbox"
          >
            ×
          </button>
        </div>
        {showSortDesc && (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={sortDesc}
              onChange={(e) => setSortDesc(e.target.checked)}
            />
            Так
          </label>
        )}

        {/* Дата від (тільки для адміна) */}
        {isAdmin && (
          <>
            <div className="flex items-center justify-between mt-4">
              <span className="font-medium">Дата від</span>
              <button
                onClick={() => setShowStartDate((prev) => !prev)}
                className="text-xl font-bold px-2"
                aria-label="Toggle StartDate picker"
              >
                ×
              </button>
            </div>
            {showStartDate && (
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="dd.MM.yyyy"
                className="px-3 py-2 rounded w-full"
                placeholderText="Оберіть дату від"
                isClearable
                style={{ border: "none" }}
              />
            )}

            {/* Дата до */}
            <div className="flex items-center justify-between mt-4">
              <span className="font-medium">Дата до</span>
              <button
                onClick={() => setShowEndDate((prev) => !prev)}
                className="text-xl font-bold px-2"
                aria-label="Toggle EndDate picker"
              >
                ×
              </button>
            </div>
            {showEndDate && (
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="dd.MM.yyyy"
                className="px-3 py-2 rounded w-full"
                placeholderText="Оберіть дату до"
                isClearable
                style={{ border: "none" }}
              />
            )}
          </>
        )}
      </div>

      {/* Кнопка Очистити */}
      <div className="flex flex-col gap-2 w-full mt-4">
        <button
          onClick={handleReset}
          className="bg-red-500 text-white px-4 py-2 rounded w-full"
        >
          Очистити фільтр
        </button>
      </div>
    </div>
  );
};

export default ProductFilter;
