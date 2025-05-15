declare module 'react-input-mask' {
  import * as React from 'react';

  interface InputMaskProps extends React.InputHTMLAttributes<HTMLInputElement> {
    mask: string;
    maskChar?: string | null;
    alwaysShowMask?: boolean;
    beforeMaskedValueChange?: (
        newState: { value: string; selection: { start: number; end: number } },
        oldState: { value: string; selection: { start: number; end: number } },
        userInput: string,
        maskOptions: unknown
    ) => { value: string; selection: { start: number; end: number } };
    children?: (props: Record<string, unknown>) => React.ReactElement;
  }

  export default class InputMask extends React.Component<InputMaskProps> {}
}
