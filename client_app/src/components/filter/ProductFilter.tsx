// import React, { useState } from "react";

// export interface ProductFilterData {
//   Query?: string;
//   PriceMin?: number;
//   PriceMax?: number;
//   MinRating?: number;
//   InStock?: boolean;
//   SortBy?: string;
//   SortDesc?: boolean;
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

//   const handleApply = () => {
//     onChange({
//       Query: query || undefined,
//       PriceMin: priceMin ? Number(priceMin) : undefined,
//       PriceMax: priceMax ? Number(priceMax) : undefined,
//       MinRating: minRating ? Number(minRating) : undefined,
//       InStock: inStock,
//       SortBy: sortBy || undefined,
//       SortDesc: sortDesc || undefined,
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

//     onChange({});
//   };

//   return (
//     <div className="w-full max-w-[1680px] flex flex-wrap gap-4 justify-between items-end px-4 mb-4">
//       <div className="flex flex-wrap gap-3">
//         <input
//           type="text"
//           placeholder="Пошук..."
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           className="border px-3 py-2 rounded"
//         />

//         <input
//           type="number"
//           placeholder="Ціна від"
//           value={priceMin}
//           onChange={(e) => setPriceMin(e.target.value)}
//           className="border px-3 py-2 rounded w-[100px]"
//         />

//         <input
//           type="number"
//           placeholder="Ціна до"
//           value={priceMax}
//           onChange={(e) => setPriceMax(e.target.value)}
//           className="border px-3 py-2 rounded w-[100px]"
//         />

//         <input
//           type="number"
//           placeholder="Мін. рейтинг"
//           value={minRating}
//           onChange={(e) => setMinRating(e.target.value)}
//           className="border px-3 py-2 rounded w-[120px]"
//           min={0}
//           max={5}
//           step={0.1}
//         />

//         <label className="flex items-center gap-2">
//           <input
//             type="checkbox"
//             checked={inStock}
//             onChange={(e) => setInStock(e.target.checked)}
//           />
//           В наявності
//         </label>

//         <select
//           value={sortBy}
//           onChange={(e) => setSortBy(e.target.value)}
//           className="border px-3 py-2 rounded"
//         >
//           <option value="">Сортування</option>
//           <option value="Price">Ціна</option>
//           <option value="Rating">Рейтинг</option>
//           <option value="CreatedAt">Нові</option>
//         </select>

//         <label className="flex items-center gap-2">
//           <input
//             type="checkbox"
//             checked={sortDesc}
//             onChange={(e) => setSortDesc(e.target.checked)}
//           />
//           За спаданням
//         </label>
//       </div>

//       <div className="flex gap-2">
//         <button
//           onClick={handleApply}
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           Застосувати
//         </button>
//         <button
//           onClick={handleReset}
//           className="bg-gray-400 text-white px-4 py-2 rounded"
//         >
//           Скинути
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProductFilter;




import React, { useState } from "react";
import { Slider } from 'antd';
import { useGetBrandsQuery } from "../../services/brandApi";
import BrandListWithAlphabet from "../brand/BrandListWithAlphabet"; // ⚠️ шлях може змінюватись

export interface ProductFilterData {
  Query?: string;
  PriceMin?: number;
  PriceMax?: number;
  MinRating?: number;
  InStock?: boolean;
  SortBy?: string;
  SortDesc?: boolean;
}

type Props = {
  onChange: (filters: ProductFilterData) => void;
};

const ProductFilter: React.FC<Props> = ({ onChange }) => {
  const [query, setQuery] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [minRating, setMinRating] = useState("");
  const [inStock, setInStock] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [sortDesc, setSortDesc] = useState(false);

  const { data: brands = [], isLoading, isError, error  } = useGetBrandsQuery();
//  const { data: brands = [], isLoading, isError, error } = useGetBrandsQuery();

  console.log("Помилка брендів:", error); // ← ВСТАВ СЮДИ
  const handleApply = () => {
    onChange({
      Query: query || undefined,
      PriceMin: priceMin ? Number(priceMin) : undefined,
      PriceMax: priceMax ? Number(priceMax) : undefined,
      MinRating: minRating ? Number(minRating) : undefined,
      InStock: inStock,
      SortBy: sortBy || undefined,
      SortDesc: sortDesc || undefined,
    });
  };

  const handleReset = () => {
    setQuery("");
    setPriceMin("");
    setPriceMax("");
    setMinRating("");
    setInStock(false);
    setSortBy("");
    setSortDesc(false);
    onChange({});
  };

  const handleBrandSelect = (brand: { name: string }) => {
    setQuery(brand.name);
    onChange({
      Query: brand.name,
      PriceMin: priceMin ? Number(priceMin) : undefined,
      PriceMax: priceMax ? Number(priceMax) : undefined,
      MinRating: minRating ? Number(minRating) : undefined,
      InStock: inStock,
      SortBy: sortBy || undefined,
      SortDesc: sortDesc || undefined,
    });
  };
  const minPriceFromApi = 100;
const maxPriceFromApi = 10000;

  return (


    <div className="w-full max-w-[1680px] flex flex-col gap-4 px-4 mb-4">
      <div className="flex flex-wrap gap-3 justify-between items-end">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Пошук..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border px-3 py-2 rounded"
          />

          {/* <input
            type="number"
            placeholder="Ціна від"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="border px-3 py-2 rounded w-[100px]"
          />

          <input
            type="number"
            placeholder="Ціна до"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="border px-3 py-2 rounded w-[100px]"
          /> */}

          <div className="w-[300px]">
  <label className="block mb-2 font-medium">Ціна, грн</label>
  <Slider
    range
    min={minPriceFromApi}
  max={maxPriceFromApi}
    step={10}
    value={[Number(priceMin) || 0, Number(priceMax) || 10000]}
    onChange={([min, max]) => {
      setPriceMin(String(min));
      setPriceMax(String(max));
    }}
  />
  <div className="flex justify-between text-sm text-gray-600 mt-1">
    <span>{priceMin || 0} грн</span>
    <span>{priceMax || 10000} грн</span>
  </div>
</div>


          <input
            type="number"
            placeholder="Мін. рейтинг"
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            className="border px-3 py-2 rounded w-[120px]"
            min={0}
            max={5}
            step={0.1}
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
            />
            В наявності
          </label>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="">Сортування</option>
            <option value="Price">Ціна</option>
            <option value="Rating">Рейтинг</option>
            <option value="CreatedAt">Нові</option>
          </select>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={sortDesc}
              onChange={(e) => setSortDesc(e.target.checked)}
            />
            За спаданням
          </label>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleApply}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Застосувати
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Скинути
          </button>
        </div>
      </div>

      {/* 👉 Компонент з абеткою та брендами */}
      <div className="border-t pt-4">
        {isLoading && <p>Завантаження брендів...</p>}
        {isError && <p>Помилка при завантаженні брендів.</p>}
        {!isLoading && !isError && (
          <BrandListWithAlphabet
            brands={brands}
            onBrandSelect={handleBrandSelect}
          />
        )}
      </div>
    </div>
  );
};

export default ProductFilter;
