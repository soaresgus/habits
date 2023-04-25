import { InputHTMLAttributes, ReactNode, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

export interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Input({
  name,
  label,
  leftIcon,
  rightIcon,
  ...props
}: IInputProps) {
  const { register } = useFormContext();

  return (
    <>
      {label && (
        <label htmlFor={name} className="font-semibold leading-tight mb-3">
          {label}
        </label>
      )}
      <div
        className="overflow-hidden rounded-lg bg-zinc-800 text-white placeholder:text-zinc-400 transition-all [&:has(input:focus)]:outline-none [&:has(input:focus)]:ring-2 [&:has(input:focus)]:ring-blue-800 [&:has(input:focus)]:ring-offset-2 [&:has(input:focus)]:ring-offset-zinc-900 flex items-center"
        role="textbox"
      >
        {leftIcon && leftIcon}
        <input
          id={name}
          type="text"
          className="w-full h-full outline-none bg-transparent p-4"
          {...register(name)}
          {...props}
        />
        {rightIcon && rightIcon}
      </div>
    </>
  );
}
