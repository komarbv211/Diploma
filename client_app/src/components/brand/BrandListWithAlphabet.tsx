// import React, { useMemo, useState } from "react";
// import ToggleIconButton from "../ui/ToggleIconButton"; // Шлях до вашого компонента
// // import MajesticonsPlusLine from "../icons/toasts/MajesticonsPlusLine"; // Шлях до вашої іконки


// type Brand = {
//   name: string;
//   id: number;
// };

// type Props = {
//   brands: Brand[];
//   selectedBrandIds?: number[];
//   onBrandSelect?: (selectedBrands: Brand[]) => void;
//   selectedLetter?: string;
//   onLetterSelect?: (letter: string) => void;
// };

// const alphabet = Array.from(
//     new Set(
//         "A B C D E F G H I J K L M N O P R S T U V W X Y Z _ A E O".split(" ")
//     )
// );

// const BrandListWithAlphabet: React.FC<Props> = ({
//                                                   brands,
//                                                   selectedBrandIds = [],
//                                                   onBrandSelect,
//                                                   selectedLetter = "",
//                                                   onLetterSelect,
//                                                 }) => {
//   const [localLetter, setLocalLetter] = useState(selectedLetter);
//   const [showAlphabet, setShowAlphabet] = useState(true);

//   const groupedBrands = useMemo(() => {
//     const groups: { [key: string]: Brand[] } = {};
//     for (const brand of brands) {
//       const firstLetter = brand.name[0].toUpperCase();
//       if (!groups[firstLetter]) groups[firstLetter] = [];
//       groups[firstLetter].push(brand);
//     }
//     return groups;
//   }, [brands]);

//   const filteredBrands = localLetter
//       ? groupedBrands[localLetter.toUpperCase()] || []
//       : brands;

//   const handleCheckboxChange = (brand: Brand) => {
//     let newSelectedBrands: Brand[];

//     if (selectedBrandIds.includes(brand.id)) {
//       // Видаляємо бренд з вибраних
//       newSelectedBrands = brands.filter(
//           (b) => selectedBrandIds.includes(b.id) && b.id !== brand.id
//       );
//     } else {
//       // Додаємо бренд
//       newSelectedBrands = brands.filter((b) => selectedBrandIds.includes(b.id));
//       newSelectedBrands.push(brand);
//     }

//     onBrandSelect?.(newSelectedBrands);
//   };

//   const handleLetterClick = (letter: string) => {
//     setLocalLetter(letter);
//     onLetterSelect?.(letter);
//   };

//   // Розбивка алфавіту на два рядки
//   const half = Math.ceil(alphabet.length / 2);
//   const firstRow = alphabet.slice(0, half);
//   const secondRow = alphabet.slice(half);

//   const renderLetterButton = (letter: string) => (
//       <button
//           key={letter}
//           onClick={() => handleLetterClick(letter)}
//           className={`w-[16px] h-[24px] rounded text-[20px] font-medium font-manrope leading-normal ${
//               localLetter === letter
//                   ? "bg-blue-200 text-black"
//                   : "bg-transparent text-gray-600"
//           }`}
//       >
//         {letter}
//       </button>
//   );

//   return (
//       <div

//       className="flex flex-col items-start gap-3"
//   style={{
//     width: '100%',
//     maxWidth: '308px',
//     height: 'auto',
//     maxHeight: 'calc(100vh - 20px)',
//     overflowY: 'auto',
//     marginLeft: 'auto',
//     marginRight: 'auto',
//   }}
//           // className="p-4 flex flex-col items-start gap-3"
//           // style={{ width: 308, height: 361 }}
//       >
//         <div className="flex justify-between items-center w-full mb-2">
//           <h2
//               className="text-black font-medium"
//               style={{
//                 fontFamily: "Manrope, sans-serif",
//                 fontSize: 24,
//                 fontWeight: 500,
//                 lineHeight: "normal",
//                 width: 73,
//                 height: 33,
//               }}
//           >
//             Бренди
//           </h2>

//           {/* <button
//               onClick={() => setShowAlphabet((prev) => !prev)}
//               className="text-xl text-gray-500 hover:text-black"
//               aria-label="Перемкнути абетку"
//           >
//             {showAlphabet ? "✕" : "─"}
//           </button> */}
          

//           <ToggleIconButton
//   isOpen={showAlphabet}
//   onClick={() => setShowAlphabet((prev) => !prev)}
//   className="text-xl text-gray-500 hover:text-black"
//   aria-label="Перемкнути абетку"
// />

//         </div>

//         {showAlphabet && (
//             <div
//                 className="flex flex-col gap-[6px]"
//                 style={{ width: "262px", height: "54px" }}
//             >
//               <div className="flex gap-[2px]">{firstRow.map(renderLetterButton)}</div>
//               <div className="flex gap-[2px]">{secondRow.map(renderLetterButton)}</div>
//             </div>
//         )}

