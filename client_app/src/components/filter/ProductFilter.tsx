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
  StartDate?: string;
  EndDate?: string;
  BrandIds?: number[]; // 🔥 Додано: масив ID брендів
}

type Props = {
  onChange: (filters: ProductFilterData) => void;
  isAdmin: boolean;
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
  const [selectedBrandIds, setSelectedBrandIds] = useState<number[]>([]); // 🔥

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [startDate, endDate] = dateRange;

  const [showMinRating, setShowMinRating] = useState(false);
  const [showInStock, setShowInStock] = useState(false);
  const [showSortBy, setShowSortBy] = useState(false);
  const [showSortDesc, setShowSortDesc] = useState(false);
  const [showDateRange, setShowDateRange] = useState(false);

  const { data: brands = [], isLoading, isError } = useGetBrandsQuery();

  // 🧠 Застосування фільтра при зміні
  useEffect(() => {
    console.log("✅ Обрані бренди (BrandIds):", selectedBrandIds);

    onChange({
      Query: query || undefined,
      PriceMin: priceMin ? Number(priceMin) : undefined,
      PriceMax: priceMax ? Number(priceMax) : undefined,
      MinRating: minRating ? Number(minRating) : undefined,
      InStock: inStock,
      SortBy: sortBy || undefined,
      SortDesc: sortDesc || undefined,
      StartDate:
        isAdmin && startDate ? format(startDate, "dd.MM.yyyy") : undefined,
      EndDate: isAdmin && endDate ? format(endDate, "dd.MM.yyyy") : undefined,
      //BrandIds: [2,4],
      BrandIds: selectedBrandIds.length > 0 ? selectedBrandIds : undefined, // 🔥
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
    selectedBrandIds,
    onChange,
    isAdmin,
  ]);

  // 🔁 Скидання всіх фільтрів
  const handleReset = () => {
    setQuery("");
    setPriceMin("");
    setPriceMax("");
    setMinRating("");
    setInStock(false);
    setSortBy("");
    setSortDesc(false);
    setSelectedLetter("");
    setDateRange([null, null]);
    setSelectedBrandIds([]); // 🔥 Скидання брендів
  };

  // ✅ Обробник вибору брендів (дозволяє кілька)
  const handleBrandSelect = (selectedBrands: { id: number }[]) => {
    const ids = selectedBrands.map((b) => b.id);
    setSelectedBrandIds(ids);
  };

  // const handleBrandSelect = (brand: { id: number } | null) => {
  //   if (!brand) return;
  //   setSelectedBrandIds((prev) =>
  //       prev.includes(brand.id) ? prev.filter((id) => id !== brand.id) : [...prev, brand.id]
  //   );
  // };

  const minPriceFromApi = 100;
  const maxPriceFromApi = 10000;

  return (
    <div className="w-full max-w-[1680px] flex flex-col gap-4 px-4 mb-4">
      {/* Бренди */}
      <div className="pt-4">
        {isLoading && <p>Завантаження брендів...</p>}
        {isError && <p>Помилка при завантаженні брендів.</p>}
        {!isLoading && !isError && (
          <BrandListWithAlphabet
            brands={brands}
            selectedLetter={selectedLetter}
            onLetterSelect={setSelectedLetter}
            // onBrandSelect={handleBrandSelect}
            // selectedBrandId={null} // ⚠️ Не використовується в мультивиборі
            // selectedBrandIds={selectedBrandIds} // 🔥 Передаємо масив
            onBrandSelect={handleBrandSelect}
            selectedBrandIds={selectedBrandIds}
          />
        )}
      </div>

      {/* Мін. рейтинг */}
      <div className="flex items-center justify-between">
        <span className="form-label">Мін. рейтинг</span>
        <button
          onClick={() => setShowMinRating((prev) => !prev)}
          className="text-xl font-bold px-2"
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
        <span className="form-label">В наявності</span>
        <button
          onClick={() => setShowInStock((prev) => !prev)}
          className="text-xl font-bold px-2"
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
        <span className="form-label">Сортування</span>
        <button
          onClick={() => setShowSortBy((prev) => !prev)}
          className="text-xl font-bold px-2"
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
        <span className="form-label">За спаданням</span>
        <button
          onClick={() => setShowSortDesc((prev) => !prev)}
          className="text-xl font-bold px-2"
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

      {/* Діапазон дат */}
      {isAdmin && (
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex items-center justify-between">
            <label className="form-label">Діапазон дат (від / до)</label>
            <button
              onClick={() => setShowDateRange((prev) => !prev)}
              className="text-xl font-bold px-2"
            >
              ×
            </button>
          </div>
          {showDateRange && (
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={(update: [Date | null, Date | null]) =>
                setDateRange(update)
              }
              isClearable
              dateFormat="dd.MM.yyyy"
              placeholderText="Оберіть діапазон"
              className="px-3 py-2 rounded w-full"
            />
          )}
        </div>
      )}

      {/* Ціна */}
      <div className="w-full">
        <label className="block mb-2 form-label">Вартість</label>
        <Slider
          range
          min={minPriceFromApi}
          max={maxPriceFromApi}
          step={10}
          value={[
            Number(priceMin) || minPriceFromApi,
            Number(priceMax) || maxPriceFromApi,
          ]}
          onChange={([min, max]) => {
            setPriceMin(String(min));
            setPriceMax(String(max));
          }}
        />
        <div className="flex flex-wrap gap-x-4 mt-2">
          <div className="flex items-center gap-2">
            <span>Від:</span>
            <span>{priceMin || minPriceFromApi}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>До:</span>
            <span>{priceMax || maxPriceFromApi}</span>
          </div>
        </div>
      </div>

      {/* 🔘 Кнопка очистки */}
      <button
        onClick={handleReset}
        className="text-blue-600 hover:underline text-sm self-start mt-4"
      >
        Очистити фільтр
      </button>
    </div>
  );
};

export default ProductFilter;
