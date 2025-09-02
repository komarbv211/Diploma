import React from "react";
import { Select, Input } from "antd";
import PhoneIcon from "./icons/PhoneIcon";

interface PhoneInputProps {
  value?: string; // формат: +38 (097) 123-45-67
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
}

const operatorOptions = [
  { code: "050", label: "Vodafone (050)" },
  { code: "066", label: "Vodafone (066)" },
  { code: "095", label: "Vodafone (095)" },
  { code: "099", label: "Vodafone (099)" },
  { code: "067", label: "Kyivstar (067)" },
  { code: "068", label: "Kyivstar (068)" },
  { code: "096", label: "Kyivstar (096)" },
  { code: "097", label: "Kyivstar (097)" },
  { code: "098", label: "Kyivstar (098)" },
  { code: "063", label: "Lifecell (063)" },
  { code: "073", label: "Lifecell (073)" },
  { code: "093", label: "Lifecell (093)" },
];

// Розбиваємо value на оператор і залишок
const parseValue = (val: string) => {
  const match = val?.match(/\+38\s?\((\d{3})\)\s?([\d-]*)/);
  return {
    operator: match?.[1] || "050",
    rest: match?.[2] || "",
  };
};

const PhoneInput: React.FC<PhoneInputProps> = ({
  value = "",
  onChange,
  className,
  disabled
}) => {
  const { operator, rest } = parseValue(value);

  // Функція, щоб прибрати всі нецифри і обмежити 7 цифр
  const formatRestValue = (input: string) => {
    // Залишаємо лише цифри
    const digits = input.replace(/\D/g, "");
    // Обрізаємо до максимум 7 цифр
    return digits.slice(0, 7);
  };

  // Форматування в стилі xxx-xx-xx
  const formatDisplay = (digits: string) => {
    const part1 = digits.slice(0, 3);
    const part2 = digits.slice(3, 5);
    const part3 = digits.slice(5, 7);
    let formatted = part1;
    if (part2) formatted += "-" + part2;
    if (part3) formatted += "-" + part3;
    return formatted;
  };

  const handleOperatorChange = (newOperator: string) => {
    const full = `+38 (${newOperator}) ${rest}`;
    onChange?.({
      target: { value: full },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Отримуємо тільки цифри, обрізаємо до 7, форматумо для відображення
    const formattedDigits = formatRestValue(e.target.value);
    const formattedDisplay = formatDisplay(formattedDigits);

    const full = `+38 (${operator}) ${formattedDisplay}`;
    onChange?.({
      target: { value: full },
    } as React.ChangeEvent<HTMLInputElement>);
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
        className={"h-0"}
        disabled={disabled}
      />
      <Input
        value={rest}
        onChange={handleNumberChange}
        suffix={<PhoneIcon />}
        placeholder="00 00 000"
        maxLength={9}
        className={className}
        bordered={false}
        disabled={disabled}
      />
    </div>
  );
};

export default PhoneInput;
