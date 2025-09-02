import React, { useMemo, useState } from "react";

type Brand = {
  name: string;
  id: number;
};

type Props = {
  brands: Brand[];
  selectedBrandId?: number | null;
  onBrandSelect?: (brand: Brand | null) => void;
  selectedLetter?: string;
  onLetterSelect?: (letter: string) => void;
};

const alphabet = Array.from(
  new Set(
    "A B C D E F G H I J K L M N O P R S T U V W X Y Z _ A E O".split(" ")
  )
);

const BrandListWithAlphabet: React.FC<Props> = ({
  brands,
  selectedBrandId,
  onBrandSelect,
  selectedLetter = "",
  onLetterSelect,
}) => {
  const [localLetter, setLocalLetter] = useState(selectedLetter);
  const [showAlphabet, setShowAlphabet] = useState(true);

  const groupedBrands = useMemo(() => {
    const groups: { [key: string]: Brand[] } = {};
    for (const brand of brands) {
      const firstLetter = brand.name[0].toUpperCase();
      if (!groups[firstLetter]) groups[firstLetter] = [];
      groups[firstLetter].push(brand);
    }
    return groups;
  }, [brands]);

  const filteredBrands = localLetter
    ? groupedBrands[localLetter.toUpperCase()] || []
    : brands;

  const handleCheckboxChange = (brand: Brand) => {
    onBrandSelect?.(selectedBrandId === brand.id ? null : brand);
  };

  const handleLetterClick = (letter: string) => {
    setLocalLetter(letter);
    onLetterSelect?.(letter);
  };

  // Розбиваємо абетку на два рядки динамічно
  const half = Math.ceil(alphabet.length / 2);
  const firstRow = alphabet.slice(0, half);
  const secondRow = alphabet.slice(half);

  const renderLetterButton = (letter: string) => (
    <button
      key={letter}
      onClick={() => handleLetterClick(letter)}
      className={`w-[16px] h-[24px] rounded text-[20px] font-medium font-manrope leading-normal ${
        localLetter === letter
          ? "bg-blue-200 text-black"
          : "bg-transparent text-gray-600"
      }`}
    >
      {letter}
    </button>
  );

  return (
    <div
      className="p-4 flex flex-col items-start gap-3"
      style={{ width: 308, height: 361 }}
    >
      {/* Заголовок + кнопка */}
      <div className="flex justify-between items-center w-full mb-2">
        <h2
          className="text-black font-medium"
          style={{
            fontFamily: "Manrope, sans-serif",
            fontSize: 24,
            fontWeight: 500,
            lineHeight: "normal",
            width: 73,
            height: 33,
          }}
        >
          Бренди
        </h2>

        <button
          onClick={() => setShowAlphabet((prev) => !prev)}
          className="text-xl text-gray-500 hover:text-black"
          aria-label="Перемкнути абетку"
        >
          {showAlphabet ? "✕" : "─"}
        </button>
      </div>

      {/* Абетка */}
      {showAlphabet && (
        <div
          className="flex flex-col gap-[6px]"
          style={{ width: "262px", height: "54px" }}
        >
          <div className="flex gap-[2px]">
            {firstRow.map(renderLetterButton)}
          </div>
          <div className="flex gap-[2px]">
            {secondRow.map(renderLetterButton)}
          </div>
        </div>
      )}

      {/* Список брендів */}
      <div className="flex flex-col gap-[12px] max-h-[200px] overflow-y-auto rounded p-2">
        {filteredBrands.map((brand) => (
          <label
            key={brand.id}
            className="flex items-center gap-2 cursor-pointer"
            style={{ height: "27px" }}
          >
            <input
              type="checkbox"
              checked={selectedBrandId === brand.id}
              onChange={() => handleCheckboxChange(brand)}
            />
            <span className="text-[#000] text-[20px] font-[400] font-manrope leading-[normal]">
              {brand.name}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default BrandListWithAlphabet;
