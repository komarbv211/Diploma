import type { RuleObject } from 'rc-field-form/lib/interface';

export const validateUkrainianPhoneNumber = (_rule: RuleObject, value: string): Promise<void> => {
  if (!value) {
    return Promise.reject(new Error('Введіть номер телефону'));
  }

  const digits = value.replace(/\D/g, '');

  if (digits.length !== 12 ) {
    return Promise.reject(new Error('Номер телефону за короткий'));
  }

  const allowedOperators = [
    '50', '66', '95', '99',       // Vodafone
    '67', '68', '96', '97', '98', // Kyivstar
    '63', '73', '93'               // Lifecell
  ];

  const operatorCode = digits.substring(3, 5);

  if (!allowedOperators.includes(operatorCode)) {
    return Promise.reject(new Error('Номер телефону не правильний'));
  }

  return Promise.resolve();
};
