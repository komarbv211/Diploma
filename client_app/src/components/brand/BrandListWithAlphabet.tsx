import React, { useState, useMemo } from "react";

type Brand = {
  name: string;
  id: number;
};

type Props = {
  brands: Brand[];
  onBrandSelect?: (brand: Brand) => void;
};

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");


console.log(alphabet);
const BrandListWithAlphabet: React.FC<Props> = ({ brands, onBrandSelect }) => {
      console.log("BrandListWithAlphabet rendered"); // <-- сюди
  const [selectedLetter, setSelectedLetter] = useState<string>("");

  // Групуємо бренди за першою літерою
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
      {/* Абетка */}
      <div className="flex flex-wrap gap-2 mb-4">
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => setSelectedLetter(letter)}
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

      {/* Список брендів */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {(selectedLetter
          ? groupedBrands[selectedLetter] || []
          : brands
        ).map((brand) => (
          <div
            key={brand.id}
            onClick={() => onBrandSelect?.(brand)}
            className="cursor-pointer hover:underline"
          >
            {brand.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandListWithAlphabet;
