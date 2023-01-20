import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'phosphor-react';

interface ICheckboxProps extends CheckboxPrimitive.CheckboxProps {
  title: string;
  labelExtraClassName?: string;
}

export function Checkbox({
  title,
  labelExtraClassName,
  ...props
}: ICheckboxProps) {
  return (
    <div className="flex items-center gap-3 cursor-pointer">
      <CheckboxPrimitive.Root
        className="flex items-center justify-center h-8 w-8 rounded-lg bg-zinc-900 border-2 border-zinc-800 peer data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
        id={title}
        {...props}
      >
        <CheckboxPrimitive.Indicator>
          <Check size={20} className="text-white" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>

      <label
        className={`text-white leading-tight cursor-pointer ${labelExtraClassName}`}
        htmlFor={title}
      >
        {title}
      </label>
    </div>
  );
}
