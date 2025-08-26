import React, { useMemo, useState } from "react";

type Brand = {
  name: string;
  id: number;
};

type Props = {
  brands: Brand[];
  onBrandSelect?: (brand: Brand) => void;
  selectedLetter?: string;
  onLetterSelect?: (letter: string) => void;
};

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const BrandListWithAlphabet: React.FC<Props> = ({
  brands,
  onBrandSelect,
  selectedLetter = "",
  onLetterSelect,
}) => {
  const [alphabetVisible, setAlphabetVisible] = useState(true);

  // Групування брендів по першій літері
  const groupedBrands = useMemo(() => {
    const groups: { [key: string]: Brand[] } = {};
    for (let brand of brands) {
      const firstLetter = brand.name[0].toUpperCase();
      if (!groups[firstLetter]) groups[firstLetter] = [];
      groups[firstLetter].push(brand);
    }
    return groups;
  }, [brands]);

  return (
    <div className="p-4">
      {/* Абетка з кнопкою "✕" */}
      <div className="flex justify-between items-center mb-4">
        {alphabetVisible && (
          <div className="flex flex-wrap gap-2 text-sm">
            {/* Кнопка "Всі" */}
            <button
              onClick={() => onLetterSelect?.("")}
              className={`px-3 py-1 rounded border ${
                selectedLetter === ""
                  ? "bg-blue-500 text-white"
                  : "bg-white text-black"
              }`}
            >
              Всі
            </button>

            {alphabet.map((letter) => (
              <button
                key={letter}
                onClick={() => onLetterSelect?.(letter)}
                className={`px-3 py-1 rounded border ${
                  selectedLetter === letter
                    ? "bg-blue-500 text-white"
                    : "bg-white text-black"
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        )}

        {/* Кнопка приховати/показати абетку */}
        <button
          onClick={() => setAlphabetVisible(!alphabetVisible)}
          className="ml-4 p-1 rounded hover:bg-gray-200"
          aria-label={alphabetVisible ? "Приховати абетку" : "Показати абетку"}
        >
          ✕
        </button>
      </div>

      {/* Список брендів зі скролом */}
      <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto border rounded p-2">
        {(selectedLetter ? groupedBrands[selectedLetter] || [] : brands).map(
          (brand) => (
            <div
              key={brand.id}
              onClick={() => onBrandSelect?.(brand)}
              className="cursor-pointer hover:underline"
            >
              {brand.name}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default BrandListWithAlphabet;
