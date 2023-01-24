import { useState } from 'react';
import { Control, useController } from 'react-hook-form';
import { Checkbox } from './Checkbox';

interface ICheckboxesProps {
  options: string[];
  name: string;
  control: Control<any>;
}

export function Checkboxes({ options, name, control }: ICheckboxesProps) {
  const [checkedValues, setCheckedValues] = useState<string[]>([]);

  const { field } = useController({
    name,
    control,
    rules: { required: 'Escolha ao menos 1 dia' },
  });

  return (
    <>
      {options.map((option) => (
        <Checkbox
          key={option}
          title={option}
          onCheckedChange={() => {
            let valuesCopy = [...checkedValues];

            if (valuesCopy.includes(option)) {
              valuesCopy = valuesCopy.filter((value) => value !== option);
            } else {
              valuesCopy = [...valuesCopy, option];
            }

            setCheckedValues(valuesCopy);

            field.onChange(valuesCopy);
          }}
          value={option}
        />
      ))}
    </>
  );
}
