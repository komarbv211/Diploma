// import MaskedInput from 'antd-mask-input';
// import { MaskedInputProps } from 'antd-mask-input/build/main/lib/MaskedInput';
//
// interface PhoneInputProps extends Omit<MaskedInputProps, 'mask'> {
//   value?: string;
//   onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
// }
//
// const PhoneInput: React.FC<PhoneInputProps> = ({ value, onChange, ...rest }) => {
//   const DUMB_IP_MASK = '+38 (000) 000-00-00';
//
//   return (
//     <MaskedInput
//       mask={DUMB_IP_MASK}
//       value={value}
//       onChange={onChange}
//       {...rest}
//     />
//   );
// };
//
// export default PhoneInput;

// import React from 'react';
// import { Select } from 'antd';
// import MaskedInput from 'antd-mask-input';
// import { MaskedInputProps } from 'antd-mask-input/build/main/lib/MaskedInput';
//
// const { Option } = Select;
//
// interface PhoneInputProps extends Omit<MaskedInputProps, 'mask'> {
//   value?: string;
//   onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onOperatorChange?: (operator: string) => void;
// }
//
// const operatorOptions = [
//   { code: '050', label: 'Vodafone (050)' },
//   { code: '066', label: 'Vodafone (066)' },
//   { code: '095', label: 'Vodafone (095)' },
//   { code: '099', label: 'Vodafone (099)' },
//   { code: '067', label: 'Kyivstar (067)' },
//   { code: '068', label: 'Kyivstar (068)' },
//   { code: '096', label: 'Kyivstar (096)' },
//   { code: '097', label: 'Kyivstar (097)' },
//   { code: '098', label: 'Kyivstar (098)' },
//   { code: '063', label: 'Lifecell (063)' },
//   { code: '073', label: 'Lifecell (073)' },
//   { code: '093', label: 'Lifecell (093)' },
// ];
//
// const PhoneInput: React.FC<PhoneInputProps> = ({ value, onChange, onOperatorChange, ...rest }) => {
//   const [operator, setOperator] = React.useState('050');
//
//   const handleOperatorChange = (newOperator: string) => {
//     setOperator(newOperator);
//     if (onOperatorChange) {
//       onOperatorChange(newOperator);
//     }
//
//     // Заміна коду оператора у value
//     const restNumber = value?.replace(/^\+38\s?\(\d{3}\)\s?/, '') || '';
//     const newValue = `+38 (${newOperator}) ${restNumber}`;
//     onChange?.({ target: { value: newValue } } as React.ChangeEvent<HTMLInputElement>);
//   };
//
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     onChange?.(e);
//   };
//
//   return (
//       <div style={{ display: 'flex', gap: 8 }}>
//         <Select
//             value={operator}
//             onChange={handleOperatorChange}
//             style={{ width: 180 }}
//             options={operatorOptions.map(({ code, label }) => ({ value: code, label }))}
//         />
//         <MaskedInput
//             mask="+38 (000) 000-00-00"
//             value={value}
//             onChange={handleInputChange}
//             {...rest}
//         />
//       </div>
//   );
// };
//
// export default PhoneInput;

// import React from 'react';
// import { Select } from 'antd';
// import MaskedInput from 'antd-mask-input';
// import { MaskedInputProps } from 'antd-mask-input/build/main/lib/MaskedInput';
//
// interface PhoneInputProps extends Omit<MaskedInputProps, 'mask'> {
//   value?: string;
//   onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onOperatorChange?: (operator: string) => void;
// }
//
// // Варіанти операторів
// const operatorOptions = [
//   { code: '050', label: 'Vodafone (050)' },
//   { code: '066', label: 'Vodafone (066)' },
//   { code: '095', label: 'Vodafone (095)' },
//   { code: '099', label: 'Vodafone (099)' },
//   { code: '067', label: 'Kyivstar (067)' },
//   { code: '068', label: 'Kyivstar (068)' },
//   { code: '096', label: 'Kyivstar (096)' },
//   { code: '097', label: 'Kyivstar (097)' },
//   { code: '098', label: 'Kyivstar (098)' },
//   { code: '063', label: 'Lifecell (063)' },
//   { code: '073', label: 'Lifecell (073)' },
//   { code: '093', label: 'Lifecell (093)' },
// ];
//
// const PhoneInput: React.FC<PhoneInputProps> = ({
//                                                  value,
//                                                  onChange,
//                                                  onOperatorChange,
//                                                  ...rest
//                                                }) => {
//   const [operator, setOperator] = React.useState('050');
//
//   const handleOperatorChange = (newOperator: string) => {
//     setOperator(newOperator);
//     if (onOperatorChange) {
//       onOperatorChange(newOperator);
//     }
//
//     // Отримати тільки частину номера без коду
//     const restNumber = value?.replace(/^\+38\s?\(\d{3}\)\s?/, '') || '';
//     const newValue = `+38 (${newOperator}) ${restNumber}`;
//     onChange?.({ target: { value: newValue } } as React.ChangeEvent<HTMLInputElement>);
//   };
//
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     onChange?.(e);
//   };
//
//   return (
//       <div style={{ display: 'flex', gap: 8 }}>
//         <Select
//             value={operator}
//             onChange={handleOperatorChange}
//             style={{ width: 180 }}
//             options={operatorOptions.map(({ code, label }) => ({
//               value: code,
//               label,
//             }))}
//         />
//         <MaskedInput
//             mask="+38 (000) 000-00-00"
//             value={value}
//             onChange={handleInputChange}
//             {...rest}
//         />
//       </div>
//   );
// };
//
// export default PhoneInput;



