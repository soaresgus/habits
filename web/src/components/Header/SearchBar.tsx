import { IInputProps, Input } from '../General/Input';
import * as Popover from '@radix-ui/react-popover';

interface ISearchBarProps extends IInputProps {}

const filterMethods = [
  { title: 'nome do hábito', input: '', example: 'beber 2L de água' },
  { title: 'data', input: 'date:', example: 'date: 20/01' },
  { title: 'dias incompletos', input: 'incomplete', example: 'incomplete' },
  { title: 'dias completos', input: 'complete', example: 'complete' },
  { title: 'progresso', input: 'progress: ', example: 'progress >= 50' },
];

export function SearchBar({ ...props }: ISearchBarProps) {
  return (
    <Popover.Root>
      <Popover.Trigger
        className="w-full"
        onClick={(event) =>
          (
            event.currentTarget.childNodes.item(0)
              .firstChild as HTMLInputElement
          ).focus
        }
      >
        <Input {...props} />
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content className="flex flex-col items-center bg-zinc-800 p-2 w-screen min-w-[300px] max-w-[340px] mt-3 rounded-lg z-50">
          <span className="text-zinc-400 text-base">Formas de filtrar</span>
          <div className="flex flex-col gap-2 w-full text-sm">
            {filterMethods.map((method) => (
              <div
                className="flex justify-between bg-zinc-900 p-2 w-full rounded-lg "
                key={method.title}
              >
                <span className="first-letter:capitalize ">{method.title}</span>
                <span className="text-zinc-400">Ex.: {method.example}</span>
              </div>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
