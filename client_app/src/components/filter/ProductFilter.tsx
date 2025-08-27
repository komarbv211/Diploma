import React, { useState } from "react";
import { Slider } from 'antd';
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
  EndDate?: string;   // "dd.MM.yyyy"
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
  const [selectedLetter, setSelectedLetter] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);


  const { data: brands = [], isLoading, isError, error } = useGetBrandsQuery();
  console.log("Помилка брендів:", error);

  const handleApply = () => {
    onChange({
      Query: query || undefined,
      PriceMin: priceMin ? Number(priceMin) : undefined,
      PriceMax: priceMax ? Number(priceMax) : undefined,
      MinRating: minRating ? Number(minRating) : undefined,
      InStock: inStock,
      SortBy: sortBy || undefined,
      SortDesc: sortDesc || undefined,
      StartDate: startDate ? format(startDate, "dd.MM.yyyy") : undefined,
      EndDate: endDate ? format(endDate, "dd.MM.yyyy") : undefined,
    });
  };

  const handleReset = () => {
    // setQuery("");
    // setPriceMin("");
    // setPriceMax("");
    // setMinRating("");
    // setInStock(false);
    // setSortBy("");
    // setSortDesc(false);
    // onChange({});
    // setSelectedLetter("");
    // setStartDate(null);
    // setEndDate(null);


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

    // Очистити фільтри
    onChange({});

    // Оновити сторінку (опціонально)
    window.location.reload();
  };

  // const handleBrandSelect = (brand: { name: string }) => {
  //   setQuery(brand.name);
  //   onChange({
  //     Query: brand.name,
  //     PriceMin: priceMin ? Number(priceMin) : undefined,
  //     PriceMax: priceMax ? Number(priceMax) : undefined,
  //     MinRating: minRating ? Number(minRating) : undefined,
  //     InStock: inStock,
  //     SortBy: sortBy || undefined,
  //     SortDesc: sortDesc || undefined,
  //   });
  // };

  const handleBrandSelect = (brand: { name: string; id: number } | null) => {
    if (brand === null) {
      setSelectedBrandId(null);
      setQuery("");
      onChange({}); // скинути фільтр бренду
    } else {
      setSelectedBrandId(brand.id);
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
    }
  };


  const minPriceFromApi = 100;
  const maxPriceFromApi = 10000;

  return (
    <div className="w-full max-w-[1680px] flex flex-col gap-4 px-4 mb-4">
      <div className="flex flex-col gap-4 w-full">

        {/* 👉 Компонент з брендами */}
      <div className="border-t pt-4">
        {isLoading && <p>Завантаження брендів...</p>}
        {isError && <p>Помилка при завантаженні брендів.</p>}
        {!isLoading && !isError && (
  //          <BrandListWithAlphabet
  //   brands={brands}
  //   selectedLetter={selectedLetter}
  //   onLetterSelect={setSelectedLetter}
  //   onBrandSelect={handleBrandSelect}
  // />

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
          className="border px-3 py-2 rounded w-full"
        />

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
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>{priceMin || minPriceFromApi} грн</span>
            <span>{priceMax || maxPriceFromApi} грн</span>
          </div>
        </div>


        <div className="flex flex-col gap-2">
          <label className="font-medium">Дата від</label>
          <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd.MM.yyyy"
              className="border px-3 py-2 rounded w-full"
              placeholderText="Оберіть дату від"
              isClearable
          />

          <label className="font-medium mt-2">Дата до</label>
          <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="dd.MM.yyyy"
              className="border px-3 py-2 rounded w-full"
              placeholderText="Оберіть дату до"
              isClearable
          />
        </div>


        {/* Мін. рейтинг */}
        <input
          type="number"
          placeholder="Мін. рейтинг"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          className="border px-3 py-2 rounded w-full"
          min={0}
          max={5}
          step={0.1}
        />

        {/* В наявності */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
          />
          В наявності
        </label>

        {/* Сортування */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        >
          <option value="">Сортування</option>
          <option value="Price">Ціна</option>
          <option value="Rating">Рейтинг</option>
          <option value="CreatedAt">Дата створення</option>
        </select>

        {/* За спаданням */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={sortDesc}
            onChange={(e) => setSortDesc(e.target.checked)}
          />
          За спаданням
        </label>

      </div>
      {/* Кнопки */}
      <div className="flex flex-col gap-2 w-full">
        <button
            onClick={handleApply}
            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          Застосувати
        </button>

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

