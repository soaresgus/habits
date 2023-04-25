import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Checkbox } from './Checkbox';

interface ICheckboxesProps {
  name: string;
  labels: string[];
  values: any[];
}

export function Checkboxes({ name, labels, values }: ICheckboxesProps) {
  const [checkedValues, setCheckedValues] = useState<any[]>([]);

  const { setValue } = useFormContext();

  return (
    <>
      {values.map((value, index) => (
        <Checkbox
          key={value}
          title={labels[index]}
          value={value}
          onCheckedChange={() => {
            let valuesCopy = [...checkedValues];

            if (valuesCopy.includes(value)) {
              valuesCopy = valuesCopy.filter((value) => value !== value);
            } else {
              valuesCopy = [...valuesCopy, value];
            }

            setCheckedValues(valuesCopy);
            setValue(name, valuesCopy);
          }}
        />
      ))}
    </>
  );
}