//         <div className="flex flex-col gap-[12px] max-h-[200px] overflow-y-auto rounded p-2">
//           {filteredBrands.map((brand) => (
//               <label
//                   key={brand.id}
//                   className="flex items-center gap-2 cursor-pointer"
//                   style={{ height: "27px" }}
//               >
//                 <input
//                     type="checkbox"
//                     checked={selectedBrandIds.includes(brand.id)}
//                     onChange={() => handleCheckboxChange(brand)}
//                 />
//                 <span className="text-[#000] text-[20px] font-[400] font-manrope leading-[normal]">
//               {brand.name}
//             </span>
//               </label>
//           ))}
//         </div>
//       </div>
//   );
// };

// export default BrandListWithAlphabet;













import React, { useMemo, useState } from "react";
import ToggleIconButton from "../ui/ToggleIconButton";

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
  new Set("A B C D E F G H I J K L M N O P R S T U V W X Y Z _".split(" "))
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
      newSelectedBrands = brands.filter(
        (b) => selectedBrandIds.includes(b.id) && b.id !== brand.id
      );
    } else {
      newSelectedBrands = [
        ...selectedBrandIds.map((id) => brands.find((b) => b.id === id)).filter(Boolean) as Brand[],
        brand,
      ];
    }
    onBrandSelect?.(newSelectedBrands);
  };

  const handleLetterClick = (letter: string) => {
    setLocalLetter(letter);
    onLetterSelect?.(letter);
  };

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
      className="relative flex flex-col gap-3 px-4 py-2 max-h-[361px] overflow-hidden" 
      style={{ width: "100%", maxWidth: "308px" }}
    >
      {/* Верхній блок з заголовком і кнопкою хрестик */}
      <div className="flex justify-between items-center w-full mb-2">
        <h2 className="text-black font-medium text-[24px] leading-normal">
          Бренди
        </h2>
        {/* <ToggleIconButton
          isOpen={showAlphabet}
          onClick={() => setShowAlphabet((prev) => !prev)}
          className="text-gray-500 hover:text-black"
        /> */}

         <ToggleIconButton
  isOpen={showAlphabet}
  onClick={() => setShowAlphabet((prev) => !prev)}
  className="text-xl text-gray-500 hover:text-black "
  aria-label="Перемкнути абетку"
