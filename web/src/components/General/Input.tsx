import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';

export interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  inputExtraStyles?: string;
  labelExtraStyles?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, IInputProps>(
  (
    {
      label,
      inputExtraStyles,
      labelExtraStyles,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    return (
      <>
        {label && (
          <label htmlFor={props.id} className={labelExtraStyles}>
            {label}
          </label>
        )}
        <div
          className={`overflow-hidden rounded-lg bg-zinc-800 text-white placeholder:text-zinc-400 transition-all [&:has(input:focus)]:outline-none [&:has(input:focus)]:ring-2 [&:has(input:focus)]:ring-blue-800 [&:has(input:focus)]:ring-offset-2 [&:has(input:focus)]:ring-offset-zinc-900 ${inputExtraStyles
            ?.split(' ')
            .filter((value) => !value.startsWith('p'))
            .join(' ')}`}
        >
          {leftIcon && leftIcon}
          <input
            type="text"
            ref={ref}
            {...props}
            className={`w-full h-full outline-none bg-transparent p-4 ${inputExtraStyles
              ?.split(' ')
              .filter((value) => value.startsWith('p'))
              .join(' ')}`}
          />
          {rightIcon && rightIcon}
        </div>
      </>
    );
  }
);
