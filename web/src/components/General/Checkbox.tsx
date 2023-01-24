import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, X } from 'phosphor-react';

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
    <div className="flex items-center gap-3">
      <CheckboxPrimitive.Root
        className="flex items-center justify-center h-8 w-8 rounded-lg bg-zinc-900 border-2 border-zinc-800 peer group transition-all disabled:cursor-not-allowed data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500  focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2 focus:ring-offset-background"
        id={title}
        {...props}
      >
        <X className="hidden group-disabled:block group-data-[state=checked]:hidden text-zinc-500" />
        <CheckboxPrimitive.Indicator>
          <Check size={20} className="text-white" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>

      <label
        className={`text-white leading-tight cursor-pointer peer-disabled:text-zinc-500 ${labelExtraClassName}`}
        htmlFor={title}
      >
        {title}
      </label>
    </div>
  );
}