/>
      </div>

      {showAlphabet && (
        <div className="flex flex-col gap-[6px] w-full">
          <div className="flex gap-[2px]">{firstRow.map(renderLetterButton)}</div>
          <div className="flex gap-[2px]">{secondRow.map(renderLetterButton)}</div>
        </div>
      )}

      {/* Список брендів зі скролом, вирівняним під кнопку хрестик */}
      <div className="flex flex-col gap-[12px] overflow-y-auto" style={{ maxHeight: "200px" }}>
        {filteredBrands.map((brand) => (
          <label key={brand.id} className="flex items-center gap-2 cursor-pointer h-[27px]">
            <input
              type="checkbox"
              checked={selectedBrandIds.includes(brand.id)}
              onChange={() => handleCheckboxChange(brand)}
              className="w-4 h-4"
            />
            <span className="text-[#000] text-[20px] font-[400] font-manrope leading-normal">
              {brand.name}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default BrandListWithAlphabet;













//
// import React, { useMemo, useState } from "react";
// type Brand = {
//   onLetterSelect?: (letter: string) => void;
// };
//
// // const alphabet = "ABCDEFGHIJKLMNOPRSTUVWXYZ_AEO".split("");
// // const alphabet = [
// //   "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
// //   "N", "O", "O", "O", "P", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
// //   "_", "A", "E", "O"
// // ];
//
// const alphabet = "A B C D E F G H I J K L M N O P R S T U V W X Y Z _ A E O".split(" ");
// // const alphabet = Array.from(
// //     new Set(
// //         "A B C D E F G H I J K L M N O P R S T U V W X Y Z _ A E O".split(" ")
// //     )
// // );
//
// const BrandListWithAlphabet: React.FC<Props> = ({
//                                                   brands,
//                                                   selectedBrandId,
//                                                   onBrandSelect,
//                                                   selectedLetter = "",
//                                                   onLetterSelect,
//                                                 }) => {
//   const [localLetter, setLocalLetter] = useState(selectedLetter);
//   const [showAlphabet, setShowAlphabet] = useState(true);
//
//   const groupedBrands = useMemo(() => {
//     const groups: { [key: string]: Brand[] } = {};
//     for (let brand of brands) {
//       for (const brand of brands) {
//         const firstLetter = brand.name[0].toUpperCase();
//         if (!groups[firstLetter]) groups[firstLetter] = [];
//         groups[firstLetter].push(brand);
//       }
//       return groups;
//     }, [brands]);
//
//     const filteredBrands = selectedLetter
//         ? groupedBrands[selectedLetter] || []
//     const filteredBrands = localLetter
//         ? groupedBrands[localLetter.toUpperCase()] || []
//         : brands;
//
//     const handleCheckboxChange = (brand: Brand) => {
//       if (selectedBrandId === brand.id) {
//         onBrandSelect?.(null);
//       } else {
//         onBrandSelect?.(brand);
//       }
//       onBrandSelect?.(selectedBrandId === brand.id ? null : brand);
//     };
//
//     const handleLetterClick = (letter: string) => {
//       setLocalLetter(letter);
//       onLetterSelect?.(letter);
//     };
//
//     // Розбиваємо абетку на 2 рядки
//     // Розбиваємо абетку на два рядки динамічно
//     const half = Math.ceil(alphabet.length / 2);
//     const firstRow = alphabet.slice(0, half);
//     const secondRow = alphabet.slice(half);
//
//     const renderLetterButton = (letter: string) => (
//         <button
//             key={letter}
//             onClick={() => handleLetterClick(letter)}
//             className={`w-[16px] h-[24px] rounded text-[20px] font-medium font-manrope leading-normal ${
//                 localLetter === letter
//                     ? "bg-blue-200 text-black"
//                     : "bg-transparent text-gray-600"
//             }`}
//         >
//           {letter}
//         </button>
//     );
//
//     return (
//         <div
//             className="p-4 flex flex-col items-start gap-3"
// @@ -417,71 +102,40 @@ const BrandListWithAlphabet: React.FC<Props> = ({
//   </div>
//
//     {/* Абетка */}
//     {showAlphabet && (
//         <div
//             className="flex flex-col gap-[6px]"
//             style={{ width: "262px", height: "54px" }}
//         >
//           {/* Перший рядок (15 букв) */}
//           <div className="flex gap-[2px]">
//             {alphabet.slice(0, 15).map((letter) => (
//                 <button
//                     key={letter}
//                     onClick={() => onLetterSelect?.(letter)}
//                     className={`w-[16px] h-[24px] rounded text-[20px] font-medium font-manrope leading-normal ${
//                         selectedLetter === letter
//                             ? "bg-blue-200 text-black"
//                             : "bg-transparent text-gray-600"
//                     }`}
//                 >
//                   {letter}
//                 </button>
//             ))}
//           </div>
//
//           {/* Другий рядок (15 букв) */}
//           <div className="flex gap-[2px]">
//             {alphabet.slice(15).map((letter) => (
//                 <button
//                     key={letter}
//                     onClick={() => onLetterSelect?.(letter)}
//                     className={`w-[16px] h-[24px] rounded text-[20px] font-medium font-manrope leading-normal ${
//                         selectedLetter === letter
//                             ? "bg-blue-200 text-black"
//                             : "bg-transparent text-gray-600"
//                     }`}
//                     {showAlphabet && (
//                         <div
//                             className="flex flex-col gap-[6px]"
//                             style={{ width: "262px", height: "54px" }}
//                         >
//                           {letter}
//                         </button>
//                     ))}
//               </div>
//               </div>
//               )}
//
//
//
//             <div className="flex gap-[2px]">
//               {firstRow.map(renderLetterButton)}
//             </div>
//             <div className="flex gap-[2px]">
//               {secondRow.map(renderLetterButton)}
//             </div>
//           </div>
//           )}
//
//     {/* Список брендів */}
//     <div className="flex flex-col gap-[12px] max-h-[200px] overflow-y-auto rounded p-2">
//       {filteredBrands.map((brand) => (
//           <label
//               key={brand.id}
//               className="flex items-center gap-2 cursor-pointer"
//               style={{ height: "27px" }}
//           >
//             <input
//                 type="checkbox"
//                 checked={selectedBrandId === brand.id}
//                 onChange={() => handleCheckboxChange(brand)}
//             />
//             <span className="text-[#000] text-[20px] font-[400] font-manrope leading-[normal]">
//         {brand.name}
//       </span>
//           </label>
//       ))}
//     </div>
//   </div>
//
//     <div className="flex flex-col gap-[12px] max-h-[200px] overflow-y-auto rounded p-2">
//       {filteredBrands.map((brand) => (
//           <label
//               key={brand.id}
//               className="flex items-center gap-2 cursor-pointer"
//               style={{ height: "27px" }}
//           >
//             <input
//                 type="checkbox"
//                 checked={selectedBrandId === brand.id}
//                 onChange={() => handleCheckboxChange(brand)}
//             />
//             <span className="text-[#000] text-[20px] font-[400] font-manrope leading-[normal]">
//               {brand.name}
//             </span>
//           </label>
//       ))}
//     </div>
//   </div>
//   );
//   };
//
//     export default BrandListWithAlphabet;