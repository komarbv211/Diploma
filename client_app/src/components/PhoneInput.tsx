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


import React from 'react';
import { Select, Input } from 'antd';
import PhoneIcon from './icons/PhoneIcon';

interface PhoneInputProps {
  value?: string; // формат: +38 (097) 123-45-67
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
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

// Розбиваємо value на оператор і залишок
const parseValue = (val: string) => {
  const match = val?.match(/\+38\s?\((\d{3})\)\s?([\d\-]*)/);
  return {
    operator: match?.[1] || '050',
    rest: match?.[2] || '',
  };
};

const PhoneInput: React.FC<PhoneInputProps> = ({ value = '', onChange, className}) => {
  const { operator, rest } = parseValue(value);

  // Функція, щоб прибрати всі нецифри і обмежити 7 цифр
  const formatRestValue = (input: string) => {
    // Залишаємо лише цифри
    const digits = input.replace(/\D/g, '');
    // Обрізаємо до максимум 7 цифр
    return digits.slice(0, 7);
  };

  // Форматування в стилі xxx-xx-xx
  const formatDisplay = (digits: string) => {
    const part1 = digits.slice(0, 3);
    const part2 = digits.slice(3, 5);
    const part3 = digits.slice(5, 7);
    let formatted = part1;
    if (part2) formatted += '-' + part2;
    if (part3) formatted += '-' + part3;
    return formatted;
  };

  const handleOperatorChange = (newOperator: string) => {
    const full = `+38 (${newOperator}) ${rest}`;
    onChange?.({ target: { value: full } } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Отримуємо тільки цифри, обрізаємо до 7, форматумо для відображення
    const formattedDigits = formatRestValue(e.target.value);
    const formattedDisplay = formatDisplay(formattedDigits);

    const full = `+38 (${operator}) ${formattedDisplay}`;
    onChange?.({ target: { value: full } } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
       <div className="form-input">
        <Select
            value={operator}
            onChange={handleOperatorChange}
            options={operatorOptions.map(({ code, label }) => ({
              value: code,
              label,
            }))}
            className={'h-0'}
            />
        <Input
            value={rest}
            onChange={handleNumberChange}
            suffix={<PhoneIcon/>}
            placeholder="00 00 000"
            maxLength={9}
            className={className}
            bordered={false}
        />
      </div>
  );
};

export default PhoneInput;



