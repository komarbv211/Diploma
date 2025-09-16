import React, { useState, useEffect } from "react";
import { Slider } from "antd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { useGetBrandsQuery } from "../../services/brandApi";
import BrandListWithAlphabet from "../brand/BrandListWithAlphabet";
import ToggleIconButton from "../ui/ToggleIconButton";

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
  BrandIds?: number[];
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
  const [selectedBrandIds, setSelectedBrandIds] = useState<number[]>([]);

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

  useEffect(() => {
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
      EndDate:
        isAdmin && endDate ? format(endDate, "dd.MM.yyyy") : undefined,
      BrandIds:
        selectedBrandIds.length > 0 ? selectedBrandIds : undefined,
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
    setSelectedBrandIds([]);

    setShowMinRating(false);
    setShowInStock(false);
    setShowSortBy(false);
    setShowSortDesc(false);
    setShowDateRange(false);
  };

  const handleBrandSelect = (selectedBrands: { id: number }[]) => {
    const ids = selectedBrands.map((b) => b.id);
    setSelectedBrandIds(ids);
  };

  const minPriceFromApi = 100;
  const maxPriceFromApi = 10000;

  return (
    <div
      className="relative w-full flex flex-col gap-4 px-4 mb-4"
      style={{ width: 308, maxWidth: "100%" }}
    >
      {/* Бренди */}
      <div>
        {isLoading && <p>Завантаження брендів...</p>}
        {isError && <p>Помилка при завантаженні брендів.</p>}
        {!isLoading && !isError && (
          <BrandListWithAlphabet
            brands={brands}
            selectedLetter={selectedLetter}
            onLetterSelect={setSelectedLetter}
            onBrandSelect={handleBrandSelect}
            selectedBrandIds={selectedBrandIds}
          />
        )}
      </div>

      {/* Мін. рейтинг */}
      <div className="flex items-center justify-between">
        <span className="form-label">Мін. рейтинг</span>
        <ToggleIconButton
          isOpen={showMinRating}
          onClick={() => setShowMinRating((prev) => !prev)}
        />
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
        <ToggleIconButton
          isOpen={showInStock}
          onClick={() => setShowInStock((prev) => !prev)}
        />
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
        <ToggleIconButton
          isOpen={showSortBy}
          onClick={() => setShowSortBy((prev) => !prev)}
        />
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
        <ToggleIconButton
          isOpen={showSortDesc}
          onClick={() => setShowSortDesc((prev) => !prev)}
        />
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
            <ToggleIconButton
              isOpen={showDateRange}
              onClick={() => setShowDateRange((prev) => !prev)}
            />
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

      {/* Кнопка очистки */}
      <button
        onClick={handleReset}
        className="text-pink hover:underline hover:text-pink2 text-sm self-start mt-4"
      >
        Очистити фільтр
      </button>
    </div>
  );
};

export default ProductFilter;
