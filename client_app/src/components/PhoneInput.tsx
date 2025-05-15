// components/PhoneInput.tsx
import InputMask from 'react-input-mask';
import { Input } from 'antd';
import { InputProps } from 'antd/es/input';

interface PhoneInputProps extends InputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ value, onChange, ...rest }) => {
  return (
    <InputMask
      mask="+380 (99) 999-99-99"
      value={value}
      onChange={onChange}
      maskChar="_"
    >
      {(inputProps) => <Input {...inputProps} {...rest} />}
    </InputMask>
  );
};

export default PhoneInput;