// import React from 'react';
// import { Select } from 'antd';
// import MaskedInput from 'antd-mask-input';
// import { MaskedInputProps } from 'antd-mask-input/build/main/lib/MaskedInput';
//
// interface PhoneInputProps extends Omit<MaskedInputProps, 'mask'> {
//     value?: string;
//     onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
//     onOperatorChange?: (operator: string) => void;
// }
//
// const operatorOptions = [
//     { code: '050', label: 'Vodafone (050)' },
//     { code: '066', label: 'Vodafone (066)' },
//     { code: '095', label: 'Vodafone (095)' },
//     { code: '099', label: 'Vodafone (099)' },
//     { code: '067', label: 'Kyivstar (067)' },
//     { code: '068', label: 'Kyivstar (068)' },
//     { code: '096', label: 'Kyivstar (096)' },
//     { code: '097', label: 'Kyivstar (097)' },
//     { code: '098', label: 'Kyivstar (098)' },
//     { code: '063', label: 'Lifecell (063)' },
//     { code: '073', label: 'Lifecell (073)' },
//     { code: '093', label: 'Lifecell (093)' },
// ];
//
// const PhoneInput: React.FC<PhoneInputProps> = ({ value = '', onChange, onOperatorChange, ...rest }) => {
//     const [operator, setOperator] = React.useState('050');
//
//     React.useEffect(() => {
//         if (value) {
//             const match = value.match(/\+38\s?\((\d{3})\)/);
//             if (match && match[1] && operator !== match[1]) {
//                 setOperator(match[1]);
//             }
//         }
//     }, [value, operator]);
//
//     const handleOperatorChange = (newOperator: string) => {
//         setOperator(newOperator);
//         onOperatorChange?.(newOperator);
//
//         // Витягуємо решту номера без коду оператора
//         const restNumber = value?.replace(/^\+38\s?\(\d{3}\)\s?/, '') || '';
//         const newValue = `+38 (${newOperator}) ${restNumber}`;
//         onChange?.({
//             target: { value: newValue },
//
//
//         } as React.ChangeEvent<HTMLInputElement>);
//     };
//
//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const newValue = e.target.value;
//         const match = newValue.match(/\+38\s?\((\d{3})\)/);
//         if (match && match[1] && operator !== match[1]) {
//             setOperator(match[1]);
//             onOperatorChange?.(match[1]);
//         }
//         onChange?.(e);
//     };
//
//     return (
//         <div style={{ display: 'flex', gap: 8 }}>
//             <Select
//                 value={operator}
//                 onChange={handleOperatorChange}
//                 style={{ width: 180 }}
//                 options={operatorOptions.map(({ code, label }) => ({
//                     value: code,
//                     label,
//                 }))}
//             />
//             <MaskedInput
//                 name="phone"
//                 mask="+38 (000) 000-00-00"
//                 value={value}
//                 onChange={handleInputChange}
//                 {...rest}
//             />
//         </div>
//     );
// };
//
// export default PhoneInput;


// import React from 'react';
// import { Select } from 'antd';
// import MaskedInput from 'antd-mask-input';

// interface PhoneInputProps {
//     value?: string; // повний номер: +38 (код) ХХХ-ХХ-ХХ
//     onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
//     onOperatorChange?: (operator: string) => void;
// }

