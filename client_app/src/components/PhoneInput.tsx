import MaskedInput from 'antd-mask-input';
import { MaskedInputProps } from 'antd-mask-input/build/main/lib/MaskedInput';

interface PhoneInputProps extends Omit<MaskedInputProps, 'mask'> {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ value, onChange, ...rest }) => {
  const DUMB_IP_MASK = '+38 (000) 000-00-00';

  return (
    <MaskedInput
      mask={DUMB_IP_MASK}
      value={value}
      onChange={onChange}
      {...rest} 
    />
  );
};

export default PhoneInput;
