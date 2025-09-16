import React, { useMemo, useState } from "react";
import ToggleIconButton from "../ui/ToggleIconButton"; // Шлях до вашого компонента
import { Checkbox, Tooltip } from "antd";
type Brand = {
  name: string;
  id: number;
};

type Props = {
  brands: Brand[];
  selectedBrandIds?: number[];
  onBrandSelect?: (selectedBrands: Brand[]) => void;
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
                                                  selectedBrandIds = [],
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
    let newSelectedBrands: Brand[];

    if (selectedBrandIds.includes(brand.id)) {
      // Видаляємо бренд з вибраних
      newSelectedBrands = brands.filter(
          (b) => selectedBrandIds.includes(b.id) && b.id !== brand.id
      );
    } else {
      // Додаємо бренд
      newSelectedBrands = brands.filter((b) => selectedBrandIds.includes(b.id));
      newSelectedBrands.push(brand);
    }

    onBrandSelect?.(newSelectedBrands);
  };

  const handleLetterClick = (letter: string) => {
    setLocalLetter(letter);
    onLetterSelect?.(letter);
  };

  // Розбивка алфавіту на два рядки
  const half = Math.ceil(alphabet.length / 2);
  const firstRow = alphabet.slice(0, half);
  const secondRow = alphabet.slice(half);

  const renderLetterButton = (letter: string) => (
      <button
          key={letter}
          onClick={() => handleLetterClick(letter)}
          className={`center-xl:w-[16px] text-[18px] center-xl:h-[24px] rounded center-xl:text-[20px] font-medium font-manrope leading-normal ${
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

      className="flex flex-col items-start gap-3 overflow-x-hidden "
  style={{
    width: '100%',
    maxWidth: '308px',
    height: 'auto',
    maxHeight: 'calc(100vh - 20px)',
    overflowY: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
  }}
      >
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
          <ToggleIconButton
            isOpen={showAlphabet}
            onClick={() => setShowAlphabet((prev) => !prev)}
            className="text-xl text-gray-500 hover:text-black"
            aria-label="Перемкнути абетку"
          />
        </div>
        {showAlphabet && (
            <div
                className="flex flex-col gap-[6px]"
                style={{ width: "262px", height: "54px" }}
            >
              <div className="flex gap-[2px]">{firstRow.map(renderLetterButton)}</div>
              <div className="flex gap-[2px]">{secondRow.map(renderLetterButton)}</div>
            </div>
        )}

      <div className="flex flex-col gap-[12px] max-h-[200px] w-[94%] overflow-y-auto overflow-x-hidden  rounded pr-4 ">
        {filteredBrands.map((brand) => (
          <Checkbox
            key={brand.id}
            checked={selectedBrandIds.includes(brand.id)}
            onChange={() => handleCheckboxChange(brand)}
            className="text-[#000] text-[20px] font-[400] font-manrope"
            style={{ height: "27px" }}
          >
            <Tooltip title={brand.name} placement="topLeft">
              <span
                className="block truncate max-w-[200px]"
              >
                {brand.name}
              </span>
            </Tooltip>
          </Checkbox>
        ))}
      </div>
    </div>
  );
};

export default BrandListWithAlphabet;