// const operatorOptions = [
//     { code: '050', label: 'Vodafone (050)' },
//     { code: '066', label: 'Vodafone (066)' },
//     { code: '095', label: 'Vodafone (095)' },
//     { code: '099', label: 'Vodafone (099)' },
//     { code: '067', label: 'Kyivstar (067)' },
//     { code: '068', label: 'Kyivstar (068)' },
//     { code: '096', label: 'Kyivstar (096)' },
//     { code: '097', label: 'Kyivstar (097)' },
//     { code: '098', label: 'Kyivstar (098)' },
//     { code: '063', label: 'Lifecell (063)' },
//     { code: '073', label: 'Lifecell (073)' },
//     { code: '093', label: 'Lifecell (093)' },
// ];

// const PhoneInput: React.FC<PhoneInputProps> = ({
//                                                    value = '',
//                                                    onChange,
//                                                    onOperatorChange,
//                                                }) => {
//     // Розбиваємо value на оператор і решту номера
//     const parseValue = (val: string) => {
//         const match = val.match(/\+38\s?\((\d{3})\)\s?(\d{3}-\d{2}-\d{2})?/);
//         return {
//             operator: match?.[1] || '050',
//             rest: match?.[2] || '',
//         };
//     };

//     const [operator, setOperator] = React.useState(() => parseValue(value).operator);
//     const [restNumber, setRestNumber] = React.useState(() => parseValue(value).rest);

//     // Оновлюємо стан, коли змінюється value пропс
//     React.useEffect(() => {
//         const { operator: newOperator, rest: newRest } = parseValue(value);
//         setOperator(newOperator);
//         setRestNumber(newRest);
//     }, [value]);

//     const handleOperatorChange = (newOperator: string) => {
//         setOperator(newOperator);
//         onOperatorChange?.(newOperator);
//         const newFullNumber = `+38 (${newOperator}) ${restNumber}`;
//         onChange?.({
//             target: { value: newFullNumber },
//         } as React.ChangeEvent<HTMLInputElement>);
//     };

//     const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const number = e.target.value;
//         setRestNumber(number);
//         const newFullNumber = `+38 (${operator}) ${number}`;
//         onChange?.({
//             target: { value: newFullNumber },
//         } as React.ChangeEvent<HTMLInputElement>);
//     };

//     return (
//         <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//             <Select
//                 value={operator}
//                 onChange={handleOperatorChange}
//                 style={{ width: 180 }}
//                 options={operatorOptions.map(({ code, label }) => ({
//                     value: code,
//                     label,
//                 }))}
//             />
//             <span>-</span>
//             <MaskedInput
//                 mask="000-00-00"
//                 value={restNumber}
//                 onChange={handleNumberChange}
//                 placeholder="___-__-__"
//             />
//         </div>
//     );
// };

// export default PhoneInput;


import React from 'react';
import { Select } from 'antd';
// import MaskedInput from 'antd-mask-input';
import { Input } from 'antd';

interface PhoneInputProps {
  value?: string; // full value: +38 (097) 123-45-67
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const operatorOptions = [
  { code: '050', label: 'Vodafone (050)' },
  { code: '066', label: 'Vodafone (066)' },
  { code: '095', label: 'Vodafone (095)' },
  { code: '099', label: 'Vodafone (099)' },
  { code: '067', label: 'Kyivstar (067)' },
  { code: '068', label: 'Kyivstar (068)' },
  { code: '096', label: 'Kyivstar (096)' },
  { code: '097', label: 'Kyivstar (097)' },
  { code: '098', label: 'Kyivstar (098)' },
  { code: '063', label: 'Lifecell (063)' },
  { code: '073', label: 'Lifecell (073)' },
  { code: '093', label: 'Lifecell (093)' },
];

// розбиваємо value на оператор і залишок
const parseValue = (val: string) => {
  const match = val?.match(/\+38\s?\((\d{3})\)\s?(\d{3}-\d{2}-\d{2})?/);
  return {
    operator: match?.[1] || '050',
    rest: match?.[2] || '',
  };
};

const PhoneInput: React.FC<PhoneInputProps> = ({ value = '', onChange }) => {
  const { operator, rest } = parseValue(value);

  console.log("📞 PhoneInput value:", value);
  console.log("📞 Operator:", operator, "Rest:", rest);

  const handleOperatorChange = (newOperator: string) => {
    const full = `+38 (${newOperator}) ${rest}`;
    onChange?.({ target: { value: full } } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const full = `+38 (${operator}) ${e.target.value}`;
    onChange?.({ target: { value: full } } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Select
        value={operator}
        onChange={handleOperatorChange}
        style={{ width: 180 }}
        options={operatorOptions.map(({ code, label }) => ({
          value: code,
          label,
        }))}
      />
      <span>-</span>
      <Input
  value={rest}
  onChange={handleNumberChange}
  placeholder="___-__-__"
/>
    </div>
  );
};

export default PhoneInput;





